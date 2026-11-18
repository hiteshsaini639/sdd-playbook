# W7 — Sessions shared across accounts

Status: todo · Area: practices · Parked: 2026-11-18 (owner)

Every Claude account on a machine reads and writes one shared `projects/`, `file-history/` and `paste-cache/`, so a conversation that runs out on one account carries on with `--resume` on another. Today each account keeps its own (`practices/account-label.md` → "It cannot move a running conversation").
- Built, not yet run for real: `mods/account-band/claude-share-sessions`; its header says what it does. With no argument it only reports. Its apply, re-run and undo were tested on scratch folders on 2026-11-17.
- To do it: close every Claude session on the machine, run `claude-share-sessions --apply`, then `claude-sp --resume` in a project should list sessions started on the other accounts. A good moment is the last copy of a machine move, when every session is closed anyway.
- The dry run on 2026-11-17 found no session clashes, 9 memory files that differ between accounts (the newer stays, the other goes to `~/.local/share/claude-shared/conflicts/`) and 6 memory indexes to merge.
- Once it is on: a session is open in one account at a time; use `--resume` and pick, not `--continue`, which takes the newest session even if another account has it open. The first reply on the new account re-reads the whole conversation with no cache.
- Finishing it: link the script in `mods/install.sh` beside `claude-pick`, and replace account-label.md's "It cannot move a running conversation" with the new way across, in the same change.

Earns its place when: a conversation that ran out on one account is resumed on another and reads whole.
