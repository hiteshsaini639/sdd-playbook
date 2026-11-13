import { expect, mock, test } from 'claude-code/testing'

import { countTasks, featureLabel, projectOf, shortPath } from '../hooks/register'

const TASKS = `# 016 — Tasks

- [x] **T1 — The first slice** (R1)
  Shas: web \`539ba67\`
- [X] **T2a — A split task** (R2)
- [ ] **T3 — Ship** (all)
- [ ] a checklist line that is no task
`

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

const BAND = {
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 120,
    scroll: { offset: 0, bodyRows: 10 },
    view: {},
    rows: [],
  },
} as const

const dir = (name: string) => ({ name, kind: 'dir', size: 0, mtimeMs: 0, isLink: false }) as const

test('draws one bar: account, project, the branch feature and the folder', async ($, on) => {
  mock.clock(on)
  mock.env(on, { CLAUDE_CONFIG_DIR: '/home/h/.claude-work', HOME: '/home/h' })
  on('session.root', () => ({ value: '/home/h/projects/app/main' }))
  on('session.cwd', () => ({ value: '/home/h/projects/app/main' }))
  on('session.start', ($, e) => ({ cwd: e.cwd }))
  on('process.run', ($, e) => {
    const stdout = e.argv.includes('remote') ? 'git@github.com:o/app.git\n' : 'feat/016-admin-ux-pass\n'

    return { value: { exitCode: 0, stdout, stderr: '' } } as never
  })
  on('fs.list', () => ({ value: [dir('015-scorecards'), dir('016-admin-ux-pass')] }))
  on('fs.stat', () => ({ value: { kind: 'file', size: 1, mtimeMs: 1, isLink: false } }))
  on('fs.read', () => ({ value: TASKS }))
  await $.session.start({ cwd: '/home/h/projects/app/main', surface: null, isInteractive: true })

  const ui = await $.ui.mount({ plugin: 'account-band', surface: 'terminal', ...BAND })

  expect(await ui.find({ type: 'Text', text: ' claude-work ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '· app ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '· 016 admin ux pass 2/3 done ' })).toBeDefined()
  expect(await ui.find({ type: 'Text', text: '~/projects/app/main ' })).toBeDefined()
  await ui.unmount()
})
