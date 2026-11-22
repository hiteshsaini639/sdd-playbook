---
name: sdd-spec
description: Start a new feature spec from the template, then run the ambiguity test on it. Use when the user wants to spec a feature before any code.
---
Feature: $ARGUMENTS

Project additions: `.claude/skill-additions/sdd-spec.md`, if it exists. Read
it first; where it and this file differ, it wins.

1. Read `CLAUDE.md` and `specs/system.md`. Find the next free NNN in `specs/`.
2. Decide which surfaces the feature touches. Read `map/<surface>.md` for each
   — those, and nothing else, are your exploration budget at this stage. Do
   not open source files yet. Read `issues/README.md` too, and note open
   issues in the areas this feature touches, so the plan can decide whether
   to fix or leave each one.
3. Create `specs/NNN-<slug>/spec.md` from `specs/_templates/spec.md`.
4. Interview me: ask the minimum questions needed to fill Goal, user stories,
   and non-goals. Do not guess.
5. Draft requirements in EARS form, numbered
   (`playbook/practices/ears-requirements.md`). Draft one AC per requirement.
   On a product with more than one surface, at least one AC must be
   cross-surface — a value written on one surface and read correctly on
   another. A feature whose ACs all sit in one repo is either genuinely
   single-surface or sliced wrong; say which.
6. Look for AI (`playbook/practices/ai-features.md` → Look for it in every
   feature): a step a model could take off the user's hands, such as a
   photo, a voice note, a bill or a PDF to read, a list to sort, a reply to
   draft, a translation, or a search by meaning. Propose one or two, the
   recommended one first, each with its model
   (`playbook/practices/local-models.md` for a narrow job, the Claude seam
   for judgement) and a line of why. Write them in the spec's AI section,
   marked proposed, with the choice under Open questions until I make it.
   Add the section if the project's template lacks it. None is an answer
   when it gives its reason.
7. If the feature changes how an existing field is stored, fill the Migration
   section: every legacy value in the database maps somewhere, including
   misspellings and orphans. "I'll work it out later" is not a mapping.
8. Ambiguity test: re-read the spec as an engineer who has never seen this
   platform. List every question you would need answered before implementing.
   Put them under Open questions. Stop and show me.
9. Do NOT write plan.md, tasks.md, or any code. Spec only.
