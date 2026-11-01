# Permissions

A permission model that can be explained from one screen and enforced in
one place. Learned on a CMS whose client had named no roles, where
roles-as-data made the late answer a seed script instead of a redesign.

## The model
- **Roles are rows, not identifiers in code.** No handler reads
  `if (role === 'manager')`. Code asks whether the user holds a *verb* on an
  *entity type*, and data answers.
- **A grant is a triple: role, entity type, verb.** No field-level grants, no
  per-record grants, no deny rules, no inheritance. Absence is denial. Each of
  those features is reasonable alone, and together they produce a system where
  "why can she do this?" takes a database query to answer.
- **A user holds one role.** Need two roles' worth? Make a role that says so.
  Then "what can this person do" is one row of one screen. (Moving to many
  roles later is a join table and one resolver, so this is reversible.)
- **Verbs are a fixed short list**, e.g. view · create · edit · delete ·
  approve · export, plus domain actions where the product has them. An entity
  declares the verbs that apply. **A verb it does not declare has no
  endpoint** and returns 404, not 403, and the matrix shows no checkbox for it.

## Enforcement
- **In the API, always.** The UI draws only what the grant list allows, and
  that is a courtesy, not a control. Review rule: ignore the UI and imagine
  the request arriving from `curl`.
- **The route generator attaches the guard**, so a new entity cannot ship
  unguarded. It is default deny: an admin route with no declared (type, verb)
  fails the build or a test that walks every registered route. Hand-written
  routes declare theirs too.
- **404 vs 403**: with no `view` on the type, every route of it is 404, because
  the type does not exist for that user. With `view` but not the verb, 403.
- Permissions resolve from the database **per request**, memoised for the
  request. Editing a role bumps the permission version of every holder in the
  same transaction, so a removed right stops working now.
- **Bulk actions check every row**, apply what is allowed, and report both
  counts.
- **One system role** holds everything. It cannot be edited or deleted, and the
  system refuses to leave it with zero enabled users. That is the bootstrap and
  the self-lockout fix.
- `/auth/me` returns the flat grant list. The client builds its sidebar and
  buttons *from* it. It is never a list of things to hide.

## Audit
Every verb except view is audited, **denials included**: a run of 403s is a
misconfigured role or someone worth asking about. Export is audited with the
actor, filters and row count, because it is the verb whose damage leaves no
trace in the data.

## Scoping
- **Tenant isolation is not a permission.** In a multi-tenant product the
  tenant id comes from the session and is applied by the data layer to every
  query. No handler can omit it and no grant can lift it.
- **"Only my own" or "only my outlet" is a rule on a screen or a scope on the
  session**, never a third state in the grant grid. One such rule is fine.
  The third is the signal to stop and redesign, because by then a second
  permission system is being built by accident.
