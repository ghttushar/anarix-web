Two independent fixes for table scroll behavior.

## Fix 1 — Tablet: scroll chains to page after last row (global)

**Problem**
On tablet, every overflow scroll container (including every data table) has `overscroll-behavior: contain` and `touch-action: pan-x pan-y`. When the user reaches the last row of a table, the finger pan stops dead instead of continuing to scroll the page. Because most screens are mostly table, this makes the app feel locked.

**Change** (file: `src/index.css`, rule block "6. Ensure scroll containers behave well…")

- Remove `overscroll-behavior: contain` from the global tablet `overflow-*` rule so that vertical pan naturally chains to the parent / page once the inner container reaches its end.
- Keep `-webkit-overflow-scrolling: touch` and `touch-action: pan-x pan-y` so the table itself still scrolls smoothly.
- Keep the row-level `touch-action: pan-y` rule (block 7) as-is — that fix for "tap on row eats scroll" stays.

Net effect on tablet:
- Scroll inside a table works as before.
- Once the inner scroll hits top/bottom, the page scrolls.
- Side panels / modals that legitimately need scroll isolation are not affected because they own their own height and have no parent to chain into.

Scope: tablet only. Desktop unchanged.

## Fix 2 — PnL expandable table scroll (tablet AND desktop, separate from Fix 1)

**Problem**
`PnLParameterTable` wraps its `<Table>` in `<div className="max-h-[70vh] overflow-auto overscroll-contain">`. Two issues:
1. As the user expands parent rows, the table grows but is capped at 70vh, forcing a second nested scroll inside the page scroll. On tablet this nested scroll is finger-trapped; on desktop it is awkward because the page and the table both scroll.
2. `overscroll-contain` further locks the gesture.

**Change** (file: `src/components/profitability/PnLParameterTable.tsx`)

- Remove the `max-h-[70vh] overflow-auto overscroll-contain` wrapper height cap.
- Keep the wrapper `<div>` so the sticky header continues to work, but let it expand with the table content. The page becomes the single scroll surface for the PnL parameter table on both desktop and tablet.
- Sticky `top-0` on `<TableHead>` rows continues to pin the header to the top of the page scroll (already supported in the existing code).
- Horizontal scroll for the weekly columns is still handled by the inner `Table` component which already wraps in `overflow-auto` — no change needed for left/right pan.

Net effect:
- Desktop: expanding parameter rows grows the table inline; user scrolls the page once, header stays pinned.
- Tablet: same behavior, no nested gesture trap, header stays pinned, horizontal scroll for week columns still works.

Scope: only `PnLParameterTable` (used by `ProfitLoss.tsx`). `ProductsPnLTable` is not touched here — it does not have an internal max-height cap.

## Files touched
- `src/index.css` (one rule block, ~2 lines)
- `src/components/profitability/PnLParameterTable.tsx` (one className change on the wrapper div)

## Out of scope
- Desktop behavior outside of the PnL parameter table.
- Mobile.
- Marketplace selector, Floating Action Island, or any other earlier tablet fix.
- Any visual / copy / layout changes.

## Validation
- Tablet (iPad portrait + landscape): on Dashboard, Campaign Manager, Catalog, Profitability — scroll inside a table, keep finger pan past the last row, page continues scrolling.
- Tablet PnL screen: expand all rows, single finger pan scrolls the whole page; header stays pinned; horizontal pan still scrolls weekly columns.
- Desktop PnL screen: expanded rows no longer trap inside a 70vh box; page scrolls; sticky header pinned to viewport top.
- Desktop tables elsewhere: unchanged.
