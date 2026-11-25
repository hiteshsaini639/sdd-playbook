# Transactional mail

This is the mail an app sends by itself: a verification link, a password
reset, a form's notice, a job's report. Learned on a health app where a
developer's local run mailed a contact message to five real people. In the
same app, nothing behind a sign-in could be checked on a local run,
because the link only ever went to a mailbox.

## Local never sends
- A local run logs each mail instead of sending it, with the link in the
  log. Then sign-up and password reset can be checked from end to end on a
  local run.
- The log-only setting stops the server from starting anywhere but local
  or test, so production can never write a link to a log.
- People who receive mail (support, the owner) are set per environment.
  Local and test have none.

## Sending
- Send through standard SMTP to a provider, never through the provider's
  own API. Then changing the provider changes config, not code.
- The host, user, password and both timeouts come from config. If any is
  missing, the server refuses to start.
- A failed send writes one error line: the kind of mail, the account or
  row id, and the server's reply code. It never writes the address, the
  link or the password.
- The domain publishes SPF, DKIM and DMARC before the first real send, or
  the mail lands in spam.
- When choosing where DMARC's aggregate reports go (`rua`): never to a
  mailbox people work from. The big receivers send one every day, and
  sometimes send the same report several times. Point `rua` at a DMARC
  report service that mails a short digest. Until there is one, use the
  support address, with a filter that moves them to their own folder,
  read, set up the same day as the record. Learned when CardiRehab's
  support inbox got 37 reports in 15 days, one of them nine times (051,
  2026-11).

## The mail itself
- One design for every mail, chosen from a prototype before it is built.
  Put the logo on a tile so it reads in dark mode, use the brand's colours
  at a readable contrast, one main button, and a footer that says why the
  mail was sent.
- Send an HTML part and a plain-text part with the same words. In the text
  part, write the link out in full.
- Keep it readable at 320 px wide and on a desktop, in dark mode, and with
  pictures blocked, with alt text on the logo. Put the styles inline, lay
  it out with tables, fetch nothing, and use no tracking picture.
- Escape everything a person typed in the HTML part.
- Keep every fact the mail carries: how long a link lasts, and "ignore this
  mail if it was not you".

A scheduled job's report goes through the same sender
(`unattended-job-alerts.md`).
