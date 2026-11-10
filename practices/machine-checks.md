# Machine checks

A rule an agent has to remember is a rule it will one day forget, on a day
nobody is watching. A rule a machine can check is checked by one: the
breach is refused before the commit, with the fix in the refusal, instead
of found by an audit weeks later.

## What gets a check
A rule earns one when it is mechanical (a pattern, a presence, a count)
and breaking it costs more than the check. Judgement stays with the review
and the drift audit (`feature-loop.md` → After the last task).

| Rule | Checked by |
|---|---|
| A commit subject is `type(scope): message` or `type: message` | `commit-msg`, every repo |
| A commit that changes product code names its task (`012/T4`) | `commit-msg`, product repos and a single repo's code folders |
| A tick records a sha on its task's `Shas:` line, or `none (<why no commit>)` | `commit-msg`, the spec repo |
| No sweeping stage (`git add -A`, `git commit -a`), no `--no-verify` | the Claude Code guard |
| A constitution rule code can break (an enum stored by ordinal, a client list restating the server's) | a test or lint in that product repo, under its **Checks** |
| Nothing merges into `main` with a red check | the host's branch protection |

Two kinds of product commit pass without a task: one that changes only
Markdown, and a release (`chore(release): …`). Anything else that changes
code without a task needs a spec, or the check needs fixing.

## The hooks
`playbook/hooks/`, installed from the spec repo's root:
```
playbook/hooks/link.sh spec <product folder>...    # or: single <code folder>...
```
- `git/commit-msg` is linked into each repo's git hooks, with the repo's
  role (`sdd.role`) and a single repo's code folders (`sdd.codePaths`) in
  its git config. Git versions neither, so each clone runs `link.sh` once.
- `claude/guard-git.py` is a Claude Code hook in the project's
  `.claude/settings.json`, which is committed. It runs in every session
  started in the project, headless children of the feature loop included.

## Rules
- **A refusal names the rule and the fix.** One that only says "invalid"
  sends the agent hunting.
- **No way around it for an agent.** A person can still pass
  `--no-verify` to git; the guard refuses it to an agent. When a check is
  wrong, fix the check, here, for every project.
- **A rule broken twice gets a check.** The second breach is the evidence,
  as for any practice here.
- **Try a check on history before turning it on.**
  `git log --format=%H | playbook/hooks/git/commit-msg --rev` lists every
  commit it would have refused. A check that would have refused good work
  is wrong, not strict.
- **Branch protection is the owner's**, set on the host. An agent files a
  missing one as an issue and never changes it.
