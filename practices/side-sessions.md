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
  local checks. The project's runbook names its ports.
- **Nothing global.** No `gh auth switch`, no global git config, no
  change to the machine's tool versions: they change the other session
  too.
- **Servers it starts, it stops.** A local server this session or its
  children started is stopped as soon as it is no longer needed. One it
  did not start is never stopped: it waits or asks.

## When the work meets
A commit on a shared branch is pushed as soon as it is made, so the other
session pulls a small change rather than a conflict. Where both must
change one file, the side session goes second.
