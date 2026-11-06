# Unattended job alerts

A scheduled job nobody watches — a nightly backup, a sync, a renewal —
fails quietly. The first anyone hears of it is the day it was needed. The
alert has to be designed with the job, and it has three layers, because
there are three ways to fail: the job ran and failed, the job never ran,
and the machine was down.

## The job proves its output
"The command exited 0" is not the goal; the result is. The job checks what
it made and exits non-zero when the check fails. For a database backup:
- the dump lists data for every table the database has;
- the stored copy is the size that was written (read it back from the store);
- a test restore into a scratch database has the live row counts, within
  the few rows that can change in the seconds between dump and check.

The scratch database and any temporary file are removed on every exit,
success or not.

## Alert from the scheduler, not the script
The failure alert is wired to the scheduler's failure hook — systemd's
`OnFailure=` pointing at a reusable template unit
(`job-failed@.service`, run as `job-failed@%n.service`) — not to error
handling inside the script. A crash, a missing binary, a killed process
and an error the script never anticipated all still alert.

## Only failures post
A quiet channel means healthy. A message names the machine, the job and
the time, then the last few useful lines of the job's log, with the
`sudo`/PAM session noise filtered out. A success message every night trains
people to stop reading the channel.

## A second check catches "it never ran"
A job cannot report a night it did not run: a disabled timer, a full disk at
boot, a broken unit file. A separate job on its own timer, hours later,
looks for the result itself — the newest backup is younger than one interval
plus a margin, and not much smaller than the one before — and alerts the
same way.

## A check-in, watched from elsewhere, catches "the machine is down"
Nothing on a stopped machine can report. After a **verified** success the
job pings a check-in address held off the machine; the watcher alerts when a
ping is late. Either a hosted check-in service, or a small scheduled
function in the same cloud account that inspects the stored result. The
script pings only when the address is set, so the machine works before the
watcher exists.

## The webhook is a credential
A chat webhook URL carries its own key: whoever holds it can post. It lives
in the server's environment file (owner-readable only), never in a repo, a
ticket, a log line or an alert message. The repo holds the scripts and unit
files; the server holds the address.

## Test it before trusting it
- Fire the whole chain once with a dummy job made to fail, whose output
  says it is a test.
- Run a new version of the job **by hand first**, outside the scheduler, so
  a bug in it does not page the channel. When one does, say so in the
  channel: an unexplained real alert teaches people alerts are noise.

## Name the blind spots
Write down what these alerts do not cover — usually the service itself
being down between runs, which needs an uptime monitor — so nobody assumes
a quiet channel means more than it does.
