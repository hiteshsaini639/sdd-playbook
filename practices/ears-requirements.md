# EARS requirements

EARS = Easy Approach to Requirements Syntax. Five sentence shapes. Using them
is not ceremony — each shape forces you to name a trigger condition you would
otherwise leave implicit.

## The shapes
| Shape | Template | Use for |
|---|---|---|
| Ubiquitous | THE SYSTEM SHALL … | Always-true invariants |
| Event | WHEN `<trigger>` THE SYSTEM SHALL … | Something happens |
| State | WHILE `<state>` THE SYSTEM SHALL … | Ongoing condition |
| Unwanted | IF `<condition>` THEN THE SYSTEM SHALL … | Errors, edge cases |
| Optional | WHERE `<feature is present>` THE SYSTEM SHALL … | Variant builds |

## Rules
- One requirement, one sentence, one `SHALL`. Two `SHALL`s means two
  requirements, and they will turn out to have different acceptance criteria.
- Name the actor or trigger. "The value is validated" hides who validates and
  when; "WHEN a log is submitted THE SYSTEM SHALL reject a code outside the
  vocabulary" does not.
- Observable outcomes only. "SHALL be performant" is not testable. "SHALL
  respond within 150ms at p95" is.
- No solution language. `SHALL store a code` is a requirement; `SHALL use a
  Java enum` is a plan decision.

## Unwanted behaviour is where the value is
Most specs describe the happy path well and the rest not at all. The `IF …
THEN` requirements — unknown code received, backfill hits an unmappable row,
locale bundle missing a key — are the ones that prevent production
surprises. Write them first if you are short on time.

## Every requirement gets an AC
`R3. IF a client receives an unrecognised code THEN THE SYSTEM SHALL display
the raw code and log it.`

`AC3. Given the server returns POWER_WALK and no bundle defines it, when the
history list renders, then the row shows "POWER_WALK" and one warning is
logged.`

The AC names the precondition, the action, and the observable result. If
writing it is hard, the requirement is vague — fix the requirement, not the
AC.
