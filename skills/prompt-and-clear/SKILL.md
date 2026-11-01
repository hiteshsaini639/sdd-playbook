---
name: prompt-and-clear
description: Write the prompt for the next step into prompts/ and hand the session over for a clear, so /lets-go can take it in a fresh session. Use when the user types /prompt-and-clear or asks to write the next prompt and clear.
---
Next step, if the owner named one: $ARGUMENTS

How a prompt is named and what it holds: `prompts/README.md` → Writing
one. The practice: `playbook/practices/session-handoff.md`. Typing this
skill is the owner asking for the prompt.

1. Settle the next step. It is the one named above, or else the one this
   conversation leaves next (the next open task, the next skill to run).
   If two are equally likely, ask the owner which, with your pick.
2. Give every fact the prompt will need a home to point at. A decision,
   finding or result that lives only in this conversation is written to
   its one home first (constitution → "Where facts live"). Done when the
   prompt can cite each by path or id.
3. Read the state of the repos: `git status -sb` and the head in this
   repo and in each product repo this session touched. Uncommitted and
   unpushed work is reported in the prompt as it stands.
4. Write the prompt as one new file, named with
   `date -u +%Y-%m-%dT%H%MZ` and a slug, with the README's sections.
   Standing rules carry the owner's words from this conversation,
   quoted. Done when a cold session could run the first command from
   the file alone, with no question this conversation already answered.
5. Read the file back as that cold session: every path and id it cites
   exists, and it holds no password, token or key.
6. Report in three lines and end the turn:
   - the prompt's path;
   - the other prompts still waiting in `prompts/`, if any (`/lets-go`
     takes the newest, which is this one);
   - `Type /clear, then /lets-go.`
   `/clear` is a built-in command that only the owner can type, so the
   clear is theirs. The next step belongs to the fresh session.
