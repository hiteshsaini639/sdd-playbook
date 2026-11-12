# AI features

How a product calls an AI model so that what it sends, what it gets back
and what the answer may do are decided once. Learned on a shop's back
office, where the AI drafts a goal's steps for the owner to accept, and on
a small trip app whose worker runs a skill headless over an inbox. Both
reach Claude through the Claude CLI on the owner's own subscription: no
billing to set up, quick to start, right for an owner-only first phase.

## Pick the shape first
Two shapes for two kinds of job. Decide before anything else; the rest of
this file differs by it.

| | Answer only | Agent |
|---|---|---|
| The AI | writes one answer in a fixed shape | works in steps, with tools (files, git, web) |
| Who acts | the app's own code, once a person accepts | the AI, unattended |
| Fits | turning data the app holds into a proposal: steps, a reply, a summary, fields from a document | open-ended work over documents or the web: keep a plan current, research, edit a repo |
| A user's text can | make the answer wrong; the checks and the person catch it | steer the agent to anything its tools reach |
| Tests | a stand-in gives fixed answers; every path is tested | the skill is not unit-testable; bound it instead |

Default to **answer only**. Take the agent only when the job cannot be done
without tools, and then bound it (below). A job that looks like an agent's
is often an answer plus a little code: the AI returns "add this expense,
void that one" as data, and the app writes them through its own checks.

## Rules for both
1. **One seam.** One module in the server is the only caller of a model.
   A feature asks it; none imports a provider's library or reads the sign-in.
2. **What is sent is listed.** The feature's spec names every kind of data
   sent, and nothing else goes: one tenant's, and only what the asking user
   may see. People are sent as refs (`p1`, `p2`), not ids.
3. **The answer is data.** The app gives the shape it wants (a JSON schema)
   and repairs the answer against its own rows before storing it: an unknown
   person becomes nobody, a past date is cleared, a loop is cut, too few
   usable items is a failure. The fixed instructions live in code and say
   the user's text is data.
4. **A person accepts** (answer only). The accept runs as that person,
   through the same checks as the same thing typed by hand, and what it
   creates says it came from an AI.
5. **Recorded and limited.** Each call records who asked, for what, the
   outcome, the model and the tokens. Each feature has a daily limit per
   tenant.
6. **No sign-in, no feature, no failure.** Without the setting the app
   starts and the feature is off. The real service is installed at start-up
   (`main`) only, never in what the tests boot, so a test can only reach a
   stand-in. The model's name is a setting with a default in code.
7. **A failure is a kind, never the provider's text:** `timeout`,
   `unavailable`, `plan_limit`, `declined`, `unusable`, each with a sentence
   and Try again. The provider's output can echo the sign-in, so it never
   leaves the seam.
8. **Long calls run in the background.** A call can take a minute. The
   request stores a `working` row and answers at once; the work runs on
   under a timeout; the page reads the row every few seconds until it is
   done or failed. A row still `working` after a few minutes (the server
   restarted mid-call) is failed the next time it is read.

## Answer only: the CLI as a child that can only answer
```ts
const home = await mkdtemp(join(tmpdir(), 'ai-'))            // empty, its own
try {
  const child = spawn('claude', [
    '-p', '--output-format', 'json', '--json-schema', JSON.stringify(schema),
    '--system-prompt', system, '--model', model,               // fixed, from code and settings
    '--tools', '', '--strict-mcp-config', '--setting-sources', '', '--no-session-persistence',
  ], {
    cwd: home, signal,                                         // the caller's timeout ends it
    env: { PATH: process.env.PATH ?? '', HOME: home,           // built from nothing
           CLAUDE_CONFIG_DIR: join(home, '.claude'), CLAUDE_CODE_OAUTH_TOKEN: token },
  })
  child.stderr.resume()                                        // drained, never read
  child.stdin.end(JSON.stringify(document))                    // the user's text: stdin, never argv
  // collect stdout, then map it (below)
} finally {
  await rm(home, { recursive: true, force: true })
}
```
- `--tools ""` turns every tool off; `--strict-mcp-config` with no config
  loads no MCP server; `--setting-sources ""` reads no settings file, so no
  hook or permission of the machine's applies; `--no-session-persistence`
  keeps nothing. With all four, `--json-schema` still gives
  `structured_output`.
- The environment is built from nothing, not copied and trimmed: the
  database password, the session secret and any API key never reach it.
- Not `--bare`: it does not read `CLAUDE_CODE_OAUTH_TOKEN`.
- The mapping of the JSON result: not JSON, or not `type: "result"` →
  `unavailable`; `is_error` with `api_error: "usage_limit_reached"` or
  status 429 → `plan_limit`; a refused sign-in (401) → `unavailable`, with
  one log line naming the setting, never its value; any other error →
  `unavailable`; `stop_reason: "refusal"` → `declined`. Otherwise the
  answer is `structured_output`, the model is the `modelUsage` key with the
  most output tokens, and the tokens come from `usage` (input plus both
  cache counts; output).
- `spawn` is a parameter, so a test replaces it and reads the arguments,
  the environment and standard input without running the CLI.

## Agent: bound what it can reach
Whoever's text an agent reads reaches its tools. Private data, untrusted
text and a way out (web, a network call) in one session let a message send
the data out. Remove one of the three, or accept the risk in writing for a
small, known group.
- The tools on the command line as an allow-list (`--allowedTools`), not
  the repo's settings alone. No web tool unless the job needs one.
- The environment built from nothing, as above. If the agent must call the
  app, its credential does this one job and nothing else; better, the agent
  answers with its result as data and the script submits it.
- Its result goes through the app's own checks, as an answer would; a
  result the app refuses changes nothing.
- Each change it makes is a commit, so any one is a `git revert`. A lock so
  runs never overlap. A run that ends with no result is retried a few
  times, then handed to the owner.
- The user's text never through a shell: in a file the run reads, or as one
  argument with no expansion (an argument is visible to other users of the
  machine).

## Signing in
- **The owner's subscription:** `claude setup-token`, run on the owner's own
  machine, gives a token that lasts a year, set as `CLAUDE_CODE_OAUTH_TOKEN`.
  It is one person's: only that person's requests go through it, and the app
  refuses anyone else's (a role check) until a key is in place. Read the
  provider's terms before letting other people's requests use it.
- **An API key** for other people's requests and per-call billing: the same
  seam with a second service behind it. Park it as work from the first
  feature, so the switch is a known task, not a rewrite.
- **On the server**, typed at a hidden prompt, never pasted into a chat, a
  shell history or a log:
  ```bash
  ( umask 077; read -rs -p 'token: ' t; echo
    printf 'CLAUDE_CODE_OAUTH_TOKEN=%s\n' "$t" >> app.env )
  grep -c '^CLAUDE_CODE_OAUTH_TOKEN=sk-ant-oat' app.env    # 1
  ```
  Check it by count, never by printing. A first try that pasted the command
  instead of the token shows as a second line. Record the day it was made
  and the day it runs out in the deployment doc: a token that has run out
  makes every call `unavailable`, with the one log line.
- It needs outbound HTTPS to the provider and nothing else.

## Shipping the CLI
- Pin the CLI's exact version as a runtime dependency of the server's
  package, so the image carries it and a lockfile check holds it.
- pnpm skips a dependency's install script unless allowed by name
  (`onlyBuiltDependencies`); the CLI's script puts its native binary in
  place, so without it `claude` will not run.
- In the image, `claude --version` runs as the app's own user. It runs on
  Alpine (musl), not as root.
- Before writing the mapping, one locked-down run by hand, and read real
  results: a success, an allowance reply, a signed-out reply.

## Tests
- A stand-in at the seam, installed by the tests' harness, gives fixed
  answers or a failure kind; every feature test runs against it.
- `RISK_` tests for the real service, with `spawn` replaced: each result
  maps to its kind; no failure and no log line holds the token; the
  arguments hold the four switches; the user's text is on standard input
  and in no argument; the environment's keys are exactly the four, with a
  database password and a session secret set in the process and absent
  from the child; the folder is empty at the start and gone at the end.
- Show they bite: give the child the server's environment, or misread the
  allowance reply, and each goes red.
