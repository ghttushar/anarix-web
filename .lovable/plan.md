
# Tablet Parity & Touch Accessibility — Phased Plan

## Goal

The `/tablet/*` experience must be visually and functionally identical to the desktop app (same routes, pages, components, charts, KPI cards, AppTaskbar, AppLevelSelector, AppSidebar, Floating Action Island, Aan island, Insights panel, etc.). No layout, copy, feature, or design changes. The only differences allowed are:

- Touch and stylus hit-targets, gestures, and pointer semantics.
- Hover-only affordances replaced with touch-equivalent affordances (tap-toggle and long-press / stylus-hover).
- Portrait/landscape behavior on iPad 11 and iPad Pro.
- On-screen keyboard overlays the app (input never gets covered or pushed off-screen) without changing layout.

Mobile is out of scope.

## Strategy (locked from clarifying answers)

- Replace the existing tablet forks under `src/views/tablet/{advertising,profitability,reports,aan}` with a thin shell that **renders the desktop pages and chrome** at `/tablet/*`.
- Tablet chrome = desktop chrome (AppLayout + AppSidebar + AppTaskbar + AppLevelSelector + FloatingActionIsland + InsightsPanel + NotificationsPanel + AskAanTooltip + AanCopilotPanel). Tablet-only widgets (`TabletSidebar`, `TabletTaskbar`, `TabletFloatingIsland`, `TabletKpiBand`, `TabletDataTable`, `TabletAanController`, `FloatingAanFab`) get removed.
- Touch behavior = **both** stylus/long-press hover and tap-to-toggle for popovers/tooltips, with no layout change.
- Acceptance validation = iPad 11 (834×1194 / 1194×834) and iPad Pro (1024×1366 / 1366×1024), portrait and landscape, plus keyboard overlay.

## Phase 0 — Audit & demolition prep (no behavior change yet)

- Inventory every existing tablet file under `src/views/tablet/**` and mark for removal vs keep.
  - Keep: `useVisualViewportInset` (keyboard overlay hook), `ViewportContext`, `ViewBadge`, `TabletPlaceholder` (rewrite later), and the `/tablet/_preview/tables` route for QA.
  - Remove: `TabletAppShell`, `TabletSidebar`, `TabletTaskbar`, `TabletFloatingIsland`, `TabletKpiBand`, `TabletDataTable`, `TabletTableToolbar`, `TabletColumnMenu`, `TabletFilterBuilder`, `TabletFilterChips`, `TabletFilterRule`, `TabletDateRangePicker`, `TabletRightPanel`, `TabletAanController`, `TabletAanWorkspace`, `FloatingAanFab`, and every screen under `tablet/{advertising,profitability,reports,aan}`.
- Add `/tablet/*` router that **renders the existing desktop pages** so nothing is "missing" anymore. No new pages, no layout forks.
- Acceptance: at end of Phase 0, every `/tablet/<route>` shows the exact desktop page (same DOM as desktop) inside a `data-view="tablet"` wrapper. No KPI cards, charts, taskbars, islands, or panels are missing.

## Phase 1 — Tablet routing + viewport substrate

- Replace `TabletAppShell` with a `TabletRouterAdapter` that mounts the existing desktop `<AppRoutes>` under `/tablet/*` by prefix-stripping (so all desktop routes work unchanged: profitability, advertising, BI, catalog, AMC, dayparting, reports, settings, aan).
- Update `ViewportContext.entryPath("tablet")` and Preferences switcher so toggling to Tab now lands on the same default route (`/tablet/profitability/dashboard`) and "switch back" preserves the equivalent path.
- Add a body-level `data-view="tablet"` and an `html.tablet` hook so CSS in Phase 2 can scope tablet-only deltas without rewriting components.
- Keyboard overlay: ensure the root layout uses `h-dvh`, never `h-screen`; verify the existing `useVisualViewportInset` pattern is wired only at the inputs that need it (Aan input, modals/popovers with text inputs).

## Phase 2 — Hit-target & cursor accessibility pass (CSS-only)

Goal: meet 44×44 minimum tap target for every interactive element on desktop pages, without changing visual layout.

- Add a tablet-scoped stylesheet that bumps padding on the components most commonly under-sized on touch:
  - `Button` `size="icon"` and `size="sm"` → enforce `min-h-11 min-w-11` under `[data-view="tablet"]`.
  - Table row action icons, taskbar icon buttons, DropdownMenu/Popover triggers, ChartContainer "Metrics", "Chart type", "Expand", MetricSelector, Calendar prev/next, close (X) buttons, and Floating Action Island action buttons.
  - Sidebar collapse trigger and AppSidebar nav rows get 44px hit area.
- Replace `cursor-pointer` decoration semantics with explicit `touch-action: manipulation` to remove 300ms tap delay.
- No visible padding changes for desktop: scope all of the above under `[data-view="tablet"] …`.

## Phase 3 — Hover → touch + stylus translation

Hover-only affordances become reachable by finger AND stylus, with no layout change:

- Global tooltip rule under `[data-view="tablet"]`:
  - Native `title=""` tooltips become `Popover`-style on tap (open on first tap, close on outside tap / Esc / second tap on same target). Implemented via a shared `useTabletTooltip` hook that wraps the existing Radix Tooltip primitive (no DOM/structure change for desktop).
  - Long press (450ms) and stylus hover (`pointerType: "pen"`) both open the same tooltip; tap still triggers the underlying click for buttons.
- Table row hover affordances (row highlight, row-action icons) become always-visible at low opacity on tablet, full opacity on touch/press, so users do not need to hover to discover them.
- Aan mascot's pointer-following micro-interaction is replaced on tablet with a passive idle animation (no mouse listener). The "Ask Aan" tooltip auto-opens on text selection (already implemented) and on long-press of selected text.
- Floating Action Island stops relying on `onMouseEnter` to expand: under `[data-view="tablet"]` it is always in expanded state (or toggled by tapping the grip handle). The drag-to-reposition handle gets `pointerdown` (not `mousedown`) so it works with finger and stylus.

## Phase 4 — Orientation, density, and overflow

- Verify every desktop page renders correctly at 834×1194 (portrait) and 1194×834 (landscape) — and the same for 1024×1366 / 1366×1024.
- Tablet-only safeguards (no layout change):
  - `AppSidebar` auto-collapses to icon rail in portrait <900px width; expanded in landscape. Already a `SidebarProvider` so we flip `defaultOpen` based on `matchMedia("(orientation: portrait)")` only when `data-view="tablet"`.
  - `min-w-0` already enforced on `main` and flex containers; audit any new overflow regressions caused by the larger tap targets in Phase 2.
  - Right-side panels (Insights, Notifications, Aan Copilot, Product Detail, Period Breakdown) keep desktop width on landscape; in portrait they become full-height drawers with the same content, opened/closed by the same triggers (no new triggers).

## Phase 5 — Keyboard overlay & input safety

- App root uses `h-dvh` so the on-screen keyboard overlays the layout instead of resizing it (already true in current `TabletAppShell`; carry over to AppLayout under `[data-view="tablet"]`).
- For every text input inside a Popover/Dialog/Side panel (date picker, filter builder, COGS edit, rule creation, report creation, Aan input, Add Keyword target), the active input is kept visible above the keyboard using `useVisualViewportInset` — the panel scrolls internally, the layout does not shift.
- Aan input (`/aan` workspace and copilot panel) anchors to the visual viewport bottom; the composer is never hidden by the keyboard, and the conversation list scrolls beneath it.

## Phase 6 — Removal of tablet forks + QA

- Delete every file in `src/views/tablet/` that is not the router adapter or kept primitive (see Phase 0 list).
- Remove Phase 4/5/6 entries from `.lovable/plan.md` and add a single "Tablet parity" entry referencing this plan.
- QA matrix (manual, with screenshots stored under `/mnt/documents/tablet-qa/`):
  - For each top-level module (Profitability dashboard/trends/pnl/geo/unified-pnl, Advertising campaigns/impact/targeting/budget-pacing/search-harvesting/anomaly-alerts/creative-analyzer/rules-{agents,applied,create,edit}, BI brand-sov/keyword-sov/product-sov/keyword-tracker/competitor-pricing, Catalog products/inventory-ads, AMC instances/queries/executed/schedules/audiences/created-audiences, Day Parting, Reports client-portal, Aan workspace, Settings preferences/accounts/team/system/integrations/billing): capture iPad 11 portrait + landscape and iPad Pro portrait + landscape.
  - Verify: KPI cards present, chart toolbars present, metric selector present, data table toolbar present, AppTaskbar present, AppLevelSelector present, AppSidebar present, Floating Action Island present, Insights/Notifications/Aan panels open on their triggers, all tap targets ≥44×44, all hover tooltips open on tap and on long-press/stylus-hover, on-screen keyboard does not push the layout.

## Technical details

- Tablet routing adapter:
  ```text
  /tablet/*  →  TabletRouterAdapter  →  <AppRoutes basePath="/tablet" />
  ```
  Implemented either by mounting `<AppRoutes />` inside a `<BasenameRouter base="/tablet">` wrapper, or by adding a parallel route table that points each `/tablet/<x>` at the same page component used at `/<x>`. The chosen approach must not duplicate page imports.
- `data-view="tablet"` is set on `<html>` by `ViewportContext` (already done) and is the single CSS hook used for all tablet-only deltas. No component gets a `if (isTablet)` branch unless behavior (not layout) actually changes (Floating Action Island expand, tooltip-on-tap, sidebar default-open by orientation, Aan mascot listener).
- `useTabletTooltip` is a new shared hook in `src/hooks/useTabletTooltip.ts` that wires `pointerdown` (tap), `pointerType === "pen"` (stylus hover), and a 450ms long-press timer; it integrates with the existing Radix `Tooltip` and `Popover` primitives.
- `useVisualViewportInset` is reused as-is for keyboard-aware popovers/panels.
- No changes to `src/integrations/supabase/*`, no DB changes, no new dependencies.

## Out of scope

- Mobile (`/mobile/*`) stays on `MobilePlaceholder`.
- Any visual, copy, or feature change to desktop pages.
- New tablet-only screens, navigation entries, KPI sets, or charts.
