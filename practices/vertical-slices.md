# Vertical slices

## The rule
A task moves every surface a change needs — server, web, mobile — for one
testable increment. Never "finish the backend, then do the clients".

## Why surface-at-a-time fails
It feels efficient because each repo stays in one person's head. What it
actually does:

- **Defers all integration risk to the end**, where it is most expensive.
  The contract mismatch you would have found in hour two is found in week
  three, after both sides built on it.
- **Produces untestable intermediate states.** A backend with a new enum and
  no client that sends it has no way to prove it works. So it gets merged on
  the strength of unit tests that assert the code does what the code does.
- **Creates a silent asymmetry.** One client ships the new field, the other
  doesn't. Nobody notices until a user switches devices, because no test ever
  exercised both.
- **Makes the "done" claim unfalsifiable.** "Backend is done" means nothing
  until something consumes it.

## What a slice looks like
Take the smallest behaviour that is observable end to end and move it all the
way through. One vocabulary, not all vocabularies. One field, not one layer.

After each slice, the whole product is coherent — shippable, even if
incomplete. That is the test of whether you sliced correctly.

## Ordering inside a slice
The contract lands first, because everything else depends on its shape. Then
the clients, together, in the same task or in the immediately following one.

A run of more than two consecutive same-surface tasks means you re-slid into
horizontal work. Re-slice.

## The acceptance criterion that enforces it
Every feature needs at least one AC that spans surfaces: a value written on
one, read correctly on another. If all the ACs sit inside one repo, either the
feature really is single-surface, or the slicing is wrong and the integration
risk is still hiding.

## The honest exception
Sometimes a contract genuinely must ship and soak before clients can adopt it
— a breaking change with versioning, a migration with a dual-write window.
That is a real pattern, not the horizontal habit in disguise. Tell them apart
by asking whether the intermediate state is *deliberately* observable and
tested. If it is, it is a slice. If it is just unfinished, it is not.
