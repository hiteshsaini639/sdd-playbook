# New-user help

A new user who cannot tell what a screen is for does not trust it. They
stop, or they write to support. Learned on a health app whose first page
had grown to seven blocks. The fix was a tour of each main screen, and a
first page that grows with the user's own data. A later feature added four
more tours as four codes and their steps, with no new mechanism.

## Before sign-in
Someone who has just installed the app should see what it is before being
asked to sign up. Show the public information the website already shows,
in the app and without a login. Keep sign in and register one tap away.
This came from the client: "the app is a login app", while the website
showed everything.

## Two parts
- **A tour of each main screen.** It starts on the first visit and can be
  skipped. A button in the same place on every toured screen opens it
  again.
- **A first page that grows with use.** A block shows only when it has
  something to show. The first time a block appears it is explained, once.
  So a new user's first page is short, and every block on it means
  something.

## What was seen lives on the server
- Each tour and each explanation is a code, scoped to a role. The server
  stores the account, the code and the first time it was seen. Help seen
  on the phone is not shown again on web or on a new phone.
- Recording is an idempotent `PUT` that keeps the first time. When two
  records arrive at once, a unique key makes one insert win and the other
  read it.
- Read it once per sign-in and keep it with the session, where every screen
  can read it. Do not keep it under the home screen, because screens opened
  on top of the home need it too.
- If the read fails, show no tour on that visit, show the screen as usual,
  and read again later. Help never blocks a screen.

## When a tour starts
- Start only after the screen's first reads have settled, whether answered
  or failed, so a tour only points at parts that are on the screen. Fix the
  steps when the tour starts. If a step's part has gone by the time its turn
  comes, skip the step and keep the count.
- Never start a tour over another dialog, such as an update prompt or a
  confirmation. Try again when that dialog closes.
- Show one thing at a time. When a tour is due, skip the explanations on
  that visit. When several explanations are due, show them as one sequence
  ("1 of 2").
- Every way out records the tour as seen: Done, Skip, Escape, a tap on the
  backdrop, the back button, or leaving the screen. If the app is closed
  mid-tour, nothing is recorded, so the tour shows again next time.

## Building it
- Use no tour library. The UI kit's own dialog already has the focus trap,
  Escape and the return of focus. Anchor it to the part, dim the rest of
  the screen and leave the part lit. Measure the part again on resize, on
  scroll and when late content draws.
- Check at the largest font size and the narrowest width that a step's
  buttons stay in reach. Keep the card within the window and let it scroll
  inside itself.
- Prototype the look and the words first, and get the owner's pick before
  any screen is built. Steps follow the screen's order, one sentence each,
  and say what the user does there, not what the widget is. Translate them
  into every language the app speaks (`localization.md`).

## Not known yet
Whether it raises how many new users reach their first real use. Count
that before and after (`work/W1-growth-after-launch.md`).
