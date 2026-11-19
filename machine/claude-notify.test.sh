#!/bin/bash
# Checks claude-notify against made-up hook input, with a notify-send that only
# writes down what it was asked to show. Nothing pops up and no settings change.
#   playbook/machine/claude-notify.test.sh
set -u
here="$(cd "$(dirname "$0")" && pwd)"
t=$(mktemp -d); trap 'rm -rf "$t"' EXIT
mkdir -p "$t/bin" "$t/fake" "$t/run" "$t/myproj"
cat > "$t/bin/notify-send" <<EOF
#!/bin/sh
printf '%s|' "\$@" >> "$t/sent"; echo >> "$t/sent"
EOF
chmod +x "$t/bin/notify-send"
# Each hook runs under a stand-in process named claude: interactive, or with -p.
ln -s /bin/bash "$t/fake/claude"
export PATH="$t/bin:$PATH" XDG_RUNTIME_DIR="$t/run" WAYLAND_DISPLAY=test CLAUDE_CONFIG_DIR=/home/x/.claude-work
unset DISPLAY CLAUDE_NOTIFY CLAUDE_NOTIFY_HEADLESS CLAUDE_NOTIFY_MIN_SECONDS
printf '%s\n' '{"type":"user","message":{"content":"run the tests"}}' \
  '{"type":"assistant","message":{"content":[{"type":"text","text":"**All 12 tests pass.** T4 is ticked.\nDetails follow."}]}}' > "$t/transcript.jsonl"

hook() { # <event json> [-p]
  printf '%s' "$1" > "$t/in"
  "$t/fake/claude" ${2:-} -c "python3 '$here/claude-notify' < '$t/in'; true"
}
ev() { # <event> [extra json fields]
  printf '{"hook_event_name":"%s","session_id":"s1","cwd":"%s","transcript_path":"%s"%s}' "$1" "$t/myproj" "$t/transcript.jsonl" "${2:-}"
}
fails=0
expect() { # <name> <pop-ups expected> [text the last one holds]
  local n=0; [ -f "$t/sent" ] && n=$(wc -l < "$t/sent")
  if [ "$n" -ne "$2" ]; then echo "FAIL $1: $n pop-ups, expected $2"; fails=$((fails+1))
  elif [ -n "${3:-}" ] && ! tail -1 "$t/sent" | grep -qF -- "$3"; then echo "FAIL $1: last pop-up lacks '$3': $(tail -1 "$t/sent")"; fails=$((fails+1))
  else echo "ok   $1"; fi
}

hook "$(ev UserPromptSubmit)"; hook "$(ev Stop)"
expect "a short turn stays quiet" 0
CLAUDE_NOTIFY_MIN_SECONDS=0 hook "$(ev Stop)"
expect "a turn over the limit pops up, named by project and account" 1 "myproj · claude-work|Finished after 0 s: All 12 tests pass. T4 is ticked.|"
hook "$(ev Stop)"
expect "with no start seen, it pops up anyway" 2 "Finished: All 12"
hook "$(ev Notification ',"notification_type":"permission_prompt","message":"Claude needs your permission to use Bash"')"
expect "an approval pops up and stays" 3 "--urgency=critical|myproj · claude-work|Claude needs your permission to use Bash"
hook "$(ev Notification ',"notification_type":"idle_prompt","message":"Claude is waiting for your input"')"
expect "waiting for input stays quiet" 3
hook "$(ev Stop)" -p
expect "a headless run stays quiet" 3
CLAUDE_NOTIFY_HEADLESS=1 hook "$(ev Stop)" -p
expect "CLAUDE_NOTIFY_HEADLESS=1 lets it through" 4
CLAUDE_NOTIFY=0 hook "$(ev Stop)"
expect "CLAUDE_NOTIFY=0 silences it" 4
WAYLAND_DISPLAY= hook "$(ev Stop)"
expect "no desktop, no pop-up" 4
hook '{not json'
expect "bad input is ignored" 4
[ "$fails" -eq 0 ] && echo "all passed" || { echo "$fails failed"; exit 1; }
