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

## Installing
Once per machine, from any project that has the playbook, naming each
account (`default` is `~/.claude`):
```
playbook/mods/install.sh default work
```
Each account then shows the band in every session it starts. The account
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
