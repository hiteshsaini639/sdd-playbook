---
name: ux-review
description: Walk every screen of a surface the way a busy first-time user reads it, and write down what will confuse, mislead or slow them, with the fix. Use when the owner says a screen is hard to understand, before a UI polish feature, or after a feature adds screens. Produces findings for a spec, never code.
---
Surface or screens: $ARGUMENTS (none means every screen the surface's map lists)

Project additions: `.claude/skill-additions/ux-review.md`, if it exists. Read
it first; where it and this file differ, it wins. It names the viewports,
the roles, how to start the app with realistic data, and where findings go.

A screen is understood when someone who has never seen it can say in five
seconds what it is for, what state things are in, and what to press next.
This skill tests that, screen by screen, against [HEURISTICS.md](HEURISTICS.md):
the rules people's reading habits impose, with how to spot each breach.

It is not `/prototype`. A review finds what is wrong and why. A prototype
shows several answers to one open design question. The review hands its
open questions to `/prototype`.

## 1. List what to walk
From the surface's map (or its navigation), list every screen, every dialog
and panel it opens, and every role that sees it differently. Each one goes in
the findings file as a heading before you open it, so none is skipped.

## 2. Walk each screen in a real browser
Never judge from the code. For each screen, at each viewport the additions
name, and as each role:
- **Data that hurts:** the longest real title, a list of 30+, a list of one,
  an empty list, a name with no data behind it. Short seed data hides most
  layout faults. Create what is missing, in a scratch database only.
- **Every state:** loading, empty, error, no permission, done, cancelled,
  overdue. Open every dialog and every menu.
- **Every action once:** press it and watch what tells you it worked.
- Screenshot each state. Keep the screenshots beside the findings.

## 3. Five-second test, written down
Before the checklist, for each screen write three lines as a newcomer would:
"This is for …", "The thing I'd press is …", "The coloured things mean …".
Where you cannot answer from the pixels alone, that is a finding, and
usually the most important one on the screen.

## 4. Hold it against the heuristics
Go through [HEURISTICS.md](HEURISTICS.md) in order for each screen. A rule
that does not apply is skipped silently, not listed.

## 5. Write each finding
One per problem, in the findings file the additions name:

```
### F<n> <screen>: <what is wrong, in the user's words>
Seen: <what is on screen; screenshot path>
User will: <what they will think or do wrong>
Rule: H<n> <name>
Severity: blocks | misleads | slows | polish
Fix: <the change, concrete enough to spec>
```

Severity: **blocks**, the user cannot finish the job (text cut off, a hidden
action). **misleads**, they will do the wrong thing or believe something
false (a status that reads as a filter). **slows**, they get there, with
effort. **polish**, only a trained eye notices.

Then group the findings: the same fault on three screens is one fix in a
shared component or style, and it goes in a **Patterns** section above the
per-screen ones. Patterns are worth the most, so fix them first.

## 6. Mark what is still open
A finding with one obvious fix is ready to spec. A finding with two or more
designs worth trying (a new layout, a new navigation) is marked
`Open: prototype`, with the question in one line. Run `/prototype` on those
before the spec settles them.

## 7. Hand over
Report the counts by severity, the patterns, and the open questions. The
findings feed `/sdd-spec`: each requirement cites the finding ids it closes.
This skill changes no code and files no issues; a defect found here goes in
the spec.
