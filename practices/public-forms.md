# Public forms

Forms that anyone can send (contact, enquiry, job application, book a
demo) are where a business gets its leads and its complaints. Learned on
two projects. A shop's website forms told visitors "sent" but wrote each
submission only to the log, so leads were lost. A health app's contact
form, run from a developer's machine, mailed five real people.

## Store first, then tell someone
- Every accepted submission is saved as a row before anything else
  happens. Any mail is a notice that the row exists, never the only copy.
- If the mail fails, the row stays and is marked as not mailed. One error
  line names the row's id and no personal data. The sender gets the same
  answer as when the mail went.
- The server sets the time, and gives the sender a reference they can
  quote.
- Recipients are set per environment in config, and no address is written
  in the code. Local and test environments mail nobody
  (`transactional-mail.md`).
- In the mail, the sender's address is the reply-to, and everything they
  typed is escaped in the HTML.
- Cap the mail sent per environment per day. Past the cap, submissions
  are still saved, and are not mailed.

## Traps, not a captcha
Use checks that a person never sees and never has to solve:
- A hidden field that only a script fills in.
- A pass the server signs when the form opens. It is good for one send,
  no sooner than a few seconds and no later than about an hour after it
  was issued.
- A cross-site post is refused.
- Limits per network address and per sender (their phone or email),
  answered with 429 and `Retry-After` (`api-surfaces.md` → Rate limits).
  The people in one shop or office often share one address, so set that
  limit with this in mind.
- A send caught by a trap gets the same success answer as a real one and
  saves nothing, so the script learns nothing. One info line says which
  trap caught it.

## An inbox, not a mailbox
- The submissions are listed in the admin area: newest first, searchable,
  and filtered by status. A count of new ones on the admin's landing page
  is the alert.
- Each submission has a status that someone moves to a close: a simple
  new and done, or a pipeline of stages for leads.
- Options the business changes, such as departments or budget bands, are
  lists the owner edits in the admin area, so changing one needs no
  deploy.
- When a person's account is deleted, the messages they sent are deleted
  with it.
