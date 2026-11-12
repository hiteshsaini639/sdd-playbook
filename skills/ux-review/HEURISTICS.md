# How people read a screen

People do not read screens. They scan for something that looks like what they
want, click the first plausible thing, and form their idea of the app from
what that did (Krug, *Don't Make Me Think*; Nielsen's ten heuristics; WCAG
2.2). Each rule below follows from that, with how to spot a breach.

## Meaning

**H1 State is not a control.** A status is shown once, as a read-only badge
next to the title. Changing it is a verb button ("Mark achieved", "Drop
goal"), only for the changes allowed from here. A row of same-looking buttons
with one lit up reads as a filter or a tab, never as "this goal is active".
Spot: a status in a facts list and again as a button group; a selected
button that is also disabled.

**H2 Buttons say what happens.** A verb and its object: "Save goal", "Cancel
task", "Add step". Not "OK", "Submit", "Active". The destructive one names
the loss: "Delete outlet", not "Remove". Spot: a button whose label is a noun
or an adjective.

**H3 The user's words.** Labels use the business's own words (the glossary),
sentence case, no codes, ids, raw timestamps or developer terms. Spot: a
label you would have to explain to the owner.

**H4 Same thing, same name, same place.** One action has one label and one
position on every screen; one colour means one thing everywhere. Spot: "Edit"
here and "Change" there; red for overdue on one screen and for cancelled on
another.

**H5 Colour is never alone.** Every colour carries a word or an icon too, and
text meets 4.5:1 contrast. Spot: a dot or a tint with no label.

**H6 Show, don't make them remember.** Names, not ids. What a link opens is
clear from its text. A value chosen earlier is visible where it matters.
Spot: "Waiting on #12"; a dropdown that only makes sense if you remember the
last screen.

## Layout

**H7 Nothing is cut off.** Long text wraps, or is shortened with an ellipsis
and the full text one tap away. No horizontal scroll inside a dialog or a
card. Test with the longest real value. Spot: text running past a border;
a word sliced at the edge; `white-space: nowrap` on anything user-written.

**H8 Fit the control to the content.** Pick many from long items: a list of
checkboxes, one per line. Toggle chips only for a few short labels (up to
about three words). Pick one of up to five: radio buttons or a segmented
control; more: a select or a search box. Spot: a wall of wrapped chips; a
select hiding two options.

**H9 One primary action per area.** The main thing to do is the one filled
button, placed where the eye ends (top right of a page, bottom right of a
dialog). Secondary actions are outlined; destructive ones are set apart and
confirmed. Spot: three filled buttons in a row; "Delete" next to "Save".

**H10 Most important first and biggest.** Title, then state, then the facts
needed to act, then the action, then the rest. Repeated metadata is quiet
(small, muted). Spot: the same assignee name printed on every row of a
one-person list; the action below the fold.

**H11 Group what belongs together.** Related fields sit in one block with a
heading; space separates groups more than lines do. Spot: a form that is one
long column of unrelated fields.

**H12 Lists suit their job.** Comparing many rows on a few fields: a table.
A few rich items: cards. Order is visible ("Due soonest first") and the
user's next item is near the top. Spot: cards that are all the same height of
mostly empty space; a list with no stated order.

## Behaviour

**H13 Every action answers.** A press shows it worked (a toast, the row
changing) or why not, in plain words beside the cause. Slow work shows
progress. Spot: a button that does nothing visible; an error that names a
code.

**H14 Empty and edge states teach.** An empty list says what goes there and
offers the action that fills it. No permission says so, and who to ask.
Spot: a blank area; "No data".

**H15 Undo or confirm the irreversible.** Deleting, cancelling, signing off:
confirm with the consequence named ("Cancel this task? Its steps stay"),
or offer undo. Spot: a one-tap destructive action.

**H16 Forms forgive.** Label above the field, required marked, sensible
default, the format shown ("dd/mm/yyyy"), errors beside the field when it is
left. Typing is never lost on a mistake. Spot: a placeholder used as the
label; an error only at the top.

## Navigation

**H17 Labels promise what is behind them.** Each menu entry says what you
will find, and no two sound alike. Spot: "Attendance" and "Attendance
months"; "Team" and "Staff list", with no hint of the difference.

**H18 Always know where you are.** The current menu entry is marked, the page
title matches the entry, a breadcrumb shows the path from a deep page.
Spot: a page titled differently from the entry that led to it.

**H19 Few clicks to the daily job.** The work done every day is one click
from the menu, at the top of its screen. Spot: the daily job behind a
"Months" page and a day picker.

## Touch and reach

**H20 Fingers, not cursors.** On tablet and phone every target is at least
44 px in both directions with space between. Nothing depends on hover.
Spot: an icon button with no label and no gap; a tooltip carrying meaning.
