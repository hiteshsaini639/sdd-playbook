import type { Register } from 'claude-code'

// A colour is picked from the name, so an account keeps its colour on every
// machine and no account is written here.
const COLORS = ['#4aa3df', '#d9a441', '#57b894', '#b58ad9', '#d97757', '#d96a9b']

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

export const register: Register = on => {
  // The band redraws often; git runs once per project root.
  const projects = new Map<string, string>()

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    // A survey holds the band while it is up.
    if (e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const [configDir, home, root, cwd] = await Promise.all([
      $.env.get('CLAUDE_CONFIG_DIR'),
      $.env.get('HOME'),
      $.session.root(),
      $.session.cwd(),
    ])

    let project = projects.get(root)

    if (project === undefined) {
      const remote = await $.process
        .run(['git', 'remote', 'get-url', 'origin'], { cwd: root, timeoutMs: 2000 })
        .catch(() => undefined)

      project = projectOf(remote?.exitCode === 0 ? remote.stdout : '', root)
      projects.set(root, project)
    }

    const account = accountOf(configDir)

    return (
      <Box>
        <Text weight="bold" inverse color={colorOf(account)}>
          {` ${account} `}
        </Text>
        <Text weight="bold">{` ${project} `}</Text>
        <Text dimColor wrap="truncate-start">
          {shortPath(cwd, home)}
        </Text>
      </Box>
    )
  })
}
