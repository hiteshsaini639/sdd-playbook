---
name: sdd-implement
description: Execute exactly one task from a feature's tasks.md. Use for each implementation step.
---
Arguments: `<NNN-slug> <Tn>` → $ARGUMENTS

Spec repo state:
!`git status --short && git log --oneline -3`

Project additions: `.claude/skill-additions/sdd-implement.md`, if it exists.
Read it first; where it and this file differ, it wins.

0. **Delegate first.** If this session holds anything beyond this one task
   (a feature parent, a planning conversation, earlier tasks), do **not**
   run the steps below here. You are the parent: spawn one fresh child with
   the Agent tool, following `playbook/practices/feature-loop.md`. Pick the
   model per its table, hand over the self-contained prompt it describes,
   then do its "After each child" checks. Only a fresh child, or a session
   started for this task alone, continues to step 1. Why:
   `playbook/practices/agent-delegation.md`.
1. Read `CLAUDE.md`. Then read the feature's documents **by section**
   (`playbook/practices/token-budgets.md` → Other levers): `tasks.md`'s
   preamble (up to the first task) and your task whole; in `spec.md` and
   `plan.md`, the sections and rows your task cites by ID (R, AC, D, C,
   Q, Risk, "→ Contract" and the like), found with `grep -n` and read by
   line range; in `map/<surface>.md`, its headings and the rows you will
   use or change. Follow a cross-reference where one leads; when unsure
   whether a section applies, read it.
2. Refuse if any earlier task is unchecked.
3. Read the task's `Read:` list. **That is your whole budget.** If you need a
   file it doesn't list, stop and report which file and why — do not go
   hunting, and do not grep the product repos. They are large enough that a
   blind search is the single most expensive mistake available to you.
4. Implement only that task. If you hit a decision the spec doesn't cover,
   STOP and ask — do not invent a requirement. If you notice a problem
   outside the task, don't fix it. Report it with `file:line` and the sha
   so it can be filed in `issues/`. When running solo, file it yourself.
5. Run the task's verify command. Send a full run's output to a file and
   read its totals and failures (`grep` for the runner's summary and
   failure lines); open more of the log only for a failure you are
   fixing. Show me the totals and any failure.
6. If red: show the failure and stop. Do not "fix forward" into the next task.
7. If green, commit in each product repo the task touched:
   `<type>(NNN/Tn): <msg> [<ids>]`
   Then in this repo: tick the checkbox, record one sha per repo on the
   task's `Shas:` line, and commit `tasks(NNN): tick Tn`.
   The shas are the only link between this spec and the code satisfying it.
   A ticked task with no shas is an unverifiable claim.
8. Do not start the next task.

Repo owners and the `gh` account to use are in `CLAUDE.md`'s table of
product repos. Don't assume; check `git remote -v`.
