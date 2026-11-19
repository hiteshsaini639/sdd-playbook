#!/bin/bash
# Sets this laptop up as playbook/practices/machines.md says: a run keeps going with the screen off,
# locked, or the lid shut on charger; a session that needs you pops up; four fixed workspaces.
# Once per machine, from anywhere, inside the desktop session:
#   playbook/machine/install.sh
# Asks for sudo once, for the lid rule, unless it is already in place. Safe to run again.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$HOME/.local/bin" "$HOME/.config/systemd/user"

# claude-keep-awake: no idle suspend while a Claude session runs
ln -sf "$here/claude-keep-awake" "$HOME/.local/bin/claude-keep-awake"
cp "$here/claude-keep-awake.service" "$HOME/.config/systemd/user/claude-keep-awake.service"
systemctl --user daemon-reload
systemctl --user enable claude-keep-awake.service >/dev/null 2>&1
systemctl --user restart claude-keep-awake.service
echo "claude-keep-awake: $(systemctl --user is-active claude-keep-awake.service)"

# the lid rule: on charger, shutting the lid only turns the screen off
if ! cmp -s "$here/lid-on-charger.conf" /etc/systemd/logind.conf.d/lid-on-charger.conf; then
  sudo install -D -m 644 "$here/lid-on-charger.conf" /etc/systemd/logind.conf.d/lid-on-charger.conf
  sudo systemctl kill -s HUP systemd-logind
  sleep 1
fi
echo "lid shut on charger: $(busctl get-property org.freedesktop.login1 /org/freedesktop/login1 \
  org.freedesktop.login1.Manager HandleLidSwitchExternalPower | cut -d' ' -f2)"

# claude-notify: a pop-up when a session finishes a long turn or waits for an approval,
# for every Claude account on this machine; sessions started from now on
ln -sf "$here/claude-notify" "$HOME/.local/bin/claude-notify"
"$HOME/.local/bin/claude-notify" --install

# four fixed workspaces, Super+1..4
"$here/workspaces.sh"
