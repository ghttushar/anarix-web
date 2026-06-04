
## 1. Trends Scatter Chart — Figma-aligned rebuild

Target: `src/components/profitability/ScatterPlotChart.tsx` (replace scatter renderer; keep bar/line views).

**Visual spec (from PDF pages 1, 4, 5):**
- Clean white plot area, no quadrant fill tints, light dashed grid.
- Axes drawn with arrow heads. X = `Profit Margin (%)` from −30 → 100, Y = `Ad Spend ($)` from 0 → 90 (driven by data extents but rendered with axis arrows + neutral muted ticks).
- A single dashed vertical reference at x=0 (profitability break-even). No quadrant background tints.
- Dots are color-tiered by margin (NOT by sales quadrant):
  - red (`hsl(0 75% 60%)`) for margin < 0
  - amber (`hsl(38 92% 55%)`) for 0 ≤ margin < 30
  - green (`hsl(142 70% 42%)`) for margin ≥ 30
- Right-rail vertical button stack (Expand, Zoom In, Zoom Out, Reset) — replaces current top toolbar zoom row to match Figma placement.

**Clustering behavior (the key change):**
- New helper `clusterPoints(points, viewport, cellPx)` that buckets points into a grid in *pixel space* given the current zoom viewBox. Cell size ~28px.
- Buckets with `count >= 2` render as a single larger bubble at the cluster centroid with the count badge centered (`5`, `10`, etc. as shown). Cluster color = dominant tier of its members.
- Buckets with `count === 1` render as the normal small dot.
- On zoom-in the viewBox shrinks → cells map to smaller data ranges → clusters naturally split apart. On zoom-out they re-merge. Implemented by recomputing clusters from `zoomLevel` + chart width each render.
- Bubble radius: 6px (single) → up to 22px (count ≥ 25), interpolated.

**Interaction:**
- Hover (desktop) / tap (tablet) on a single point or cluster opens a floating tooltip card matching Figma p2/p6:
  - Thumbnail placeholder, `Product Name`, `ID: … | SKU: …`
  - Highlighted chips: `Profit Margin: 113%` and `Ad Sale: $8.43`
  - `✨ Ask Aan` chip → calls `useAan().openCopilot({ prompt: "Why is <Product Name> performing this way?", context: { id, sku } })`
  - For clusters: header shows `N products` and a mini list (first 5 names, then "+ N more").
- Click on dot/cluster:
  - Single point → opens Aan right-panel pre-filled with the product context (matches Figma p4/p5 Aan workflow). Existing `onPointToggle` still fires for table linkage.
  - Cluster → zooms in to that cluster's bbox (×1.6).

**Zoom controls:**
- `zoomLevel` + `panOffset {x,y}` state. Buttons: Expand (existing Dialog), Zoom In (×1.3), Zoom Out (÷1.3), Reset.
- Wheel + pinch zoom on the SVG: scale around cursor / pinch midpoint. Pan via mouse drag when not in area-select mode.

**Implementation note:** Replace Recharts ScatterChart for the scatter view with a hand-rolled SVG (`<svg viewBox=…>`) because Recharts can't cleanly do per-render pixel-space clustering, custom arrow axes, or smooth wheel/pinch zoom. Bar/line views keep Recharts.

## 2. Tablet parity — port last round's fixes

Apply the calendar / sticky panel / opaque table / sidebar-cleanup work to tablet shell:

- **Calendar:** tablet uses the same `src/components/ui/calendar.tsx` already, so it inherits the fix. Verify `src/views/tablet/components/TabletDateRangePicker.tsx` (if present) wraps the same primitive; if it uses its own calendar, swap to the shared one.
- **Sticky right-side panels in tablet:** apply the same `sticky top-0 self-start h-screen z-10` wrapper inside tablet Trends / Dashboard / ProfitLoss / Geographical / UnifiedPnL screens under `src/views/tablet/pages/profitability/*`. Parent flex container becomes `flex flex-1 h-full min-h-0`.
- **Opaque table backgrounds:** add the same `bg-card` / `bg-muted` sticky-column fix to tablet table primitive (`src/views/tablet/components/TabletDataTable.tsx`) and any tablet Profitability tables.
- **Sidebar theme switcher:** confirm tablet sidebar (`src/views/tablet/components/TabletSidebar.tsx` or equivalent) does not render the theme toggle; remove if present. Theme stays only in the Floating Action Island.

## 3. Floating Action Island — hide Screenshot on tablet

`src/features/creative/FloatingActionIsland.tsx`:
- Gate the Screenshot `<Button>` block with `{!isWebsite && !isTabletView && (...)}`. Native OS screenshot on tablet/mobile covers it.

## 4. Memory updates

- Add `mem://features/profitability-module/scatter-chart-v2` — clustering + tier coloring + Aan tooltip + zoom rules.
- Append to `mem://features/viewport-variants/phase-5-tablet-profitability` — recent calendar / sticky panel / opaque table fixes also apply to tablet.
- Append to `mem://architecture/navigation-and-layout-system/floating-action-island-v6` — Screenshot button hidden in tablet view.

## Files touched

- rewrite: `src/components/profitability/ScatterPlotChart.tsx`
- new: `src/components/profitability/scatterCluster.ts` (pure clustering util + tier helper)
- new: `src/components/profitability/ScatterTooltipCard.tsx`
- edit: `src/features/creative/FloatingActionIsland.tsx`
- edit (tablet parity): files under `src/views/tablet/...` for date picker, panels, tables, sidebar (exact paths confirmed during build by reading the tablet tree)
- memory: 3 files under `mem://`

No backend, no schema, no routing changes.
