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
One child per task, one task at a time; two at once only as "Two children
at once" below allows. Every child starts
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
change this one, the machine limits (below), and how to read: the
governing documents by section and test output by its summary
(`token-budgets.md` → Other levers). The child should never need
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

## Children on other accounts
A child need not be a subagent of the parent's own session. Where the
owner has more than one account on the machine, the parent may start a
child as a headless session on another account, so the feature does not
stop when one account's usage limit ends. The workflow is the same
whichever account runs a child and however many accounts there are: the
same prompt, the same one task, the same checks by the parent afterwards.
Accounts may be added, removed or swapped without changing any of it.

- **Which accounts.** A fact of the machine, not of this practice: the
  owner says which may be used, and the project keeps the list where it
  keeps such facts. The parent does not guess one and does not sign in
  to one.
- **How.** One command starts the child with its prompt from a file, its
  model, and the tools a child has and no more; the child's last message
  is its report. The project keeps that command as a script beside its
  feature-loop skill.
- **A headless child cannot ask.** Its prompt says so: on a decision the
  spec does not cover it stops, changes nothing more and reports. It
  pushes nothing.
- **The parent stays where it is.** When the parent's own account runs
  out, the children already started finish and commit; the parent checks
  them when it is back. A child cut off by its account's limit is
  resumed on that account, or its uncommitted work is thrown away and
  the task is run again elsewhere: never half of one and half of the
  other.
- **Which account for which child.** Whichever has room. The model is
  picked from the task, as always, not from the account.
- **What a headless child does not get.** Browser tools such as Claude
  in Chrome reach an interactive session only, not a headless one, even
  on an account that has them. A by-hand check in the owner's real
  browser is the owner's, or an interactive session's, not a child's.

## Two children at once
One at a time is the rule. Two may run together only when all of this
holds:
- the owner has said parallel runs are wanted, for this run or this
  pair: a yes does not carry over to the next feature, and a task list
  that pairs tasks is a plan, not the owner's yes;
- the two tasks touch different product repos (one on web, one on the
  app), never the same repo;
- neither needs the result of the other, nor of any task not yet ticked.

Then:
- **The spec repo has one writer.** At most one running child ticks the
  task list and commits there. Every other child commits nothing in the
  spec repo and does not edit the task list: it writes its result (shas,
  what ran, notes for later tasks) to a hand-back file the parent named,
  may edit its own surface's map, and the parent ticks and commits for
  it after checking.
- **The parent writes between the children.** It commits by explicit
  path, and never touches a file a running child may be editing. Issues
  and changes to a task's text wait until no child is writing there.
- **The machine still sets the pace.** Each child runs its own checks
  one at a time and looks at free memory before a full one. Two full
  test suites at once is the ceiling on a workstation; a third child
  waits.
- **The order is still the task list's.** A task runs early only because
  nothing it needs is open; the parent says so in the child's prompt, so
  the child does not refuse over an unticked earlier task, and the
  parent's report says which tasks ran together.

## Budget
Each child aims for well under 100k tokens. Going over is allowed when the
task genuinely needs it; the child finishes and says why in its report. Going
far over (roughly 2×) means the task was too big, so stop and report. The
parent stays cheap by reading reports, not files.

Two counts tell a task's size, and they differ by several times:
- **the child's own,** what one context holds: the budget above and its
  2× line are in this count, and the child watches it;
- **the harness's,** which the parent sees when a child ends: the sum of
  every turn, cache reads included. Held to the 2× line, it would stop
  nearly every task.

The parent reports the harness's count for each task, since it is the
one that is measured, and pauses for size only past a much higher line,
which the project sets (the feature-loop skill's additions).

## Nothing the task did not ask for
The parent adds no guard of its own that costs the owner time or money:
repeated CI runs "in case it is flaky", an extra full build, a second
review. If it thinks one is needed, it asks. The checks a task runs are
its Verify line and the repo's Checks (`verification-harness.md` → CI
before a merge).

## Machine limits
The loop runs on someone's workstation. Children run verify steps one at a
time, cheapest first, at low priority. They never add a heavy step (full
production build, whole test suite in watch mode, dev server) that the task
does not ask for. When a task does require one, cap it so it cannot take the
machine down, and leave interactive checks (click through the running app) to
the human.
