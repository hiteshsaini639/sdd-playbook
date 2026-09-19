# The feature loop

How a parent session takes a feature from "tasks approved" to "drift audit
done" without being prompted per task.

## Shape
```
parent (holds the feature)
  └─ for each unchecked task, in order:
       pick model → spawn a fresh child → child does ONE task → reports
       parent checks the report → next task, or stop for a decision
```
One child per task, one task at a time, never in parallel. Every child starts
fresh: context from one task is never carried into the next. The parent is
the only thing that sees the whole feature.

## Picking the child's model
Decide per task, from the task text, before spawning. See
`agent-delegation.md` for the reasoning.

| Sonnet — straightforward | Opus — complex |
|---|---|
| Files named, change described, verify command exact | Task says "if X turns out costly, stop and decide" |
| Mechanical edit, config, rename, one new test against an existing harness | New scaffolding, first-of-its-kind test, design left open |
| Following a recipe in plan.md | Audits, drift checks, anything reviewing other work |

When unsure, Opus. A wrong Sonnet answer that gets committed costs more than
the model saved.

## What the parent hands the child
A self-contained prompt: feature and task id, repo paths and branch, the
task's text verbatim, its `Read:` list as the file budget, its verify and
commit lines, the shas/tick procedure, any findings from earlier tasks that
change this one, and the machine limits (below). The child should never need
to read the parent's conversation.

## When the parent stops
Only for a decision, never for routine progress:
- a child reports a question the spec does not answer
- a child's verify is red and the fix is not inside that task
- an outward-facing action the user has not already approved (push, PR,
  anything visible to others)
- a child crosses the budget by a wide margin — the task was mis-sized

Everything else — green verify, a finding already covered by the plan, a
small spec note — the parent records and moves on.

## After each child
The parent checks the child's claims against the repos (commit exists, box
ticked, shas recorded) instead of trusting the report, applies any finding
that affects later tasks, files anything the child noticed outside its task
as an issue (`issue-log.md`), and pushes if the user approved pushing.

When spawning, tell the child about open issues in the files it will touch,
so it neither rediscovers them nor fixes them in passing.

## Budget
Each child aims for well under 100k tokens. Going over is allowed when the
task genuinely needs it; the child finishes and says why in its report. Going
far over (roughly 2×) means the task was too big, so stop and report. The
parent stays cheap by reading reports, not files.

## Machine limits
The loop runs on someone's workstation. Children run verify steps one at a
time, cheapest first, at low priority. They never add a heavy step (full
production build, whole test suite in watch mode, dev server) that the task
does not ask for. When a task does require one, cap it so it cannot take the
machine down, and leave interactive checks (click through the running app) to
the human.
