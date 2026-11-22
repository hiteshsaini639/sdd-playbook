# W4 — A production release's checks as scripts

Status: doing · Area: practices · Parked: 2026-11-17 (owner)

The checks a release runs by hand from a checklist become scripts in their
own repos, run at their step without anyone remembering them.
- The checks before the deploy gate it. One is rehearsing the migrations
  on a copy of production.
- The checks after the deploy run after the smoke test: the server
  started, and the row counts are still there.
- The web build, the app build, the backup and the search listing each run
  their own checks at their own step.
- One ordered list of the commands lives in the runbook.
- Each check is a script in the repo it checks, printing one line per
  check and a non-zero status on a failure, and naming its origin.
- The release's own learning, its findings and its record, is already a
  practice: `practices/learning-loop.md` → Where the loop runs.

- Proved on CardiRehab's 062 release (2026-11-22), the first run this
  way: every check of the backend and web ran from scripts at its step,
  and the record was written from their lines. Caught: the key check, on
  preprod, a missing key that would have stopped the deploy (062/T11);
  the smoke after web's production deploy, a 60 s freeze of the server
  itself, not the release (I562). The rehearsal had no migration to run,
  and no app build rode.

Earns its place when: a production release has run its checks from the
scripts, from end to end, and the scripts caught something. Met for the
backend and web (above). Still to see: an app build's release, its store
build checked by its script, and a migration rehearsed at the deploy.
