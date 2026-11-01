# Parked work

Somewhere for "we will do this later" that is not a defect. A defect goes in
the issue log (`issue-log.md`). A question nobody can answer yet goes in a
spec's Open questions. This is everything else that is pending: the
follow-up a spec named and did not own, the step cut from a task, the idea
the owner said yes to but not now.

## The one rule
**Anything parked mid-task becomes a file before work continues.** Never just
a bullet in a plan, a paragraph in a report, or a `TODO`. Parked work in prose
is parked work that gets missed: one project found it spread across 78 plans
before this rule.

## Layout
```
work/
  README.md        ← rules + template
  W14-block-drop-marker.md
```
- `W<n>` ids are global, never reused. The slug is fixed for life.
- Status lives in the file's header (`todo · doing · done · dropped`), never in
  its name, so closing an item renames nothing and breaks no link.
- `done` and `dropped` files stay. A dropped item carries the reason, so nobody
  rediscovers it.
- Body under twenty lines. Past that it is a plan or a spec, and the W file
  links to it.
- A script lists open items by status and area (`pnpm work`). The list is
  a query, not a file someone maintains.

The roadmap orders work. The W files are the inventory it orders from.
