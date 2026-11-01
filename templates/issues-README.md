# Issues

Problems found but deliberately not fixed yet, across all the product repos.
The full practice is in `playbook/practices/issue-log.md`. The short version:

- **File when you find it.** Copy `_template.md` to `I<next>-<slug>.md` and
  add a row below, in the same commit: `issue(I<n>): open – <title>`.
- **IDs are never reused or renumbered.** The next ID is one past the highest
  row below.
- **Fixes go through a spec.** The plan lists `Fixes: I<n>` and the task cites
  `[I<n>]`. When the task is ticked, set Status to `Fixed (<repo> <sha>)` here
  and in the file.
- **S1 means stop and escalate**, not just file.
- Closed issues stay. Never delete a file.

Severity: **S1** users harmed now · **S2** real defect or unenforced
guarantee · **S3** friction, noise, test gaps · **S4** cosmetic or hygiene.

| ID | Title | Type | Sev | Surface | Status |
|---|---|---|---|---|---|
