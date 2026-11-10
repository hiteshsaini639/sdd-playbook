#!/bin/bash
# Installs the playbook's hooks in a project. Run from the spec repo's root
# (or a single repo's), with the playbook at playbook/. The practice:
# playbook/practices/machine-checks.md.
#
#   playbook/hooks/link.sh spec <product folder>...   a spec repo and its product repos
#   playbook/hooks/link.sh single <code folder>...    one repo holding specs and code
#
# Each repo gets the commit-msg hook, linked, and its role in its git
# config; git does not version either, so each clone runs this once. The
# project gets the Claude Code guard in .claude/settings.json: commit that.
# A commit-msg hook a repo already has is left alone and reported. Safe to
# run again.
set -eu
[ -d playbook/hooks ] || { echo "run from the spec repo root (no playbook/hooks here)"; exit 2; }
mode="${1:-}"
[ $# -gt 0 ] && shift
hook="$(pwd)/playbook/hooks/git/commit-msg"

link_hook() {  # <repo folder> <role>
  local hooks target
  hooks="$(git -C "$1" rev-parse --path-format=absolute --git-path hooks)"
  target="$hooks/commit-msg"
  mkdir -p "$hooks"
  if [ -L "$target" ] && [ "$(readlink "$target")" = "$hook" ]; then
    echo "linked already: $1"
  elif [ -e "$target" ] || [ -L "$target" ]; then
    echo "kept, the repo's own commit-msg hook: $1 ($target)"
  else
    ln -s "$hook" "$target"
    echo "linked: $1"
  fi
  git -C "$1" config sdd.role "$2"
}

case "$mode" in
  spec)
    link_hook . spec
    for repo in "$@"; do link_hook "$repo" product; done ;;
  single)
    link_hook . single
    git config sdd.codePaths "$*"
    [ $# -gt 0 ] || echo "no code folders named: code commits are not checked for a task" ;;
  *)
    echo "usage: playbook/hooks/link.sh spec <product folder>... | single <code folder>..."
    exit 2 ;;
esac

python3 - <<'PY'
import json, os
path = '.claude/settings.json'
cmd = '"$CLAUDE_PROJECT_DIR"/playbook/hooks/claude/guard-git.py'
data = {}
if os.path.exists(path):
    with open(path) as f:
        data = json.load(f)
pre = data.setdefault('hooks', {}).setdefault('PreToolUse', [])
if any(h.get('command') == cmd for e in pre for h in e.get('hooks', [])):
    print('guard in .claude/settings.json already')
else:
    pre.append({'matcher': 'Bash', 'hooks': [{'type': 'command', 'command': cmd}]})
    os.makedirs('.claude', exist_ok=True)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
        f.write('\n')
    print('guard added to .claude/settings.json: commit it')
PY
