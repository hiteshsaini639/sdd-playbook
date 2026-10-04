# Session handoff

A long piece of work outlives a session: the context fills, the day ends,
the work moves to a fresh session. The fresh session starts cold. What it
needs is not a summary of the conversation but the owner's instruction for
what comes next, with the decisions, limits and stop points that held
before. Without one, the owner retypes it, or the new session re-derives
it and reopens what was settled.

## A prompt in a folder
- The project keeps one folder for waiting prompts (its guide names it).
  A session writes a prompt there **only when the owner asks**, one file
  per prompt.
- The file's name starts with the UTC time it was written
  (`2026-10-04T1130Z-<slug>.md`), so the newest is the last in name
  order, whatever the file system says about modification times.
- The prompt is written as the owner's instruction to the next session:
  what to do and the first command; where to find the facts (by path and
  id, never copied); what is decided and must not be reopened; the
  standing rules and approvals, quoted; what is parked; the state of the
  repos; where to stop and ask.
- No secret goes in it. It names the file that holds one.
- Prompt files are not committed. They are notes for one session on one
  machine. A fact that must last is written to its one home
  (`single-source-of-truth.md`) and the prompt points there.

## Taking it: once, newest first
One command starts a session from the newest prompt and deletes the file
as it reads it. Deleting on pickup means a prompt runs once: a second
session does not redo the work, and an old prompt does not linger to be
taken by mistake. The command says which prompt it took and which are
still waiting.

## What a prompt cannot do
- Outrank the project's rules. It carries the owner's words, and the
  project's guide still governs.
- Grant new approvals. A standing approval the owner gave and the prompt
  quotes still holds; anything else outward-facing (a push, a merge, a
  deploy) is asked for again in the new session.
- Override the repos. If the prompt says a task is open and the record
  says it is done, the record wins and the session says so.
