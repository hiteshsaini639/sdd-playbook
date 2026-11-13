import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { Feature } from '../types'

// A colour is picked from the name, so an account keeps its colour on every
// machine and no account is written here.
const COLORS = ['#4aa3df', '#d9a441', '#57b894', '#b58ad9', '#d97757', '#d96a9b']
const INK = '#000000'
// Where the playbook keeps a project's features, relative to its root.
const SPECS = 'specs'
const REREAD_MS = 10_000
// "- [x] **T3a — Title**", the playbook's task line.
const TASK = /^- \[([ xX])\] \*\*T\d+[a-z]?\s/gm

const feature = atom({ plugin: 'account-band', key: 'feature' } as const, null)

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

const git = async ($: EngineInterface, root: string, args: string[]): Promise<string> => {
  const ran = await $.process
    .run(['git', ...args], { cwd: root, timeoutMs: 2000 })
    .catch(() => undefined)

  return ran?.exitCode === 0 ? ran.stdout.trim() : ''
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

const refresh = async ($: EngineInterface) => {
  const root = await $.session.root()
  const folder = await pickFeature($, root)
  let now: Feature | null = null

  if (folder !== undefined) {
    const text = await $.fs.read(`${root}/${SPECS}/${folder}/tasks.md`).catch(() => '')
    const { done, total } = countTasks(text)
    if (total > 0) now = { name: featureLabel(folder), done, total }
  }

  if (JSON.stringify(await read($, feature)) !== JSON.stringify(now)) {
    await update($, feature, () => now)
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
    const [configDir, home, root, cwd, now] = await Promise.all([
      $.env.get('CLAUDE_CONFIG_DIR'),
      $.env.get('HOME'),
      $.session.root(),
      $.session.cwd(),
      read($, feature),
    ])

    let project = projects.get(root)

    if (project === undefined) {
      project = projectOf(await git($, root, ['remote', 'get-url', 'origin']), root)
      projects.set(root, project)
    }

    const account = accountOf(configDir)
    const paint = colorOf(account)

    return (
      <Box width="100%" backgroundColor={paint}>
        <Box flexShrink={0}>
          <Text weight="bold" color={INK} backgroundColor={paint}>
            {` ${account} `}
          </Text>
          <Text color={INK} backgroundColor={paint}>
            {`· ${project} `}
          </Text>
          {now !== null && (
            <Text color={INK} backgroundColor={paint}>
              {`· ${now.name} ${now.done}/${now.total} done `}
            </Text>
          )}
          <Text color={INK} backgroundColor={paint}>
            {'· '}
          </Text>
        </Box>
        <Text color={INK} backgroundColor={paint} wrap="truncate-start">
          {`${shortPath(cwd, home)} `}
        </Text>
      </Box>
    )
  })
}
