#!/usr/bin/env python3
# Claude Code PreToolUse hook on Bash: refuses, before they run, the git
# commands the playbook forbids an agent. The practice:
# playbook/practices/machine-checks.md. Installed by hooks/link.sh.
#
#   git add -A, --all, -u, --update, or `.` `:/` `*`   sweeps up work that is
#   git commit -a, --all                               not this task's
#   --no-verify on any git command, git commit -n      skips the commit-msg check
import json
import re
import shlex
import sys

SEPARATORS = {';', ';;', '&', '&&', '|', '||', '|&', '(', ')'}
GLOBAL_VALUE = {'-C', '-c', '--git-dir', '--work-tree', '--namespace', '--config-env'}
SWEEP_PATHS = {'.', './', ':/', ':/:', '*', ':(top)'}
COMMIT_VALUE = set('mFCct')     # the next token, or the rest of the cluster, is a value
COMMIT_ATTACHED = set('Su')     # an optional value attached to the flag

STAGE_BY_PATH = 'stage by path: `git add <the files this task changed>`'


def tokens(text):
    lex = shlex.shlex(text, posix=True, punctuation_chars=True)
    lex.whitespace_split = True
    return list(lex)


def all_tokens(command):
    try:
        return tokens(command)
    except ValueError:      # an unquoted heredoc or a stray quote: line by line
        out = []
        for line in command.splitlines():
            try:
                out += tokens(line) + [';']
            except ValueError:
                out += tokens(re.split(r'[\'"]', line, maxsplit=1)[0]) + [';']
        return out


def git_commands(toks):
    """Each `git …` in the token list, as (subcommand, args)."""
    for i, t in enumerate(toks):
        if t != 'git' and not t.endswith('/git'):
            continue
        j = i + 1
        while j < len(toks) and toks[j].startswith('-') and toks[j] not in SEPARATORS:
            j += 2 if toks[j] in GLOBAL_VALUE else 1
        if j >= len(toks) or toks[j] in SEPARATORS:
            continue
        args = []
        for t2 in toks[j + 1:]:
            if t2 in SEPARATORS or t2 == 'git':
                break
            args.append(t2)
        yield toks[j], args


def refusals(sub, args):
    out = []
    if '--no-verify' in args:
        out.append(f'`git {sub} --no-verify` skips the commit-msg check. '
                   'If the check is wrong, say so; it is fixed in the playbook')
    if sub == 'add':
        after_dashes = False
        for a in args:
            if a == '--':
                after_dashes = True
            elif not after_dashes and a in ('--all', '--update'):
                out.append(f'`git add {a}` sweeps up work that is not this task\'s; {STAGE_BY_PATH}')
            elif not after_dashes and re.fullmatch(r'-[^-]+', a) and set(a[1:]) & set('Au'):
                out.append(f'`git add {a}` sweeps up work that is not this task\'s; {STAGE_BY_PATH}')
            elif (after_dashes or not a.startswith('-')) and a in SWEEP_PATHS:
                out.append(f'`git add {a}` stages everything under it; {STAGE_BY_PATH}')
    if sub == 'commit':
        skip_next = False
        for a in args:
            if skip_next:
                skip_next = False
                continue
            if a == '--all':
                out.append(f'`git commit --all` commits every changed file; {STAGE_BY_PATH}, then commit')
            elif re.fullmatch(r'-[^-]+', a):
                for k, ch in enumerate(a[1:]):
                    if ch == 'a':
                        out.append(f'`git commit {a}` commits every changed file; {STAGE_BY_PATH}, then commit')
                    elif ch == 'n':
                        out.append(f'`git commit {a}` skips the commit-msg check')
                    elif ch in COMMIT_VALUE:
                        skip_next = k == len(a) - 2
                        break
                    elif ch in COMMIT_ATTACHED:
                        break
            elif a in ('--message', '--file', '--reuse-message', '--reedit-message',
                       '--template', '--author', '--date', '--fixup', '--squash'):
                skip_next = True
    return out


def main():
    try:
        event = json.load(sys.stdin)
    except ValueError:
        return 0
    if event.get('tool_name') != 'Bash':
        return 0
    command = (event.get('tool_input') or {}).get('command') or ''
    if 'git' not in command:
        return 0
    found = []
    for sub, args in git_commands(all_tokens(command)):
        found += refusals(sub, args)
    if not found:
        return 0
    print('Refused by the playbook\'s git guard (playbook/practices/machine-checks.md):',
          file=sys.stderr)
    for f in dict.fromkeys(found):
        print(f'  - {f}', file=sys.stderr)
    return 2


if __name__ == '__main__':
    sys.exit(main())
