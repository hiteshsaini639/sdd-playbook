# Rebuilding from legacy

When a working system is replaced rather than changed, the old one becomes
**evidence**. It is the record of what the business actually does, which is
often not what anyone says it does.

## Before deleting anything
- **Tag the old code** in git (`legacy-<area>-<date>`), so it stays reachable by
  name after the delete.
- **Write the feature inventory**: every module the old system had, what it did,
  who used it, and its data. One row per feature, each later marked
  *rebuild · rebuild changed · drop · undecided*. A feature not in the
  inventory gets forgotten until a user asks for it in production.
- **Keep the legacy data queryable read-only**: load the old dump into the dev
  database as `legacy_*` tables, and query it rather than parsing the dump file.
  Write down its traps (abandoned tables, stale columns, a field holding
  comma-separated ids) as you find them.

## Evidence rules
- **Count, don't estimate.** "706 products", not "about 500". Numbers from the
  data win every disagreement with a document, an interview or a crawl.
- **Every factual claim cites dated evidence.** A "verified" finding that was
  never actually tested will travel into three documents and a client-facing
  recommendation before anyone checks it.
- Evidence files are append-only: corrections are marked and dated, never
  silently rewritten.

## While building
- Each rebuilt feature's spec cites its inventory row and states what changes
  from the old behaviour, and why.
- **Code written knowingly wrong to bridge the gap** (a shim, a hard-coded
  value until the real source exists) is listed in one place with its file,
  the event that removes it, and the test that fails when it goes.
- A migration maps every legacy value somewhere, including misspellings and
  orphans (`spec-driven-development.md`). It is re-runnable via `legacy_id`
  (`data-conventions.md`).
