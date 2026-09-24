# Single source of truth for documentation

Every fact has exactly one home. Everywhere else refers to it by ID or link;
nothing else restates it.

## Why
An agent reads whatever it finds first and acts on it. When a fact lives in
two places, the copies drift, and the agent can't tell which one is current.
It will confidently follow the stale one. This is the same bug as three
hardcoded copies of an option list (`localization.md`), applied to prose. It
costs more with agents than with people, because an agent never has the
hallway context that tells a person "that doc is old".

## The rules
1. **One home per kind of fact.** The project declares, in one table, where
   each kind of fact lives: rules, requirements, decisions, known problems,
   code locations, ordering of work, and how a system is deployed. A fact
   goes in its home or nowhere.
2. **Refer by ID, don't restate.** Point with a stable ID, optionally with its
   one-line title: `I32`, `ADR-0005`, `012/R4`. Never copy the body. If a
   reader needs more than the title, they follow the ID.
3. **Facts about code live with the code.** How a product repo builds,
   deploys, configures and runs belongs in that repo, next to the scripts that
   do it, because that is where it changes. The spec repo links to it and
   never describes it.
4. **Logs are not copies.** Issue history, commit messages and ADR context
   record *what was true or done at a time*. They may mention facts that have
   a home elsewhere, and they are never edited to track current state. Current
   state is only ever read from the fact's home.
5. **Replacing means deleting.** When a fact moves or changes, the old
   statement is removed in the same change. It is not left behind as "old
   layout" or "see also". A superseded document is deleted, not archived
   beside the new one; git history is the archive.
6. **Agent memory holds pointers and preferences only.** Never a fact a
   repo records. "Server layout: see `backend/DEPLOYMENT.md`" is fine;
   the layout itself is not.

## Smell tests
- You are writing a sentence that already exists somewhere else. Link instead.
- A checklist item has more than one line. It should be an issue with an ID.
- Two files both answer "where does X live?" One of them is wrong, or will be.
- A doc says "previously…" or "the old way was…". Delete the old way.

## Checking it
The drift audit at the end of a feature (`spec-driven-development.md`) also
checks that every fact the feature touched has one home, and that nothing
restates it.
