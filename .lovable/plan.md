# Alerts v7 - Polish Pass

Presentation-only tweaks to Stack + Grid views on `/alerts/*`.

## Changes

### 1. Meeting card - no clubbed CTA in overview
- `StackRow.tsx` / `GridCard.tsx`: when `decision.kind === "meeting_bundle"` (or bundle), do NOT render the `[Action ▾] [Dismiss]` cluster in the collapsed overview. Only chevron to expand remains. Per-task CTAs live inside the expanded `InlineMeetingWorkspace`.

### 2. Meeting card - distinct left border
- Add a 3px left border in a distinct accent (using existing token, e.g. `border-l-[3px] border-l-primary/70` or a warm accent already in the palette) to meeting cards/rows in both views. Non-meeting cards keep current border.

### 3. Remove arrow icon from primary blue buttons
- `ActionChoiceRow.tsx`: remove the `ArrowRight` icon from the primary split button (keep the label + chevron for dropdown).
- `ExpandedAlertBody.tsx`: remove `ArrowRight` from the inline "Run" buttons in suggested-actions list (which is being removed anyway - see #5).
- Any other blue Button with `ArrowRight` in Alerts scope: strip it.

### 4. Bump text size in expanded bodies
- `ExpandedAlertBody.tsx`: eyebrows 10.5px -> 11.5px, body copy 13px -> 14px, value-basis callout 12.5px -> 13.5px, evidence row 12.5px -> 13.5px.
- `InlineMeetingWorkspace.tsx`: summary 12.5px -> 14px, action-item insight 13px -> 14px, transcript 12px -> 13px, eyebrows 10.5px -> 11.5px, meta 11.5px -> 12.5px.
- Keep collapsed row typography unchanged.

### 5. Remove "Suggested actions" section everywhere
- `ExpandedAlertBody.tsx`: delete the entire right column (Eyebrow "Suggested actions" + list + "Write custom action" button). Expand left column to full width. The primary action + dismiss are already accessible via the collapsed row's action cluster and via the "..." expand chevron; discussion access moves to a single subtle text link at the bottom of the expanded body: "Discuss with Aan ->" (no arrow icon, primary color text).
- Remove `deriveAlternateActions` import from `ExpandedAlertBody.tsx`.
- Grid becomes single-column layout inside expanded body.

## Files
- `src/components/actions/ActionChoiceRow.tsx`
- `src/components/actions/ExpandedAlertBody.tsx`
- `src/components/actions/InlineMeetingWorkspace.tsx`
- `src/components/actions/StackRow.tsx`
- `src/components/actions/GridCard.tsx`

No data, routing, or state changes.
