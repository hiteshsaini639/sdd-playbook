---
name: sdd-feature
description: Run every remaining task of a feature, one fresh child agent per task, until the drift audit is done. Use when the user wants a whole feature finished without prompting per task.
---
Arguments: `<NNN-slug>` → $ARGUMENTS

You are the **parent**. Follow `playbook/practices/feature-loop.md`; this file
turns it into steps.

Project additions: `.claude/skill-additions/sdd-feature.md`, if it exists.
Read it first; where it and this file differ, it wins. It holds what is the
project's own: the machine limits for the child prompt, the accounts on the
owner's machine, and any rule the owner added to the loop.

## Before the first child
1. Read `specs/<NNN-slug>/tasks.md`. Note each unchecked task's model
   (below) and any step needing outward-facing approval: a push to a product
   repo, a PR, a change visible on GitHub. **Ask for all of them at once, up
   front,** so the loop does not stall halfway. Also ask whether to push the
   spec repo after each tick, unless the user has already said.
2. **Ask which agents are active for this run,** every time, before the
   first child: a subagent of this session, and each other account the
   additions name, one yes or no each. The owner says which are on; the
   parent then decides which child runs where, among those only. An agent
   the owner did not switch on runs no child, not even as a fallback when
   another's limit ends.
3. Do not read product-repo files yourself. That is the children's budget.

## Loop, in order, one at a time
For each unchecked task:
1. **Model.** Sonnet if the task is straightforward (named files, described
   change, exact verify). Opus if it is complex: new scaffolding, a
   stop-or-skip judgement in the task text, audits (`/sdd-drift` is always
   Opus). When unsure, Opus.
2. **Spawn** a fresh `general-purpose` agent with that `model`, using the
   prompt template below. Wait for its notification. Never run two at once,
   but as "Other accounts, and two at once" below allows.
3. **Check** the result instead of trusting it: the product-repo commit
   exists on the feature branch, the box in `tasks.md` is ticked, and `Shas:`
   is filled in.
4. **Push** if approved: the product branch, and this repo with `playbook/`.
5. **Carry forward** any finding that changes a later task into that child's
   prompt. If the finding changes the spec or plan, stop and ask.
6. **What the feature's own children left is fixed in the feature:** the
   parent answers for its children. Sort each thing a report names:
   - *Left by this feature's work* (a reference to something a task
     removed, a name or a comment a task made untrue, a deviation from a
     rule, a bug in what a task wrote): it is not an issue for later. The
     child that made it cleans it before it reports; what it could not
     reach goes, by the parent, into the prompt of the next task on that
     repo as a commit of its own (`fix(NNN/Tn): …`), or into a fix task
     the parent adds. The feature is not done while one is open: the
     run report lists each with the sha that fixed it.
   - *There before the feature, or not this feature's*: **file** it as
     an issue (`issues/README.md`), in the same push as the tick.
   When it is unclear which, read the diff of the feature's branch for
   that line: if the branch made it, it is the feature's.
7. **Stop only for a decision** (see the feature loop). Otherwise go on.
   Size is a decision only past the line the additions set, in the
   harness's count (feature loop → Budget).

The child's prompt asks for nothing beyond its task: no repeated CI runs,
no extra build (feature loop → Nothing the task did not ask for).

## After the last task
The practice: `playbook/practices/feature-loop.md` → After the last task.
1. **Review.** In each product repo the feature touched, on its feature
   branch: `/code-review` at the level the additions name (`low` if
   none), and `/security-review` too when `plan.md` → Security review
   says yes. Never `max` or `ultra` unless the owner asks.
2. **Sort the findings** as loop step 6 sorts a report: this feature's
   become a fix task you add to `tasks.md` and run like any other; older
   ones are filed as issues. One you judge wrong goes in the report with
   the reason.
3. **Report:** one line per task with model, shas and the harness's
   token count; what the children and the review left, and the sha that
   fixed each; issues filed during the run; review findings judged
   wrong, with why; anything left for the owner; the Definition of done
   checklist.
4. **End with What to understand:** four lines in plain words, every id
   with its meaning: the one idea the feature rests on; the riskiest
   change (repo, file, line); how it could fail in use; where to look
   first if it does. Not a summary of the tasks.

## Child prompt template
```
Execute exactly ONE task, <Tn> of feature <NNN-slug>, then stop and report.
Do not start the next task.

Spec repo: <absolute path of this repo> (commit to <its branch>)
Product repo(s): <path(s)>, branch `<branch>`
Follow .claude/skills/sdd-implement/SKILL.md steps 1-8 exactly.

The task, verbatim from tasks.md:
<paste>

Context from earlier tasks: <findings that affect this one, or "none">
Known issues in your files: <I-ids from issues/README.md, or "none">.
Don't fix them unless the task says so.
Approved outward actions: <e.g. "push branch, open PR", or "none: do not push">

Budget: <the per-task budget from CLAUDE.md>. You may go over if the task
needs it. Say how much and why. At roughly 2x, stop and report instead.

Reading: spec.md, plan.md, tasks.md and the map by section, as
sdd-implement step 1 says: grep -n for your task's IDs and headings, read
those line ranges; never a whole map. Test output: a full run goes to a
file; read its totals and failures with grep, and more of the log only
for a failure you are fixing.

Machine limits: this is the user's workstation. Run verify steps one at a
time, cheapest first, at low priority (nice -n 19). Never run a production
build, a dev server or a watch mode unless the task's Verify line names it.
<the project's commands and caps, from the additions>
Leave "manual:" verify steps to the user and say so in your report.

Before you report, clean what your own change leaves behind: a reference
to something you removed, a name or a comment your change made untrue.
What of it sits in a file you may not open, name with file:line.

Report (max 40 lines): what you did · verify output · shas · left by your
change and not cleaned (file:line, why) · noticed and there before your
change (file:line) · tokens used · decisions needed, if any.
```

## Other accounts, and two at once
The practice: `playbook/practices/feature-loop.md` → Children on other
accounts, Two children at once.
- **The accounts** are the project's fact, named in the additions (or in
  the session memory they point to); if none are named, ask the owner.
  Which are active for a run is asked each time (→ Before the first
  child, 2). Each is a Claude Code config folder `~/.claude-<name>`.
- **The command:** `.claude/skills/sdd-feature/run-child.sh <name> <model> <prompt-file> <out-dir> <task-id>`,
  run in the background from the spec repo, with the prompt in a file in
  the session's scratch folder. Its header says what it allows the child.
  `default` is the parent's own account.
- **Talk mode, always:** add `--talk` before `<name>`. The child runs the
  same; the parent can also reach it (practice → Talking to a headless
  child). While it works: read `<out-dir>/stream-<task-id>.jsonl`, then
  `.claude/skills/sdd-feature/send-child.sh <out-dir> <task-id> "<message>"`.
  After it reports: `run-child.sh --talk --resume "$(cat <out-dir>/session-<task-id>.txt)" <name> <model> <follow-up-file> <out-dir> <task-id>b`,
  same account and model.
- **The prompt** is the template above, opened with: this session was
  started for one task alone, so the implement skill's step 0 does not
  apply; it runs headless and cannot ask; it spawns no agent; a message
  headed "From the parent:" may reach it while it works, and it follows
  it as the owner's word passed on.
- **Two at once**, only when the owner has asked for parallel runs for
  this run (ask; an earlier yes does not carry over), and only tasks on
  different product repos. The second child's prompt adds:
  work in its product repo only; commit nothing in the spec repo and do
  not edit `tasks.md`; write `Shas:`, `Result` and `For later tasks` to
  `<out-dir>/result-<task-id>.md` as they should stand under the task; it
  may edit its own `map/<surface>.md` and leaves it uncommitted; why an
  unticked earlier task is no reason to refuse; check free memory before
  a full check, and wait while it is low. The parent then ticks from that
  file.

## Accounts on GitHub
Owners and `gh` accounts: `CLAUDE.md`'s table of product repos. Check
`git remote -v` first.
