## Goal

Establish a two-way sync model:
- **Flow A (existing):** An Anarix event fires an alert; the alert may also reference a meeting where it was discussed. These belong under **All / Live / Overnight** (never filtered as "Meetings").
- **Flow B (new):** A meeting happens, decisions are made, and a set of action items must be executed inside Anarix. These are the *only* cards that appear under **Meetings**.

## Changes

### 1. Reclassify existing "meeting" seeded events
File: `src/components/aan/autonomous/AanEventsContext.tsx`

- Remove the deterministic `-mtgN` event IDs from the four seeded scenarios (`launch-coverage`, `event-campaign`, `reviews`, `loss-making`) so `hashString(eventId) % 7 === 0` no longer routes them to the "meeting" channel.
- Keep their `meetingRef` intact — the cards still show the "From meeting" chip, but they live under **All / Live / Overnight** based on time.

File: `src/pages/Alerts.tsx`

- Change `inferChannel` so the **meeting channel** is no longer derived from a hash. Instead, a card is `"meeting"` **only** when it is a meeting-originated task (see new event type below).
- No visual/design changes to existing cards. They remain exactly as designed.

### 2. New event type: meeting-originated action bundle
File: `src/data/mockMeetingTasks.ts` (new)

Define a `MeetingTaskBundle` shape:
```ts
{
  bundleId, meetingTitle, meetingWhen, participants[],
  transcriptExcerpt, summary,
  actionItems: [{ id, title, owner, due, detail, status: 'pending'|'approved'|'rejected' }]
}
```

Seed **3 bundles** covering different situations:
- "Staples QBR — 10:00 AM" (5 action items: relist SKU, adjust Prime Day bids, pull competitor pricing memo, prepare inventory forecast, update creative)
- "Weekly Ads Sync — Yesterday 4:00 PM" (3 items)
- "Founder + Agency Review — 2 days ago" (4 items)

File: `src/components/aan/autonomous/AanEventsContext.tsx`

- Add `meetingBundles: MeetingTaskBundle[]` state + `approveMeetingItem`, `rejectMeetingItem`, `approveAllMeetingItems`, `rejectAllMeetingItems` handlers.
- Seed with the 3 bundles above.
- Bundles do NOT enter the `events` array; they are a parallel stream surfaced only in the Meetings tab.

### 3. Meetings tab renders bundle cards
File: `src/pages/Alerts.tsx`

- When `filter === "meetings"`, render `<MeetingBundleCard />` list instead of `AanEventCard`.
- Meeting bundle count = sum of bundles with at least one `pending` item.
- The Meetings tab pill count reflects pending bundles only.
- "All" tab does **not** include bundles (keeps existing card semantics clean); bundles live under Meetings only. (Confirmed: this matches the "solely coming from a meeting" phrasing.)

### 4. New card: `MeetingBundleCard` (overview)
File: `src/components/aan/autonomous/MeetingBundleCard.tsx` (new)

Overview card layout (consistent with existing `AanInboxCard` visual language):
- Header row: meeting icon + **meeting title** + timestamp chip
- Sub-row: participant avatars (initials chips, max 4 + "+N") + duration
- Body: 2-3 line **summary** (italic muted)
- Meta strip: `N action items · M pending`
- Footer buttons: **Approve all** (primary), **Reject all** (ghost), **View more** (link)
- Uses same border/spacing tokens as `AanInboxCard`.

### 5. Meeting bundle detail: reuse artifact template
File: `src/components/aan/autonomous/MeetingBundleArtifact.tsx` (new, mirrors `ExecutionArtifact` structure)

Right-side panel sections (using the existing `SectionHeader` primitive for consistency):
- **Meeting** — title, when, duration, participants (full list with roles)
- **Summary** — 4-6 sentence brief
- **Transcript excerpt** — scrollable monospace-ish block (mock 15-20 lines)
- **Action items** — each rendered as an independent row with:
  - Title + owner + due chip
  - 2-line detail
  - Per-item **Approve** / **Reject** buttons (disabled once acted)
  - Status pill once resolved
- Sticky footer: **Approve all pending** / **Reject all pending** / Close

### 6. Wiring
- `Alerts.tsx` imports the new card + artifact, opens artifact via `setDetailFor` equivalent for bundles (separate state `bundleDetailFor`).
- All state is client-only, in `AanEventsContext`. No backend, no schema changes.

## Out of scope
- No changes to existing `AanInboxCard` design, `ExecutionArtifact` design, Preferences, or any e-commerce alert data.
- No changes to routing, contexts other than `AanEventsContext`, or backend.

## Files touched
- New: `src/data/mockMeetingTasks.ts`, `src/components/aan/autonomous/MeetingBundleCard.tsx`, `src/components/aan/autonomous/MeetingBundleArtifact.tsx`
- Edited: `src/components/aan/autonomous/AanEventsContext.tsx`, `src/pages/Alerts.tsx`
