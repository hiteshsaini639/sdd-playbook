# sdd-playbook

General practice for building software products, extracted from real projects
and reused across them. Nothing project-specific lives here — if it names a
company, a stack version, or a feature, it belongs in that project's repo.

Consumed as a git submodule at `playbook/` in a project's spec repo.

## Contents
- `practices/spec-driven-development.md` — the loop, and why code never leads
- `practices/ears-requirements.md` — writing requirements that can be tested
- `practices/vertical-slices.md` — why "backend first" produces the worst bugs
- `practices/decision-levels.md` — where a decision goes, by blast radius
- `practices/agent-delegation.md` — which model does what, and why
- `practices/feature-loop.md` — a parent running every task through fresh children, then one review
- `practices/issue-log.md` — filing what you found but weren't asked to fix
- `practices/token-budgets.md` — making a large codebase cheap to navigate
- `practices/multi-repo-sdd.md` — one spec repo governing several code repos
- `practices/localization.md` — storing meaning, not words
- `practices/new-user-help.md` — a tour of each main screen, a first page that grows with use, what was seen kept on the server
- `practices/forced-update.md` — the version gate in version 1, a minimum and a latest, fail open, the release order
- `practices/public-forms.md` — store first then mail, traps instead of a captcha, an inbox in the admin
- `practices/transactional-mail.md` — local logs instead of sending, SMTP not a provider's API, one design readable everywhere
- `practices/replacing-paper.md` — keep the paper's shape, fix what it hides, sign-off locks a frozen month
- `practices/single-source-of-truth.md` — one home per fact; refer by ID, never restate
- `practices/verification-harness.md` — named checks per repo, test and smoke identities, done = green
- `practices/machine-checks.md` — a rule a machine can check is checked by one: the hooks, tests and branch protection
- `practices/local-run-check.md` — the by-hand check on a local run: when, standing local accounts, what gets recorded
- `practices/session-handoff.md` — a prompt file for the next session, taken once and deleted
- `practices/side-sessions.md` — a second session on the same machine, without breaking the first
- `practices/unattended-job-alerts.md` — a scheduled job proves its output; alerts for failed, never ran, machine down
- `practices/learning-loop.md` — the same mistake never twice: each lesson written at once where it is read when it matters, a repeat made a check; at a release, the findings
- `practices/new-project.md` — the checklist that sets a new project up for all of this
- `practices/rebuild-from-legacy.md` — the old system as evidence: tag, inventory, count, cite
- `practices/api-surfaces.md` — one database client, public vs admin surfaces, errors, limits, resends, health
- `practices/auth-sessions.md` — access and refresh tokens, expiry, throttling, reset, bootstrap
- `practices/permissions.md` — roles as data, (role, type, verb), enforced by the route generator
- `practices/declarations.md` — one declaration per entity generates API, validation and admin screens
- `practices/data-conventions.md` — keys, convention columns, time, money, tenancy, migrations
- `practices/local-dev.md` — one command, fixed ports that fail rather than move, one env list
- `practices/glossary.md` — `CONTEXT.md`: what a word means here, and nothing else
- `practices/parked-work.md` — anything parked mid-task becomes a W file before work continues
- `practices/account-label.md` — every session names the account it runs on, above the prompt
- `practices/machines.md` — the laptop keeps working shut on charger; pop-ups and fixed workspaces for many sessions; a spare machine only for one-off work started by hand
- `practices/ai-features.md` — look for it in every feature; a free local model for a narrow job, Claude for judgement; answer only or agent; one seam; the Claude CLI as a child that can only answer; the token
- `practices/local-models.md` — free models on our own machine, by job: cut-outs, tagging, OCR, speech, translation, small text models; when they save tokens; the licences a business can't use
- `practices/production-only-testing.md` — no staging: ship dark behind permissions, roll out by granting, migrations only add, a test business that can be emptied
- `skills/` — the Claude Code skills that run these practices; linked into a project (`skills/README.md`)
- `hooks/` — the git and Claude Code hooks that refuse a broken rule; installed by `hooks/link.sh`
- `mods/` — Claude Code mods every project shares; installed per account by `mods/install.sh`
- `machine/` — per-machine setup: the lid rule, `claude-keep-awake`, `claude-notify` and `workspaces.sh`, installed by `machine/install.sh` (`practices/machines.md`)
- `templates/` — generic spec/plan/tasks/issue, the constitution, and the issues and prompts READMEs, before project adaptation
- `work/` — the playbook's own parked work, mostly practices still being learned (`W<n>` files, `practices/parked-work.md`)
- `decisions/` — ADRs that apply to any project
  - `ADR-0001-proper-fix-first.md` — the proper fix by default; a shortcut only with its proper fix planned
  - `ADR-0002-production-only-testing.md` — one environment: trials on production behind permissions and a test business, no staging server

## Companion tools
Separate repos, general to any project, installed once per machine rather than per project.
- [claude-in-firefox](https://github.com/hiteshsaini639/claude-in-firefox) — Claude Code drives Firefox: an MCP server, a start script and a skill; Claude's own profile by default

## How this grows
A practice earns its place here by being learned the hard way on a real
project, not by sounding correct. When something in a project repo turns out
to generalise, it moves up (`practices/learning-loop.md`). Keep each file short enough to read in full, and
prefer deleting a rule that stopped paying over keeping it out of politeness.
