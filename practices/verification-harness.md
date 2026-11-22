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

Checks run cheapest first, at the priority and pace the machine's row
allows (`feature-loop.md` → Machine limits).

## Known red
A check that is red on `main` for a reason outside the task (missing local
infrastructure, a known bug) is listed under **Checks → Known red**, with its
issue ID. Agents skip past it instead of rediscovering it. The list is meant
to shrink: every entry is an open issue.

## CI before a merge
One green CI run of the required checks is enough to merge. A run is
repeated only when an acceptance criterion names repeated runs, or the
owner agrees: each one is minutes of someone waiting. A test that passes
only sometimes is an issue to file, not a reason to rerun until green.

A branch cut from an older point, such as a release branch cut from
`production`, lacks the test fixes `main` gained since. When its run is
red on such a test alone, one whose issue is fixed on `main`, the red is
that old flake, not the change's: one rerun at the owner's word, and no
new issue. The release's record names it. Learned at CardiRehab's 062
release (web #72, I491).

## A test waits on the event, not the clock
When writing a test that waits for something (a page loaded, a dialog
closed, a request answered), wait on that thing itself, with the runner's
own limit as the only clock. Never a short fixed wait, and never the test
library's default wait, chosen because it passed on an idle machine: a
loaded machine or a CI runner misses it, and the next test fails on what
the first left behind. Learned when three of one project's tests failed
this way in one month, each fixed alone (CardiRehab I378, I510, I560). A
fourth would make it a check (`machine-checks.md`).

## A check on a deployed environment gets no answer
When a smoke or a check after a deploy times out with no answer at all,
not an error status, read the host's kernel log for that minute before
blaming the check or the release. A virtual machine its host stops
running freezes everything on it, and its kernel says so afterwards (an
RCU stall, "rcu_sched kthread starved"). Then the check was right, the
release is not at fault, and the host is the issue. Learned when a 60 s
freeze right after a web deploy looked like the nginx reload's fault
(CardiRehab I562).

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
