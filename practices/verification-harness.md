# Verification harness

An agent should never finish with "I think it works". Each repo gives it a
fixed set of checks to run and fixed identities to run them as, so that
"done" means "the named checks are green".

## Checks, declared once per repo
Each product repo lists its checks in one place: its agent guide
(`CLAUDE.md`), under **Checks**. They are commands, not prose, in three tiers:

| Tier | When | Scope |
|---|---|---|
| **fast** | before every commit | the tests for what changed, plus the build/compile step |
| **full** | before a task is ticked or a branch merged | the whole test suite |
| **smoke** | after every deploy | a handful of requests against the running environment |

A fourth check is not a command: the **local run**, by hand, for a change a
person sees or two surfaces share. When it runs, who it runs as, and what it
records: `local-run-check.md`.

Task `Verify:` lines name these tiers ("fast, then full") and add only what
is specific to the task. The commands themselves live in the repo, where they
change (`single-source-of-truth.md`).

Checks run at low priority and one at a time, cheapest first
(`feature-loop.md` → Machine limits).

## Known red
A check that is red on `main` for a reason outside the task (missing local
infrastructure, a known bug) is listed under **Checks → Known red**, with its
issue ID. Agents skip past it instead of rediscovering it. The list is meant
to shrink: every entry is an open issue.

## Identities for tests
Tests never create users by hand and never go looking for a token. The test
sources provide one fixture that:
- builds an authenticated principal for each role; and
- mints a token signed with the **test profile's** secret, for the full
  filter-chain path.

The fixture seeds only in-memory or throwaway test databases.

## Identities for deployed environments
Smoke checks that need a login use a dedicated **smoke account per role**:
- on non-production environments only;
- holding no real user data, and able to reach none;
- with credentials kept where the environment's other secrets are kept,
  never in git, never in a doc;
- rotated whenever those secrets are.

Production smoke checks use unauthenticated endpoints (health, public
lookups) only. A standing credential into production for automation is a
standing breach.

## Definition of done, for an agent
- fast and full are green, or red only on the Known red list;
- after a deploy, smoke is green;
- the task records which checks it ran and their results.
