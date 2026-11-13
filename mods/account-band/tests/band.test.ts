import type { On } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'

import { bestOf, countTasks, featureLabel, fullnessOf, projectOf, roomLabel, shortPath } from '../hooks/register'

const NOW = Date.parse('2026-11-14T10:00:00Z')
const LEDGER = '/home/h/.local/state/claude-accounts'

const TASKS = `# 016 — Tasks

- [x] **T1 — The first slice** (R1)
  Shas: web \`539ba67\`
- [X] **T2a — A split task** (R2)
- [ ] **T3 — Ship** (all)
- [ ] a checklist line that is no task
`

const reading = (account: string, fiveHour: number, resetsAt: string, week: number) =>
  JSON.stringify({
    account,
    configDir: `/home/h/.${account}`,
    readAt: '2026-11-14T09:00:00.000Z',
    windows: [
      { kind: 'five_hour', percentUsed: fiveHour, resetsAt },
      { kind: 'seven_day', percentUsed: week, resetsAt: '2026-11-18T00:00:00Z' },
    ],
  })

const dir = (name: string) => ({ name, kind: 'dir', size: 0, mtimeMs: 0, isLink: false }) as const
const file = (name: string) => ({ name, kind: 'file', size: 1, mtimeMs: 0, isLink: false }) as const

test('counts the ticked tasks of a tasks.md', async () => {
  expect(countTasks(TASKS)).toEqual({ done: 2, total: 3 })
  expect(countTasks('')).toEqual({ done: 0, total: 0 })
})

test('names a feature by its folder', async () => {
  expect(featureLabel('016-admin-ux-pass')).toBe('016 admin ux pass')
})

test('names the project by its remote, else its folder', async () => {
  expect(projectOf('git@github.com-hitesh:fh-4-org/creative-display.git\n', '/x/main')).toBe('creative-display')
  expect(projectOf('', '/home/h/projects/fruitfitz/')).toBe('fruitfitz')
})

test('shortens home to ~', async () => {
  expect(shortPath('/home/h/projects', '/home/h')).toBe('~/projects')
  expect(shortPath('/home/hx', '/home/h')).toBe('/home/hx')
})

test('an account is as full as its busier window, and a window past its reset is empty', async () => {
  const windows = [
    { kind: 'five_hour', percentUsed: 100, resetsAt: '2026-11-14T09:59:00Z' },
    { kind: 'seven_day', percentUsed: 30, resetsAt: '2026-11-18T00:00:00Z' },
  ]
  expect(fullnessOf(windows, NOW)).toBe(30)
  expect(fullnessOf(windows, Date.parse('2026-11-14T09:00:00Z'))).toBe(100)
})

test('the best account is the emptiest; one with no reading only beats those 90% full', async () => {
  expect(bestOf([{ account: 'a', fullness: 40 }, { account: 'b', fullness: 12 }, { account: 'c', fullness: null }])).toBe('b')
  expect(bestOf([{ account: 'a', fullness: 95 }, { account: 'c', fullness: null }])).toBe('c')
  expect(bestOf([{ account: 'a', fullness: 100 }])).toBeUndefined()
  expect([roomLabel(null), roomLabel(100), roomLabel(12.4)]).toEqual(['?', 'full', '12%'])
})

const BAND = {
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 160,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
    rows: [],
  },
} as const

// A machine with three accounts: claude-work and claude have readings,
// claude-sp has none yet.
const machine = (on: On, files: Record<string, string>) => {
  mock.clock(on, { now: NOW })
  mock.env(on, { CLAUDE_CONFIG_DIR: '/home/h/.claude-work', HOME: '/home/h' })
  on('session.root', () => ({ value: '/home/h/projects/app/main' }))
  on('session.cwd', () => ({ value: '/home/h/projects/app/main' }))
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('session.measure', ($, e) => ({ changed: e.changed }))
  on('process.run', ($, e) => {
    const stdout = e.argv.includes('remote') ? 'git@github.com:o/app.git\n' : 'feat/016-admin-ux-pass\n'

    return { value: { exitCode: 0, stdout, stderr: '' } } as never
  })
  on('fs.list', ($, e) => {
    if (e.path === '/home/h') return { value: [dir('.claude'), dir('.claude-sp'), dir('.claude-work'), file('.claude.json'), dir('.config')] }
    if (e.path === LEDGER) return { value: Object.keys(files).filter(path => path.startsWith(LEDGER)).map(path => file(path.slice(LEDGER.length + 1))) }

    return { value: [dir('015-scorecards'), dir('016-admin-ux-pass')] }
  })
  on('fs.stat', () => ({ value: { kind: 'file', size: 1, mtimeMs: 1, isLink: false } }))
  on('fs.read', ($, e) => (e.path.endsWith('/tasks.md') ? { value: TASKS } : e.path in files ? { value: files[e.path] ?? '' } : { deny: 'no file' }))
  on('fs.write', ($, e) => {
    files[e.path] = e.text

    return { value: undefined } as never
  })
}

const START = { cwd: '/home/h/projects/app/main', surface: null, isInteractive: true } as const

test('draws one bar: account, project, feature, folder, and every account with the emptiest marked', async ($, on) => {
  machine(on, {
    [`${LEDGER}/claude-work.json`]: reading('claude-work', 81, '2026-11-14T12:00:00Z', 40),
    // Its five-hour window was full and has since reset: only the week counts.
    [`${LEDGER}/claude.json`]: reading('claude', 100, '2026-11-14T09:30:00Z', 12),
  })
  await $.session.start(START)

  const ui = await $.ui.mount({ plugin: 'account-band', surface: 'terminal', ...BAND })

  expect(await ui.find({ type: 'Text', text: ' claude-work ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '· app ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '· 016 admin ux pass 2/3 done ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '~/projects/app/main ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '→ claude 12%' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: ' · claude-sp ?' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: ' · claude-work 81%' })).toBeDefined()
  await ui.unmount()
})

test("a usage reading is recorded in the account's own file and shown", async ($, on) => {
  const files: Record<string, string> = {}
  machine(on, files)
  await $.session.start(START)
  const ui = await $.ui.mount({ plugin: 'account-band', surface: 'terminal', ...BAND })

  await $.session.measure({
    context: { usedTokens: 0, windowTokens: 200000 },
    rateLimits: [
      { kind: 'five_hour', percentUsed: 23.5, resetsAt: '2026-11-14T12:00:00Z' },
      { kind: 'seven_day', percentUsed: 8 },
    ],
    changed: ['rateLimits'],
  } as never)

  expect(JSON.parse(files[`${LEDGER}/claude-work.json`] ?? '{}')).toEqual({
    account: 'claude-work',
    configDir: '/home/h/.claude-work',
    readAt: '2026-11-14T10:00:00.000Z',
    windows: [
      { kind: 'five_hour', percentUsed: 23.5, resetsAt: '2026-11-14T12:00:00Z' },
      { kind: 'seven_day', percentUsed: 8 },
    ],
  })
  expect(await ui.find({ type: 'Text', text: ' · → claude-work 24%' })).toBeDefined()
  await ui.unmount()
})
