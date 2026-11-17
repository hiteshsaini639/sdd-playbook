# Forced update

Once a mobile app is installed, it keeps calling the server with the
contract it shipped with. When the server changes, the old build breaks
for its user, and nobody can reach that build to fix it. Learned on a
health app where every feature changed its API in place.

## Ship the gate in version 1
- A build that ships without the gate can never be stopped. It goes away
  only when its users update by themselves. So the check goes in the first
  release, before there is anything to break.
- The check's address can never change. Every build ever shipped calls it,
  so it never moves and is never removed. If its answer has to change,
  add a new address and keep the old one answering.

## The check
- For each platform (a code), the server answers with a minimum version
  and a latest version. The address is public, needs no login, and is set
  per environment in config, so raising a version is a config change and
  not a code deploy.
- The app checks when it starts and each time it returns to the
  foreground.
- Below the minimum, the app shows a full-screen block in the user's
  language, with one button to its store page. There is no way past it.
- Below the latest only, it shows a prompt the user can dismiss.
- If the check fails, or its answer cannot be read, the app runs as usual
  and logs it. Failing closed would lock everyone out whenever the server
  is down.

## The release order
Write it down once, in the app's repo:
1. Build, and submit to every store.
2. Wait until every store offers the new build to every user. That can be
   hours after "published".
3. Deploy the server.
4. Raise the minimum.

If the minimum is raised before the stores offer the build, users are told
to update to a version they cannot get yet.

## Prove it on a phone
Before raising the minimum on production, raise it on the test environment
first. Check that an old build is told to update and cannot get past the
block, and that the new build goes through.
