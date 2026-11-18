# W8 — A spare machine runs only while mains power and Wi-Fi are both up

Status: todo · Area: practices · Parked: 2026-11-19 (owner)

A run on the spare machine (`practices/machines.md`) needs the mains power twice: it charges the laptop,
and it runs the Wi-Fi router, which has no battery. On a power cut the laptop carries on on its battery for
a while, but the network is gone at once, so the run is cut off. Checks for both, before and during a run.
- Power: the charger is online, `cat /sys/class/power_supply/A*/online` prints 1. A 0 means the mains is
  off, and the router with it.
- Wi-Fi: `nmcli networking connectivity` prints `full`, and the router answers a ping.
- Before a run: both, or it doesn't start. To try: a wrapper, `machine/power-guard <command>`.
- During a run: both checked every 30 seconds. On a cut, to decide by testing: stop the run at once, pause
  it until the power is back, or let it fail and continue it as a cut-off child (`feature-loop.md`).
- On a long cut: let go of `claude-keep-awake`'s block and suspend, so the battery isn't run flat. To test:
  whether the BIOS powers the laptop back on when the charger comes back (Dell: "Wake on AC").
- From the laptop you carry, a cut shows only as the spare machine dropping off the private network
  (Tailscale shows it offline). Without Wi-Fi the spare machine can't send word itself.

Earns its place when: a run on the spare machine has met a power cut, was stopped or paused by the checks,
and was continued once the power was back.
