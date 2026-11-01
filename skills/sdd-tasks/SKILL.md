---
name: sdd-tasks
description: Break an approved plan into ordered, verifiable tasks. Use after plan.md is Approved.
---
Feature: $ARGUMENTS

Project additions: `.claude/skill-additions/sdd-tasks.md`, if it exists. Read
it first; where it and this file differ, it wins.

1. Read `spec.md` and `plan.md` for $ARGUMENTS.
2. Create `tasks.md` from `specs/_templates/tasks.md`. Rules:
   - T1 is the enum/schema change if there is one. T2 is the failing AC tests.
   - **Slice vertically** (`playbook/practices/vertical-slices.md`). A task
     that changes a contract either carries its clients or is immediately
     followed by the task that does. Never schedule all of one client and
     then all of another — if the task list has a run of same-surface tasks
     longer than two, re-slice it.
   - The backfill task precedes any task that assumes coded values.
   - Each task names its surfaces and lists the **exact files** the
     implementing agent may read. That list is the agent's whole budget, so it
     must be sufficient — an agent that has to stop and ask for one more file
     costs more than one you listed generously.
   - Each task has a concrete verify command with its expected outcome, e.g.
     "AC1, AC3 pass; AC2 still red". It names the repo's check tiers
     (`playbook/practices/verification-harness.md`) instead of restating
     their commands.
   - Each task leaves every touched repo's test command runnable.
   - **A name a task gives must be writable where it goes.** A class, a
     file, a key or a test group a task text names is legal in that
     language and follows the surface's own naming rule, which the task
     cites instead of restating. A child told to write a name that cannot
     be written invents one, and two children invent two (a Java class
     "named `024`").
   - The last task is always the drift audit.
   - 6–15 tasks. Fewer means too coarse; more means split the feature.
3. Estimate each task against the per-task budget in `CLAUDE.md`. Flag any
   task you think will exceed it and propose the split.
4. Stop and show me.
