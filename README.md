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
- `practices/feature-loop.md` — a parent running every task through fresh children
- `practices/issue-log.md` — filing what you found but weren't asked to fix
- `practices/token-budgets.md` — making a large codebase cheap to navigate
- `practices/multi-repo-sdd.md` — one spec repo governing several code repos
- `practices/localization.md` — storing meaning, not words
- `practices/single-source-of-truth.md` — one home per fact; refer by ID, never restate
- `practices/verification-harness.md` — named checks per repo, test and smoke identities, done = green
- `practices/local-run-check.md` — the by-hand check on a local run: when, standing local accounts, what gets recorded
- `practices/session-handoff.md` — a prompt file for the next session, taken once and deleted
- `templates/` — generic spec/plan/tasks/issue, before project adaptation
- `decisions/` — ADRs that apply to any project

## How this grows
A practice earns its place here by being learned the hard way on a real
project, not by sounding correct. When something in a project repo turns out
to generalise, it moves up. Keep each file short enough to read in full, and
prefer deleting a rule that stopped paying over keeping it out of politeness.
