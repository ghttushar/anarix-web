## Redesign Match Types cell — aligned 3-row grid

The current cell collapses bids when a pill is off and wraps awkwardly. Replace with a fixed, aligned vertical layout so every row is predictable and every input is always reachable.

### New layout (per cell)

3 stacked rows, one per match type, always visible and always aligned:

```
[ BROAD  ]  ₹ [ 0.85 ]
[ EXACT  ]  ₹ [ 1.25 ]
[ PHRASE ]  ₹ [ 0.95 ]
```

- Each row = `grid-cols-[68px_1fr]`, height `h-7`, gap `gap-2`. Fixed widths so all three rows line up perfectly across every table row.
- **Pill (left)**: full-width button inside its column, 10px uppercase tracking-wide.
  - Off: outlined, muted text. Click toggles on.
  - On: `bg-primary/10 border-primary/40 text-primary`.
- **Bid input (right)**: always rendered; small currency symbol prefix + numeric input (`h-7 w-full text-xs`).
  - When the pill is **off**: input is `disabled`, `opacity-50`, value still shown as a faint default. Toggling the pill on enables it instantly.
  - When the pill is **on**: input is active, editable, `bg-background`.
- Wrap each input pair in a label `<label>` so clicking the pill or the input region focuses the right control.

### Wiring fixes

The current pills don't actually persist because the parent passes value but no `onChange`. Fix in `TargetingActions.tsx`:

- Add `rowState`, a `useState<Record<string, MatchTypesValue>>` initialized from `mockTargetingActions` on first render (lazy init).
- Pass `value={rowState[action.id]}` and `onChange={(next) => setRowState(s => ({...s, [action.id]: next}))}` to `<MatchTypePicker>`.
- Result: clicking BROAD/EXACT/PHRASE actually toggles selection, and bid edits persist for the session.

### `MatchTypePicker.tsx` changes

- Replace the flex-wrap layout with the fixed `grid` per-row layout described above.
- Always render the bid input; only its `disabled` state changes.
- Remove the "Select match type" empty hint (no longer needed since rows are always visible).
- Keep `useCurrency().currencyConfig.symbol` for the prefix.

### Column

- Reduce header width: `min-w-[200px]` (down from 260) since the layout is now compact and aligned.

### Files

- `src/components/advertising/MatchTypePicker.tsx` — rewrite cell layout per above.
- `src/pages/advertising/TargetingActions.tsx` — add `rowState` + wire `onChange`; reduce `Match Types` column min-width.

### Out of scope

- No changes to data model, other columns, or toolbar.
- No bulk-edit affordance for match types yet.
