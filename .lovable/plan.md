# Action Items — Cosmetic & UX Overhaul

Rename, re-voice, and redesign the Alerts surface. No new modules. All client-only.

## 1. Rename & re-voice (Aan speaks in first person as an employee)

- Route + nav label: `Alerts` → `Action Items` (update `src/pages/Alerts.tsx` header, `AppTaskbar` breadcrumb, sidebar entry, any nav registry). Keep route path `/alerts` to avoid breaking links — only labels change.
- Header rewrite:
  - Replace `"What Aan noticed for you"` + the `7 awaiting approval · 3 critical · 2 completed` line with a **personal greeting from Aan**:
    - Line 1 (small caps eyebrow): `AAN · ACTION ITEMS`
    - Line 2 (H1): `"Hi Tushar — here's what I'm watching."`
    - Line 3 (muted, one sentence, first person): `"I'm keeping an eye on your marketplaces and meetings in the background. These need a decision from you."`
  - Remove the raw pending/critical/completed count line entirely.
- Convert all Aan-authored copy across cards, artifacts, toasts, and chat replies to first person: `I noticed…`, `I recommend…`, `I paused this…`, `I'll report back once done.` (Sweep: `AanInboxCard.tsx`, `ExecutionArtifact.tsx`, `MeetingBundleCard.tsx`, `MeetingBundleArtifact.tsx`, `AanEventsContext` toast strings.)

## 2. Tab renames

Keep the concepts, change the words:

| Old | New |
|---|---|
| All | Everything |
| Needs approval | Waiting on you |
| Overnight | Morning brief |
| Meetings | From meetings |
| Live | As it happens |
| Executing | I'm on it |
| Done | Wrapped up |

## 3. Sorting

Add a small sort control (segmented buttons, right-aligned above the timeline) with three options: **Latest**, **High value**, **Critical**.
- Latest = current `updatedAt desc`.
- High value = sort by projected impact — parse the numeric magnitude from `scenario.impact` (regex `/([\d,.]+)/`) as a rough proxy; fall back to `updatedAt`.
- Critical = severity `critical` first, then `warning`, then rest; break ties by `updatedAt`.

## 4. Approve / Reject with 30-second Undo

- In `AanEventsContext`, wrap `approve` and `reject` so the state change is applied immediately (optimistic) but a 30s window allows revert. Show a Sonner toast with an `Undo` action button and a visual countdown (using toast `duration: 30000`).
- Track a `pendingActionTimer` map keyed by `eventId`; on undo → restore previous lifecycle; on timeout → commit (for `approve`, actually kick off `runExecution` at commit time so a reverted approval doesn't burn execution).
- Same pattern for `approveMeetingItem` / `rejectMeetingItem`.

## 5. Card cleanups (`AanInboxCard.tsx`)

- Remove the tag chip row.
- Insight and Value shown **side-by-side** in a two-column grid at the top of the card body (Insight left, Value right, `md:grid-cols-2 gap-3`), collapsing to stacked on narrow widths.

## 6. `ExecutionArtifact` — state-of-the-art redesign

Widen and restructure the panel so it stops feeling like a data dump.

### Layout
- Panel width: `640px` → `760px` (max `94vw`).
- Two-zone vertical split, both zones visually distinct:
  - **Zone A — Details (scrollable)**: content sections.
  - **Zone B — Talk to Aan (fixed bottom)**: chat, visually separated with heavier top border, background `bg-card`, extra padding (`p-4`), taller input (`h-10`), rounded input with soft shadow, send button as filled primary icon-button. Add subtle "typing…" state. This removes the cramped feel.

### Section redesign
- Snapshot: keep, but replace the flat value line with a **radial progress ring** or a **thin progress bar** for confidence % (visual), plus the projected value as the hero number.
- Insight & Evidence: convert evidence rows into a **mini bar visualization** — each metric row gets a horizontal bar showing delta magnitude relative to baseline (using existing chart color tokens for positive/negative). Long lists collapse after 3 rows with `Show all (N)`.
- Reasoning: collapsible (`<Collapsible>` from shadcn) with first item visible, rest hidden behind `Show my full reasoning`.
- **From meeting**: collapsed by default (`<Collapsible defaultOpen={false}>`), header shows meeting title + date + attendee-count chip; body reveals the full attendees / decisions / action items / callouts / notes tree.
- Recommendation: unchanged structure, but move controls into a sticky footer bar so they're always reachable.
- Execution: replace the step list with a **vertical stepper with connecting line** and a top progress bar (`progress / steps.length`).
- Verification (visible after approve/reject, not only fulfilled):
  - Show a verification block with: what I did, timestamp, actor, policy id, and diff.
  - Add a proper **Share** button group (Slack / Teams / Email / Copy link) rendered as a segmented control after action, not as tiny text buttons.
  - For rejected state, verification block confirms `"I've stood down on this. I won't repeat it for 24h."`.

### Header
- Remove tag chips from header (matches card cleanup).
- Add an inline first-person status pill next to the title (e.g. `I'm waiting on you`, `I'm on it`, `I wrapped this up`).

## 7. `MeetingBundleArtifact` — same design language

Apply the same widened layout, collapsible transcript, per-item stepper visuals, sticky action bar, and redesigned chat zone so both artifacts feel consistent.

## Files touched

- `src/pages/Alerts.tsx` — title, greeting, remove count line, tab labels, sort control, remove stale filter constants.
- `src/components/aan/autonomous/AanInboxCard.tsx` — remove tags, side-by-side insight/value, first-person copy.
- `src/components/aan/autonomous/ExecutionArtifact.tsx` — full redesign per §6.
- `src/components/aan/autonomous/MeetingBundleArtifact.tsx` — mirror redesign per §7.
- `src/components/aan/autonomous/MeetingBundleCard.tsx` — first-person copy tweaks.
- `src/components/aan/autonomous/AanEventsContext.tsx` — 30s undo for approve/reject (events + meeting items), first-person toasts.
- Sidebar/nav registry file(s) — rename "Alerts" label to "Action Items".

## Out of scope

- No backend, schema, or route path changes.
- No changes to Preferences edit-alert flow (already shipped).
- No changes to which events surface where (Flow A / Flow B split stays).
