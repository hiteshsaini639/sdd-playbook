# Testing on production, without staging

How a small product ships fast with one environment. Each new feature goes
live switched off for everyone but the owner. The owner tries it in a test
business on the same server, then switches it on for the real users without a
deploy. Learned on a shop's back office: one server, a handful of staff, an
owner who tries every feature themselves. The decision behind it is
`decisions/ADR-0002-production-only-testing.md`.

## Why not staging
A staging server is a second deploy path, database, set of secrets and set of
DNS names, all to keep in step. It drifts from production, and on a small team
nobody tests there twice. Without one, though, every trial writes real rows and
every half-finished screen is seen. The four rules below remove both problems.

## The four rules
1. **Ship dark.** A new feature's screens, menu entries and routes are reached
   only through its own permissions (`permissions.md`). Its migration grants
   those to the owner's role alone. At deploy, nobody else sees anything new.
2. **Roll out by permission.** The spec names which roles get which
   permissions once the owner is satisfied. The owner adds them in the roles
   screen: no deploy. Taking them away hides the feature again. A change to a
   screen people already use cannot hide this way, so the spec lists those
   changes as "seen by everyone at deploy". If one must wait, it gets a
   permission of its own.
3. **Migrations only add.** That means new tables, nullable columns or columns
   with a default, and widened checks. The previous server image must still run
   on the new schema, so rolling the code back stays possible. A rename, a drop
   or a narrowed check takes two features: first the new shape ships and
   everything moves to it, then a later feature removes the old one.
4. **A test business on production.** One tenant of kind `sandbox` beside the
   real ones (`data-conventions.md` → tenancy). The owner tries features there
   with made-up outlets, staff and records. Its rules:
   - **Made by an operator command on the server**, never through the app.
     Nothing in the app creates, empties or deletes a tenant, or changes a
     tenant's kind. The kind is set at creation and never changed.
   - **One login, the owner's.** The app refuses a second login there. This
     also keeps services bound to the owner's own account, such as an AI
     subscription, within their terms.
   - **Unmistakable.** A banner on every screen ("Test business: nothing here
     is real."), in a colour used nowhere else, that cannot be closed. The
     browser tab's title starts `TEST · `.
   - **Public writes never land there.** The public site's tenant is fixed by
     the server, and the app refuses a setting that names the test business.
   - **New features arrive there on deploy day.** The migration that grants a
     new type to every tenant's owner role (rule 1) grants it to the test
     business too.
   - **Cleaned by the same command.** `empty` takes it back to the day it was
     made: its login and fresh starting lists are kept, and everything else
     goes. `remove` deletes it completely, so it can be made again. Both find
     the test business by its kind, never by a name or id given to them, and
     both need its name typed to confirm. Only for a test business, and only
     through this command, may rows of the append-only log and history be
     deleted. A real business's stay locked, and a test proves it.

## The loop
1. The feature ships. Only the owner sees it, in both businesses.
2. The owner tries it in the test business. Fixes go forward as usual.
3. The owner grants it to the real users. That is the rollout.
4. Later, if a migration had to keep an old shape, the contracting feature
   removes it.
5. When the test business is cluttered, the operator empties it.

## What each feature's spec says
- **Permissions:** the new types' permissions go to the owner's role only. Add
  the rollout list: which roles get what.
- **Seen by everyone at deploy:** every change to an existing screen or route.
- **Migration:** additive, or the two-feature split it needs.
- **The owner's trial:** what it writes, done in the test business.

## Needed from day one
Tenancy from the first table (`data-conventions.md`), and permissions as data
enforced on every route (`permissions.md`). Also take a backup before every
deploy that migrates: this is the one rehearsal a destructive migration cannot
get any other way.

## Where it falls short
- A bug in code shared with older features reaches everyone at deploy. Only
  the tests guard it.
- No load testing: production's load is the real one.
- An outward side effect (an SMS, an email, a payment) sent from the test
  business reaches a real person. Each integration needs a "send nowhere for
  a `sandbox` tenant" rule before the test business may use it.
- Many users, several people deploying, or a regulated domain: revisit
  (the ADR says when).
