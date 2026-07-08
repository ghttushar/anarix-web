
## Why the page is empty

`AlertsInner` filters by the shared `FilterContext.dateRange`, which persists in `localStorage` (`anarix-dateRange`) as **Apr 01 – May 30, 2026** (visible in the taskbar screenshot). Every decision in `mockDecisions.ts` uses `createdAt: now - N * MIN/HOUR`, so with today = Jul 8, 2026 **every alert falls outside the stored range** and gets stripped by the `filtered` memo. Tabs still show counts because `computeTabCounts` runs on the raw `decisions`, not on `filtered`.

## Changes

### 1. Isolate the alerts date filter (fixes the empty page)

- Add optional `dateRange` + `onDateRangeChange` props to `AppTaskbar` (both parts). When provided, the taskbar reads/writes those instead of `FilterContext` — no other page is affected.
- In `Alerts.tsx`: hold local `alertsDateRange` state (persisted to `sessionStorage` under `alerts:date-range`) defaulting to **last 30 days ending today**, and pass it into `AppTaskbar`. Use this range (not `useFilter().dateRange`) in the `filtered` memo.
- Result: the taskbar date picker still works on /alerts, but starts on a range that actually contains data.

### 2. Remove the "46 open · $70k at stake / 19 critical" block

Delete the right-side stats column inside the hero `<header>` in `Alerts.tsx`. Keep only the Aan mascot + "ANARIX · AAN / Alerts" title. Drop the now-unused `openCount` / `criticalCount` / `openValueCents` / `totalValueFmt` calculations.

### 3. Professional card-level confirmation ("instant gratification")

Goal: after an approve / reject / delegate / snooze on a row or card, the user sees a mature, subtle success state — no confetti, no bounce.

Implementation:

- **`StackRow.tsx` and `GridCard.tsx`**: when `decision.status !== "open"` (i.e. `in_flight`, `with_aan`, `rejected`, `completed`, `snoozed`), render a **subtle horizontal gradient** using existing semantic tokens:
  - success-flavored: `bg-gradient-to-r from-success/[0.06] via-success/[0.03] to-transparent` + `border-success/25`
  - rejected: `from-destructive/[0.05] via-destructive/[0.02] to-transparent` + `border-destructive/25`
  - snoozed: `from-muted/60 to-transparent`
- Replace the action row on completed items with a small inline confirmation strip:
  - Check icon + one-line status (`"Approved — executing in 28s"`, `"Handed to Aan"`, `"Rejected"`, `"Snoozed until tomorrow"`)
  - Live 30s countdown ring reused from `UndoToast` (extracted into `src/components/actions/CountdownRing.tsx` so both places share it)
  - Inline `Undo` button (calls the existing rollback via a new `useUndoFor(id)` hook that listens to `action-item:undoable` events already dispatched by the store)
  - After 30s the strip fades out and the row keeps the muted "settled" appearance (no removal — items already move to their tab via `filterByTab`).
- Apply the same treatment to the settled state inside `AlertDetailPanel` ("View more"):
  - When the underlying decision transitions from `open`, swap the footer action bar for the same confirmation strip (icon + label + countdown + Undo).
  - After the 30s window elapses, auto-close the sheet (`onOpenChange(false)`).

### 4. Move undo out of sonner toasts

In `src/state/actionsStore.tsx`:
- Remove the `action: { label: "Undo" | "Undo all", … }` options from every `toast.success` / `toast.message` call (`approve`, `reject`, `delegateToAan`, `snooze`, `bulkApprove`, `markTaskCompleted`, `markTaskNotCompleted`, `delegateTaskToAan`, `bulkCompleteBundle`, `answerQuestion`, `skipQuestion`).
- Keep the `publishUndoable(...)` calls — they already drive the on-screen `UndoToast` pill and the new inline card strip.
- Add `publishUndoable` for the four spots that currently only have a sonner `action` (bulk approve, bulk complete bundle, answer question, skip question) so bulk undo is also on-screen.
- Trim the toast copy so it just confirms ("Approved.", "Rejected.", "Snoozed until tomorrow.") — the countdown/undo lives on the card and in the bottom pill only.

### 5. Small housekeeping

- Extract shared countdown ring into `src/components/actions/CountdownRing.tsx` (used by `UndoToast`, `StackRow`, `GridCard`, `AlertDetailPanel`).
- New tiny hook `src/components/actions/useUndoFor.ts` — subscribes to the `action-item:undoable` events and returns `{ active, secondsLeft, undo }` for a given decision id, so the row/card/panel strips stay in sync with the pill without duplicating timers.

### Files touched

- edit `src/pages/Alerts.tsx` (local date state, remove stats block)
- edit `src/components/layout/AppTaskbar.tsx` (optional dateRange override props)
- edit `src/components/actions/StackRow.tsx` (success tint + inline confirmation strip)
- edit `src/components/actions/GridCard.tsx` (same)
- edit `src/components/actions/AlertDetailPanel.tsx` (confirmation strip + auto-close after 30s)
- edit `src/components/actions/UndoToast.tsx` (use shared CountdownRing)
- edit `src/state/actionsStore.tsx` (strip sonner undo actions, add missing publishUndoable calls)
- new `src/components/actions/CountdownRing.tsx`
- new `src/components/actions/useUndoFor.ts`

### Explicitly not changing

- Tabs, filters, sort, bulk bar layout, meeting workspace, data files, action store logic beyond the toast-actions strip.
- The bottom-center `UndoToast` pill stays — it's the global fallback. Only the sonner-embedded Undo buttons are removed.
