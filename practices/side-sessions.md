# Working beside another session

An owner may run two sessions on one machine at once: a feature loop in
one, issues or a second feature in the other. The second session's work
must not break, slow or pollute the first. Everything the two share is
the risk: checkouts, branches, the index, files both edit, ports, the
local database, global settings.

## Rules for the side session
- **Its own checkout.** A `git worktree` for any repo the other session
  has checked out, product repos and the spec repo alike. Never switch
  the branch of a shared checkout.
- **Stage by path.** Never `git add -A` or `git commit -a` in a shared
  checkout: it sweeps up the other session's work. Leave its untracked
  files alone.
- **Its own files.** Files the other session edits (its feature's
  folder, the maps it updates, the issue index, the release tracker) are
  touched only with care: pull first, commit small, and never while it is
  mid-edit there.
- **No shared ports or local database** while the other session runs
  local checks. The project's runbook names its ports. Looking first is
  not enough: a check made at the start sees only who was running then,
  and the other session can start a moment later. The shared thing
  guards itself (below).
- **Nothing global.** No `gh auth switch`, no global git config, no
  change to the machine's tool versions: they change the other session
  too.
- **Servers it starts, it stops.** A local server this session or its
  children started is stopped as soon as it is no longer needed. One it
  did not start is never stopped: it waits or asks.

## Shared resources guard themselves
Two sessions that share a local test database will, sooner or later, run
their tests at once. Each run's reset empties the other's rows, so both
fail, or one hangs for hours, on code that has no defect. A rule each
agent must remember does not stop this. The test command itself does.
- **The lock lives on the resource.** For a Postgres test database, the
  test command takes an advisory lock (`pg_advisory_lock`) on that
  database before its first reset and holds it on one connection for the
  whole run. It names itself in `application_name` (checkout, pid, start
  time), so a second run waits and prints who it waits for. Postgres frees
  the lock the moment the holder's connection drops: a crashed or killed
  run leaves nothing stale, which a lock file cannot promise.
- **One lock per run.** The root command takes it and passes it down (an
  environment variable), so the packages it runs in turn do not wait on
  their own parent. A package run alone takes it itself.
- **Every test file has a time limit.** A run that still meets trouble
  fails in minutes, naming the file, instead of hanging.
- A test database per checkout removes the wait altogether, at the cost
  of setup per worktree. The lock is the smaller first step, and the same
  pattern serves anything else the checkouts share.

## When the work meets
A commit on a shared branch is pushed as soon as it is made, so the other
session pulls a small change rather than a conflict. Where both must
change one file, the side session goes second.
