import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Feature, Reading, Room, Window } from '../types'

// A colour is picked from the name, so an account keeps its colour on every
// machine and no account is written here.
const COLORS = ['#4aa3df', '#d9a441', '#57b894', '#b58ad9', '#d97757', '#d96a9b']
const INK = '#000000'
// Where the playbook keeps a project's features, relative to its root.
const SPECS = 'specs'
const REREAD_MS = 10_000
// "- [x] **T3a — Title**", the playbook's task line.
const TASK = /^- \[([ xX])\] \*\*T\d+[a-z]?\s/gm
// Every account's sessions leave their latest usage here, one file per
// account, under $XDG_STATE_HOME (~/.local/state); claude-pick reads it too.
const LEDGER = 'claude-accounts'
// An account with no reading yet is picked only once every account with one
// is at least this full. claude-pick uses the same number.
const UNKNOWN = 90
const ACCOUNT_FOLDER = /^\.claude(-[\w-]+)?$/

const feature = atom({ plugin: 'account-band', key: 'feature' } as const, null)
const rooms = atom({ plugin: 'account-band', key: 'rooms' } as const, [])

// The account is the config folder the session runs on: ~/.claude-work reads
// "claude-work", and no CLAUDE_CONFIG_DIR is the default folder, "claude".
export const accountOf = (configDir: string | undefined): string => {
  const folder = (configDir ?? '').replace(/\/+$/, '').split('/').pop() ?? ''

  return folder.replace(/^\./, '') || 'claude'
}

export const colorOf = (account: string): string => {
  let sum = 0

  for (const letter of account) {
    sum += letter.charCodeAt(0)
  }

  return COLORS[sum % COLORS.length] ?? '#4aa3df'
}

// The project is the repository's name on its remote, so a worktree folder
// such as "main" still reads as its project; with no remote, the root folder.
export const projectOf = (remoteUrl: string, root: string): string => {
  const fromRemote =
    remoteUrl.trim().replace(/\/+$/, '').replace(/\.git$/, '').split(/[/:]/).pop() ?? ''

  return fromRemote || root.replace(/\/+$/, '').split('/').pop() || root
}

export const shortPath = (path: string, home: string | undefined): string =>
  home && (path === home || path.startsWith(`${home}/`))
    ? `~${path.slice(home.length)}`
    : path

export const countTasks = (text: string): { done: number; total: number } => {
  let done = 0
  let total = 0

  for (const [, mark] of text.matchAll(TASK)) {
    total += 1
    if (mark !== ' ') done += 1
  }

  return { done, total }
}

// "016-admin-ux-pass" reads "016 admin ux pass".
export const featureLabel = (folder: string): string => folder.replace(/-/g, ' ')

// A window past its reset is empty again, whatever it last read.
export const fullnessOf = (windows: readonly Window[], now: number): number =>
  Math.max(
    0,
    ...windows.map(({ percentUsed, resetsAt }) =>
      resetsAt !== undefined && Date.parse(resetsAt) <= now ? 0 : percentUsed,
    ),
  )

export const bestOf = (all: readonly Room[]): string | undefined => {
  let best: { account: string; key: number } | undefined

  for (const { account, fullness } of all) {
    const key = fullness ?? UNKNOWN
    if (key < 100 && (best === undefined || key < best.key)) best = { account, key }
  }

  return best?.account
}

export const roomLabel = (fullness: number | null): string =>
  fullness === null ? '?' : fullness >= 100 ? 'full' : `${Math.round(fullness)}%`

const git = async ($: EngineInterface, root: string, args: string[]): Promise<string> => {
  const ran = await $.process
    .run(['git', ...args], { cwd: root, timeoutMs: 2000 })
    .catch(() => undefined)

  return ran?.exitCode === 0 ? ran.stdout.trim() : ''
}

const ledgerOf = async ($: EngineInterface): Promise<{ dir: string; home: string }> => {
  const [state, home = ''] = await Promise.all([$.env.get('XDG_STATE_HOME'), $.env.get('HOME')])

  return { dir: `${state || `${home}/.local/state`}/${LEDGER}`, home }
}

// The feature the branch names ("feat/016-…"), else the one whose tasks.md
// changed last.
const pickFeature = async ($: EngineInterface, root: string): Promise<string | undefined> => {
  let folders: string[]

  try {
    folders = (await $.fs.list(`${root}/${SPECS}`))
      .filter(entry => entry.kind === 'dir' && /^\d{3}-/.test(entry.name))
      .map(entry => entry.name)
  } catch {
    return undefined
  }

  const number = /(?:^|\/)(\d{3})-/.exec(await git($, root, ['branch', '--show-current']))?.[1]
  const named = number === undefined ? undefined : folders.find(name => name.startsWith(`${number}-`))
  if (named !== undefined) return named

  let best: { name: string; at: number } | undefined

  for (const name of folders) {
    try {
      const { mtimeMs } = await $.fs.stat(`${root}/${SPECS}/${name}/tasks.md`)
      if (best === undefined || mtimeMs > best.at) best = { name, at: mtimeMs }
    } catch {
      // A feature with no tasks yet.
    }
  }

  return best?.name
}

const readFeature = async ($: EngineInterface): Promise<Feature | null> => {
  const root = await $.session.root()
  const folder = await pickFeature($, root)
  if (folder === undefined) return null

  const text = await $.fs.read(`${root}/${SPECS}/${folder}/tasks.md`).catch(() => '')
  const { done, total } = countTasks(text)

  return total > 0 ? { name: featureLabel(folder), done, total } : null
}

// Every account of the machine: its config folder in home, or a reading in
// the ledger. A file caught mid-write keeps what it read last time.
const readRooms = async ($: EngineInterface, before: readonly Room[]): Promise<Room[]> => {
  const { dir, home } = await ledgerOf($)
  const now = await $.clock.now()
  const found = new Map<string, number | null>()

  for (const { name, kind } of await $.fs.list(home).catch(() => [])) {
    if (kind === 'dir' && ACCOUNT_FOLDER.test(name)) found.set(accountOf(name), null)
  }

  for (const { name } of await $.fs.list(dir).catch(() => [])) {
    if (!name.endsWith('.json')) continue

    try {
      const reading = JSON.parse(await $.fs.read(`${dir}/${name}`)) as Reading
      found.set(reading.account, fullnessOf(reading.windows, now))
    } catch {
      const account = name.slice(0, -'.json'.length)
      found.set(account, before.find(room => room.account === account)?.fullness ?? null)
    }
  }

  return [...found]
    .map(([account, fullness]) => ({ account, fullness }))
    .sort((a, b) => a.account.localeCompare(b.account))
}

const record = async ($: EngineInterface, windows: readonly Window[]) => {
  if (windows.length === 0) return

  const configDir = (await $.env.get('CLAUDE_CONFIG_DIR')) ?? null
  const account = accountOf(configDir ?? undefined)
  const reading: Reading = {
    account,
    configDir,
    readAt: new Date(await $.clock.now()).toISOString(),
    windows: windows.map(({ kind, percentUsed, resetsAt }) =>
      resetsAt === undefined ? { kind, percentUsed } : { kind, percentUsed, resetsAt },
    ),
  }
  const { dir } = await ledgerOf($)

  await $.fs.write(`${dir}/${account}.json`, `${JSON.stringify(reading, null, 2)}\n`)
}

const refresh = async ($: EngineInterface) => {
  const before = await read($, rooms)
  const [nowFeature, nowRooms] = await Promise.all([readFeature($), readRooms($, before)])

  if (JSON.stringify(await read($, feature)) !== JSON.stringify(nowFeature)) {
    await update($, feature, () => nowFeature)
  }

  if (JSON.stringify(before) !== JSON.stringify(nowRooms)) {
    await update($, rooms, () => nowRooms)
  }
}

export const register: Register = on => {
  // The band redraws often; git runs once per project root.
  const projects = new Map<string, string>()

  on('session.start', async ($, e, next) => {
    await refresh($).catch(() => undefined)
    $.clock.every(REREAD_MS, () => {
      refresh($).catch(() => undefined)
    })

    return next(e)
  })

  on('session.measure', async ($, e, next) => {
    const measured = await next(e)

    if (e.changed.includes('rateLimits')) {
      await record($, e.rateLimits).catch(() => undefined)
      await refresh($).catch(() => undefined)
    }

    return measured
  })

  on('turn.complete', async ($, e, next) => {
    const done = await next(e)
    await refresh($).catch(() => undefined)

    return done
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    // A survey holds the band while it is up.
    if (e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const [configDir, home, root, cwd, nowFeature, all] = await Promise.all([
      $.env.get('CLAUDE_CONFIG_DIR'),
      $.env.get('HOME'),
      $.session.root(),
      $.session.cwd(),
      read($, feature),
      read($, rooms),
    ])

    let project = projects.get(root)

    if (project === undefined) {
      project = projectOf(await git($, root, ['remote', 'get-url', 'origin']), root)
      projects.set(root, project)
    }

    const account = accountOf(configDir)
    const paint = colorOf(account)
    const best = bestOf(all)

    return (
      <Box width="100%" backgroundColor={paint}>
        <Box flexShrink={0}>
          <Text weight="bold" color={INK} backgroundColor={paint}>
            {` ${account} `}
          </Text>
          <Text color={INK} backgroundColor={paint}>
            {`· ${project} `}
          </Text>
          {nowFeature !== null && (
            <Text color={INK} backgroundColor={paint}>
              {`· ${nowFeature.name} ${nowFeature.done}/${nowFeature.total} done `}
            </Text>
          )}
          <Text color={INK} backgroundColor={paint}>
            {'· '}
          </Text>
        </Box>
        <Box flexGrow={1} flexShrink={1}>
          <Text color={INK} backgroundColor={paint} wrap="truncate-start">
            {`${shortPath(cwd, home)} `}
          </Text>
        </Box>
        {all.length > 0 && (
          <Box flexShrink={0}>
            <Text color={INK} backgroundColor={paint}>
              {'│ used '}
            </Text>
            {all.map((room, index) => (
              <Text color={INK} backgroundColor={paint} weight={room.account === best ? 'bold' : 'regular'}>
                {`${index === 0 ? '' : ' · '}${room.account === best ? '→ ' : ''}${room.account} ${roomLabel(room.fullness)}`}
              </Text>
            ))}
            <Text color={INK} backgroundColor={paint}>
              {' '}
            </Text>
          </Box>
        )}
      </Box>
    )
  })
}
