#!/bin/bash
# Sends one message to a child started with `run-child.sh --talk`, while it
# works. It reaches the child between two of its steps, as from the parent.
#
#   send-child.sh <out-dir> <task-id> <message...>
#
# The practice: playbook/practices/feature-loop.md -> Children on other
# accounts -> Talking to a headless child.
set -u
out="$1"; task="$2"; shift 2
pipe="$out/in-$task"
[ -p "$pipe" ] || { echo "no child is listening on $pipe: it has ended, or was not started with --talk"; exit 2; }
# One message is one line; a newline inside it travels as \n.
printf 'From the parent: %s\n' "$(printf '%s' "$*" | sed ':a;N;$!ba;s/\n/\\n/g')" > "$pipe"
echo "sent to $task"
