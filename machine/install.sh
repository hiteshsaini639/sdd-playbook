#!/bin/bash
# Sets this machine up so a run keeps going with the screen off, locked, or the lid shut on charger
# (playbook/practices/machines.md). Once per machine, from anywhere:
#   playbook/machine/install.sh
# Asks for sudo once, for the lid rule. Safe to run again.
set -eu
here="$(cd "$(dirname "$0")" && pwd)"

# claude-keep-awake: no idle suspend while a Claude session runs
mkdir -p "$HOME/.local/bin" "$HOME/.config/systemd/user"
ln -sf "$here/claude-keep-awake" "$HOME/.local/bin/claude-keep-awake"
cp "$here/claude-keep-awake.service" "$HOME/.config/systemd/user/claude-keep-awake.service"
systemctl --user daemon-reload
systemctl --user enable claude-keep-awake.service >/dev/null 2>&1
systemctl --user restart claude-keep-awake.service
echo "claude-keep-awake: $(systemctl --user is-active claude-keep-awake.service)"

# the lid rule: on charger, shutting the lid only turns the screen off
sudo install -D -m 644 "$here/lid-on-charger.conf" /etc/systemd/logind.conf.d/lid-on-charger.conf
sudo systemctl kill -s HUP systemd-logind
sleep 1
echo "lid shut on charger: $(busctl get-property org.freedesktop.login1 /org/freedesktop/login1 \
  org.freedesktop.login1.Manager HandleLidSwitchExternalPower | cut -d' ' -f2)"
