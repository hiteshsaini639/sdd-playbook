# Which account a session runs on

An owner with more than one Claude account on a machine (`~/.claude`,
`~/.claude-work`, …) cannot tell from a terminal which one a session is
using. It matters: each account has its own usage limit, and a feature
parent started on the wrong one spends the allowance meant for something
else (`feature-loop.md` → Children on other accounts).

## The rule
Every interactive session names its account where the owner is already
looking: a one-row bar directly above the prompt, the full width of the
terminal, in the account's own colour.

- **The name is the config folder's**, with the dot dropped: `~/.claude`
  reads `claude`, `~/.claude-work` reads `claude-work`. Nothing is typed
  or configured per account, so the label cannot drift from the truth.
- **The colour comes from the name**, so an account looks the same in
  every project and on every machine.
- **The project and the working folder follow it** on the same row. The
  project is the repository's name on its `origin` remote, so a worktree
  folder such as `main` still reads as its project; with no remote, the
  session's root folder. The folder is the session's working directory,
  home shortened to `~`.
- **The feature sits between them**, as `016 admin ux pass 15/16 done`:
  the ticked and total tasks of its `specs/NNN-name/tasks.md`. It is the
  feature the branch names (`feat/016-…`), else the one whose `tasks.md`
  changed last, re-read every ten seconds. A project with no `specs/`
  features shows none.
- **It is one mod, in the playbook:** `mods/account-band/`. A project
  does not copy it or keep a version of its own.

## Which account to use
Each account has its own usage limits: a five-hour window and a weekly
one. The bar's right end shows how full every account on the machine is,
as `│ used claude 12% · claude-sp ? · claude-work 81%`, with the
emptiest in bold behind an arrow. Nobody works it out by hand.

- **One number per account: its busier window.** A window whose reset
  time has passed counts as empty, so an account left alone reads right.
  `full` is 100%. `claude-pick --list` gives both windows and when each
  resets.
- **Every session records its own account.** After a reply moves a
  window, the session writes its account's reading to
  `~/.local/state/claude-accounts/<account>.json`. Any session on any
  account reads all of them, every ten seconds.
- **`claude-pick` starts the emptiest account** in the current folder:
  `claude-pick`, with any `claude` arguments after it. `claude-pick work`
  starts that account anyway. `claude-pick --which` prints the pick, for a
  script such as the feature loop's.
- **An account with no reading shows `?`.** It is picked only when every
  account with a reading is 90% full or more. One reply on it gives it a
  reading.
- **A reading is only as fresh as that account's last reply on this
  machine.** Use from the browser, the phone or another computer counts
  against the same limit but shows only after the next reply here.
- **It cannot move a running conversation.** Each account keeps its
  conversations in its own folder. When one runs out mid-task, the way
  across is a handoff note (`session-handoff.md`) and a fresh session on
  the account `claude-pick` names.

## Installing
Once per machine, from any project that has the playbook, naming each
account (`default` is `~/.claude`):
```
playbook/mods/install.sh default work
```
Each account then shows the band in every session it starts, and
`claude-pick` is linked into `~/.local/bin`. The account
reads the mod from that project's `playbook/` folder: a playbook bump
there updates it, and a project that is moved or deleted means running
the script again from another.

## What it is not
- **Not for a headless child.** A child the feature loop starts has no
  screen; which account ran it is in the parent's report.
- **Not a guard.** It shows the account; it does not stop a session on
  the wrong one.
- **Early access.** Claude Code's mod interface may change between
  releases. If the band stops drawing after an update, nothing else is
  affected: fix the mod here, once.
