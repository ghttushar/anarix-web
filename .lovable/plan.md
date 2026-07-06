
## Goals

1. **Taskbar utility cluster is conditional** — only show Insights + island-mirrored actions in `AppTaskbar` when the Floating Action Island is hidden. When the island is visible, the taskbar goes back to its prior minimal state (no duplication).
2. **Alerts / Notifications get a full-screen route** — replace the small right-side sheet with a dedicated page.
3. **Condense the Aan Feed timeline** — drop low-signal "scanning / monitoring" chatter, keep only material events.

---

## 1. Conditional taskbar cluster

- Read Floating Action Island visibility from the same source the island itself uses (context/preference flag — currently checked in `FloatingActionIsland` mount logic).
- In `AppTaskbar.tsx`, wrap the new utility cluster (Insights, Aan Inbox w/ badge, Ask Aan, Refresh, Alerts) in `{islandHidden && (...)}`.
- Keep the badge count wiring intact so when the island returns, no state is lost.
- No visual redesign of the cluster itself — only its mount condition changes.

## 2. Alerts as a full-screen route

- New route: `/alerts` (and `/panels/alerts` already exists for the panel form — keep it for Figma export).
- New page `src/pages/Alerts.tsx` rendered inside `AppLayout`:
  - Full-width, two-column layout: left = filter rail (Severity, Source, Time, Marketplace, Status), right = alerts list with grouping by day.
  - Row actions: Acknowledge, Snooze, Open related artifact, Assign.
  - Uses existing alerts data source (System Alerts from Floating Action Island bell).
- Bell icon in Floating Action Island and Alerts button in taskbar both `navigate('/alerts')` instead of opening the right-side sheet.
- Remove the small right-side Alerts sheet trigger from in-app surfaces (keep the component file for `/panels/alerts` standalone route only).

## 3. Condense Aan Feed timeline

Current feed (`src/pages/aan/Feed.tsx` + `mockAanFeed.ts`) includes low-signal entries like "Scanning campaign X", "Monitoring keyword Y", "Refreshed metrics". These add noise.

Rules for what stays vs. drops:

| Keep | Drop |
|---|---|
| Executed action (with impact) | "Scanning ..." |
| Needs approval | "Monitoring ..." |
| Anomaly / threshold breach | "Refreshed metrics" |
| Morning briefing | "Heartbeat / still watching" |
| Meeting action item | Passive status pings |
| Policy change | Duplicate consecutive scans |

Changes:
- Filter `mockAanFeed` items by an `importance` field (`material` vs `ambient`); only `material` renders in the main timeline.
- Add a small collapsed footer: "N ambient events hidden — Show activity log" that expands the noisy items on demand (progressive disclosure, matches the Inbox pattern).
- Tighten row density: single-line title + one-line context, timestamp right-aligned; secondary metadata behind hover/expand.

## Files

- `src/components/layout/AppTaskbar.tsx` — gate utility cluster on island-hidden.
- `src/features/creative/FloatingActionIsland.tsx` — bell → `navigate('/alerts')`.
- `src/pages/Alerts.tsx` (new) — full-screen alerts page.
- `src/App.tsx` — register `/alerts` route.
- `src/pages/aan/Feed.tsx` — filter + progressive disclosure for ambient events.
- `src/data/mockAanFeed.ts` — add `importance` field; mark scanning/monitoring as `ambient`.

## Out of scope

- No changes to Aan Inbox layout, Morning Briefing, or Execution Artifact.
- No changes to `/panels/*` routes (Alerts panel remains for Figma export only).
- No data model changes beyond the `importance` tag.
