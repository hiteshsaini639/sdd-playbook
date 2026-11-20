# Release learning

A production release's checks are not designed once and kept. Each release
shows something: a problem the checks missed, a check that stopped a bad
release, a step somebody did by hand, a check that failed for no reason.
Write it down the same day and turn each finding into a change. Then the
checks grow out of what releases actually did, and a check that only sounds
right shows as one: it has no origin and has never caught anything.

Learned when a production release was checked by hand, step by step, from a
dozen earlier tasks' notes. Nothing kept those steps, so the next release
would have had to find them all again.

## The loop
1. **Run from the runbook.** Every production release runs from one ordered
   list of steps. The project names that list's one home. A step done
   outside it is noted at the moment it is done: a command typed by hand, a
   look at a log, a fix on the server.
2. **Open with the open findings.** The runbook's first step lists every
   open finding from earlier releases (step 4's issues). One that could let
   this release harm users holds the release until the owner decides.
3. **Record at the end.** The runbook's last step writes the release's
   record. It gives each check's verdict with a link to its run, and each
   finding. The project names where records go. A log of releases it
   already keeps is better than a new kind of file.
4. **Give each finding one destination, the same day.** The record names
   the destination:
   - **the runbook**, for a step that is missing, out of order or unclear,
     edited in the same commit as the record;
   - **an issue**, for a new or changed check, filed so the next release
     lists it (step 2). A check is code, so it changes only through a spec
     (`spec-driven-development.md`);
   - **no change**, with the reason.

   A finding that is only in the record is lost.
5. **Late findings count.** Sometimes a problem found after the release
   could have been caught by a check: a user reports it, an error mail
   shows it, the next release meets it. It is a finding of the release
   that shipped it. Add it to that release's record and give it a
   destination.

## What counts as a finding
| Finding | Usual destination |
|---|---|
| A problem reached production and no check caught it | an issue for the check that would have caught it |
| A step done by hand, outside the runbook | the runbook, as a step, or an issue for a script when the step will be done again |
| A check failed wrongly, or passed only on a rerun | an issue to fix the check. Never rerun until green (`verification-harness.md` → CI before a merge) |
| A check failed rightly and stopped a bad release | no change: the check earned its place. Say so in the record |
| A step's wording sent someone the wrong way | the runbook |
| A check that has not failed in many releases and costs minutes each time | review it: keep it with its reason, or remove it |

## Each check names its origin
Every check names, in its own header or output line, where it came from:
the incident, the issue, the release finding or the acceptance criterion
that added it. A reader can then tell a check that earned its place from
one added because it sounded right, and knows what is lost by removing it.
A check with no origin is a guess. Review it at the next release where it
costs time.

## Rules
- **A check is a script in the repo it checks.** It prints one line per
  check, passed or failed, and exits non-zero on a failure, so CI and a
  session read the verdict without reading a log (`verification-harness.md`).
  A spec repo holds the runbook and the records, never a check that someone
  runs by hand.
- **The loop does not change code by itself.** Here "automatic" means the
  loop cannot be skipped. Recording and opening are runbook steps, and a
  machine checks whatever it can (`machine-checks.md`). A record skipped
  even once is the evidence that earns a machine check. The change itself
  goes the normal way: a runbook edit, or a spec.
- **A failed check never rolls back by itself.** It fails and names what
  failed. The way back is a runbook step, taken at the owner's word.
- **The stage before production runs the same checks.** A check then meets
  its own bugs where they cost nothing.

## Starting it
A new project's runbook starts with its first production release
(`new-project.md`). From the first release, its first step is the open
findings and its last is the record. It may have no checks yet. The loop
adds them as releases teach.
