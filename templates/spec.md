# NNN — <feature name>

Status: Draft · Depends on: <system.md IDs, other features> · Ambiguity test: not run
Surfaces: <only the ones this feature actually touches>

## Goal
<One paragraph: problem, who has it, why this feature and why now.>

## User stories
- As a <actor>, I <do X> so that <outcome>.
Unhappy paths in scope: <list them explicitly>.

## Requirements (EARS)
- R1. WHEN <trigger> THE SYSTEM SHALL <response>.
- R2. IF <condition> THEN THE SYSTEM SHALL <response>.
- R3. WHILE <state> THE SYSTEM SHALL <response>.

## Data contract
<Request/response shapes, DB fields, enum members, events — the boundary,
not the internals. For a vocabulary: the full code list and what each code
means.>

## Migration
<What existing rows hold today and what each maps to. "None" if greenfield.
Every legacy value must map somewhere, including misspellings and orphans.>

## Non-goals
- <Things a reasonable person might assume are included. Say no here.>

## Acceptance criteria
- AC1. Given <precondition>, when <action>, then <observable result>.
<On a product with more than one surface, at least one AC is cross-surface:
a value written on one surface and read correctly on another.>

## Open questions
- <Every question the ambiguity test raises goes here until resolved.
  Strike through, don't delete.>
