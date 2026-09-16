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

## Status
`Proposed` → `Accepted` → `Superseded by ADR-NNNN`.

Never delete or edit an accepted decision's substance. Supersede it with a new
one that says what changed. The history of what you used to believe is how a
project explains itself.
