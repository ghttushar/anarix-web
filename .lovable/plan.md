## Alerts — Grid & Meeting Card Polish

### 1. Equal-height grid cards (All / Needs Approval tabs)
- In `src/pages/Alerts.tsx`, replace the CSS-columns layout in `GridBody` with a CSS grid (`grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-fr items-stretch`) so every card in a row shares the tallest card's height.
- In `src/components/actions/GridCard.tsx`, add `h-full` to the outer card wrapper so it stretches to the grid row height.
- Note: expansion will still make one card taller — because rows use `auto-rows-fr`, the neighboring card in the same row will match. Acceptable and matches the "aligned" ask.

### 2. Overview action buttons — rename & simplify
In `src/components/actions/ActionChoiceRow.tsx`:
- Rename primary button label from the dynamic `actionVerb` (currently "Approve", "Reply", etc.) to a single word: **"Action"**. Split-button dropdown chevron on the right is kept (that's how alternates are chosen), but the standalone chevron/caret decoration on the primary label is removed.
- Replace the "Dismiss" text button with an icon-only button: `X` icon, ghost/outline style, `aria-label="Dismiss"`, `title="Dismiss"`. No text label.

### 3. Grid card header — remove clutter, add share on expand
In `src/components/actions/GridCard.tsx`:
- Remove the `MoreHorizontal` "More" dropdown block at the bottom of the expanded body (lines ~199-228).
- Remove the chevron/expand icon button in the header top-right (lines ~140-150). Expansion still works via clicking the card header row.
- When `expanded === true`, render a small **Share** icon button (using `Share2` from lucide) in the header top-right that opens the existing `ShareMenu` (wrap it in a `DropdownMenu` or reuse the existing ShareMenu component as trigger). Only visible in expanded state.

### 4. Meeting card — de-duplicate, surface counts
In `src/components/actions/GridCard.tsx` (overview / collapsed meeting header):
- Keep meeting title as headline (already done).
- Replace the "insight repeated after timestamp" chip (lines ~126-131) with two meta chips:
  - `{tasks.length} action items`
  - `{attendees.length} attendees`
- Data source: read `d.meetingRef.bundleId` → look up via `useActionsStore().meetings` + `tasksForBundle(bundleId)` (same pattern used by `InlineMeetingWorkspace`).

In `src/components/actions/InlineMeetingWorkspace.tsx` (expanded state):
- Remove the duplicated meeting title header block (lines ~34-59) since the parent card already shows title + attendees. Start the expanded panel directly with the Summary section.
- Remove the "Meeting workspace" eyebrow label.
- The "Action items" section stays as-is (per-item value + action row).

### 5. Also apply overview button renames to Stack view
`StackRow.tsx` uses the same `ActionChoiceRow`, so changes flow through automatically. No stack-specific edits required for the button rename.

### Files to edit
- `src/pages/Alerts.tsx` — GridBody layout
- `src/components/actions/GridCard.tsx` — height, header icons, meeting meta chips, remove More menu
- `src/components/actions/ActionChoiceRow.tsx` — "Action" label, icon-only Dismiss
- `src/components/actions/InlineMeetingWorkspace.tsx` — remove duplicate header
