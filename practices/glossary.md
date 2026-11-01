# The glossary

One file at the repo root (`CONTEXT.md`) that says what a word means **in
this product**. It holds nothing else: no decisions, no implementation
detail, no pending work. Those have their own homes.

## Why
Two vocabularies sit on top of each other in any product: the business's
(outlet, token, shift) and the system's (entity, surface, grant). The same word
in both, or two words for one thing, is where specs, code and conversations
quietly diverge.

## The rules
- **A term enters only when something fixes its meaning**: a declaration, the
  schema, or a decision. A term still argued over is not written down as if
  settled. Settle it first.
- Each entry is a bold term, two or three lines of meaning, and an `_Avoid_:`
  line of synonyms that must not be used for it.
- Note where two lists look alike and are not the same list.
- It changes when the language changes, and nothing else has to move then. It
  states no fact about the build, so it is not a second home for any fact
  (`single-source-of-truth.md`).
- Specs, code names, UI labels and commit messages use the glossary's word.
