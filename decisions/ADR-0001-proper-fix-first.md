# ADR-0001 — The proper fix first; a shortcut only with its proper fix planned

Status: Accepted · 2026-10-04 · Applies to: every project using this playbook

## Context
Work under time pressure drifts toward the change that makes the symptom
go away: a compatibility flag, a pinned old version, a skipped test, a
setting that restores yesterday's behaviour. Each one is cheap on the day.
Together they become the debt the next project inherits, and nobody
remembers which ones were meant to be temporary. The owner put it plainly:
correctness over speed, even when it costs more time, more planning or
more features.

## Decision
1. The default is the proper fix: the change a careful senior team would
   make with no deadline, done the way the tool or framework documents as
   current, not deprecated.
2. A shortcut (a stopgap, a compatibility shim, a pin, a workaround, a
   deferred upgrade, a known-red test left red) is allowed only when both
   hold:
   - the proper fix cannot be done now, and the reason is written down
     (it needs a contract change, another feature, an owner decision, or
     it would put users at risk today); and
   - the proper fix is planned: it has its own issue or roadmap entry,
     and the shortcut's plan row cites that ID.
3. Every shortcut is named as one where it is decided (a plan's Key
   decisions row, or an ADR's Cost accepted), with the words "short-term"
   and the ID of its proper fix. A shortcut that is not labelled is a
   defect.
4. A plan that weighs a proper fix against a shortcut recommends the
   proper fix, unless rule 2 holds. Being bigger, slower or adding a task
   is not, by itself, a reason.
5. The drift audit checks every short-term row still has an open issue or
   roadmap entry behind it.

## Why
A shortcut with a planned exit is a sequencing choice; without one it is
permanent by default. Writing the exit down at the moment of choosing
costs one line and makes the cost visible to whoever pays it.

## What this rules out
- "Temporary" fixes with no issue or roadmap entry behind them.
- Choosing the smaller change because it is smaller.
- Silencing a failing check, skipping a test, or restoring old behaviour by
  flag without saying when and how it goes away.
- Deferring an upgrade or a cleanup into "later" with no owner and no ID.

## Cost accepted
Features grow: more tasks, more planning, sometimes an extra feature to do
the proper fix. Some plans will carry a follow-up issue for every
compatibility setting they keep.
