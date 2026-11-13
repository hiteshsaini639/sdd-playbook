# ADR-0002 — Test on production behind permissions and a test business; no staging server

Status: Accepted · 2026-11-13 · Applies to: every project using this playbook that runs on one server for one small team

## Context
A small product has one server, a handful of users and an owner who tries
every feature themselves. A staging environment doubles the deploy path, the
database, the secrets and the names, and drifts from production unless
someone keeps it in step, which nobody on a small team does. But with
production alone, a trial writes real rows and a half-built screen is seen by
everyone.

## Decision
1. There is one environment, production. No staging server and no second
   database for trials.
2. Every feature ships dark: reached only through its own permissions,
   granted at deploy to the owner's role alone. It is rolled out by granting,
   never by deploying (`practices/production-only-testing.md`, rules 1 and 2).
3. Migrations only add. A rename or a drop takes two features (rule 3).
4. Trials happen in one test business on production, a tenant of kind
   `sandbox`. It has one login, the owner's, and is made, emptied and removed
   only by an operator command, which finds it by its kind (rule 4).

## Why
It uses what the platform already needs: tenancy and permissions as data.
It costs no server, and turns rollout and rollback into a permission change
the owner makes in a minute. Additive migrations keep a code rollback open.

## What this rules out
- A staging or preview server for trials.
- Feature flags kept apart from permissions (a flag table, a flag service).
- Two versions of the server running side by side (a canary).
- Trial rows in a real business.
- Anything in the app that empties or deletes a tenant.

## Cost accepted
A bug in shared code still reaches everyone at deploy; only tests guard it.
A rename or a drop takes two features. There is no load testing. The
append-only log gets one exception, for the test business's rows through the
clean command. Each outward integration (SMS, email, payment) needs a rule
that it sends nothing for a test business.

## Revisit when
Many users, more than one person deploying, a regulated domain, a need for
load tests, or an integration whose side effects cannot be stopped for one
tenant.
