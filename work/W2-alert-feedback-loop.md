# W2 — Alert, feedback, improve: the loop after launch

Status: todo · Area: practices · Parked: 2026-11-17 (owner)

How what production says, in errors and in users' words, becomes a fix
that is seen to work.
- Send a daily digest of errors and warnings, each kind once with its
  count. Alert at once only for a new kind at error level. A quiet
  channel means healthy (`unattended-job-alerts.md` → Only failures post).
- Every alert ends in an issue, or in a dismissal with a reason. It never
  ends in "seen".
- A user's contact message and a store review feed the same loop. A
  ticket with an owner and a status keeps them from being lost.
- Close the loop. The fix's spec names the error kind, and the first
  digest after the release shows it gone.
- With sensitive data, keep the log on the machine. A third-party error
  service is a new dependency and sends data out.

Earns its place when: one error has gone all the way round on a project:
alerted, filed, fixed, released and seen gone.
