# Local development

The whole product runs on a laptop with one command, the same way every time.

- **One command starts everything**: `pnpm dev` (or the stack's equivalent) runs
  every app in parallel. The database runs in a container started once.
  Document the command and the container in the constitution.
- **Fixed ports, and every service fails rather than moves.** A dev server that
  quietly takes the next free port comes up on an origin the API's allow-list
  and the mail links do not name, and fails somewhere unrelated. Set strict-port
  options. When a port is busy, free it; never pass another one.
- Keep a **port table** in the constitution: each service, its port, what
  starts it. That includes test instances, which get their own ports so they
  never seed into the instance someone is browsing.
- **A committed env example** lists every variable with dev values and no real
  secret. Every environment uses **the same variable list with different
  values**. Never branch code by environment name.
- Prefer failing over guessing on secrets. A missing signing key that falls
  back to a random one "works" and then signs everyone out on every restart.
  Say which variables fail quietly, in the example file.
- **Seed commands** create the first admin and dev users. Nobody inserts rows by
  hand to log in.
- **A test database** separate from the dev one, created by a setup script. The
  harness refuses to run against anything else (`data-conventions.md`).
- The health check, the seed and the test setup are the first three things a
  new machine runs. If they don't get it working, the README is wrong.
