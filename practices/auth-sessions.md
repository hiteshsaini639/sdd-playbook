# Auth and sessions

Login, tokens and expiry for a staff-facing console, independent of
framework. Each rule below cost a real project time when it was missing.

## Tokens
- **Access token**: a short-lived signed JWT (about 15 minutes) returned in the
  response body and **held in memory** by the client. Sent as a bearer header.
  Never in `localStorage`, `sessionStorage` or a readable cookie.
- **Refresh token**: an opaque random value, not a JWT, stored **hashed** in the
  database. It sits in a cookie that is `HttpOnly`, `Secure`,
  `SameSite=Strict`, host-scoped, and `Path` set to the auth routes only. Then
  the refresh endpoint is the only cookie-authenticated route, so CSRF has
  nothing to aim at.
- It is opaque because everything it says has to be checked against the
  database anyway: revoked, expired, account still active.
- **The token carries identity, not permissions.** Permissions are resolved per
  request (`permissions.md`). A permission-version claim stamped on the user
  row lets one bump kill every access token that user holds.
- **Rotation with reuse detection was tried and withdrawn.** Its alarm, "the
  same token arrived twice", is exactly what two open tabs produce, so it
  signed people out for ordinary use. "One column" became a hundred lines and
  a bug that deleted live sessions. The host-scoped cookie already closes the
  copy threat. Revocation (`revoked_at`) is what ends sessions.

## Expiry
| | |
|---|---|
| access | ~15 min |
| refresh, idle | one working shift (e.g. 8 h) |
| refresh, absolute | e.g. 7 days from login |
| reset token | 60 min, single use |

- The client refreshes ahead of expiry while in use.
- When a session does end, a **re-login dialog opens over the current
  screen** and the unsaved form survives. A redirect that throws away
  half-typed work is how a tool earns a bad name.
- A password change, a reset or a disabled account revokes every refresh token
  of that user at once.

## Login
- Throttle on three axes: IP, identifier, and the IP-and-identifier pair. Add
  delay on failures and lock an identifier briefly (about 15 minutes).
  **Never lock durably**: a permanent lock is a denial of service anyone can
  trigger against a known name.
- One answer for "no such user", "wrong password" and "disabled", with as
  close to the same timing as possible.
- Audit every attempt, success or failure, with IP and user agent.
- Passwords: bcrypt (or better) with a configured cost, minimum length, a small
  blocklist, and no composition rules. Length carries the strength.

## Reset and handover
- Forgot-password: a random token whose hash is stored with an expiry, mailed
  as a link. The response is identical whether or not the account exists.
  Using it consumes it, revokes sessions, and sends a confirmation mail.
- **The mailer is a port** with one method. Development and tests use an
  adapter that writes mail to a file the tests read. Nobody sends real mail
  from a test run.
- A migration hands over one temporary credential with `must_change_password`.
  An administrator **set password** action lets a colleague unblock someone
  without waiting for email.

## Bootstrap
A seed command creates the first administrator from the environment. There
must be a way in that is not a SQL console, or the SQL console becomes the way.
