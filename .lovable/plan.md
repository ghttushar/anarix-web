
## Goals

1. Always show at least one alert per **channel** (Overnight, Meeting, Live) and per **severity/situation** so the demo never has empty tabs.
2. Attach richer **meeting context** (source meeting, attendees, owners, action items, callouts, tags, notes) to a subset of alerts.
3. Redesign the **card** so Insight and Value sit side-by-side, and rebuild the **View more** panel as a single consistent template across every alert.
4. Rebuild **Edit Alerts** in Preferences: list every alert category with on/off toggles.
5. In **How Aan decides**, add a "Connect a workspace" section with Google Workspace, Microsoft Teams, Slack, Gmail, Calendar, etc., each with a Connect button.

All work is presentation-only mock data. No backend, no schema changes.

---

## 1. Scenario data — guarantee coverage + add meeting refs

**Edit `src/data/mockAanScenarios.ts`**

Extend `ScenarioTemplate` with optional fields (all optional so existing scenarios stay valid):

```ts
tags?: string[];                      // e.g. ["Prime Day", "Hero SKU", "Pricing"]
meetingRef?: {
  title: string;                      // "Staples Review — 10:00 AM"
  when: string;                       // "Today · Ended 47m ago"
  attendees: string[];                // ["Dorothy", "Mike", "You", "Aan"]
  decisions: string[];                // 1–3 bullets
  actionItems: { owner: string; due: string; task: string; done?: boolean }[];
  callouts: string[];                 // 1–2 quoted callouts
  notes?: string;                     // freeform 1–2 sentence recap
};
```

Add `tags` to all 10 scenarios (2–4 tags each drawn from domain vocabulary).

Populate `meetingRef` on **4** scenarios so meeting-channel cards always have real context:
- `launch-coverage` → Mount-It launch sync
- `event-campaign` → Prime Day planning
- `reviews` → Monday QBR — Retail Sync
- `loss-making` → Walmart P&L review

**Edit `src/components/aan/autonomous/AanEventsContext.tsx`** (`seedEvents`)

Ensure the seed always contains **at least one event per channel and per severity/situation**:
- Overnight critical: `buybox`, `suppression` (both created before 8 AM local)
- Overnight opportunity: `daypart` (fulfilled)
- Meeting critical: `launch-coverage` (created with a timestamp whose hash % 7 === 0 to match `inferChannel`)
- Meeting opportunity: `event-campaign` (same hash rule)
- Meeting fyi: `reviews`
- Live critical: `loss-making`
- Live opportunity: `keyword-promotion`, `placement-opt`
- Live fyi: `budget-optimization` (fulfilled)

Since `inferChannel` uses `hashString(eventId) % 7 === 0` for meeting, use fixed IDs for the four meeting seeds that satisfy the hash (e.g. `evt-launch-coverage-mtg`, `evt-event-campaign-mtg`, etc., picked by loop-verifying the hash in a small helper at seed time). Fall back to timestamp-based nudge if needed.

---

## 2. Card redesign — Insight | Value side-by-side + tags + meeting chip

**Edit `src/components/aan/autonomous/AanInboxCard.tsx`**

Layout change:
- Meta strip (unchanged).
- New **two-column body** using `grid grid-cols-[1fr_auto] gap-3` (collapses to stacked on `< 480px`):
  - **Left = Insight**: title (`text-[15px] font-semibold`), subtitle (`text-[12px] muted line-clamp-2`).
  - **Right = Value** (the anchor): the highlighted band from the current design, but as a fixed-width right column (`min-w-[180px] max-w-[220px]`) so it aligns visibly next to the insight.
- **Tags row**: `flex flex-wrap gap-1` under the two columns; each tag `text-[10px] rounded bg-muted px-1.5 py-0.5 text-foreground/70`.
- **Meeting chip** (only when `event.scenario.meetingRef`): a compact one-liner under tags:
  `Video icon · "From: Staples Review — 10:00 AM · 4 action items"` (link-styled `text-[11px] text-primary`, opens details panel scrolled to Meeting section).
- **Action** row and **footer** buttons unchanged.

No changes to `Alerts.tsx` groupings.

---

## 3. View more — unified consistent template

**Rewrite `src/components/aan/autonomous/ExecutionArtifact.tsx`** section stack so every alert renders the exact same ordered sections. Missing data collapses gracefully (section hidden), but the order and headings are identical:

1. **Header** — title, marketplace, confidence, tags (chips), severity dot. Icons for Edit/Close (unchanged).
2. **Snapshot** — one-line `s.impact` displayed as a hero value strip (mirrors the card's Value band) so users land on the payoff first.
3. **Insight** — `s.signal` + evidence rows + sources chips (as today).
4. **Reasoning** — bullet list from `s.reasoning`.
5. **From meeting** *(new, conditional on `meetingRef`)* — compact card with:
   - Meeting title + when
   - Attendees row (avatars/initials)
   - Decisions (bullets)
   - Action items (owner · due · task, with checkmark if `done`)
   - Callouts (italic quotes)
   - Freeform notes
6. **Workspace context** — the existing `workspaceContext` slack/email quote block (kept for non-meeting sources).
7. **Recommendation & controls** — recommendation text, editable input, Approve/Reject buttons (as today).
8. **Execution** — steps list (as today).
9. **Verification** — before/after diff + share row + audit log (as today).
10. **Talk to Aan** — inline chat composer (as today).

Every section uses the same `SectionHeader` primitive with the same spacing (`space-y-5`), same border/padding treatment, so all alerts look consistent regardless of which fields are populated.

---

## 4. Edit Alerts — full category list with on/off

**Edit `src/pages/settings/Preferences.tsx`** in the `#edit-alerts` section.

Add above the existing policies list a new subsection **"Alert categories"**:
- Local state `categoryPrefs: Record<string, boolean>` persisted to `localStorage` under `anarix-alert-categories`.
- Categories (each = row with icon, label, description, `Switch`):
  - Buy Box changes
  - Listing suppressions & compliance
  - Budget pacing & spend
  - Keyword promotion & harvesting
  - Placement optimization
  - Day parting & schedules
  - Launch coverage
  - Loss-making SKUs / margin
  - Review & rating trends
  - Event campaigns (Prime Day, BF, etc.)
  - Meeting-derived action items
  - Morning briefing (overnight)
- Rendered as a grid of cards inside a bordered container. Toggling only mutates local state (mock behavior); no side-effects on the events stream.

Keep the existing policies list ("How Aan can act without asking") beneath it as-is.

---

## 5. How Aan decides — Connect a workspace

**Same file**, extend the collapsible **How Aan decides** panel with a new subsection **"Connect a workspace"** below the existing "Connected systems" grid.

- Grid of connector tiles: **Google Workspace, Gmail, Google Calendar, Microsoft Teams, Slack, Zoom, Notion, Linear, Outlook, 7thGear**.
- Each tile:
  - Icon (`lucide-react` fallback: `Mail`, `Video`, `MessageSquare`, `Calendar`, etc. — no new logo assets).
  - Name.
  - Small "Connected" / "Not connected" status derived from a local `connectedWorkspaces` state (defaults: Slack, Gmail, Google Calendar connected; rest not).
  - Right-aligned button: `Connect` (or `Manage` if connected). Both are mock — clicking toggles the local state and fires a `toast.success("Connected <name> (mock)")`.
- Persist to `localStorage` under `anarix-connected-workspaces`.

No changes to `CONNECTED_SYSTEMS` data source; the new grid is a UI-only addition.

---

## Technical notes

- All new state is client-side only (`useState` + `localStorage`). No context changes, no supabase, no new routes.
- No changes to `AanEventsContext` interface or `Alerts.tsx` logic other than the seed events.
- Meeting rendering primitives live inline in `ExecutionArtifact.tsx` — no new component files unless the meeting block exceeds ~60 lines, in which case extract `MeetingBlock.tsx` under `src/components/aan/autonomous/`.
- Card column collapse handled with Tailwind: on narrow containers stack via `md:grid md:grid-cols-[1fr_auto]`.

## Out of scope

- No changes to Alerts filtering, tabs, or timeline structure.
- No real OAuth flows — Connect buttons are mock toggles.
- No changes to routing, contexts, or mobile view.
