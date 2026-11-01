# Starting a new project

What a new product needs so that the practices and skills here run on it
from the first feature. The shape is `multi-repo-sdd.md`; this is the
checklist that builds it. A single-repo product follows the same steps
with one product repo.

## 1. The spec repo
```
mkdir <product>-sdd && cd <product>-sdd && git init
git submodule add <playbook remote> playbook
```
`.gitignore`: each product repo folder, and `prompts/*` with
`!prompts/README.md`. Clone the product repos inside it, as their folders.

## 2. The files the skills expect
| Path | From |
|---|---|
| `CLAUDE.md` | `playbook/templates/constitution.md`, renamed: fill the product, the repo table and the non-negotiables that apply |
| `specs/_templates/spec.md`, `plan.md`, `tasks.md` | `playbook/templates/`: then add the project's sections and convention ADRs |
| `specs/system.md` | new: the platform's cross-cutting requirements (`S1`…) and the feature index |
| `specs/roadmap.md` | new: the order of work and the owner's decisions (`D1`…) |
| `decisions/` | new, empty until the first platform ADR |
| `issues/README.md`, `issues/_template.md` | `playbook/templates/issues-README.md`, `issue.md` |
| `map/<surface>.md` | new, one per product repo: where things live, pointing in (`token-budgets.md`) |
| `prompts/README.md` | `playbook/templates/prompts-README.md` |
| `runbooks/local-run.md` | new when the first by-hand check is needed (`local-run-check.md`) |

Each product repo gets a **Checks** section in its own `CLAUDE.md`
(`verification-harness.md`), committed there.

## 3. The skills
```
playbook/skills/link.sh
```
Then write `.claude/skill-additions/<skill>.md` only for what is the
project's own (`playbook/skills/README.md` → A project's additions). For
`sdd-feature` that is at least the machine limits: the test command at low
priority, and the build commands with their memory caps.

## 4. What does not come along
- **The session memory.** Claude Code keeps it per project folder, so a
  new project starts without it. A lesson in it that holds for any
  project belongs here, as a practice, and the memory note goes. What is
  the machine's (accounts, paths) stays in memory or the project.
- **Another project's ADRs, ids and history.** Its rules arrive here only
  as practices or `playbook/decisions/`, made generic.

## Done when
`/sdd-spec <first feature>` runs to its ambiguity test without asking
where anything is.
