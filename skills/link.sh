#!/bin/bash
# Links every playbook skill into the project's .claude/skills/, so Claude
# Code finds it. Run from the spec repo's root, with the playbook at
# playbook/. A skill the project already has under that name is left alone
# and reported. Safe to run again after the playbook gains a skill.
set -eu
[ -d playbook/skills ] || { echo "run from the spec repo root (no playbook/skills here)"; exit 2; }
mkdir -p .claude/skills
for dir in playbook/skills/*/; do
  name="$(basename "$dir")"
  target=".claude/skills/$name"
  if [ -L "$target" ]; then
    echo "linked already: $name"
  elif [ -e "$target" ]; then
    echo "kept, the project's own: $name"
  else
    ln -s "../../playbook/skills/$name" "$target"
    echo "linked: $name"
  fi
done
