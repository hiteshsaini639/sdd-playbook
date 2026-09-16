# Multi-repo SDD

When one product spans several repos — a backend, a web client, a mobile app —
the specs cannot live in any one of them without implying that repo is the
primary. It isn't, and features cross all three.

## The shape
A **spec repo** that contains specs and no code. The product repos sit inside
it as folders and are gitignored, each keeping its own history and remote.

```
product-sdd/                  ← spec repo
├── CLAUDE.md                 ← constitution
├── specs/                    ← system.md + NNN-feature/
├── decisions/                ← platform ADRs
├── map/                      ← where things live, per product repo
├── playbook/                 ← submodule: general practice
├── backend/         (ignored)
├── web/             (ignored)
└── mobile/          (ignored)
```

Why nested rather than siblings: an agent's working directory is the spec
repo, and every product path is a short relative one from there. No
cross-directory navigation, no absolute paths in tasks.

Why gitignored rather than submodules for the product repos: they move on
their own cadence, driven by their own CI and releases. Pinning them to the
spec repo would either be constantly stale or force a bump commit on every
product change. The playbook is a submodule because the opposite is true —
you *want* to know which version of the general rules governed a feature.

## Linking specs to code
Two-sided, because the commits live in different histories:

- Code commit, in the product repo: `feat(012/T4): add activity enum [R3,AC2]`
- Spec commit, in the spec repo: `tasks(012): tick T4`, with the resulting
  sha recorded on the task line.

The shas in `tasks.md` are the only durable link between a requirement and the
code satisfying it. A ticked task with no sha is an unverifiable claim, and
the drift audit should treat it as a finding.

## What this buys
- Specs are reviewable as a unit, across surfaces, in one place.
- A feature's history reads as one story even though its code landed in three
  repos on three branches.
- Product repos stay clean — a mobile developer cloning the app does not
  inherit the platform's spec history.

## What it costs
- Two commits per task instead of one.
- Clone instructions, because the spec repo does not bring the product repos.
- Discipline: nothing enforces the link but the process. If ticks stop
  carrying shas, the link quietly rots and you find out during an audit.

## Per-repo conventions still belong to the repo
Stack versions, lint rules, build commands, local idioms — those go in each
product repo's own `CLAUDE.md`, committed there. The spec repo holds what
spans repos. Three levels total: universal playbook, product platform, single
repo. Put each fact at the level that owns it, and no higher.
