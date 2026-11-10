---
name: sdd-plan
description: Write the technical plan for an approved feature spec. Use only after spec.md status is Approved and Open questions is empty.
---
Feature: $ARGUMENTS

Project additions: `.claude/skill-additions/sdd-plan.md`, if it exists. Read
it first; where it and this file differ, it wins.

Refuse if `spec.md` status is not Approved or Open questions is non-empty —
tell me which.

1. Read `CLAUDE.md`, `specs/system.md`, `specs/$ARGUMENTS/spec.md`, and
   `map/<surface>.md` for each surface the spec names.
2. Only now open source files — and only the ones the maps point you at. If
   the map is thin or wrong for what you need, fix the map: that correction is
   part of this feature's work, not a detour.
3. Create `plan.md` from `specs/_templates/plan.md`.
4. Every data-model field, enum member, decision, and module must cite an
   R-number. If you cannot cite one, either the spec is missing a requirement
   (tell me) or you are inventing scope (drop it). Where the template names
   ADRs for a section, cite each rule the plan relies on by rule id
   (`ADR-0009.3`), and record any rule it does not follow as a row in Key
   decisions, with the reason.
5. Fill the per-surface table. If one surface has no work, say so explicitly
   rather than leaving the row blank — a silently empty row reads as an
   oversight.
6. Fill every section the template has, or write "None" with a reason
   (Translation keys and Backfill, for example). Security review is yes
   or no, never None.
7. Sort decisions by blast radius (`playbook/practices/decision-levels.md`).
   A decision affecting two or more surfaces beyond this feature belongs in
   `decisions/` as an ADR, not in the table — flag it and I will write it.
   One affecting any future project belongs in `playbook/decisions/`.
8. Any new dependency needs a one-line justification, as the constitution
   (`CLAUDE.md`) asks.
9. List risks; mark which need a `RISK_` test.
10. Stop and show me. Do not write tasks or code.
