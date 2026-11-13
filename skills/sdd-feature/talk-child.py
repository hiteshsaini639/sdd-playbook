#!/usr/bin/env python3
"""The talk mode of run-child.sh: a headless child the parent can message
while it works, and continue after it reports.

    talk-child.py <out-dir> <task-id> <claude args...>

Starts `claude -p` with streaming input and output. The task's prompt, in
<out-dir>/prompt-<task-id>.txt, is the first message. Every line written to
the pipe <out-dir>/in-<task-id> (send-child.sh writes them) reaches the
child as one more message, between two of its steps. The child's events
land in <out-dir>/stream-<task-id>.jsonl and its session id in
<out-dir>/session-<task-id>.txt, for a later --resume. The session ends at
the first result with no background task of the child's still running;
the last result is the report.
The practice: playbook/practices/feature-loop.md -> Children on other
accounts -> Talking to a headless child.
"""
import json, os, subprocess, sys, threading

out, task, args = sys.argv[1], sys.argv[2], sys.argv[3:]
pipe = os.path.join(out, f'in-{task}')
if os.path.exists(pipe):
    os.remove(pipe)
os.mkfifo(pipe)

child = subprocess.Popen(['claude', '-p', '--input-format', 'stream-json', '--output-format', 'stream-json',
                          '--verbose', '--replay-user-messages', *args],
                         stdin=subprocess.PIPE, stdout=subprocess.PIPE, text=True,
                         stderr=open(os.path.join(out, f'err-{task}.txt'), 'w'))
lock = threading.Lock()
closed = False


def say(text):
    with lock:
        if closed:
            return False
        child.stdin.write(json.dumps({'type': 'user', 'message': {'role': 'user', 'content': text}}) + '\n')
        child.stdin.flush()
        return True


def listen():
    # Opened read-write, so the pipe never reads as ended between two senders.
    with os.fdopen(os.open(pipe, os.O_RDWR), 'r') as source:
        for line in source:
            line = line.rstrip('\n').replace('\\n', '\n')
            if line and not say(line):
                print(f'too late, the session had ended: {line[:80]}', file=sys.stderr)


say(open(os.path.join(out, f'prompt-{task}.txt')).read())
threading.Thread(target=listen, daemon=True).start()

running, last = set(), None
with open(os.path.join(out, f'stream-{task}.jsonl'), 'w') as stream:
    for line in child.stdout:
        stream.write(line)
        stream.flush()
        try:
            event = json.loads(line)
        except ValueError:
            continue
        kind, sub = event.get('type'), event.get('subtype')
        if kind == 'system' and sub == 'init' and event.get('session_id'):
            open(os.path.join(out, f'session-{task}.txt'), 'w').write(event['session_id'] + '\n')
        elif kind == 'system' and sub == 'task_started':
            running.add(event.get('task_id'))
        elif kind == 'system' and sub == 'task_notification':
            running.discard(event.get('task_id'))
        elif kind == 'result':
            last = event
            if not running:
                with lock:
                    closed = True
                    child.stdin.close()
code = child.wait()
os.remove(pipe)

print(f'exit={code} task={task}')
if last is None:
    print('no result: see', os.path.join(out, f'err-{task}.txt'))
    sys.exit(1)
usage = last.get('usage') or {}
tokens = sum(usage.get(k) or 0 for k in ('input_tokens', 'output_tokens',
             'cache_creation_input_tokens', 'cache_read_input_tokens'))
print('is_error:', last.get('is_error'), '| turns:', last.get('num_turns'), '| output tokens:',
      usage.get('output_tokens'), '| all tokens, cache reads included:', tokens,
      '| session:', last.get('session_id'))
print('--- REPORT ---')
print(str(last.get('result'))[:8000])
