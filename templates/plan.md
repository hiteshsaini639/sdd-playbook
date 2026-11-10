# NNN — Technical Plan

Status: Draft · Traces to: spec.md R1–Rn

<A project with convention ADRs names them in the sections they govern
("Cite by rule id: ADR-0006 (REST paths)"), so a plan cites each rule it
relies on and the drift audit checks the code against them.>

## Data model
<Schema and enum changes. Every field and every enum member comments the
R-number that needs it.>

## Contract
<Endpoints, payload shapes, wire values. What changes for existing callers
and whether it is breaking.>

## Per-surface work
| Surface | What changes | Files |
|---|---|---|
| <surface> | | |

<Paths, new vs modified. Pull them from map/<surface>.md — if the map is
wrong or thin, fix the map as part of this feature. A surface with no work
says so.>

## Translation keys
<The key convention and which bundles gain which keys, per locale. "None" if
the feature adds no user-visible text.>

## Backfill
<The guarded component, its mapping table, how it is triggered, how it is
verified idempotent, and how it is rolled back. "None" if greenfield.>

## Key decisions
| # | Decision | Rationale | Traces |
|---|---|---|---|
| D1 | | | R? |

<Anything here that affects two or more surfaces beyond this feature belongs
in decisions/ instead. Anything that affects any future project belongs in
playbook/decisions/.
Deviations: a plan that does not follow a rule of an ADR named above says so
in a row here, naming the rule (`ADR-0009.3`) and the reason.>

## New dependencies
<Name — one-line justification, or "none".>

## Risks
<What could go wrong and the mitigation. Each risk that needs a test gets one
named RISK_….>

## Security review
<Yes or no, never blank. Yes when the feature touches sign-in, sessions,
permissions, secrets, uploads, payments, or anything an anonymous caller can
reach; name which. Yes adds `/security-review` to the review after the last
task (`playbook/practices/feature-loop.md` → After the last task).>

## Issues
Fixes: <I-ids this feature closes, each cited by a task, or "none">
Observed, out of scope: <new problems seen while planning, filed in
`issues/` and listed here by ID>

## Reviewer notes
<Rejected proposals and why. Written by the human.>
