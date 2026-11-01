# NNN — Tasks

Rule: one task per session. Each ends with its verify command green and a
commit in every repo it touched.

Slices are vertical. A task that changes a contract carries its clients with
it, or the next task does — never a whole surface at a time.

- [ ] **T1 — <title>** (<R/D/AC ids>)
  Surfaces: <the surfaces this task touches>
  <What to do, 1–3 lines.>
  Read: `<exact file list — this is the agent's whole budget>`
  Verify: `<command>` → <expected>
  Commit: `<type>(NNN/T1): <msg> [<ids>]`
  Shas: <filled in when ticked — one per repo touched>

## Ordering rules
- T1 is the enum/schema change if there is one.
- T2 is the failing AC tests.
- The backfill task comes before any task that assumes coded values.
- The last task is always the drift audit.
- 6–15 tasks. Fewer means too coarse; more means split the feature.

## Definition of done
All AC tests green · no test without an AC · every legacy row backfilled ·
spec and test commits precede feature commits · system.md feature index
updated · map/ updated if the working areas moved.
