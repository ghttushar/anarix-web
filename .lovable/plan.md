
## Goal
Rebuild the `/alerts` experience into a clean **Signals** page matching the attached PDF, reduce cognitive load, ship a global Signals widget on every screen, and eliminate the Emergent/Lovable config mismatch so the Lovable preview reflects current code.

## 1. Fix preview / config drift (Emergent ↔ Lovable)
- Consolidate to a single Vite/React toolchain owned by Lovable:
  - Keep `frontend/` as the app root (already the case).
  - Delete any Emergent-only build wrappers (`.emergent/*` cron/webhook scripts referenced in the tree) from build path; retain repo files but don't invoke them.
  - Root `/dev-server/package.json` + `lovable.toml` proxy already forwards to `frontend/` — verify `dev`, `build`, `build:dev` all `cd frontend && bun run <script>` and that `frontend/bun.lock` is the source of truth (remove stray root `bun.lock` if it reappears).
  - Ensure `frontend/vite.config.ts` `server.port = 8080`, `host: "::"` (Lovable preview requirement).
- Result: what you see in Lovable preview = what's in the repo.

## 2. Rename Alerts → Signals (finish the pass)
- Any remaining "Alerts"/"alerts" user-visible strings → "Signals"/"signals" (sidebar, taskbar, empty states, tooltips, toasts, breadcrumbs, page titles, meta tags).
- Route paths stay `/alerts/*` (no behavior change, avoids breaking links); add an internal alias `/signals` → redirect to `/alerts` for future migration.
- File/variable names stay as-is to keep the diff small.

## 3. Signals page layout (matches PDF)
### Remove
- Top app-level metric bar (the KPI strip above the tabs) is deleted — greeting header keeps the 4 inline stat chips (Opportunity Open / Revenue Protected / Aan Running / Opportunities Today) exactly as PDF page 3 shows them, but no separate metric bar.
- Ambient background gradients dimmed further; wasted bottom whitespace collapsed (remove `pb-16`/oversized paddings on the queue container so content ends where content ends).

### Left column — category navigation
Replace the current always-expanded stacked sections with a **sticky category rail + collapsible sections**:
- Sticky vertical rail at left of the queue (PDF page 9/10) listing categories with counts:
  - Advertising 20, Inventory 5, Profitability 6, Customer Service 5, Buyer/Accounts 3, Retail Listings 11, Pending This Week 45.
- Clicking a rail item scroll-spies + expands that section; all sections **collapsed by default**, showing only the header row (title + count + chevron + aggregate impact).
- Expanding one section auto-collapses others (accordion mode) to prevent long scroll.
- Category headers keep icon + count pill; body renders decision rows lazily.

### Tabs
- `All 50 | From Meetings 12 | FYI 5 | Done 8` — keep as-is (PDF matches current tabs). Slim visual style.

### "From Meetings" tab — restructure
Currently shows each **signal derived from a meeting**. Change to show each **meeting as a card** (PDF page 2):
- Each row = one meeting bundle: title, timestamp, attendees, aggregate impact ($X across N signals).
- Clicking a meeting card opens the right pane in `MeetingReviewView` mode (already exists) listing all alerts from that meeting.
- Grouping key = `decision.meetingRef.bundleId`.

### Right column (Review Workspace)
- Keep the 3-page carousel (Summary / Details / Metrics).
- On Details: **Choose your strategy** section stays promoted at top with count hint, recommended badge, ring on selected — already implemented; verify visuals match PDF pages 1 & 8 (radio-style cards, value chip + confidence + risk + reversibility + ETA on one meta line).
- Footer CTA: `Execute: {strategy title}` + Modify / Assign / Reject / Snooze / Share (matches PDF).

## 4. Global Signals widget (floating, all screens)
- Remove Signals/Alerts entry from the Floating Action Island.
- Add a new **`SignalsWidget`** component mounted in `App.tsx` inside the authenticated shell so it renders on every route:
  - Small pill anchored bottom-right (above island), shows unread-signal count + top severity color.
  - Hover/click → compact popover listing top 5 pending signals grouped by category, with "Open Signals" button that routes to `/alerts`.
  - Uses the same `useActionsStore` selectors as the Signals page.
  - Respects mobile viewport (hide on `/mobile/*`, existing bottom bar carries it).

## 5. Cleanup
- Delete unused `GridBody` / `ViewSwitcher` remnants and the `/alerts/grid` route; `/alerts` and `/alerts/stack` render the stack layout (grid abandoned).
- Remove the `AlertDetailPanel` legacy path if superseded by `ReviewWorkspace`.
- Update memory: add note that Signals page uses accordion category sections + sticky rail; global SignalsWidget replaces Floating Island alerts entry.

## Files touched
- `frontend/src/pages/Alerts.tsx` — remove metric bar, add sticky `CategoryRail`, accordion sections, meeting-card renderer for From Meetings tab, tighten paddings.
- `frontend/src/components/actions/CategoryRail.tsx` *(new)* — sticky nav with counts + scroll-spy.
- `frontend/src/components/actions/CategorySection.tsx` — collapsed-by-default, accordion behavior.
- `frontend/src/components/actions/MeetingCard.tsx` *(new)* — row card per meeting bundle.
- `frontend/src/components/actions/GreetingHeader.tsx` — keep inline stat chips; drop external metric bar.
- `frontend/src/components/widgets/SignalsWidget.tsx` *(new)* — global floating widget.
- `frontend/src/App.tsx` — mount `SignalsWidget`; register `/signals` alias.
- `frontend/src/features/creative/FloatingActionIsland.tsx` — remove Signals/Alerts button.
- `frontend/src/components/layout/AppTaskbar.tsx` + sidebar — final "Signals" rename sweep.
- `frontend/vite.config.ts` — verify port/host.
- Delete: legacy `ViewSwitcher`/grid remnants if still present.

## Out of scope
- Route rename `/alerts` → `/signals` (labels only; deep links preserved).
- Backend/data changes; all mock-data driven.
- Mobile-view redesign (existing mobile shell untouched aside from label sweep).
