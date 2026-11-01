---
name: sdd-drift
description: Audit a feature for drift between spec and code across the product repos. Use at the end of a feature or before touching an old one.
---
Feature: $ARGUMENTS

Project additions: `.claude/skill-additions/sdd-drift.md`, if it exists. Read
it first; where it and this file differ, it wins.

1. Read `specs/$ARGUMENTS/spec.md` and `plan.md`, then the files the plan's
   per-surface table names, in every repo it names.
2. Produce two lists:
   A. Requirements/ACs the code does NOT satisfy (cite repo, file, line).
   B. Behaviours in the code that NO requirement describes (cite repo, file,
      line).
3. For each item in B, say whether it looks like a bug or a missing
   requirement. For each bug, check `issues/README.md`. If it is already
   filed, cite the ID. If not, it is undeclared: file it (copy
   `issues/_template.md`, add the index row), which is the one write this
   audit makes.
4. Check the platform invariants for this feature's surfaces: the
   constitution's non-negotiables (`CLAUDE.md`) that code can break. Where
   the project localizes (`playbook/practices/localization.md`), at least:
   - Is any fixed-choice value still stored as display text or an i18n key?
   - Does any vocabulary exist in more than one place — a client list that
     restates the server's code list instead of deriving from it?
   - Did any surface get left behind — a code the server can emit that one
     client cannot render?
   - Does every locale bundle have a key for every code, or do some locales
     fall back silently?
   - Did a backfill leave rows outside the code list?
5. Check the conventions. If `specs/_templates/plan.md` names convention
   ADRs, hold the code this feature added or rebuilt, and no other code,
   against their rules, which the plan cites section by section. Report a
   "Conventions" section: one line per breach with its rule id
   (`ADR-0009.3`), repo, file and line, or "none". A rule that the plan's
   Key decisions records as a deviation is listed as a recorded deviation,
   not as a breach. Code the feature did not touch is not checked.
6. Contract snapshot. If the project keeps one (its additions say where)
   and the feature changed it, list what changed, operation by operation
   and schema by schema, from the diff between the feature's first and
   last commits. Cite where the spec's Data contract or the plan's
   Contract names each. One that neither names goes in list B.
7. Flag any test whose name is not `AC<n>_` or `RISK_` — that is unowned
   behaviour.
8. Check that every ticked task in `tasks.md` carries shas, and that those
   commits exist in their repos. A tick without a reachable commit is drift in
   the process, not just the code.
9. Propose a delta spec block for anything in B that should become a
   requirement. Edit no other files.
