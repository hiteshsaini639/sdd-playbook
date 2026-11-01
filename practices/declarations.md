# Declarations

Write each entity once and derive everything else from it. Learned on a
CMS where 11 of 17 admin screens were the same list and the same form with
different fields, so a hand-built screen per entity would not have fit the
estimate.

## The idea
One typed declaration per entity, in a shared package that the server and the
admin both import:
- fields with their types and rules (required, max length, unique, relation)
- label, sidebar group, icon
- verbs (`permissions.md`), states and transitions
- list: columns, filters, search, sort, bulk actions, ordering
- form: sections and widgets

From it come four outputs, **none maintained by hand**:

| Output | Consumer |
|---|---|
| request validation, DTOs, OpenAPI | server |
| list screen: columns, filters, paging, bulk | admin |
| form screen: fields, widgets, client validation | admin |
| proposed DDL for a new table | a person writing the migration |

Add a field to the declaration and it appears in the API, its validation, the
docs and the form. If one of them does not show it, that is a generator bug,
not a task.

## Rules
- **The declaration is code** (typed), not JSON or YAML. A relation to an entity
  that does not exist, or a list column naming a renamed field, fails the build.
- **Client and server validate with the same object**, not two copies kept in
  sync. One rule, one message, both ends.
- **Generated DDL is a proposal.** A person writes and reviews the migration.
  Nothing alters the schema at boot or from a rename. Most real migrations
  carry data fixes, backfills and grants that no diff can express.
- **Escape hatches are explicit and counted.** An entity may name a custom
  widget or list renderer and stay generated for everything else. A command
  lists them. Three or four is healthy; ten means the format is not paying.
- **A wholly bespoke screen is decided up front**, not drifted into: a POS
  register, a kitchen display, a permission matrix. It still reads its fields,
  verbs and permissions from the declaration.
- **Prove the format on the hardest entity first**: the one with the most
  relations, the largest list and the oddest data. If it survives that, it
  survives the rest, and you learn it in week two.
- The generic repository writes audit or version rows on every mutation, so
  no entity can forget them.

## Convention columns
Every declared table carries the same block, added by the generator and not
reachable from a declaration: id, created_at, updated_at, created_by,
updated_by, deleted_at. Plus `tenant_id` in a multi-tenant product, and
`legacy_id` on migrated tables. See `data-conventions.md`.
