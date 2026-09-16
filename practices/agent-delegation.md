# Agent delegation

## The tiers
| Tier | Model | Owns | Holds |
|---|---|---|---|
| Parent | Opus | One feature: spec, plan, task breakdown, decisions, drift | The feature's full context |
| Child — implement | Sonnet | One task, fixed file list, one verify command | Only what the task lists |
| Child — investigate | Opus | One open question needing judgement | Only what the question needs |

A parent handles one feature at a time. A child handles one task. Neither
holds more than that, and the discipline is what keeps each session cheap.

## Which model
Route by whether the work needs **judgement** or **execution**.

Sonnet for execution: the decision is already made, the files are named, the
verify command exists. Most implementation tasks are this, and using a bigger
model on them buys nothing.

Opus for judgement: writing a spec, choosing between designs, auditing drift,
anything where the right answer is not yet determined and a confident wrong
answer is costly.

The mistake in both directions is real. Opus on mechanical work is waste;
Sonnet on an open design question produces something plausible and wrong,
which costs more than the model you saved on.

## What a child gets
A task handed to a child names:
- the surfaces it touches
- the **exact files it may read** — this is a budget, not a hint
- what to do, in three lines or fewer
- the verify command and its expected outcome
- the commit message

## Be generous with the file list
An agent that has to stop and ask for one more file costs a full round trip
plus the re-read of everything it already had. Listing three files it turns
out not to need costs almost nothing. Err toward listing too many.

## The stop condition
A child that needs something outside its budget **stops and reports**. It does
not go hunting, and it does not search the repo to find out. Blind search in a
large codebase is the single most expensive thing an agent can do, and it
tends to happen precisely when the agent is least sure what it is looking for.

A child that hits a decision the spec doesn't cover also stops. Inventing a
requirement is worse than blocking, because the invention gets committed and
then inherited.

## Reporting up
A child reports: what it did, the verify output, and anything it noticed that
was outside its task. That last part matters — the child is the only one who
saw those files, and an observation dropped there is one nobody else will
make.

## Future: an orchestrator tier
A tier above the parent, sequencing features rather than tasks. Worth adding
only once the single-feature loop runs reliably without intervention — an
orchestrator over an unreliable loop multiplies the unreliability.
