# <Product> — Constitution

Governs every spec, plan, and line of code across the product repos.
Specs may add rules; they may never relax these.

## What this platform is
<Two or three lines: what the product does, for whom, and which part owns
the data and the contracts.>

## The product repos
| Folder | GitHub | Stack | Audience |
|---|---|---|---|
| `<product>-backend/` | `<owner>/<product>-backend` | <language, framework, database, versions> | — |
| `<product>-web/` | `<owner>/<product>-web` | <...> | <...> |

This table is the one home for repo names, folders and owners. `playbook/`
is `<owner>/<playbook repo>`. Each GitHub owner is also the `gh` account to
use: `gh auth switch` to it before any GitHub operation, and check
`git remote -v` first.

These repos are gitignored here. They are separate repos with their own
history and remotes. This repo holds specs, plans, tasks, decisions and
maps — never code.

## Non-negotiables
<Keep the ones that apply, add the product's own, number them: they are
cited as "constitution rule N".>
1. **Spec before code.** No code commit without a spec in `specs/<NNN>-<slug>/`.
   Code commits cite feature and task: `feat(012/T4): … [R3,AC2]`.
2. **Fixed-choice values are codes, never display text.** Anything a user
   picks from a list of known options is stored as a code (`BRISK_WALK`),
   never a label or an i18n key. See `playbook/practices/localization.md`.
3. **Localize at the edge.** The server is locale-free. Clients translate
   codes for display.
4. **One vocabulary, every consumer.** A code list is declared once, on the
   server. Client option lists derive from it; they never restate it.
5. **Slices are vertical.** A task moves every surface it touches together
   for one testable increment. See `playbook/practices/vertical-slices.md`.
6. **Tests come from acceptance criteria.** Each AC maps to a test named
   `AC<n>_<slug>`. Done = every AC test green and no test without an AC.
7. **The schema is migrations.** <the migration tool; nothing changed by
   hand-run SQL; an applied migration is never edited.>
8. **No new runtime dependency** without a one-line justification in the plan.
9. **One home per fact.** Every fact lives in exactly one place (table
   below). Everywhere else refers to it by ID, never restates it. See
   `playbook/practices/single-source-of-truth.md`.
10. **The proper fix first.** See `playbook/decisions/ADR-0001-proper-fix-first.md`.

## Where facts live
| Kind of fact | Its one home | Refer to it as |
|---|---|---|
| Rules every change obeys | this file | "constitution rule 9" |
| Platform behaviour, cross-cutting requirements | `specs/system.md` | `S3` |
| A feature's requirements and criteria | `specs/NNN-slug/spec.md` | `012/R4`, `012/AC2` |
| How a feature is built / its steps | that feature's `plan.md` / `tasks.md` | `012/T3` |
| Order of work, owner decisions | `specs/roadmap.md` | `D2`, feature `012` |
| Platform decisions | `decisions/ADR-NNNN-*.md` | `ADR-0005` |
| Known problems and open follow-ups | `issues/I<n>-*.md` | `I32` |
| Where code lives in a product repo | `map/<surface>.md` (points in, never copies) | `map/backend.md` |
| How a product repo is checked (fast / full / smoke, known red) | that repo's `CLAUDE.md` → **Checks** | `<product>-backend/CLAUDE.md#checks` |
| How a product repo builds, deploys, configures, runs | that repo | `<product>-backend/DEPLOYMENT.md#<heading>` |
| How the platform is run and checked by hand on local | `runbooks/local-run.md` | `runbooks/local-run.md#<heading>` |
| What the skills do differently here | `.claude/skill-additions/<skill>.md` | "the sdd-feature additions" |
| General practice beyond this project | `playbook/` | `playbook/practices/<file>.md` |

Issue history, commit messages and ADR context are logs of what happened.
They may mention facts, and they are never the place to read current state.

## Working on a feature
Read in this order and stop as soon as you have enough:
1. This file.
2. `map/<surface>.md` for the surfaces the task touches. **Find the working
   area here.** Do not search the repos blind.
3. `specs/<NNN>-<slug>/spec.md`, then `plan.md`, then your one task.

Then: execute exactly one task from `tasks.md` and stop and report.
Before committing, run the repo's **Checks**: fast before every commit, full
before ticking a task, smoke after a deploy. Record what ran and the result
in the task. See `playbook/practices/verification-harness.md`.
Read only the files that task lists. If you need one it doesn't list, stop
and say why — do not go hunting.
If a task needs a decision the spec doesn't cover, STOP and ask. Never
invent a requirement.

## Decisions
Blast radius decides where it lives:
- Applies to any future project → `playbook/decisions/`
- Two or more surfaces here → `decisions/ADR-NNNN-<slug>.md`
- One feature → the Key decisions table in that feature's `plan.md`

Short: what was decided, why, what it rules out.

## Issues
Found a problem outside your task? Don't fix it in passing. File it in
`issues/` (one file per issue, global `I<n>` ids; see `issues/README.md`).
Fixes go through a spec that cites the ID.

## Skills
`/sdd-spec` · `/sdd-plan` · `/sdd-tasks` · `/sdd-implement` · `/sdd-drift` ·
`/sdd-feature` · `/prompt-and-clear` · `/lets-go`: the playbook's
(`playbook/skills/README.md`), linked into `.claude/skills/`. This
project's additions to them: `.claude/skill-additions/`.

A session writes a prompt in `prompts/` only when the owner asks:
`prompts/README.md`.

Hooks refuse what a machine can check (a commit with no task, a tick with
no sha, `git add -A`): `playbook/practices/machine-checks.md`. A refusal is
the rule speaking; fix the commit, never route around the hook.

## Conventions
- Feature dirs are `NNN-kebab-slug`, numbered in order of first spec.
- Commits here: `spec(012): …`, `plan(012): …`, `tasks(012): tick T4`.
- When a task is ticked, record the resulting sha per repo in `tasks.md`.
  That is the only link between a spec and the code that satisfies it.
- Time is UTC. IDs and phone numbers are strings.

## Communication
- Speak plainly. When citing an id (`D2`, `ADR-0005`, `I3`), say in the same
  sentence what it is: "the tenant decision (ADR-0003)", not "per ADR-0003".
- Explain jargon the first time it appears.
- Code comments keep only what the long term needs: why something is not the
  obvious way. No essays, no history (git has it).

## Budget
One task should cost well under 100k tokens. Going over is fine when the
task needs it. Finish and say why. At roughly 2× it is too big, so stop and
say so. Never add a heavy build the task's Verify doesn't name.
