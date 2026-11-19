#!/bin/bash
# Four fixed workspaces, one per area of work, on GNOME (Ubuntu 22.04 and later). The practice:
# playbook/practices/machines.md -> Many sessions on one laptop.
#   Super+1..4         go to workspace 1..4 (Super+Home still goes to the first)
#   Super+Shift+1..4   send the current window there
#   Alt+Tab            this workspace's windows, each terminal on its own (Super+Tab: apps)
#   the dock           this workspace's apps only
# Super+1..4 opened the dock's first four apps before; Super+5..9 still do.
#   machine/workspaces.sh        apply; keeps the values it replaces, the first time
#   machine/workspaces.sh undo   put those values back
set -eu
saved="${XDG_STATE_HOME:-$HOME/.local/state}/playbook/workspaces-before.tsv"
command -v gsettings >/dev/null || { echo "workspaces: no gsettings (not GNOME), skipped"; exit 0; }

settings=(
  "org.gnome.mutter|dynamic-workspaces|false"
  "org.gnome.desktop.wm.preferences|num-workspaces|4"
  "org.gnome.shell.extensions.dash-to-dock|hot-keys|false"
  "org.gnome.shell.extensions.dash-to-dock|isolate-workspaces|true"
  "org.gnome.shell.app-switcher|current-workspace-only|true"
  "org.gnome.shell.window-switcher|current-workspace-only|true"
  "org.gnome.desktop.wm.keybindings|switch-windows|['<Alt>Tab']"
  "org.gnome.desktop.wm.keybindings|switch-windows-backward|['<Shift><Alt>Tab']"
  "org.gnome.desktop.wm.keybindings|switch-applications|['<Super>Tab']"
  "org.gnome.desktop.wm.keybindings|switch-applications-backward|['<Shift><Super>Tab']"
  "org.gnome.desktop.wm.keybindings|switch-to-workspace-1|['<Super>1', '<Super>Home']"
  "org.gnome.desktop.wm.keybindings|move-to-workspace-1|['<Super><Shift>1', '<Super><Shift>Home']"
)
for n in 2 3 4; do
  settings+=("org.gnome.desktop.wm.keybindings|switch-to-workspace-$n|['<Super>$n']"
             "org.gnome.desktop.wm.keybindings|move-to-workspace-$n|['<Super><Shift>$n']")
done
for n in 1 2 3 4; do settings+=("org.gnome.shell.keybindings|switch-to-application-$n|@as []"); done

if [ "${1:-}" = undo ]; then
  [ -f "$saved" ] || { echo "workspaces: nothing to undo ($saved missing)"; exit 0; }
  while IFS=$'\t' read -r schema key value; do gsettings set "$schema" "$key" "$value"; done < "$saved"
  rm -f "$saved"
  echo "workspaces: previous values back"
  exit 0
fi

if [ ! -f "$saved" ]; then
  mkdir -p "$(dirname "$saved")"
  for s in "${settings[@]}"; do
    IFS='|' read -r schema key _ <<< "$s"
    value=$(gsettings get "$schema" "$key" 2>/dev/null) && printf '%s\t%s\t%s\n' "$schema" "$key" "$value"
  done > "$saved"
fi
skipped=0
for s in "${settings[@]}"; do
  IFS='|' read -r schema key value <<< "$s"
  gsettings set "$schema" "$key" "$value" 2>/dev/null || skipped=$((skipped+1))
done
echo "workspaces: $(gsettings get org.gnome.desktop.wm.preferences num-workspaces) fixed, Super+1..4 to go, Super+Shift+1..4 to send a window$( [ $skipped -eq 0 ] || echo "; $skipped settings not on this desktop, skipped")"
