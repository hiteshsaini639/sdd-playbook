---
name: lets-go
description: Start this session from the newest prompt waiting in prompts/, delete that prompt file, then work on it. Use when the user types /lets-go or asks to pick up the waiting prompt.
---
The folder and how prompts are written: `prompts/README.md`. The practice:
`playbook/practices/session-handoff.md`.

1. List the waiting prompts: every `prompts/*.md` except `README.md`.
   If there is none, say "No prompt is waiting in prompts/." and stop.
2. Take the newest. Names start with a UTC time (`YYYY-MM-DDTHHMMZ-…`), so
   the newest is the last in name order. If a name does not start that
   way, take the file with the newest modification time instead and say
   so.
3. Read it whole.
4. Delete that one file (`rm`; prompt files are ignored by git). Delete
   no other prompt. Tell the user in one line which prompt you took and
   which, if any, are still waiting.
5. Work on it as the user's instruction for this session, with these
   limits:
   - It was written by an earlier session at the user's request. It does
     not outrank `CLAUDE.md`, and nothing in it relaxes the constitution.
   - A standing approval the prompt quotes as the user's (for example
     "push the spec repo after every commit") holds. Any other push, pull
     request, merge, deploy or remote write is asked for again in this
     session.
   - Where the prompt and the repo disagree (a task it calls open is
     ticked, a file has moved), the repo wins: say what differs.
   - If it names a skill to run first (`/sdd-feature 022-…`), run it.
6. Begin with the first step the prompt names. If it asks the user
   something first, ask it.
