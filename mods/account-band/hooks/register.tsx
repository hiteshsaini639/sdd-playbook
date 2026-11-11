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

export const register: Register = on => {
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    // A survey holds the band while it is up.
    if (e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Text } = $.ui.resolve(e)
    const account = accountOf(await $.env.get('CLAUDE_CONFIG_DIR'))

    return (
      <Box>
        <Text weight="bold" inverse color={colorOf(account)}>
          {` ${account} `}
        </Text>
      </Box>
    )
  })
}
