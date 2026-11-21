# sdd-playbook — router

General practice, project-independent. A project's own `CLAUDE.md` outranks
this file; this is the default when the project says nothing.

Read the one practice you need. Do not read all of them.

| If you are | Read |
|---|---|
| Starting a feature | `practices/spec-driven-development.md` |
| Writing requirements | `practices/ears-requirements.md` |
| Ordering tasks | `practices/vertical-slices.md` |
| Recording a decision | `practices/decision-levels.md` |
| Handing work to an agent | `practices/agent-delegation.md` |
| Running a whole feature's tasks | `practices/feature-loop.md` |
| Found a problem outside your task | `practices/issue-log.md` |
| Working in a big codebase | `practices/token-budgets.md` |
| Setting up a spec repo | `practices/multi-repo-sdd.md` |
| Touching anything user-visible | `practices/localization.md` |
| Helping a new user learn the screens | `practices/new-user-help.md` |
| Shipping a mobile app | `practices/forced-update.md` |
| Building a form anyone can send | `practices/public-forms.md` |
| Sending mail from the app | `practices/transactional-mail.md` |
| Moving a paper sheet into the app | `practices/replacing-paper.md` |
| Checking a change by hand on a local run | `practices/local-run-check.md` |
| Handing work to the next session | `practices/session-handoff.md` |
| Working beside another session | `practices/side-sessions.md` |
| Scheduling a job nobody watches | `practices/unattended-job-alerts.md` |
| Learned something, or a mistake came back; releasing to production | `practices/learning-loop.md` |
| Starting a new project | `practices/new-project.md` |
| Replacing an old system | `practices/rebuild-from-legacy.md` |
| Shaping an API, its errors and limits | `practices/api-surfaces.md` |
| Building login, tokens, sessions | `practices/auth-sessions.md` |
| Building roles and permissions | `practices/permissions.md` |
| Many CRUD entities and admin screens | `practices/declarations.md` |
| Designing tables | `practices/data-conventions.md` |
| Setting up local run, ports, env | `practices/local-dev.md` |
| A word means something particular here | `practices/glossary.md` |
| Parking work for later | `practices/parked-work.md` |
| Using more than one Claude account on a machine | `practices/account-label.md` |
| Setting up a laptop: the lid shut, pop-ups, workspaces; or a spare machine; how hard a machine's checks may load it | `practices/machines.md` |
| Adding anything that calls an AI model | `practices/ai-features.md` |
| Changing or installing a skill | `skills/README.md` |
| A rule keeps being broken, or installing the hooks | `practices/machine-checks.md` |

## The one rule
Code does not change unless a spec changed first. Everything else here is
detail in service of that.
