# Learning loop: the same mistake never twice

Failing once is how anything new gets learned. Failing the same way twice,
in this project or the next, is waste: the time, effort and attention spent
finding and fixing it again could have gone to a problem nobody has solved
yet. So every lesson goes where the next person will read it at the moment
it matters, and a mistake that comes back is treated as the real failure.

This is how the playbook grows (README → How this grows), made a practice:
every practice here began as one project's lesson.

## What counts as a lesson
Anything that would change what someone does next time:
- a failure: a bug that reached a user, a broken release, a wrong guess;
- a surprise: the tool, the platform or the user behaved otherwise than
  expected;
- a correction: the owner says "not like that", or a review finds it;
- a fix made a second time;
- an outcome that worked better than expected and is worth repeating.

Anyone notices it: the agent from what it observes, or the owner from
testing and use. It counts whichever account, project or machine it
happened on.

## Where it goes
Ask: *would this be true for any project of this kind?*

| The lesson holds for | It goes to |
|---|---|
| any project: a UI, UX, web, app, roles-and-permissions, data, release or process lesson | the playbook: the practice a person would open at that moment, or a new one. A lesson still being proven is a `work/` item until a project has seen it work (`parked-work.md`) |
| this project alone | the project's own home for that kind of fact: its constitution, an ADR, a spec, the map, an issue |
| this machine or this account | the session memory, or `machines.md` |
| nothing beyond the case | nothing: fixing it was enough |

When unsure between the playbook and the project, write it in the
project and note "may generalise". A second project hitting the same
thing is the proof that it belongs here.

## Written at once, where it is read when it matters
- **Now, not at a review later.** The session that learns it writes it
  before its work is done. It goes in the same commit as the fix where
  there is one. Lessons saved up for a retrospective get lost.
- **At the moment of decision.** A lesson prevents nothing unless the
  person about to repeat the mistake reads it first. Put it where that
  moment already sends them: the router's row, a template, a checklist, a
  skill's step. Then name the moment in the lesson itself ("before adding
  a role…", "when a screen shows a list…").
- **With its origin.** Each rule names the incident that taught it, in a
  line ("Learned when…"). Then a rule that earned its place can be told
  from one that only sounds right, and the cost of removing it is known.
  A rule with no origin is a guess. Review it the next time it costs
  something.
- **Short, and pruned.** A rule that has stopped paying is deleted. Clutter
  hides the rules that matter.

## A repeat is the real failure
The first time a mistake happens, it is a lesson. When the same mistake
happens again after its lesson was written, the lesson was in the wrong
place or was too weak. Treat the repeat as a finding of its own:
- move the lesson to where the moment of decision actually is;
- or make it a check, so a machine refuses the mistake
  (`machine-checks.md` → A rule broken twice gets a check).

Never just fix the repeat and move on.

## Where the loop runs
- **During any work.** On each surprise, correction or second fix, ask
  "would this hold for any project?" before moving on.
- **At the end of a feature.** The parent's report names the general
  lesson the feature taught, and where it was written, or says "none"
  (`feature-loop.md` → After the last task).
- **At a production release.** The runbook opens with the findings
  earlier releases left open. One that could harm users holds the release
  until the owner decides. The runbook ends with the release's record:
  each check's verdict, with its run, and each finding. Findings are:
  - a problem that reached production and no check caught;
  - a step done by hand, outside the runbook;
  - a check that failed wrongly, or passed only on a rerun (fix the check,
    never rerun until green: `verification-harness.md`);
  - a check that stopped a bad release (it earned its place).

  Each finding gets one destination the same day: a runbook edit, an issue
  for a new or changed check, or "no change" with the reason. A finding
  only in the record is lost. A problem found later that a check could
  have caught is a finding of the release that shipped it.

  Checks as scripts are still being learned: `work/W4`.
- **Outside code.** The loop is the same for any project, a non-software
  one included. Each project's first-read file says where its general
  lessons go.

## Rules
- **The loop never changes code by itself.** "Automatic" means it cannot
  be skipped: it is a step at the moments above, and a machine checks
  whatever it can. The change goes the normal way: a spec for code, an
  edit for a document.
- **One home per lesson** (`single-source-of-truth.md`). A lesson moved up
  to the playbook leaves the project, or the memory, in the same change.
  The project points to it.
