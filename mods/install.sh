#!/bin/bash
# Installs the playbook's mods for the Claude Code accounts on this machine.
# Run from a project's root, with the playbook at playbook/. The practice:
# playbook/practices/account-label.md.
#
#   playbook/mods/install.sh <account>...
#
# <account>  the name after "claude-" of a config folder such as
#            ~/.claude-work, or "default" for ~/.claude.
# Each account gets the playbook folder as a marketplace and every mod in
# it, for every session that account starts (the user scope). The account
# reads a mod from this folder itself, so a playbook bump updates it: run
# /reload-plugins in a session that is already open. Safe to run again.
set -eu
[ -f playbook/.claude-plugin/marketplace.json ] || { echo "run from the project root (no playbook/.claude-plugin here)"; exit 2; }
[ $# -gt 0 ] || { echo "name at least one account: default, or the name after claude-"; exit 2; }
here="$(cd playbook && pwd)"
for account in "$@"; do
  if [ "$account" = default ]; then dir="$HOME/.claude"; else dir="$HOME/.claude-$account"; fi
  [ -d "$dir" ] || { echo "no config folder $dir, skipped"; continue; }
  for mod in "$here"/mods/*/; do
    name="$(basename "$mod")"
    if CLAUDE_CONFIG_DIR="$dir" claude plugin install "$name" --marketplace "$here" --scope user >/dev/null 2>&1; then
      echo "installed: $name for $dir"
    else
      echo "not installed: $name for $dir (run: CLAUDE_CONFIG_DIR=$dir claude plugin install $name --marketplace $here)"
    fi
  done
done
