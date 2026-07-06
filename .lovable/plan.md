
# Aan Alerts Redesign — Insight · Value · Action · Verification

Reshape how Aan events are surfaced everywhere so the overview is signal-only, and detail is opt-in.

## 1. New card model (single source of truth)

Every event card renders exactly four zones, in order, matching the Cara AI reference:

```text
[● severity dot]  INSIGHT       Campaign SP | Bamboo Queen at 90% budget by 2 PM
                  VALUE         +$180 projected sales in remaining 4h peak window
                  ACTION        Increase daily budget by $45
                  ─────────────────────────────
                                                       [ View more → ]
```

After approval/execution the same card swaps ACTION for:

```text
                  VERIFICATION  Budget raised from $150 → $195 · 8:12 AM · Successful
```

Rules for the card:
- No Accept / Reject / Approve buttons on the overview card. Only `View more →`.
- No "confidence %", no marketplace chip, no impact pill, no source tags, no step list — those move to the panel.
- Only four labels shown, in `text-[9px] uppercase tracking-wider text-muted-foreground`, one line per zone, `line-clamp-2`.
- Severity is one 6px dot + a subtle left border colored by severity. No background gradients.
- Verification zone uses `text-success` for the field label only; body stays neutral.

Component: rewrite `src/components/aan/autonomous/AanInboxCard.tsx` as `AanEventCard` with these four zones (drop lifecycle-specific execution UI from the overview).

## 2. Detail panel = the workbench

Keep the existing right-side `ExecutionArtifact` panel, opened via `View more`. Additions:
- Add a "Talk to Aan about this event" composer at the bottom of the panel (single-line input + send). On submit it opens `/aan?ctx=<eventId>` seeded with the event context (mock, no backend).
- Move all Approve / Reject / Modify / Undo buttons into this panel only.
- Replace the "Set as policy" text button with a **small pencil icon** (`Pencil`, `h-3.5 w-3.5`) placed inline next to the event title in the panel header (right side, before the close X). Tooltip: "Edit alert rule". Click → `navigate("/settings/preferences#edit-alerts")` (deep-link to the Edit Alerts section, replacing the old `/aan/policies`).

## 3. Alerts page = Aan's day timeline

Rewrite `src/pages/Alerts.tsx` so the primary surface is a chronological timeline of *material* events only. Remove Morning Briefing card, Meeting Actions card, "Watching" section, "briefing"/"meeting"/"listened"/"monitoring" entries.

Kept domains: **Budget, Inventory, Profitability, Advertising, Listing/Retail**.

Layout:

```text
┌─ Alerts ────────────────────────────────────────────────┐
│  [ Needs approval · 3 ]  [ Executing · 1 ]  [ Done · 6 ]│  ← quiet filter pills
│                                                          │
│  Today                                                   │
│  ├─ 08:12  ● Budget          [card]  View more →         │
│  ├─ 09:40  ● Inventory       [card]  View more →         │
│  ├─ 11:05  ● Advertising     [card]  View more →         │
│                                                          │
│  Earlier                                                 │
│  ├─ Yesterday 4:20 PM  ● Profitability [card]            │
└──────────────────────────────────────────────────────────┘
```

- Single centered column (`max-w-[820px]`), timeline rail on the left.
- Events grouped by time bucket (`Today` / `Yesterday` / `Earlier this week`), not by lifecycle. Lifecycle is expressed by the pills at top which just filter the same list.
- Right-side detail panel slides in when `View more` is clicked (unchanged behavior).

### Segregating "channels" without tabs

To keep morning-brief items, last-meeting items, and events happening through the day distinguishable without splitting into tabs, each row gets a small left-aligned **channel chip** before the domain:

- `Overnight` — anything Aan surfaced from the morning briefing window (00:00–08:00)
- `From meeting` — items captured from the last meeting
- `Live` — anything detected during the working day

Chips are 10px uppercase, muted background, no borders. They read like a natural sentence prefix (`Overnight · Budget` / `From meeting · Advertising` / `Live · Inventory`) so it's one unified stream visually, but the eye can scan by channel. No separate lists, no extra tab.

## 4. Aan Feed cleanup

In `src/pages/aan/Feed.tsx`:
- Delete the `Connected Systems` aside.
- Delete the `How Aan works` aside.
- Drop the right column entirely — timeline becomes full-width.
- Move the "connected systems" list and the "how Aan works" copy into the new Edit Alerts page (§5) as a collapsible "How Aan decides" section, so nothing is lost.

## 5. Automation Policies → Preferences › Edit Alerts

- Add an **Edit Alerts** section to `src/pages/settings/Preferences.tsx` (anchor `#edit-alerts`).
- Port the contents of `src/pages/aan/Policies.tsx` into that section: per-scenario auto-approve toggle, thresholds, quiet hours.
- Append the moved "Connected Systems" list + "How Aan decides" copy at the bottom of the same section.
- `src/pages/aan/Policies.tsx` becomes a thin redirect to `/settings/preferences#edit-alerts` (keeps old links alive) and is unlinked from the sidebar / breadcrumbs.
- Update every existing reference (`/aan/policies` in Feed, taskbar, FloatingActionIsland) to point at `/settings/preferences#edit-alerts`.

## 6. Mock data trim

`src/data/mockAanScenarios.ts`: keep the campaign / retail / profitability / inventory scenarios; drop the `briefing` and `workspace` domains from what feeds the Alerts timeline (still available for the Aan chat page if referenced there).

`src/data/mockAanFeed.ts`: filter out `briefing`, `listened`, `attended`, `captured` when composing the Alerts timeline (Feed page can still show them since it's the raw activity log).

## Technical notes

- Files rewritten: `AanInboxCard.tsx` (renamed conceptually to event card), `Alerts.tsx`, `ExecutionArtifact.tsx` (add composer + pencil button, drop "Set as policy" button), `Feed.tsx` (drop asides), `Preferences.tsx` (new Edit Alerts section), `Policies.tsx` (redirect).
- No new routes. `#edit-alerts` anchor + `scrollIntoView` on mount when hash matches.
- No backend changes. All state stays in `AanEventsContext`.
- Typography and severity colors continue to use existing tokens (`--destructive`, `--success`, `--warning`, `--primary`). No new palette.
- Preserve `useAanEvents` API surface; only presentation changes.

## Explicitly out of scope

- No new tabs for briefing / meeting / live — handled by channel chips per row.
- No changes to the AppTaskbar bell or Floating Action Island entry points (already point at `/alerts`).
- No changes to underlying scenario lifecycles or approval logic.
