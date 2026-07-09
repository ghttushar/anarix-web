## Grid Card v10 — Meeting content, independent expand, in-card undo

### 1. Independent expand (fix "right card grows when left expands")
**File:** `src/pages/Alerts.tsx`
- Replace `grid grid-cols-1 lg:grid-cols-2 gap-3 auto-rows-fr items-stretch` with a **CSS masonry-style 2-column layout** using two flex columns so each column's cards stack independently:
  - Wrap in `<div className="flex gap-3">` with two `<div className="flex-1 flex flex-col gap-3">` columns.
  - Distribute cards by index (`i % 2 === 0` → left column, else right).
- This makes expanding a left-column card only push cards **below it in the left column** down. Right column is untouched.

**File:** `src/components/actions/GridCard.tsx`
- Remove `h-full` from the outer wrapper (no longer stretching to row height).
- Collapsed cards render at their natural (small) height; expanded cards grow only themselves.
- To keep collapsed cards visually consistent, set a `min-h-[140px]` on the outer card so all collapsed cards share the same baseline height (as user asked: same height when collapsed).

### 2. Meeting card — fill empty collapsed space
**File:** `src/components/actions/GridCard.tsx`, meeting branch of the header (`isMeeting`)
- Below the meta chip row (`N action items · N attendees`), add a small **preview block** shown only when collapsed:
  - **Meeting context line:** first sentence of `bundle.summary` (truncated to 2 lines with `line-clamp-2`, muted-foreground, 13px).
  - **Attendee avatar row:** horizontal stack of `AttendeePill` initials (max 5 shown, then `+N` chip). Uses `bundle.attendees` and the existing `AttendeePill` (already used in `InlineMeetingWorkspace`).
- Hide this preview when `expanded` is true (the full workspace covers it).

### 3. In-card undo (replace floating toast for approve/complete)
Already partially wired via `useUndoFor` + `ActionChoiceRow`'s undo branch and `UndoToast` suppression for `dec:*:approve` / `task:*:done`. Verify + tighten:

**File:** `src/components/actions/GridCard.tsx`
- The FYI branch currently renders a plain `<Button>Got it</Button>` with no undo swap. Wrap it so when `undo.active` (already computed at top of component) it renders the same green **"Undo · Ns"** pill as `ActionChoiceRow` does (extract a small `<InlineUndoPill />` from `ActionChoiceRow` or reuse it directly by rendering `ActionChoiceRow` in FYI mode).
- Confirm existing effect (lines 55–61) that hides the card once undo window ends is intact: after the 30s pill expires, `setHidden(true)` runs and card disappears; store already moves the decision to `completed` status so it appears in the **Done** tab.

**File:** `src/components/actions/UndoToast.tsx` — no change needed (already suppresses `dec:*:approve` and `task:*:done`).

### 4. Same behavior in Stack view
No change requested; StackRow already reuses `ActionChoiceRow` so the undo pill works there too.

### Technical notes
- Column-distribution approach is intentional over CSS `columns-*` (which we removed earlier) because we need each card to be a flex item, not a fragmented block, and we need independent scroll/expand per column without CSS-columns' balancing behavior.
- `auto-rows-fr` on CSS grid is what forces neighboring cards to grow — removing it (by switching to flex columns) fixes the "right card expands too" bug.
- Bucket sections (`Today` / `Yesterday` / `Earlier`) each get their own 2-column split so cards stay grouped by date.

### Files touched
- `src/pages/Alerts.tsx` (GridBody column layout)
- `src/components/actions/GridCard.tsx` (remove h-full, add meeting preview block, wire FYI undo pill)
