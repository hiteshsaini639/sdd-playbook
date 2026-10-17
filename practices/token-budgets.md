# Token budgets

## The target
One task should cost well under 100k tokens. Crossing it is acceptable when
the task genuinely needs it; finish and say why. A task that looks like it
will blow far past it (roughly 2×) is too big — say so rather than pushing
through, because the failure mode is not a bigger bill, it is an agent that
ran out of room to think.

## Where tokens actually go
Not writing code. Finding out where the code is. In a large repo, blind
search — grep, read, grep again, read the wrong file — dwarfs every other
cost, and it is entirely avoidable.

## The map layer
Keep a `map/<surface>.md` per repo: where things live, what the conventions
are, which files matter for the areas under active work. An agent reads the
map and goes straight to the working area.

A good map entry is a path plus a fact you would otherwise have to read the
file to learn:

> `entity/Activities.java:29-51` — `activityName`, `rpeBorg`, `symptoms` all
> plain `String`, no length caps

That line replaces opening the file. Twenty of them replace exploring a
module.

## Keep the map honest
A stale map is worse than none, because it is trusted. So: whoever finds the
map wrong fixes it as part of their task, not as a follow-up. The correction
is the cheapest it will ever be at the moment of discovery.

Write the map when exploration is already fresh — right after a survey, not
later from memory.

## Other levers
- **Read budgets per task.** Name the exact files. An agent with a list does
  not explore.
- **Short always-loaded files.** The constitution is read every session; keep
  it under ~100 lines. Everything else is read on demand via a router table.
- **One task per session.** Context that carries between tasks is context paid
  for repeatedly.
- **Delegate the fan-out.** A broad survey belongs in a child agent whose
  context is discarded, returning a compact answer. The parent pays for the
  summary, not the search.
- **Ask for terse output.** A subagent told "max 400 lines, cite file:line,
  quote only where the exact shape matters" returns something usable. One
  told nothing returns a transcript.
- **Read the governing documents by section.** A task cites its
  requirements, criteria and decisions by ID; the agent reads those
  sections, the task list's preamble and its own task, and the map rows it
  will use or change: found by heading and ID (`grep -n`), then read by
  line range. A whole spec, plan, task list and map read for one task is
  a fixed cost of tens of thousands of tokens before any work, paid again
  by every task. When a section points to another, follow it; when unsure
  whether something applies, read more. Precision beats the saving.
- **Read test output by its summary.** A full test run writes to a file;
  the agent reads its totals and its failures (`grep` for the runner's
  summary and failure lines), and opens more of the log only for a
  failure it is fixing. A whole log in the context is paid for on every
  turn after it.

## What not to optimise
Do not compress a spec to save tokens. Specs are read once and govern
everything after; ambiguity there is paid back many times over in
clarification round trips. Spend on precision where it is read most.
