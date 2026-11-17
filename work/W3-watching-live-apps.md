# W3 — Watching the running apps

Status: todo · Area: practices · Parked: 2026-11-17 (owner)

What tells you, while it is happening, that the live product is down or
failing for users. `unattended-job-alerts.md` covers scheduled jobs. This
covers the service itself.
- There are four sources: the server's errors, the browser's errors, the
  mobile app's crashes, and whether it is up, checked from outside the
  machine.
- A machine cannot report its own outage. Probe the health endpoints
  from somewhere else.
- Each client error carries its build version, so a fix can be confirmed
  release by release.
- One operations page in the admin area shows the state of every job. It
  reads each job's state from that job's own home, and it is never a copy.
  Any admin can see it without access to the server.
- Each admin has their own account, and each sign-in and admin action is
  recorded (`permissions.md` → Audit).

Earns its place when: a project's watch has caught a live failure before
a user reported it.
