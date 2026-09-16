# Localization

## Store meaning, not words
Anything a user picks from a known set of options is stored as a **code** — a
stable, locale-free identifier (`BRISK_WALK`). Never the label they saw.

This sounds obvious and is violated constantly, because the violation is
invisible at first. An app ships in one language; the English label works fine
as a value. Localization arrives later, translates the display, and now the
stored data is in whatever language the user happened to be using. Nobody
notices until someone reads the data in a different language than it was
written in.

## The test
Can a value written by a user in one language be read correctly by a user in
another? If not, you stored a word where you needed a meaning.

This is not hypothetical in any product with two audiences — a patient logging
in Tamil and a clinician reviewing in English, a customer ordering in Hindi
and an operator fulfilling in English. The moment those two people look at the
same row, the choice you made about storage becomes visible.

## Localize at the edge
The server is locale-free: no `Accept-Language`, no translated payloads, no
`MessageSource` for domain values. It emits codes. Each client resolves codes
to labels through its own bundle.

Why not translate server-side: the response becomes locale-dependent, which
breaks caching, makes aggregation string-matching, and forces the server to
know about presentation. And it cannot serve two readers of the same row in
two languages, which is the whole problem.

## One vocabulary, N consumers
Declare each code list **once**, server-side, and have clients derive their
option lists from it. Clients that restate the list drift — and the drift is
silent, because nothing compares the copies. A typo in one copy becomes
permanent data.

## What is not translated
Free prose — comments, notes, descriptions. Codes carry meaning across
languages; prose does not, and pretending otherwise leads to machine
translation of clinical notes, which is worse than leaving them alone. Say so
explicitly in the spec so nobody tries.

## Unknown codes
A client will eventually receive a code its bundle doesn't define — a server
deployed ahead of an app release, a locale missing a key. Define the
behaviour: render the raw code, log it. Never blank, never a crash. Blank is
the worst option because it looks like missing data rather than a missing
translation.

## Migrating an existing field
Every legacy value maps somewhere, including misspellings and orphans. Build
the mapping table before writing any code — it is where you discover that
production contains four spellings of one option. Backfill with an idempotent,
guarded, reversible component, and verify no row is left outside the
vocabulary.

## Don't forget the switcher
A language switcher is easy to get subtly wrong and hard to notice: a locale
that isn't a product language, a label pointing at the wrong code, a bundle
that exists but is unreachable. Test that every offered locale actually loads
its own bundle. This is a real bug class, not a theoretical one.
