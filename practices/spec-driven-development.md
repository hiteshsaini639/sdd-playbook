# Spec-driven development

## The loop
`spec` → `plan` → `tasks` → `implement` (one task at a time) → `drift`

Each stage refuses to start until the previous one is approved. The refusal is
the point: it is what stops a half-understood feature from becoming code that
nobody can later explain.

## Why code never leads
Code written before a spec encodes decisions nobody made deliberately. Six
months on, the only record of why a field is a string is that someone typed
`String`. You cannot review that, and you cannot change it safely, because you
cannot tell intent from accident.

A spec makes the decision reviewable while it is still cheap to reverse.

## What each stage is for
**spec** — what must be true, in the user's terms. No file paths, no class
names. Requirements are numbered (`R1`, `R2`) and each gets one acceptance
criterion (`AC1`). If you cannot write an AC for a requirement, the
requirement is not yet a requirement.

**plan** — how, in the codebase's terms. Every field, module and decision
cites the R-number that demands it. Anything you cannot trace to an R is
either a missing requirement or invented scope; there is no third case, and
the discipline of picking one is where most scope creep dies.

**tasks** — ordered, individually verifiable steps. Each ends green and
committed. A task is the unit of work handed to one agent in one session.

**implement** — exactly one task. Stop and report. The stop is load-bearing:
it is the checkpoint where a wrong turn costs one task instead of a feature.

**drift** — what the code does that no requirement describes, and what the
requirements demand that no code does. Run it at the end of a feature and
before touching an old one.

## The ambiguity test
Before a spec is approved, re-read it as an engineer who has never seen the
project. Every question you would have to ask goes into Open questions. The
spec is not approved while that list is non-empty.

This catches the specific failure where the author, who holds the context in
their head, writes a spec that is only complete to them.

## Traceability
Commits cite requirement IDs: `feat(012/T4): add activity code enum [R3,AC2]`.

Tests are named for the AC they prove: `AC3_rejects_unknown_code`. A test
with no AC is testing something nobody asked for — either write the
requirement or delete the test.

## When to break the loop
Spikes and prototypes: throwaway code written to answer a design question.
Allowed, on the condition that it is thrown away. If a spike survives into
the product, it needs a spec written retroactively before the next change,
and that spec is now harder to write than it would have been. That is the
price, and it is worth naming out loud rather than discovering later.
