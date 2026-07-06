## Fix Alerts channel mix + replace right rail with tabs

### 1. Fix channel distribution in `src/pages/Alerts.tsx`
Current `inferChannel` marks every 5th event as `meeting` and everything else as `live` (nothing is `overnight`). Rewrite so the mix reflects reality:

- **Overnight**: events with `createdAt` hour `< 8` OR older than ~10h → `overnight` (morning brief).
- **Meeting**: a small, stable subset (e.g. `eventId` hash `% 7 === 0`) → `meeting`.
- **Live**: everything else created during the working day → `live`.

Result: a natural mix of morning brief items, live intraday items, and a few meeting-sourced items. Meeting-blue left edge stays limited to actual meeting items.

### 2. Remove the right summary rail
Delete the entire `<aside>` block (Today at a glance / Up next / Channels) and switch the layout back to a single-column timeline:

- Grid `lg:grid-cols-[1fr_320px]` → single column, centered with existing `max-w-[1400px]`.
- Remove the `Stat` helper and `CHANNEL_LEGEND` / `upNext` computations that are no longer used.

### 3. Promote rail content to top-level tabs
Extend the existing filter pill row into a proper tab set. Keep the current lifecycle filters and add channel/summary tabs:

Tabs (in order):
1. **All**
2. **Needs approval** (existing)
3. **Overnight** — channel = overnight (morning brief)
4. **Meetings** — channel = meeting (existing, relabeled position)
5. **Live** — channel = live
6. **Executing** (existing)
7. **Done** (existing)

Each tab shows its count. Filtering logic extended in the same `filtered` `useMemo` to branch on channel for the three new channel tabs.

No other files touched. No changes to card design, lifecycle, chat panel, or preferences.

### Technical notes
- `inferChannel` becomes deterministic on `eventId` + `createdAt` so the mix is stable across renders.
- `Stat`, `CHANNEL_LEGEND`, `upNext` are removed to keep the file clean per the "delete unused code" rule.
- Filter pill styling stays; only the tab list grows.
