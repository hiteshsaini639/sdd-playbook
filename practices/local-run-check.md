# The local run check

Tests prove what they were written to prove. Some faults only show when
the real surfaces run together: a page that throws when it is first opened
for real, a screen that goes blank after a reconnect, an address nothing
serves. The local run check is the tier that looks: the changed flows, by
hand, against every surface running on the developer's machine.

It does not replace test-first work. A requirement still gets its failing
test before its code (`spec-driven-development.md`). The local run comes
after the tests are green, and whatever it finds becomes a test, a fix in
the task that owns the code, or an issue (`issue-log.md`). It never ends as
"looked fine".

## When
A task's `Verify:` names it when the change is something a person sees or
something two surfaces say to each other: a screen, a route, a sign-in, a
message between two users. A change no client shows needs none. Run it
before the branch is pushed, so the first environment other people use
never sees the fault.

## Make it cheap to repeat
The first local run of a project costs an afternoon: which port, which
origin, which account, how to become an admin. Pay that once. The project
keeps one **local run recipe** (its home is named in the project's own
guide) that holds:

- how each surface is started and stopped, with the ports and the one or
  two settings a local run needs;
- the **standing local accounts**: one per role, plus the relationships
  the main flows need (two users who may talk to each other, a second
  person to move someone to);
- copy-paste recipes for the two ways in: a request with a token from the
  command line, and a sign-in in a browser;
- how to read the local database for a before-and-after count;
- how to put the standing accounts back after a flow that changes them.

An agent that needs a local run reads that recipe and nothing else. If
the recipe was wrong or thin, fixing it is part of the task.

## Standing local accounts
- They exist on the local database only, and are made through the
  product's own sign-up wherever it has one, so they look like real
  accounts. A role the product offers no sign-up for (an admin) is made
  the way the recipe records.
- Their names say what they are (`local-patient`, `local-admin`).
- Their passwords are generated once and kept in **one file beside the
  repo that git ignores**. The recipe names the file, never the values.
  A password written into a tracked doc is pushed with the repo and
  outlives the account it opened.
- The file is not a secret store: nothing in it works anywhere but on
  that machine's local database. An agent may read it. That is its
  purpose, so that no one has to work around a missing password.
- A token is never stored. It is fetched by signing in when needed, kept
  in a shell variable or the browser, and never printed.
- They are never used on a deployed environment. Those have their own
  identities (`verification-harness.md` → Identities for deployed
  environments).

Throwaway accounts are still right for a flow that destroys the account
(delete, deactivate). They are made by the same sign-up recipe and removed
at the end, with a count of the tables before and after.

## Rules for the run
- Local only. Check that the database host is the local machine before
  the first write, every time.
- Count before and after. A flow that should store nothing is proven by
  the count, not by the screen.
- One heavy process at a time to start; check free memory first; stop
  everything at the end and say so (`feature-loop.md` → Machine limits).
- Put back what the flow changed, or say what was left changed.
- No secret in any output or record: key names, never values.

## What gets recorded
The task's result lists each flow that was run, what was seen, and what
was not looked at. "Not checked" is a line in the record, not an omission:
the next reader must be able to tell a flow that passed from one nobody
opened.
