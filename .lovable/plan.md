## Simplify Match Type selection in Targeting Actions

Replace the current 3-column grid (Broad / Exact / Phrase), where every row shows 3 large bordered cards with a checkbox + bid input (whether used or not), with a single compact "Match Types" column.

### New cell design

- One column header: **Match Types** (min-width ~220px, replaces the 3 × 100px columns).
- Inside each row cell: a horizontal row of 3 small pill toggles — `BROAD`, `EXACT`, `PHRASE`.
  - Unselected pill: outlined, muted text, 10px uppercase tracking-wide. Click toggles on.
  - Selected pill: filled `bg-primary/10` + `border-primary/40` + `text-primary`.
- Bid inputs only appear for selected pills, rendered inline immediately to the right of each selected pill as a compact `h-6 w-14` numeric input prefixed by the currency symbol (muted).
- When nothing is selected: show a muted hint "Select match type" so the row reads cleanly.

Result: unused match types collapse to a single small pill instead of a full card with an unused bid field — far less visual noise, and the "active vs inactive" state is immediately scannable.

### Files

- `src/pages/advertising/TargetingActions.tsx`
  - Remove the 3 `<TableHead>` cells for Broad/Exact/Phrase; add 1 `<TableHead className="min-w-[240px]">Match Types</TableHead>`.
  - Replace the per-row `.map(["broad","exact","phrase"])` block (lines ~222–233) with a single `<TableCell>` containing the new pill+bid component.
- New component: `src/components/advertising/MatchTypePicker.tsx`
  - Props: `value: { broad, exact, phrase: { selected, bid } }`, `onChange`.
  - Renders 3 pills; when `selected`, renders inline bid input next to it. Uses currency symbol from `useCurrency`.
  - No new state shape on backend — uses existing `action.matchTypes` structure from `mockTargetingActions`.

### Out of scope

- No changes to other columns, toolbar, or data model.
- "Add Keyword Target" modal already uses its own multi-match UI; not touched here.
- No bulk edit behavior changes.
