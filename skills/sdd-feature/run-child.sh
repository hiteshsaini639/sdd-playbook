#!/bin/bash
# Runs one child of the feature loop as a headless Claude Code session on
# another account of this machine, and prints its report.
#
#   run-child.sh <account> <model> <prompt-file> <out-dir> <task-id>
#
# <account>  the name after "claude-" of a config folder such as
#            ~/.claude-work, which becomes the child's CLAUDE_CONFIG_DIR.
#            "default" keeps the inherited CLAUDE_CONFIG_DIR: the account
#            the parent itself runs on.
# <model>    opus | sonnet
# The child runs in the spec repo: the repo this script sits in, or, when
# the playbook is a submodule, the repo above it. It may use Bash, Read,
# Edit, Write, Glob and Grep and nothing else, and is never prompted. Its
# last message is its report: it lands in <out-dir>/out-<task-id>.json and
# is printed here.
# The practice: playbook/practices/feature-loop.md -> Children on other
# accounts.
set -u
account="$1"; model="$2"; prompt="$3"; out="$4"; task="$5"
here="$(cd "$(dirname "$0")" && git rev-parse --show-toplevel)" || exit 2
super="$(git -C "$here" rev-parse --show-superproject-working-tree)"
cd "${super:-$here}" || exit 2
if [ "$account" != "default" ]; then
  [ -d "$HOME/.claude-$account" ] || { echo "no config folder ~/.claude-$account"; exit 2; }
  export CLAUDE_CONFIG_DIR="$HOME/.claude-$account"
fi
claude -p "$(cat "$prompt")" \
  --model "$model" \
  --allowedTools Bash Read Edit Write Glob Grep \
  --permission-mode acceptEdits \
  --output-format json > "$out/out-$task.json" 2> "$out/err-$task.txt"
echo "exit=$? task=$task account=$account model=$model"
python3 - "$out/out-$task.json" <<'PY'
import sys, json
try:
    d = json.load(open(sys.argv[1]))
    u = d.get('usage') or {}
    tokens = sum(u.get(k) or 0 for k in ('input_tokens', 'output_tokens',
                 'cache_creation_input_tokens', 'cache_read_input_tokens'))
    print('is_error:', d.get('is_error'), '| turns:', d.get('num_turns'),
          '| output tokens:', u.get('output_tokens'), '| all tokens, cache reads included:', tokens)
    print('--- REPORT ---')
    print(str(d.get('result'))[:8000])
except Exception as e:
    print('no json result:', e)
    print(open(sys.argv[1]).read()[:1500])
PY
