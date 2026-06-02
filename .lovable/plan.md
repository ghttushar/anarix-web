# Tablet Portrait Optimization

Goal: when the app is in tablet view AND `(orientation: portrait)`, the entire shell adapts for narrow width without forking pages. Triggered exclusively by `html[data-view="tablet"]` + the `(orientation: portrait)` media query — width-agnostic, per your choice.

## 1. Global activation hook

- Add `data-orientation="portrait|landscape"` on `<html>` (in `ViewportContext` or `AppLayout`), bound to `matchMedia("(orientation: portrait)")`.
- Single CSS scope used everywhere: `html[data-view="tablet"][data-orientation="portrait"]` (alias `.tp:` via a Tailwind variant added in `tailwind.config.ts` for ergonomic class authoring).
- All portrait rules live behind this scope so desktop/landscape are byte-identical.

## 2. Layout density

- `AppLayout` `<main>` padding: drop from `p-6` to `p-4` in portrait (compact density still wins if user picked it).
- `AppTaskbar`:
  - Collapse marketplace label → icon-only chip.
  - Date range button shows preset label only (hide explicit date string).
  - Breadcrumbs truncate to last 2 segments with `…` prefix linking to root.
  - Overflow extra actions into a single `⋯` menu when row width < container.
- KPI grids (Profitability hero, CampaignManager, Dashboard): force `grid-cols-2` in portrait regardless of source `lg:grid-cols-5` etc. Done via a `.tp:grid-cols-2` override at the grid wrapper level (no per-page edits — apply via a shared `KpiGrid` wrapper or a CSS layer rule targeting `[data-kpi-grid]`).
- Tables:
  - Reduce row height `h-11 → h-10`, cell px `px-3 → px-2`.
  - Keep sticky first/second cols; allow horizontal scroll on table body wrapper (already structured for this).
  - Pagination bar wraps to 2 lines instead of squashing.

## 3. Right-side panels behavior

- `InsightsPanel`, `NotificationsPanel`, `AanCopilotPanel`, `ProductDetailPanel`, `PeriodBreakdownPanel` currently sit beside `<main>`. In portrait:
  - Render as a full-width overlay drawer (anchored right, width `100vw` minus 56px icon-rail sidebar, max-w-none).
  - Main content stays mounted but is visually obscured by drawer (z-index above main, below modal layer).
  - Add a backdrop tap target that closes the panel (only for `productDetail`/`periodBreakdown`/`insights`/`notifications` — Copilot keeps its explicit close button).
  - Auto-collapse sidebar logic (already in `AppLayout`) is unchanged; in portrait the sidebar is forced to icon rail.

## 4. Sidebar + Floating Island ergonomics

- `AppSidebar`: in portrait, lock to icon-rail (no expand on hover), nav items min-height 44px.
- `FloatingActionIsland`:
  - Reposition from current spot to `bottom-4 right-4` with safe-area inset; stays clear of thumb zone.
  - Bell, Aan, and quick actions buttons → 44×44px hit targets.
  - When any side panel is open in portrait, island hides (would overlap drawer).
- Native `title` tooltips only (per Radix guardrail) — no hover popovers since touch can't hover.

## 5. Charts & data viz

Targeted at `PerformanceChart`, `ImpactLineChart`, `ScatterPlotChart`, `MetricFrequencyChart`, heatmaps:
- X-axis tick interval doubled (`interval="preserveStartEnd"` or explicit `interval={Math.ceil(data.length/5)}`).
- Y-axis tick font 11px, label width clamped.
- Legend wraps to 2 lines, font 11px.
- Tooltip uses `wrapperStyle={{ maxWidth: 240 }}` and `allowEscapeViewView: false` so it never overflows.
- Dual-axis labels stack vertically when container <520px (already detected via chart wrapper ResizeObserver — add one if absent in `ImpactLineChart`).
- Heatmaps: cell min-width 32px; horizontal scroll allowed.

## 6. Files touched

```
src/contexts/ViewportContext.tsx          (add orientation tracking → html[data-orientation])
src/components/layout/AppLayout.tsx       (portrait padding, drawer panel mode, sidebar lock)
src/components/layout/AppSidebar.tsx      (portrait icon-rail lock, 44px targets)
src/components/layout/AppTaskbar.tsx      (compact controls, overflow menu, breadcrumb truncation)
src/components/insights/InsightsPanel.tsx (drawer mode in portrait)
src/components/notifications/NotificationsPanel.tsx
src/components/aan/AanCopilotPanel.tsx
src/components/profitability/ProductDetailPanel.tsx
src/components/profitability/PeriodBreakdownPanel.tsx
src/features/creative/FloatingActionIsland.tsx
src/components/charts/PerformanceChart.tsx
src/components/charts/ImpactLineChart.tsx
src/components/charts/MetricFrequencyChart.tsx
src/components/profitability/ScatterPlotChart.tsx
src/index.css                              (portrait scope utility rules: KPI grid override, table density, panel drawer)
tailwind.config.ts                         (add `tp:` variant for tablet-portrait)
```

No page-level files edited — all changes are shell + shared components.

## 7. Verification

- `/profitability/dashboard`, `/advertising/impact`, `/advertising/campaigns`: screenshot in tablet portrait viewport (820×1180) and confirm: 2-col KPIs, compact taskbar, sticky columns intact, no horizontal page scroll.
- Open Insights → confirm full-width drawer, tap backdrop to close.
- Open Aan Copilot → confirm drawer + explicit close.
- Rotate to landscape (1180×820) → confirm layout reverts to desktop-style.

## Out of scope

- Mobile view (separate variant).
- Tablet landscape changes (already correct).
- Page-level redesigns or new components.
- Backend/data changes.
