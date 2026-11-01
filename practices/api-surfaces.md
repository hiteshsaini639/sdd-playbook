# API surfaces

How a product's server is shaped so that every client can share it and
no rule gets enforced in two places. Learned on a CMS rebuild with a public
site, an admin console and a planned storefront on one API.

## One database client
The API is the only thing that touches the database. The public site, the
admin and any later client (POS, mobile, a partner) reach data only through it.
The reason is enforcement, not speed: permissions, validation, workflow and
audit need exactly one place to live. Two apps that can each reach the tables
have two permission models, and one of them is wrong.

## Two surfaces, split by audience
```
/api/v1/<things>          anonymous · public data only · rate-limited · read-mostly
/api/v1/admin/<things>    token required · everything · permission-checked
```
- **"Public only" is a property of the endpoint, not of the caller.** No
  `?includeDrafts=true` that a privileged token unlocks: the public router
  applies the one visibility predicate and has no privileged caller.
- The public surface takes no token at all. Anything the browser holds is
  public, so a "public token" protects nothing.
- Staff identities and any future customer identities are **separate tables
  from day one**. Merging them later is a rebuild.
- Put the admin on its own host when the public side renders anything an
  editor authored. A script injected through content then cannot ride the
  admin's cookie.

## Shape
- Version the path from the first commit (`/v1`).
- Plural nouns. `PATCH` for partial update, no `PUT`. Delete is soft.
- **State changes with side effects are actions**, not field writes:
  `POST /orders/{id}/cancel`, `POST /pages/{id}/publish`. Each writes its own
  audit line and can carry its own permission.
- `snake_case` in the database, `camelCase` on the wire, translated once in the
  serialization layer.
- Lists: offset pagination with a total, which is what a screen with page
  numbers needs. Cursors only at a scale that needs them.
  `{ "data": [...], "meta": { "page", "perPage", "total", "totalPages" } }`
- Filter parameters come from the same declaration the list screen renders
  (`declarations.md`), so the API cannot accept a filter the UI lacks.
- The OpenAPI document is generated, never hand-maintained.

## Errors
One format for every error: RFC 9457 `application/problem+json`, with
field-level detail on validation, written so a form can show it as is:
```json
{ "title": "Validation failed", "status": 422,
  "errors": [{ "field": "slug", "code": "unique",
               "message": "Slug is already used by another product" }] }
```
| Code | For |
|---|---|
| 400 | malformed request |
| 401 | no or invalid token |
| 403 | authenticated, may see it, may not do this (`permissions.md`) |
| 404 | not found, **or** not permitted to know it exists |
| 409 | state conflict (cancelling a closed order) |
| 422 | validation failed |
| 429 | rate limited, with `Retry-After` |

A 500 that a person can cause by typing is a missing validation, and that is a bug.

## Rate limits
Login, password reset and every anonymous write are limited by IP **and** by
identifier. Write down where the counter lives: an in-process counter is
per-instance and resets on deploy, so the real one belongs in shared state or
the reverse proxy. A surface described as rate-limited and not limited is a
claim the code does not keep.

## Health
`/healthz` sits outside the versioned surface and **queries the database**.
A process that is listening is not a process that can serve, and a constant
`{ok: true}` lets a deploy with a wrong database password go green.
