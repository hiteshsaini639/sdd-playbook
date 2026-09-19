# The issue log

Somewhere to put the problem you found but were not asked to fix. Without it,
an observation ends up in one of three bad places: a `TODO` in the code,
which planning never sees; a note in some task's report, which nobody finds
again; or a fix done "while I'm here", which breaks traceability and grows
the task. The log keeps the fact and keeps the task honest.

## What goes in
An **issue** is something wrong or risky that exists now and was deliberately
left unfixed:

| Type | Example |
|---|---|
| `bug` | Code does the wrong thing, even harmlessly |
| `debt` | Works, but makes future work harder or riskier |
| `risk` | Nothing is broken yet; something could go wrong and nobody checks |
| `ops` | Needs a setting, credential or infra change, not code |
| `verify` | A claim that has not yet been checked where it matters, e.g. in production |

What stays out:
- **A feature request.** Wanting something new is a spec.
- **A question about a spec in progress.** That belongs in the spec's Open
  questions.
- **The task you are on.** If it's in scope, fix it.

## Layout
One folder at the root of the spec repo, one file per issue, one index:
```
issues/
  README.md          ← the index: one row per issue, and the only file triage reads
  _template.md
  I1-debug-logging-in-production.md
  I2-...
```
Why files and not a hosted tracker: they are versioned next to the specs they
refer to, readable by an agent without auth, span every product repo, and an
ID in a commit message resolves to a file. The cost is no notifications or
assignees. If a team later moves to a tracker, keep the `I<n>` in the ticket
title, so old commits still resolve.

## IDs
`I1`, `I2`, … global to the project, sequential, **never reused or
renumbered**, even when an issue is closed or turns out to be a duplicate.
The next ID is one past the highest in the index. The filename is
`I<n>-<kebab-slug>.md`, and the slug never changes after filing.

Cite IDs wherever the issue is touched: `[I3]` in commit messages, `Fixes: I3`
in a plan, and `→ I3` next to a finding note so the note is findable later.

## Filing
File it **when you find it**, by whoever found it. Details are cheapest and
most accurate then. A child agent reports what it noticed; the parent files it.

A good issue is written so that someone with no context can act on it:
- **Where:** repo, `file:line`, and the sha you saw it at. Line numbers
  drift; the sha lets anyone see what you saw.
- **Observed vs expected**, in one line each.
- **Repro:** the smallest command or steps that show it.
- **Impact:** who is affected, how badly, and how often. This sets severity.
- **Suggested fix and size,** if you know it. Mark guesses as guesses.

Keep it short. An issue that takes 30 minutes to file doesn't get filed.

## Severity
| | Meaning | What happens |
|---|---|---|
| **S1** | Users harmed now: wrong data, security, outage | **Don't just log it.** Stop and escalate; file it as well so there is a record |
| **S2** | A real user-facing defect, or a guarantee that isn't actually enforced | Plan a fix soon: next feature touching the area, or its own |
| **S3** | Developer/ops friction, noise, performance, test gaps | Fix when passing through |
| **S4** | Cosmetic or hygiene | Batch with others |

## Lifecycle
`Open` → `Planned (NNN)` → `Fixed (sha)` · `Won't fix (reason)` · `Duplicate (of In)`

- Every status change edits the issue file **and** its index row in the same
  commit.
- Closed issues are never deleted. They are the record of why the code looks
  the way it does.
- `Won't fix` needs a reason a future reader will accept, not "low priority".

## Fixing one
Spec-before-code still applies. A fix is either:
- **carried by a feature** that touches the same files: its plan lists
  `Fixes: I3`, a task cites `[I3]`, and the tick closes the issue; or
- **batched** into a small hygiene feature with several related issues,
  when no feature is heading that way.

Never slip a fix into an unrelated task.

## Triage: where the log gets read
- **Starting a spec:** read the index; list open issues in the areas the
  feature touches, and let the plan decide whether to fix or leave each one.
- **Drift audit:** a bug not described by any requirement and not already
  in the log is undeclared; file it.
- **End of each feature:** skim open `S2`s. If one has sat through two
  features untouched, schedule it or downgrade it with a reason.

## Commits
`issue(I3): open – <title>` · `issue(I3): plan in 004` ·
`issue(I3): close – fixed by web a1b2c3d`
