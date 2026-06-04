# Scatter Chart UX + Detail Panel Wiring + Pagination

## 1. Scatter chart: cursor + scroll-zoom containment
File: `src/components/profitability/ScatterPlotChart.tsx`

- **Visible cursor on plot**: set `cursor: crosshair` on the SVG; switch to `grabbing` only while drag is active. Bubbles already use `pointer`.
- **Stop page from zooming when scroll-zooming the chart**:
  - React's `onWheel` is passive in React 17+/18, so `e.preventDefault()` silently fails — the browser still zooms/scrolls the page (especially with ctrl/pinch gesture on trackpads).
  - Attach a native non-passive wheel listener via `useEffect` on the SVG ref: `svg.addEventListener('wheel', handler, { passive: false })`, call `preventDefault()` + `stopPropagation()` for every wheel event over the chart.
  - Also intercept browser pinch-zoom: listen for `gesturestart`, `gesturechange`, `gestureend` on the SVG and `preventDefault()` them.
  - Set CSS `overscroll-behavior: contain; touch-action: none;` on the chart container so trackpad scroll never reaches the page.

## 2. Scatter chart: "More details" affordance + right-panel wiring

Currently a single-dot click opens Aan only on Dashboard's chart; Trends page never passes `onPointDetail` so clicking a dot does nothing useful.

- **Tooltip "More details" button** (`ScatterTooltipCard.tsx`): add a primary "View details" button alongside the existing "Ask Aan" chip. Clicking calls a new prop `onViewDetails(point)`. For multi-point clusters, list each product with its own "View details" link.
- **Bubble click** (`ScatterPlotChart.tsx`):
  - Multi-point cluster → keep zoom-to-split behavior.
  - Single point → always call `onPointDetail(id)` when provided; if not provided, fall back to Aan as today.
- **Wire Trends page** (`src/pages/profitability/Trends.tsx`):
  - Pass `onPointDetail={(id) => setDetailProduct(profitabilityProducts.find(p => p.id === id) ?? null)}` to `ScatterPlotChart`.
  - `ProductDetailPanel` already opens via existing state; ensure it stays mounted as a right-side panel (it already does).
- **Dashboard scatter** (if it renders one): same wiring already exists via `handleOpenDetail`.

## 3. Pagination: populate everywhere it's missing

Target pageSize = 15 (2 pages over 30-row datasets already added).

Add `TablePagination` (already exists at `src/components/tables/TablePagination.tsx`) to:

- `src/pages/profitability/Trends.tsx` — products trends table (currently renders all rows, no pagination).
- `src/pages/profitability/Dashboard.tsx` — products/orders table wrapper. Pass `page/pageSize` to `ProductsPnLTable` or slice in the page.
- `src/pages/profitability/ProfitLoss.tsx` — PnL table.
- `src/pages/profitability/Geographical.tsx` — `RegionalTable` and `RegionalProductTable`.
- `src/pages/profitability/UnifiedPnL.tsx` — unified table.

Behavior: slice `filtered` array by `(page-1)*pageSize` to `page*pageSize`; reset `page` to 1 when filters/search change; place `<TablePagination>` directly inside the bordered card, below the table body.

## 4. Verification

After build:
- Hover scatter → crosshair cursor visible.
- Ctrl/trackpad scroll on chart → only the chart zooms, page does not zoom or scroll. Scroll outside chart → page scrolls normally.
- Click single dot on Trends scatter → right-side `ProductDetailPanel` opens with full info.
- Hover cluster → tooltip shows "View details" button that also opens the right panel.
- Every profitability table shows pagination footer "1-15 of 30" with working next/prev.

## Files touched

- `src/components/profitability/ScatterPlotChart.tsx`
- `src/components/profitability/ScatterTooltipCard.tsx`
- `src/pages/profitability/Trends.tsx`
- `src/pages/profitability/Dashboard.tsx`
- `src/pages/profitability/ProfitLoss.tsx`
- `src/pages/profitability/Geographical.tsx`
- `src/pages/profitability/UnifiedPnL.tsx`

No data, type, or business-logic changes.
