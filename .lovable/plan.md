
# Mobile rebuild — full sweep against new spec

Goal: replace the current mobile shell, taskbar, drawer, tables, charts, and Aan layout with a single coherent system that matches the new UX spec. View-only everywhere except: hamburger nav, account panel nav, page tabs, KPI metric dropdowns, chart metric/expand/rotate, search input, filter/column icons, table row tap-through, and Aan chat.

---

## 1. Global shell

Files: `src/views/mobile/MobileShell.tsx`, `MobileTopBar.tsx`, `MobileDrawerNav.tsx`, new `MobileAccountSheet.tsx`, new `MobileAppLevelBar.tsx`, `MobileTaskbar.tsx` (becomes a thin wrapper around `MobileAppLevelBar`).

- **Sticky top bar (56px)** on every page: `[☰]  Page Name (centered, truncates)  [👤]`.
  - Page name resolved from a small `pageTitleByRoute` map + route params for drill-downs (e.g. "Campaign: ACME-BR-001").
  - Drill-down pages get a leading `←` before the title.
  - Remove logo, Aan/insight/alert clusters, theme toggle, density toggle from top bar — they live elsewhere.
- **App-level selector bar** (sticky, directly under top bar, `bg-card` with bottom border):
  - Row 1: breadcrumb text only (no actions).
  - Row 2: Account chip + Marketplace chip (read-only display, opens drawer marketplace section on tap so user can switch — still considered nav).
  - Row 3: Date range chip + Frequency chip (read-only display; tap opens a bottom sheet to change — confirm in build). **Run button hidden on mobile.**
  - One component, used on every page. No filter chips here anymore.
- **Bottom bar removed.** Only floating Aan FAB remains (see §5).

## 2. Hamburger drawer (left)

Rebuild `MobileDrawerNav.tsx` to match spec exactly:

1. Header row: Anarix logo + ✕ close.
2. `✦ Ask Aan` row — navigates to `/aan`.
3. `MARKETPLACE` section: Amazon / Walmart / Shopify / TikTok with active highlight.
4. Main nav (flat, single-level expand): Profitability, Advertising, Rules, Catalog, AMC, Business Intelligence, Day Parting. Each with `>` chevron; tap expands inline child list (read from existing `navigationGroups`, filtered against `MOBILE_BLOCKED`).
5. Footer: Light/Dark toggle only. **Remove profile/email/account actions from drawer** — they live in the account sheet.

Tap outside or ✕ closes drawer.

## 3. Account sheet (top-right 👤)

New `MobileAccountSheet.tsx`, opened from top bar 👤. Right-side sheet using existing `MobileRightSheet`. Items in exact order:

`Anarix Website, Preferences, Accounts, Integrations, Team, System, Design System, Component Library, Billing, Profile` — then a divider and **Logout in red**.

All items are navigation links. No inline editing.

## 4. Page template (used by Campaign Manager + all data pages)

New `MobilePageTemplate.tsx` composing in order:
1. KPI Cards — `MobileKpiGrid` (new). 2×2 fixed grid, no scroll. Each card: metric dropdown (interactive), large value, delta with arrow+color, "vs prev" line.
2. Performance Overview chart — `MobileChartFrame` updated: title left, controls right (Show Impact toggle display-only, metric dropdown(s), rotate, expand). Full-width dual-axis line chart. Color legend row below (4 chips).
3. Horizontally scrollable page tab strip — new `MobileTabStrip` with snap scroll, active underline.
4. Search + filter icon + column icon row — `MobileTableToolbar` reworked: search input **enabled**, filter & column icons **enabled** (open existing sheets). All write actions stripped.
5. Data table — `MobileDataTable`: native table, sticky first column, horizontal scroll inside frame only, **totals row pinned at bottom** (bold, distinct bg). No bulk checkboxes. Row tap navigates to drill-down route.

Drill-down pages (Ad Group, Product, etc.) reuse the same template — only title + data change. Title row gets `←` back.

## 5. Aan FAB + Aan page (OPT A)

- New `MobileAanFab.tsx`: fixed bottom-right (`bottom: 16px + safe-area`, `right: 16px`), 56px, gradient ring, Aan glyph. Hidden on `/aan` and on Aan-owned panels. Rendered in `MobileShell`.
- Rewrite `MobileAanLayout.tsx` for OPT A:
  - Top bar: `[☰ app nav]  Aan AI  [＋ new chat] [⋯ aan settings] [👤]`.
  - Body: scrollable conversation, `flex-1 min-h-0`.
  - Composer docked above the keyboard using `100dvh` + visualViewport listener; input stays visible when keyboard opens. Send + attach buttons inside composer.
  - No right-side history drawer.

## 6. View-only enforcement

`src/index.css`:
- Keep `data-write-action`, `data-chart-actions`, `data-viz-toolbar` hidden in mobile view.
- Add: hide Run button on app-level bar in mobile.
- Allow search input, filter trigger, column trigger (remove any prior mobile disable).
- Force table first column sticky + opaque bg-card.
- Hide bulk-selection checkbox columns globally on mobile.

Page components keep their desktop logic; the template + CSS gates do the trimming. No business logic edits.

## 7. Pages to touch (full sweep)

Apply the new template/shell to every mobile-visible route. For data pages, swap their current mobile wrapper to `MobilePageTemplate` with the right KPI set, chart, tabs, and table data:

- Advertising: Campaign Manager, Ad Group detail, Product Ad detail, Targeting Actions, Impact Analysis (+ drill-downs), Search Harvesting, Anomaly Alerts, Budget Pacing, Creative Analyzer, Applied Rules.
- Profitability: Dashboard, Trends, Profit & Loss, Geographical, Unified P&L.
- Catalog: Products, Inventory Ads.
- BI: Brand SOV, Keyword SOV, Product SOV, Keyword Tracker, Competitor Pricing.
- AMC: Instances, Queries, Executed Queries, Schedules, Audiences, Created Audiences.
- Day Parting: Hourly Data.
- Reports: Client Portal.
- Settings (all listed in §3) — already mostly read-only on mobile; just verify top bar title and account sheet entry points.
- Aan: `/aan` rebuilt as in §5.

Mobile blocks remain for write-only routes (Workspace, Rule Agents, Rule Creation).

## 8. Out of scope (no changes)

Desktop/tablet shells, business logic, data fetching, route names, role/permission system, design tokens (Periwinkle stays).

## 9. Verification

Test at 390×844 and 360×800, light + dark:
- Top bar title centered and truncating; ☰ and 👤 tap targets ≥44px.
- Drawer matches §2 exactly; ✕ + outside-tap close.
- Account sheet matches §3 exactly; Logout red at bottom.
- App-level bar shows 3 rows, no Run button, sticky under top bar.
- 4 KPI cards always visible in 2×2, dropdowns swap metrics in chart.
- Chart full width, dual axis, 4-chip legend below, controls top-right.
- Page tabs scroll horizontally, snap, active state visible.
- Search/filter/column work; no Export/Upload/Save/Edit/Create/Run anywhere.
- Tables: sticky first column, horizontal scroll inside frame only, totals row at bottom.
- Row tap navigates to drill-down, drill-down shows ← back in title.
- Aan FAB visible on all data pages, hidden on /aan; Aan composer stays above keyboard; OPT A nav.
- No page-level horizontal scroll; no light/dark contrast failures on primary buttons, toggles, delta chips.

## Technical notes

- New files: `MobileAppLevelBar.tsx`, `MobileAccountSheet.tsx`, `MobilePageTemplate.tsx`, `MobileKpiGrid.tsx`, `MobileTabStrip.tsx`, `MobileAanFab.tsx`, `pageTitleByRoute.ts`.
- Modified: `MobileShell.tsx`, `MobileTopBar.tsx`, `MobileDrawerNav.tsx`, `MobileTaskbar.tsx`, `MobileDataTable.tsx`, `MobileTableToolbar.tsx`, `MobileChartFrame.tsx`, `MobileAanLayout.tsx`, `index.css`, and the per-page mobile wrappers listed in §7.
- Delete: any now-unused mobile-only bits (old bottom bar, old in-drawer profile actions, old AppLevelBar variants that don't match §1).
- Memory: after build, save a new `mem://features/viewport-variants/phase-mobile-redesign-4` entry replacing redesigns 2 & 3 as the source of truth.
