# Phase 3 — Tablet Tables, Filters, Date Picker

Goal: deliver touch-optimized versions of the three highest-traffic interactive primitives — data tables, the multi-rule filter builder, and the date range picker — so module-screen ports (Phase 4+) have ready-to-use building blocks.

Same data, same containers from `src/app/*`. Only presentation forks under `src/views/tablet/`.

## Scope (in)

### 1. Tablet Data Table (`src/views/tablet/data/`)
- `TabletDataTable.tsx` — generic table wrapper preserving existing density rules (`whitespace-nowrap`, black numbers, sticky first column, sticky header, `bg-card` container).
  - Row height: 52px (vs desktop 36px) — keeps tap targets >= 44px while staying data-dense.
  - Each row wrapped in `SwipeableRow`; swipe-left reveals row actions (Pin / Edit / More).
  - Sort / Pin / column-menu icons are **always visible** per row-header (no hover-reveal).
  - Cell text remains 14px Noto Sans, numbers black.
  - Selection: tap row checkbox (44×44 hit area); bulk action bar slides in from top when >0 selected.
- `TabletTableToolbar.tsx` — touch-sized toolbar (column visibility, filter, density, export). Buttons use `TouchTarget`; labels use `LongPressTooltip`.
- `TabletColumnMenu.tsx` — sheet-style column visibility picker (slides up from bottom on portrait, right-drawer on landscape). Search input, checkboxes 44×44.

### 2. Tablet Filter Builder (`src/views/tablet/filters/`)
- `TabletFilterBuilder.tsx` — right-side `TabletRightPanel` hosting the multi-rule builder. Rules stack vertically with large tap targets; AND/OR toggle is a segmented control.
- `TabletFilterRule.tsx` — one rule per card (column / operator / value), drag-handle on the left (long-press to start drag), delete button 44×44 on the right.
- `TabletFilterChips.tsx` — applied-filter chips rendered in toolbar; each chip has a 44×44 dismiss target.

### 3. Tablet Date Range Picker (`src/views/tablet/datepicker/`)
- `TabletDateRangePicker.tsx` — opens a sheet (portrait) / popover (landscape) using shadcn `Calendar` (mode="range") with `p-3 pointer-events-auto`.
  - Preset rail on the left (Today, Yesterday, 7d, 28d, MTD, QTD, YTD, Custom) — each preset is a 48px-tall pill.
  - Explicit **Apply** (primary) and **Cancel** (secondary) buttons fixed to the sheet footer.
  - Two-month calendar in landscape, single-month in portrait (driven by `matchMedia`).
  - Keyboard-aware via `useVisualViewportInset` so the footer is never hidden.

### 4. Wiring & demo
- Add a sample mounted route under `/tablet/_preview/tables` that renders `TabletDataTable` with mock rows + the toolbar + filter panel + date picker, so Phase 3 is verifiable end-to-end without touching real module screens.
- Demo links added to the Tablet shell's empty-state center card.

## Scope (out)
- Any real module screen (Advertising, Profitability, Reports, BI, Catalog, AMC, Settings) — Phase 4+.
- Desktop changes (existing desktop data table / filter / date picker untouched).
- Mobile variants.
- Business logic / data shape changes.
- New dependencies.

## Technical notes
- Reuses existing shadcn `Calendar`, `Checkbox`, `Input`, `Button`, `Select` primitives — only layout & sizing change.
- All new components live under `src/views/tablet/` and consume only shared utilities (`cn`, `lib/utils`) plus Phase 2 primitives (`TouchTarget`, `LongPressTooltip`, `SwipeableRow`, `TabletRightPanel`, `useVisualViewportInset`).
- Generic table API mirrors a minimal subset of TanStack-style column defs to make Phase 4+ porting trivial:
  ```ts
  type TabletColumn<T> = {
    id: string;
    header: string;
    cell: (row: T) => ReactNode;
    align?: "left" | "right";
    sticky?: boolean;
    sortable?: boolean;
  };
  ```
- Preserves Core memory rules: `whitespace-nowrap`, black numbers, `bg-card` container, no backdrop blur, no right-edge shadows, independent scroll containers (`flex-1 min-h-0`), sticky header inside scroll container.

## Files to create
```
src/views/tablet/data/TabletDataTable.tsx
src/views/tablet/data/TabletTableToolbar.tsx
src/views/tablet/data/TabletColumnMenu.tsx
src/views/tablet/data/types.ts
src/views/tablet/filters/TabletFilterBuilder.tsx
src/views/tablet/filters/TabletFilterRule.tsx
src/views/tablet/filters/TabletFilterChips.tsx
src/views/tablet/filters/types.ts
src/views/tablet/datepicker/TabletDateRangePicker.tsx
src/views/tablet/datepicker/presets.ts
src/views/tablet/_preview/TablePreview.tsx
```

## Files to edit
- `src/App.tsx` — add `/tablet/_preview/tables` route under `TabletAppShell`.
- `src/views/tablet/shell/TabletAppShell.tsx` — empty-state card links to the Phase 3 preview route.

## Verification
- Visit `/tablet/_preview/tables` (after switching to Tab in Preferences) — table renders with sticky header/column, 52px rows, swipe-left actions on a row, working toolbar, filter panel, date picker.
- Rotate portrait↔landscape — date picker swaps sheet/popover; sidebar swaps rail/expanded.
- Focus the filter rule value input on a tablet emulation — keyboard overlays, input scrolls into view, Apply button stays visible.
- Desktop routes unchanged.

Awaiting approval to execute Phase 3.