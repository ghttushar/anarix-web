
# Mobile Redesign — 3 Phases

Rebuild the mobile experience as a purpose-built mobile app (not a squeezed desktop). All work scoped to `view === "mobile"` and the mobile shell. No desktop changes.

---

## Phase 1 — Shell, Navigation & Aan

**Goal:** fix global chrome, drawer, Aan, theme placement, marketplace.

1. **Bottom bar redesign**
   - Remove Insights, Alerts, and Theme toggle from `MobileBottomBar`.
   - New bottom bar: `Home · Aan · Notifications` (3 slots, 56px, no blur, flat bg).
2. **Top bar redesign**
   - Left: hamburger. Center: Anarix logo. Right: Marketplace pill (currently missing) + bell.
   - Marketplace pill opens a bottom sheet listing marketplaces (Amazon/Walmart/Shopify/TikTok) with the current connector active state.
3. **Hamburger drawer (`MobileDrawerNav`)**
   - Add theme switcher (Light/Dark/System segmented control) and currency selector under the profile chip footer — matches earlier behavior referenced in screenshot.
   - Keep nav tree as-is; tighten spacing, 44px touch targets.
4. **Aan on mobile = full-screen only**
   - Remove `AanCopilotPanel` from `MobileShell` overlay branch.
   - Tapping Aan (bottom bar / top bar / FAB) always navigates to `/aan`.
   - Redesign `/aan` mobile layout inspired by ChatGPT mobile: sticky top bar (back, model selector, new chat), full-height conversation, sticky input dock with attach + send, slide-in left drawer for chat history/Reports/Audit/Creative/Agent (replaces current overlapping sidebar shown in screenshot 2).
5. **Horizontal scroll lockdown**
   - Add `overflow-x: hidden` on `html[data-view="mobile"] body, main`.
   - Audit `MobileShell` + page wrappers for `min-w-0` on every flex child.

**Acceptance:** No page scrolls horizontally except inside table containers. Marketplace switcher present. Aan opens full-screen. Theme lives in drawer.

---

## Phase 2 — App Taskbar, Panels & Insights/Alerts Integration

**Goal:** rebuild the per-page metric/taskbar strip and consolidate Insights/Alerts there.

1. **New `MobileTaskbar` component** (replaces current cramped breadcrumb+date+Run block):
   - Row 1: Breadcrumb (truncated, single line, marketplace dot).
   - Row 2: Date range chip (full width minus actions) + icon buttons: `Insights` (lightbulb w/ red dot if critical), `Alerts` (bell w/ count), `Run` (primary, icon-only when space is tight).
   - Fonts: H1 24px Satoshi, subtitle 13px Noto. Numeric chips reserve 8-char width (`min-w-[9ch] tabular-nums`).
2. **Insights & Alerts entry points**
   - Remove from bottom bar. Open from the new taskbar icons.
   - Both open as right-side sheets that slide in from the right edge (same pattern as hamburger from left), full-height, 92vw width, with a backdrop. Reuses `ActivePanelContext` single-panel rule.
3. **Right-side panel system**
   - Centralize a `MobileRightSheet` primitive used by Insights, Alerts, P&L breakdown, filter builder, column visibility, edit forms.
   - Slide-in from right, drag-to-close handle, sticky header w/ title + close.
4. **Marketplace context wiring**
   - The marketplace pill from Phase 1 hooks into existing `MarketplaceContext`; selection persists and re-runs queries.

**Acceptance:** Taskbar fits in one viewport width on 360px. Insights/Alerts reachable from taskbar, slide from right. No bottom bar clutter.

---

## Phase 3 — Tables, Data Viz & Toolbar

**Goal:** real mobile tables (not cards-only), working filters/sort/pin/group/delta, viz that fits the screen.

1. **`MobileDataTable` primitive** (new)
   - Sticky first column (product/name), horizontal scroll only inside the table container (max-h, overscroll-contain).
   - Compact row height 40px, `tabular-nums`, numeric cells reserve 9ch.
   - Column header: tap = sort cycle; long-press = column menu (Pin, Hide, Group by, Sort asc/desc).
   - Delta badge inline under primary metric cells using existing `DeltaBadge`.
2. **`MobileTableToolbar`** (replaces stacked Columns/Export bar shown in screenshot 4):
   - Single horizontal scroll-free row: `Search` (collapses to icon), `Filter` (chip w/ active count, opens right sheet filter builder), `Group by` (chip), `Columns` (chip → right sheet w/ searchable visibility + pin toggle), `Sort` (chip), overflow menu (Export, Upload, Edit).
   - All chips 32px height, 13px Noto, active state uses `brand.primary` outline.
3. **Card mode toggle**
   - Toolbar exposes a `Cards ↔ Table` segmented switch. Default = Table on data-dense pages (Catalog Products, Campaigns, P&L, Geographical, Trends). `MobileCardList` remains for drill-down lists.
4. **Page swaps to new primitives**
   - Catalog Products, Campaign Manager (all tabs), Profitability Trends + Geographical + Unified P&L, BI Keyword Tracker, AMC Queries, Reports Client Portal, Day Parting Hourly, Advertising (Campaign/AdGroup/ProductAd details).
   - Restore all columns; rely on horizontal scroll within table only.
5. **Data visualization fit-to-screen**
   - Wrap every chart in `MobileChartFrame` that sets `width: 100%`, `aspect-ratio: 16/10`, removes inner min-widths, condenses axis ticks, hides legend into a tap-to-expand row.
   - Pages touched: Profitability Dashboard hero scroller (convert horizontal card scroller into vertical stack of period cards as in screenshot 5), Trends chart, P&L matrix (keep horizontal scroll inside container), Geographical map/bars, Advertising performance chart, Day Parting heatmap, BI SOV chart.
   - Profitability Dashboard hero: replace the cramped horizontal "J… / J… / J… / M…" scroller with the stacked period-card layout from screenshot 5 (one card per period, KPI grid 3x2 inside).

**Acceptance:** No horizontal page scroll. All charts fit width. Tables show all columns, scroll horizontally only inside the table. Sort, pin, group-by, filter, delta all functional on mobile.

---

## Technical Notes

- New files: `src/views/mobile/MobileTaskbar.tsx`, `MobileRightSheet.tsx`, `MobileMarketplacePill.tsx`, `MobileDataTable.tsx`, `MobileTableToolbar.tsx`, `MobileChartFrame.tsx`, `MobileAanLayout.tsx`.
- Edits: `MobileShell`, `MobileTopBar`, `MobileBottomBar`, `MobileDrawerNav`, `App.tsx` (Aan route mobile branch), all listed pages.
- Tokens only — no hardcoded colors. Numeric cells use `tabular-nums` and `min-w-[9ch]`.
- `overflow-x:hidden` enforced on `html[data-view="mobile"] body` + `main`; tables opt-in to `overflow-x:auto` via `MobileDataTable`.
- Memory updates after each phase: `mem://features/viewport-variants/phase-mobile-redesign-{1,2,3}`.

Phases ship in order; nothing is skipped, no sub-parts.
