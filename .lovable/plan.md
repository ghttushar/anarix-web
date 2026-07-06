## Alerts page redesign — refinements

### 1. Page title & header
- Rename "Aan's day" → **"Alerts"** (with subtitle "What Aan noticed for you today").
- Remove the "Live mode" toggle from the header; move it into Preferences → Edit Alerts section as a switch row ("Live mode — stream new alerts in real-time").

### 2. Layout — reduce empty space, less compact feel
- Drop the `max-w-[820px] mx-auto` constraint. Use a two-column layout:
  - **Left column (main, ~flex-1)**: timeline of alert cards.
  - **Right column (~320px, sticky)**: summary rail — counts by severity, "What's next" (top 3 pending), and a compact "Today's channels" legend (Overnight / Meeting / Live).
- Increase card padding (`px-5 py-4`), zone label width, and font sizes (Insight ~14px, Value/Action ~13px) so cards breathe.
- Add generous section spacing (`space-y-10`) between time buckets.

### 3. Overview cards — inline Accept / Reject
- Restore action buttons directly on the overview card for events in `awaiting_approval` / `detected` / `analyzing` states.
- Footer row of the card: `[ Accept ] [ Reject ]` on the left, `[ View more → ]` on the right.
- Use existing `useAanEvents` handlers (approve/reject).
- Fulfilled / executing / rejected cards keep verification zone only (no buttons).

### 4. Filter tabs — add "Meetings"
- Add a fourth pill: **Meetings** — filters to events whose inferred channel is `meeting`.
- Keep existing: All · Needs approval · Executing · Done · Meetings.
- Order: All, Needs approval, Meetings, Executing, Done.

### 5. Card left-edge severity color — meeting override
- Currently left border uses severity color (destructive/success/muted).
- When channel = `meeting`, override left border and severity dot to **`border-l-primary` / `bg-primary`** regardless of severity, so meeting-derived items are visually distinguishable.
- Pass `channelLabel` and a new `channel` prop into `AanEventCard` for this.

### 6. Hide Floating Action Island on Alerts route
- In `FloatingActionIsland.tsx`, add `/alerts` to the hidden-routes list (alongside existing hidden routes like `/aan`).

### 7. Detail panel — inline chat, no redirect
- Currently "Talk to Aan" input redirects to `/aan?ctx=<eventId>`.
- Replace with an in-panel chat thread rendered inside `ExecutionArtifact`:
  - Chat area above the composer showing user turns + Aan mock replies (local component state; no backend).
  - Composer submits into that local thread; Aan replies with a canned contextual acknowledgement using the event's title/recommendation.
  - Mirrors the pattern of the minimized right-side Aan panel: header, scrollable messages (`flex-1 min-h-0`), sticky composer at bottom.
- Remove the router push to `/aan`.

### 8. Preferences — Live mode toggle
- Add a row in the "Edit Alerts" section of `Preferences.tsx`: Live mode switch, wired to `useAanEvents().liveMode` / `setLiveMode`.

### Files to edit
- `src/pages/Alerts.tsx` — title, layout (2-col), remove toggle, add Meetings tab, pass channel to cards.
- `src/components/aan/autonomous/AanInboxCard.tsx` — inline Accept/Reject, channel-based border color, larger padding/type.
- `src/components/aan/autonomous/ExecutionArtifact.tsx` — inline chat thread replacing redirect.
- `src/features/creative/FloatingActionIsland.tsx` — hide on `/alerts`.
- `src/pages/settings/Preferences.tsx` — add Live mode row in Edit Alerts.

### Out of scope
- No changes to event lifecycle logic, mock data, routing, or the taskbar bell.
- No new palette tokens (reuse `primary`, `destructive`, `success`, `muted`).
