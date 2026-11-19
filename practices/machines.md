# Machines: the laptop you carry, and a spare one

One laptop does the work and goes everywhere. A spare machine, if there is
one, helps only when someone has just made sure it is ready.

## The laptop keeps working shut, on charger
A long run (a feature loop, a full test suite, a big copy) must not stop
because the lid was closed or nobody touched the keyboard.
- **On charger, closing the lid only turns the screen off.** Sessions,
  containers, downloads and Wi-Fi carry on (`machine/lid-on-charger.conf`).
- **While a Claude session runs, the machine does not suspend for being
  idle**, on battery too. `machine/claude-keep-awake`, a user service
  started at login, blocks suspend while any `claude` process runs and lets
  go when none does. `systemd-inhibit --list` shows it as "A Claude session
  is working".
- **Shut on battery still suspends.** A laptop in a bag must not keep
  running hot, so unplugging a shut laptop ends the run.
- A screen that turns off or locks stops nothing; only a suspend does.
- Working shut: on a hard surface, never a bed or a sofa, which block the
  vents.
- **A laptop that mostly stays on charger has its battery capped.** Kept
  full and warm all day, a battery loses its capacity much faster. Set it
  from Linux where the laptop offers it
  (`/sys/class/power_supply/BAT0/charge_types`: `Long_Life` on a Lenovo,
  `Custom` with `charge_control_end_threshold` at 80 on a Dell), otherwise in
  the BIOS. Before a day away from a socket, switch to `Standard` the night
  before, and back after.
- Set up once per machine: `playbook/machine/install.sh`. It asks for sudo
  once, for the lid rule, and is safe to run again.

## A spare machine runs one-off work, started by hand
An old laptop at home can take a heavy job off the one you carry: a long
Claude run, a full test suite, a one-time copy. Only when **you know it is
plugged in and has power** at the moment you start it, and only for work a
person starts and a person checks afterwards.
- **Nothing recurring or automatic on it**: no scheduled backups, syncs, CI
  runners or always-on demo links. A power cut, a dropped Wi-Fi or a
  suspend makes them fail quietly, and the first anyone hears is the day the
  result was needed. Those belong on a host that stays up, with the alerts in
  `unattended-job-alerts.md`.
- **Before starting:** it is on charger
  (`cat /sys/class/power_supply/A*/online` prints 1), its Wi-Fi works, and it
  answers over SSH. Start the job inside `tmux`, so a dropped connection
  doesn't kill it.
- **The Wi-Fi router usually has no battery,** so a power cut ends the
  network at once, while the laptop runs on. Checks for power and Wi-Fi
  before and during a run are being tested: `work/W8-spare-machine-power-and-wifi-checks.md`.
- **Afterwards a person reads the result.** A run that stopped half-way is
  continued as `feature-loop.md` says for a cut-off child, never assumed done.
- **Its own logins.** Sign the spare machine into Claude, GitHub and the rest
  on the machine itself. Copied login files are only for a laptop that
  replaces the old one: two machines running on one copied login can sign
  each other out.
- It runs `machine/install.sh` too, so its runs also survive the lid and
  idle. Reach it the same way from anywhere (a private network such as
  Tailscale), SSH by key only.
