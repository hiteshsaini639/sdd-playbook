# Prompts waiting for a session

A session writes a prompt here when the owner asks for one ("write the
prompt for the next session", "write the handoff", `/prompt-and-clear`).
`/prompt-and-clear` writes it and ends the session's work there: the
owner types `/clear`, then `/lets-go`. The next session takes
it with `/lets-go`, which reads the newest prompt and deletes its file.
The practice behind it: `playbook/practices/session-handoff.md`.

Prompt files are ignored by git (`.gitignore`): they are working notes for
one session on this machine, not records. Whatever must outlive the
session belongs in its one home (constitution → "Where facts live"), and
the prompt points there.

## Writing one
- Only when the owner asks. One file per prompt, never an edit of an
  older one.
- Name: `<UTC time>-<slug>.md`, the time as `YYYY-MM-DDTHHMMZ`
  (`2026-10-04T1130Z-019-prod-release.md`). The name decides which prompt
  `/lets-go` takes, so the time comes first and is UTC.
- Write it as the owner's instruction to the next session, in the
  owner's words where they gave them. Sections, as they apply:
  1. **What to do**: the task, and the first command to run (a skill such
     as `/sdd-feature 022-…` if one fits).
  2. **Find before you ask**: where the facts are (spec, plan, tasks,
     maps, issues), by path and id. Point; do not copy.
  3. **Already decided, do not reopen**: decisions by id.
  4. **Standing rules**: the owner's approvals and limits that hold for
     the whole session, quoted ("push the spec repo after every commit").
  5. **Parked, do not start**.
  6. **State of the repos**: branches, heads, anything unpushed.
  7. **Stop points**: where the session stops and asks.
- Never a secret: no password, token or key. Name the file that holds
  one instead.

## Taking one
`/lets-go`. It takes the newest prompt, deletes that file, says which it
took and which are still waiting, and starts on it.
