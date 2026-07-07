## Goal

Restore the scrapped card design shown in the attached screenshot as the "Card" view on `/alerts`. Keep the current Stack view intact; the toggle already switches between them. Replace the current `DecisionCard`, `MeetingBundleCard`, `QuestionCard` (which are the wrong "card v2") with cards that match the screenshot exactly.

## Reference (from screenshot)

Header block above the tab bar:
- Aan mascot icon on the left
- Eyebrow "ALERTS" in tracked uppercase
- Title: "What Aan noticed for you"
- Subline: "7 awaiting approval · 3 critical · 2 completed" (live counts from store)

Tab bar (pill tabs, count chip inline):
- `All N`, `Needs approval N`, `Overnight N`, `Meetings N`, `Live N`, `Executing N`, `Done N`
- Right-aligned "Clear completed" text link
- Tabs apply only in Card view; Stack view keeps its current tab set unchanged

Timeline column:
- Left gutter shows the timestamp (e.g. `10:03 PM`) per card, aligned to the card top
- Date bucket labels `TODAY`, `YESTERDAY`, `EARLIER` as small uppercase headers

Decision card shape:
- Full-width card, subtle border, generous padding
- 4px colored left rail: green for Live/opportunity, red for critical, muted for FYI
- Top row: status dot + `LIVE` (or `OVERNIGHT` / `EXECUTING`) · source label (`ADVERTISING`, `P&L`, etc.), all uppercase, muted; right side shows a status pill like `EXECUTING` when applicable
- Title line: bold decision insight (e.g. "3 search terms ready to graduate from Auto → Manual")
- Subline: `insightDetail` in muted text
- Chip row: 3–5 small outlined tags (Keywords, Auto→Manual, Bamboo, Harvest, etc.)
- Meeting-origin line (when applicable): `From: <Meeting Title> — <cadence> · N action items`
- `ACTION` label + one-sentence action sentence in normal weight
- Footer row: filled primary `Approve <verb>` button + ghost `× Reject` + right-aligned `View more →` link
- Right side of the card body: bordered `VALUE` box with `VALUE` eyebrow and the formatted value line (e.g. `+$310/wk projected sales`)

Meetings and Questions cards in Card view follow the same visual language (left rail, timeline gutter, chip row, VALUE box when a value exists, Approve/Reject or Open workspace footer). Share menu is available on every card.

Stack view, filters, sort, bulk bar, keyboard nav, undo toast, workspace sheet are all unchanged.

## Files

New:
- `src/components/actions/CardAlertsHeader.tsx` — mascot + title + subline + tabs + Clear completed
- `src/components/actions/CardTabs.tsx` — pill tab bar with count chips (All / Needs approval / Overnight / Meetings / Live / Executing / Done)
- `src/components/actions/CardTimelineItem.tsx` — timeline gutter + card slot wrapper
- `src/components/actions/ValueBox.tsx` — bordered right-side VALUE box used in cards

Rewritten (kept file names so the toggle still resolves):
- `src/components/actions/DecisionCard.tsx` — match screenshot exactly
- `src/components/actions/MeetingBundleCard.tsx` — same visual language, keeps Open workspace CTA
- `src/components/actions/QuestionCard.tsx` — same visual language, keeps answer choices

Edited:
- `src/pages/Alerts.tsx` — in Card view, replace bucket grid render with the new header + tabs + timeline list. Compute counts per new tab from existing store selectors. Stack view branch is untouched. `Clear completed` calls the existing bulk-clear path already used by `HandledFilters`.

Deleted: none.

## Technical notes

- New tab keys used only inside the Card view: `all | needs_approval | overnight | meetings | live | executing | done`. Mapping:
  - `needs_approval` = decisions with `status === "open"`
  - `overnight` = decisions whose `createdAt` is between 22:00 previous day and 08:00 today
  - `meetings` = meetings list from `useActionsStore().meetings`
  - `live` = decisions with `status === "open"` and `source !== "meeting"` (matches the green-rail live items in the screenshot)
  - `executing` = decisions with `status === "in_flight"`
  - `done` = decisions with `status ∈ {completed, rejected, expired}`
  - `all` = union of the above (deduped)
- Color rail: `bg-success` (green) for `live`/`opportunity`, `bg-destructive` (red) for `critical`, `bg-muted-foreground/40` for `fyi`. All via existing semantic tokens; no hex.
- `VALUE` box is only shown when `valueCents !== 0`; falls back to a plain right-aligned meta line otherwise.
- Timeline gutter is a fixed 72px column on `md+`, collapses above the card on small screens.
- No changes to `actionsStore`, `selectionStore`, mock data, or Stack view components.

## Out of scope

- Stack view visuals
- Data model, workflows, keyboard shortcuts, workspace sheet
- Any settings / theme changes
