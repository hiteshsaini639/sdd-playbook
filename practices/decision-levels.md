# Decision levels

## Where a decision goes
Blast radius decides. Ask: *what would have to change if we reversed this?*

| Reversing it affects | Lives in | Form |
|---|---|---|
| Any future project | `playbook/decisions/` | ADR |
| Two or more surfaces of this product | `<project>/decisions/` | ADR |
| One feature | that feature's `plan.md` | A row in Key decisions |

Getting this wrong is cheap in one direction and expensive in the other. A
feature-level decision written as a platform ADR is clutter. A platform
decision buried in one feature's plan is invisible to the next person, who
will contradict it and not know they did.

## What earns an ADR
Both tests, or it is not an ADR:
1. **Surprising without context**: a reader would assume the opposite, and
   might "fix" it.
2. **A real trade-off**: there were genuine alternatives, and the reason one
   won can be stated.

Three things look like decisions and are not:

| Not a decision | Where it goes |
|---|---|
| a **finding** ("this renders nothing, checked live") | evidence, or the spec |
| a **count** ("this has one consumer") | the spec or plan |
| an **implementation rule** ("a snapshot omits these columns") | the spec |

A log that admits all of them is how one project filled 196 entries in six
weeks, half of them not decisions, and every entry inherited the trust of the
least reliable kind.

"Hard to reverse" is a note in the ADR, not an admission test. The ADRs that
work hardest are often the cheap ones to undo, because those are the ones
someone undoes while tidying.

## Keep them short
A decision record has four parts and none of them is an essay:

- **Context** — the situation that forced a choice. Facts, with citations
  where they exist.
- **Decision** — what was chosen, stated so a reader can comply without
  interpreting.
- **Why** — the reasoning that would have to change for this to be wrong.
- **What this rules out** — the alternatives now closed, named explicitly.

That last section is the one people skip and the one that pays. A decision
that doesn't say what it forbids will be "complied with" by someone doing the
exact thing you meant to prevent.

## Write the cost down
If a decision has a known, accepted cost — a migration per vocabulary, a
slower build, a dependency you'd rather not have — say so under a **Cost
accepted** heading. Later, when the cost is being paid and someone asks
whether anyone thought about this, the answer is on the page.

## Status and change
`Proposed` → `Accepted` · `Withdrawn (reason)`.

**An ADR is edited in place, with its history in the file.** An ADR's job is
to be right today, so there are no superseding chains a reader must walk.
- **If the answer changed:** rewrite the top, and append a dated line under
  `## History` with what it used to say and why that was wrong.
- **If only the explanation changed:** just edit.

The address never moves, so every citation of `ADR-0007` still lands on the
current answer. A superseding chain makes each reader replay the history to
find out what is true now, and one link left unread is how a dead rule gets
followed.
