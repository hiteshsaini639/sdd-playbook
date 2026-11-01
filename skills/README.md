# Skills

Claude Code skills that run the practices: the spec → plan → tasks →
implement → drift loop, the feature loop, and the session handoff. They
are generic. Whatever is a project's own lives in that project.

| Skill | Runs | Practice |
|---|---|---|
| `/sdd-spec <slug>` | a spec from the template, then the ambiguity test | `spec-driven-development.md`, `ears-requirements.md` |
| `/sdd-plan <NNN-slug>` | the plan for an approved spec | `decision-levels.md` |
| `/sdd-tasks <NNN-slug>` | ordered, verifiable tasks from an approved plan | `vertical-slices.md` |
| `/sdd-implement <NNN-slug> <Tn>` | exactly one task | `agent-delegation.md`, `token-budgets.md` |
| `/sdd-feature <NNN-slug>` | every remaining task, one fresh child each | `feature-loop.md` |
| `/sdd-drift <NNN-slug>` | the audit of spec against code | `multi-repo-sdd.md` |
| `/prompt-and-clear [next step]` | the prompt for the next session | `session-handoff.md` |
| `/lets-go` | a session from the newest waiting prompt | `session-handoff.md` |

## Installing in a project
From the spec repo's root, with the playbook at `playbook/`:
```
playbook/skills/link.sh
```
It links each skill folder into `.claude/skills/`, where Claude Code finds
it, and leaves alone any skill the project already has under that name.
Commit the links. A playbook bump then updates every skill at once; run
the script again when the playbook gains one.

## What a skill expects of the project
The layout `new-project.md` sets up: `CLAUDE.md` (the constitution, with
its table of product repos, "Where facts live", and the per-task budget),
`specs/system.md`, `specs/_templates/`, `specs/NNN-slug/`, `map/<surface>.md`,
`decisions/`, `issues/README.md` and `_template.md`, `prompts/README.md`,
and a **Checks** section in each product repo's `CLAUDE.md`.

## A project's additions
A skill reads `.claude/skill-additions/<skill>.md` first, if the project
has one, and that file wins where the two differ. It holds only what is the
project's own: ids of its ADRs and rules a step should cite, its machine
limits and build commands, the accounts on the owner's machine, a rule the
owner added. It never restates the skill.

A skill the project needs and no other project would (a client report, a
release checklist) is the project's own folder in `.claude/skills/`, not a
link.

## Changing a skill
In the playbook, in the same spirit as a practice: learned on a real
project, then made generic. A change that names a project's ADR, path or
stack belongs in that project's additions instead.
