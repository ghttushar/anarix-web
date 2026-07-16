## Signals page cleanup + FAI/Signals widget + Execute→Undo + Live-mode filter

Scope: `/alerts` page and Floating Action Island only. No data/schema changes beyond swapping mock decisions when Live mode is off.

### 1. Remove duplicated "Categories" (heading shown twice)

`CategorySection.tsx`
- Drop the section header row (chevron + icon + label + count pill) entirely. Keep only the panel body; sections become always‑expanded. Category label already lives in the left rail, so the header is redundant.
- Remove the `open/onToggle/defaultOpen/aggregate` props from the render path (keep prop signature but no‑op) so `Alerts.tsx` callers keep compiling.

`Alerts.tsx`
- Remove the accordion behaviour: `openCategory` state, `handleRailSelect` collapse toggle, `useEffect` reset on tab change. Rail click just scrolls the section into view (already keyed via `sectionRefs`).
- Remove the redundant page heading duplication is not present in code — only the section header is duplicated, already handled above.

### 2. Remove Compact/Comfortable density toggle

`AlertsToolbar.tsx`
- Delete the density segmented control and its props.

`Alerts.tsx`
- Remove `density` state, `usePersistedState("alerts:density", …)`, the `text-[13px]` class hook, and the two props passed to `AlertsToolbar`.

### 3. Remove app‑level utility cluster on `/alerts`, restore Signals to FAI

`AppTaskbar.tsx`
- Add an optional `hideUtilityCluster?: boolean` prop; when true skip the entire `{islandOff && (…)}` right‑side cluster.
- Keep the cluster elsewhere unchanged. Signals (Bell) inside that cluster continues to represent the Signals widget when FAI is off, matching the user's rule.

`Alerts.tsx`
- Pass `hideUtilityCluster` to `<AppTaskbar />`.

`FloatingActionIsland.tsx`
- Reintroduce a Signals action (Bell + `aanPendingCount` badge, `highlight` when `aanCriticalCount > 0`, click → `navigate("/alerts")`). Insert it at the top of `appActions` so it renders on every non‑website route.
- Remove the `void aanPendingCount; void aanCriticalCount;` no‑op.

`SignalsWidget.tsx` + `App.tsx`
- Delete the standalone `<SignalsWidget />` mount from `App.tsx` and the file itself. Signals now lives in FAI (when FAI is on) and in the AppTaskbar utility cluster (when FAI is off) — no third surface.

### 4. Execute → Undo with 5 s countdown + auto‑close

`ReviewWorkspace.tsx`
- Add local state: `executed: { strategyTitle: string; verifyMsg: string } | null` and `countdown: number`.
- On `onExecute()`: run current logic (`approve/delegate/snooze`), then set `executed` and start a 5 s interval that decrements `countdown`; at 0 call `onClose()`.
- Replace the Execute button (same wrapper, same position, same size) with an Undo card while `executed` is set:
  - Line 1 (success): `✓ Executed: {strategy title}`
  - Line 2 (verification, muted 12 px): e.g. "Change applied. Verifying downstream metrics…"
  - Right side: circular ring showing `countdown`s + an `Undo` ghost button that clears `executed`, cancels the interval, and calls the store's `rollback` via the existing `publishUndoable` toast (call `useActionsStore().rollbackLast?.(id)` — since we don't have a public rollback, trigger via a new lightweight approach: emit a custom event that the store already registers on `publishUndoable` undo — simplest: call the store action's inverse; use `snooze("1h")` → no. Instead, expose `rollback(id)` from `actionsStore.tsx` in the returned value and consume it here).
- Disable the surrounding footer actions (Modify/Assign/Reject/Snooze/Share) while `executed` is set to prevent conflicting input.

`actionsStore.tsx`
- Export `rollback(id: string)` on the store (it already exists internally); just add to the interface + `value` object so the review card can call it.

### 5. Right column scroll fix

`Alerts.tsx`
- Right column wrapper currently is `flex flex-col max-h-[calc(100vh-220px)] sticky top-4`; the child `ReviewWorkspace` is `flex flex-col flex-1 min-h-0 …`. Sticky + max-h prevents proper inner scroll. Change to `h-[calc(100vh-140px)] sticky top-4 min-h-0` and ensure the `ScrollArea` inside ReviewWorkspace already uses `flex-1 min-h-0` (it does). This gives ReviewWorkspace a real bounded height so its internal ScrollArea takes over.

### 6. Live/Assisted toggle: filter mock alerts

New `frontend/src/data/criticalOnlyDecision.ts`
- Export a single `Decision` matching the ASIN B0CSH8TCC6 spec from the message (title, insightDetail, value $6,885 at_risk/7d, valueInputs = the 4 evidence lines, valueBasis paragraph, three strategies via a targeted override in `strategiesFor` — see below).

`Alerts.tsx`
- Read `liveMode` from `useAanEvents()` inside `AlertsInner`.
- When `liveMode` is `false`, replace the working decision list with `[CRITICAL_ONLY]` before `filterByTab`. When `true`, use `decisions` as today.

`strategies.ts`
- If `d.id === "critical-b0csh8tcc6"`, return exactly three strategies:
  1. `approve` — "Approve Recommendations" (recommended). Runs the existing approve path.
  2. `notify-vm` — "Notify Vendor Manager".
  3. `draft-ticket` — "Draft Amazon Support Ticket".

`ReviewWorkspace.tsx`
- When the selected strategy id ends in `:notify-vm` or `:draft-ticket`, do NOT call approve/delegate/snooze on Execute. Instead:
  - Open Aan Copilot (left‑side panel) via `useAan().openCopilot()`.
  - Seed the composer with a canned prompt: for `notify-vm` — "Draft an email to the Vendor Manager about ASIN B0CSH8TCC6 losing advertising eligibility…"; for `draft-ticket` — "Draft an Amazon support ticket disputing the eligibility loss on ASIN B0CSH8TCC6…".
  - Aan replies with a canned mock draft (email or ticket) rendered as the assistant message.
  - Still trigger the executed/Undo card in the review panel so the user sees confirmation + 5 s auto‑close.

Requires a small helper in `AanContext` (or the existing openCopilot signature) to accept an optional `seedPrompt` and `seedResponse`; if such a hook doesn't exist we add it (2–3 lines).

### 7. Layout consistency (no shrinking cards, no crowding)

`DecisionValueCard`
- Add `min-h-[140px]` and consistent internal padding so cards keep height with sparse data.

`DailyBriefing` and the right column
- Give the right container a fixed `h-[calc(100vh-140px)]` so switching between DailyBriefing / MeetingReviewView / ReviewWorkspace doesn't cause vertical jitter.

Typography/spacing sweep in the touched files only: 14 px body min, generous line‑height (already `leading-relaxed`), no additional micro‑copy added.

### Files touched

Edited: `frontend/src/pages/Alerts.tsx`, `frontend/src/components/actions/AlertsToolbar.tsx`, `frontend/src/components/actions/CategorySection.tsx`, `frontend/src/components/actions/ReviewWorkspace.tsx`, `frontend/src/components/actions/DecisionValueCard.tsx`, `frontend/src/components/layout/AppTaskbar.tsx`, `frontend/src/features/creative/FloatingActionIsland.tsx`, `frontend/src/state/actionsStore.tsx`, `frontend/src/lib/decisions/strategies.ts`, `frontend/src/App.tsx`, `frontend/src/components/aan/AanContext.tsx` (seed prompt param — if not present).

Created: `frontend/src/data/criticalOnlyDecision.ts`.

Deleted: `frontend/src/components/widgets/SignalsWidget.tsx`.

### Out of scope

Backend/data schema, other pages (Dashboard, Profitability, etc.), mobile shell, autonomy‑mode display in `AanEventsContext`.
