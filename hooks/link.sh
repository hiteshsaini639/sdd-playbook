#!/bin/bash
# Installs the playbook's hooks in a project. Run from the spec repo's root
# (or a single repo's), with the playbook at playbook/. The practice:
# playbook/practices/machine-checks.md.
#
#   playbook/hooks/link.sh spec <product folder>...   a spec repo and its product repos
#   playbook/hooks/link.sh single <code folder>...    one repo holding specs and code
#
# Each repo gets the commit-msg hook, linked, and its role in its git
# config; git does not version either. The project gets, in
# .claude/settings.json (commit it), the Claude Code guard and a session
# start that runs this again with --session, so a fresh clone (a cloud
# session, another machine) links itself when Claude Code starts in it.
# --session prints only what changed or is wrong, skips product folders
# not cloned here, and leaves settings.json alone. A commit-msg hook a
# repo already has is left alone and reported. Safe to run again.
set -eu
[ -d playbook/hooks ] || { echo "run from the spec repo root (no playbook/hooks here)"; exit 2; }
session=
[ "${1:-}" = --session ] && { session=1; shift; }
mode="${1:-}"
[ $# -gt 0 ] && shift
hook="$(pwd)/playbook/hooks/git/commit-msg"

say() { [ -n "$session" ] || echo "$1"; }

link_hook() {  # <repo folder> <role>
  local hooks target
  if ! git -C "$1" rev-parse --git-dir >/dev/null 2>&1; then
    say "not a git repo, skipped: $1"
    return
  fi
  hooks="$(git -C "$1" rev-parse --path-format=absolute --git-path hooks)"
  target="$hooks/commit-msg"
  mkdir -p "$hooks"
  if [ -L "$target" ] && [ -e "$target" ] && [[ "$(readlink "$target")" == */playbook/hooks/git/commit-msg ]]; then
    say "linked already: $1"
  elif [ -L "$target" ] && [[ "$(readlink "$target")" == */playbook/hooks/git/commit-msg ]]; then
    ln -sf "$hook" "$target"    # a link into a clone that has moved or gone
    echo "commit check relinked: $1"
  elif [ -e "$target" ] || [ -L "$target" ]; then
    echo "kept, the repo's own commit-msg hook: $1 ($target); the playbook's commit check is off there"
  else
    ln -s "$hook" "$target"
    echo "commit check linked: $1"
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
    [ $# -gt 0 ] || say "no code folders named: code commits are not checked for a task" ;;
  *)
    echo "usage: playbook/hooks/link.sh [--session] spec <product folder>... | single <code folder>..."
    exit 2 ;;
esac

[ -n "$session" ] && exit 0

python3 - "$mode" "$@" <<'PY'
import json, os, shlex, sys
path = '.claude/settings.json'
guard = '"$CLAUDE_PROJECT_DIR"/playbook/hooks/claude/guard-git.py'
# Self-contained, because in a fresh clone playbook/ may still be empty.
link = 'playbook/hooks/link.sh --session ' + ' '.join(shlex.quote(a) for a in sys.argv[1:])
start = ('cd "$CLAUDE_PROJECT_DIR" && '
         '{ [ -x playbook/hooks/link.sh ] || GIT_TERMINAL_PROMPT=0 git submodule update --init playbook >/dev/null 2>&1; }; '
         f'if [ -x playbook/hooks/link.sh ]; then {link}; '
         'else echo "playbook/ is empty and could not be fetched: the playbook skills, '
         'the git guard and the commit check are off in this session"; fi')
data = {}
if os.path.exists(path):
    with open(path) as f:
        data = json.load(f)
hooks = data.setdefault('hooks', {})
changed = []

pre = hooks.setdefault('PreToolUse', [])
if not any(h.get('command') == guard for e in pre for h in e.get('hooks', [])):
    pre.append({'matcher': 'Bash', 'hooks': [{'type': 'command', 'command': guard}]})
    changed.append('the guard')

ours = lambda h: 'playbook/hooks/link.sh --session' in h.get('command', '')
ss = hooks.setdefault('SessionStart', [])
if not any(h.get('command') == start for e in ss for h in e.get('hooks', [])):
    for e in ss:
        e['hooks'] = [h for h in e.get('hooks', []) if not ours(h)]
    ss[:] = [e for e in ss if e['hooks']]
    ss.append({'hooks': [{'type': 'command', 'command': start, 'timeout': 60}]})
    changed.append('the session start')

if changed:
    os.makedirs('.claude', exist_ok=True)
    with open(path, 'w') as f:
        json.dump(data, f, indent=2)
        f.write('\n')
    print(f'{" and ".join(changed)} added to .claude/settings.json: commit it')
else:
    print('guard and session start in .claude/settings.json already')
PY
