## Alerts v8 — Meeting headline, inline undo, expanded polish

### 1. Meeting card headline
- **StackRow.tsx / GridCard.tsx**: When `decision.kind === "meeting_bundle"`, replace the value-as-headline with the meeting title as the primary headline. The value block is removed from the meeting overview (values stay only on individual action items inside `InlineMeetingWorkspace`).
- Non-meeting cards keep current value-first headline.

### 2. Stack expanded background
- **StackRow.tsx**: The inline expansion currently sits on the page background. Change wrapper so expanded content uses `bg-card` (same as the row), removing the visual "gap" — it should read as the same card growing taller. Keep a subtle top divider only.

### 3. Remove "Expand to review action items" hint
- Search & remove that helper string from `StackRow.tsx`, `GridCard.tsx`, `InlineMeetingWorkspace.tsx`, and anywhere else it appears.

### 4. Remove "Discuss with Aan" link from expanded view
- **ExpandedAlertBody.tsx**: Delete the bottom "Discuss with Aan →" link that was added in v7. The dropdown item in the Action split button remains the only entry point.

### 5. Inline undo (replace floating toast for approve action)
- **ActionChoiceRow.tsx**: When the primary approve action fires, swap the approve button in place into an "Undo · 30s" button showing a countdown (reuse `CountdownRing` + `useUndoFor`). Dismiss button hides during the undo window.
- After 30s with no undo, the row/card auto-dismisses (fades out and is removed from the visible list — actionsStore already marks it completed; UI just needs to hide it once the undo window closes).
- **UndoToast.tsx**: Suppress rendering for events that originate from approve/complete actions on alert cards (they now render inline). Simplest approach: gate `UndoToast` off on `/alerts/*` routes, OR filter by event id prefix. Plan: filter by id prefix (`dec:*:approve`, `task:*:complete`) so other surfaces still get toasts.
- Applies in both Stack and Grid views, and to per-task action rows inside `InlineMeetingWorkspace`.

### Files touched
- `src/components/actions/StackRow.tsx`
- `src/components/actions/GridCard.tsx`
- `src/components/actions/InlineMeetingWorkspace.tsx`
- `src/components/actions/ExpandedAlertBody.tsx`
- `src/components/actions/ActionChoiceRow.tsx`
- `src/components/actions/UndoToast.tsx`

No data, routing, or store logic changes.
