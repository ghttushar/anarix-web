
# Mobile View — Read-Only Companion App

Goal: ship a `/mobile/*` variant that lets users *view* their accounts on a phone. Same features, same data, same modules as desktop — no editing, uploading, connecting accounts, rule creation, or destructive actions. Layouts may shuffle (drawer nav, full-screen detail panels), but no module is dropped or invented.

This plan has two parts:
1. **Flow map** — every existing module, what it does, what it links to, and what its read-only mobile equivalent looks like.
2. **Implementation phases** — how the mobile variant gets built, layered on top of the existing `data-view="mobile"` plumbing already in `ViewportContext`.

---

## Part 1 — Module Flow Map (Current App → Mobile Read-Only)

### A. Shell / Global Navigation
Current desktop: persistent left `AppSidebar` (groups of NavLinks), `AppTaskbar` (breadcrumb, date range, marketplace, filters), `FloatingActionIsland` (theme/insights/notifications/Aan), three right-side panels (`InsightsPanel`, `NotificationsPanel`, `AanCopilotPanel`), and several config right-panels (`CreateCampaignPanel`, `CreateSchedulePanel`, `CreateReportPanel`, product detail, period breakdown).

Mobile mapping:
- Top app bar (56px): hamburger (left), Anarix logo, marketplace chip, bell + Aan icon (right).
- Hamburger opens **Drawer Nav** — same `navigationGroups` from `AppSidebar.tsx`, collapsible groups, marketplace selector, profile menu (view-only items).
- `FloatingActionIsland` collapses into the top bar + a bottom mini-bar (Insights, Notifications, Aan, Theme).
- All right-side panels become **full-screen sheets** that slide over the main content. **One panel at a time** (enforced by extending `ActivePanelContext` — when a panel opens, any other panel closes).
- Config panels (`CreateCampaign`, `CreateSchedule`, `CreateReport`, `CampaignSettings`, `AdGroupSettings`, `AddProductAd`) are **hidden on mobile** (read-only app).
- Date range + filter controls move into a "Filters" sheet triggered from the top bar.

### B. Profitability (5 screens)
- **Dashboard** (`/profitability/dashboard`) — KPI cards row + summary. Mobile: vertical stack of KPI cards (1-col), swipeable period tabs.
- **Trends** (`/profitability/trends`) — Scatter cluster chart + product table. Mobile: stacked — scatter chart fills width (pinch-zoom only inside chart, tap a dot opens product detail sheet), product table becomes vertical card list with pagination.
- **Profit & Loss** (`/profitability/pnl`) — Weekly P&L matrix. Mobile: sticky parameter column, horizontal scroll for weeks, expand/collapse rows.
- **Geographical** (`/profitability/geo`) — Region tree + table. Mobile: tap region to drill in (push navigation).
- **Unified P&L** (`/profitability/unified-pnl`) — Same horizontal-scroll matrix pattern as P&L.

### C. Advertising (12 screens)
- Campaign Manager → Campaign Detail → Ad Group Detail → Product Ad Detail (4-level drill). Mobile: each level is a stacked route with back arrow; tables become card lists; edit/inline-edit affordances stripped.
- Impact Analysis → Impact Campaign → Impact Ad Group (same pattern).
- Targeting Actions, Budget Pacing, Search Harvesting, Anomaly Alerts, Creative Analyzer — list/table screens → mobile card lists.
- Rule Agents, Applied Rules — view-only list. Rule **Creation/Edit routes are removed** on mobile.

### D. Catalog
- Products, Inventory & Ads — table → mobile card list with thumbnail, ASIN, KPI strip.

### E. Business Intelligence
- Brand SOV (chart + table), Keyword Tracker, Keyword SOV, Product SOV, Competitor Pricing — chart on top (responsive), table → card list.

### F. AMC (6 screens)
- Queries, Executed Queries, Schedules, Audiences, Created Audiences, Instances — all become read-only lists. "Run query" / "Create schedule" hidden.

### G. Day Parting
- Hourly heatmap + history table. Mobile: heatmap fits width (horizontal scroll for hours), legend below, history table → card list.

### H. Reports
- Automated Reports (`/reports/client-portal`) — list + preview. Mobile: list view → tap to open preview sheet. "Create report" hidden.

### I. Aan (AI workspace)
- `/aan` full-screen workspace + side panel. Mobile: full-screen chat with conversation, attachment bar hidden (read-only), `AskAanTooltip` text-selection trigger disabled.

### J. Settings
- Preferences, Accounts, Integrations, Team, System, Design System, Component Library, Billing.
- Mobile shows **Preferences (theme/density/visibility toggles only)** and a read-only **Profile**. Accounts/Integrations/Billing/Team/Connect flows are hidden (writes).

### K. Workspace / Health Score
- Dashboard Builder (`/workspace`) — grid drag-and-drop. **Hidden on mobile** (authoring tool).
- Health Score — read-only score view. Kept, vertically stacked.

### L. Onboarding / Auth / Billing flows
- Login kept (auth is read access). `/onboarding/connect`, `DataSyncingState`, `TrialExpiredState`, `AddCardModal`, billing flow — **hidden on mobile**. If a logged-in user hits mobile without accounts, show a "Open desktop to connect an account" empty state.

### M. Shared components inventory (kept, mobile-skinned)
- `KPICard`, `KPICardsRow`, `ChartContainer`, `PerformanceChart`, `ImpactLineChart`, `MetricSelector` — responsive widths.
- `TablePagination`, `SortableTableHead`, all `tables/*` — wrapped by a new `MobileCardList` adapter that consumes the same row data and renders cards.
- `InsightCard`, `InsightsPanel`, `NotificationsPanel`, `AanCopilotPanel` — re-rendered as full-screen sheets.
- `MarketplaceSelector`, `AppLevelSelector`, `PageBreadcrumb` — moved into top bar / drawer.
- `StatusBadge`, `ProgressRing`, `MorphingNumber`, `MetricPulse` — reused as-is.
- Edit-only components hidden on mobile: `CampaignSettings*`, `AdGroupSettings*`, `AddProductAd*`, `AddKeywordModal`, `RuleCreation`, `ShortcutEditor`, `WidgetCanvas`, `AddWidgetModal`, integration flows, `AddCardModal`.

---

## Part 2 — Implementation Phases

### Phase M0 — Foundations (no visual change yet)
- Replace `MobilePlaceholder` with a real `MobileShell` mounted at `/mobile/*`.
- Extend `ActivePanelContext` with a `view`-aware rule: on mobile, opening any data or AI panel closes all others (single-panel constraint).
- Add a `useIsReadOnly()` hook driven by `view === "mobile"`. Every edit/create/upload control checks this and hides itself.
- Create `src/views/mobile/` folder structure: `MobileShell.tsx`, `MobileTopBar.tsx`, `MobileDrawerNav.tsx`, `MobileBottomBar.tsx`, `MobileSheet.tsx`, `MobilePageHeader.tsx`, `MobileCardList.tsx`, `MobileFiltersSheet.tsx`.

### Phase M1 — Shell + Navigation
- Build top bar, hamburger drawer (reusing `navigationGroups`), bottom mini-bar, full-screen sheet primitive.
- Wire drawer NavLinks to existing routes prefixed with `/mobile`.
- Add `/mobile` route tree mirroring desktop routes; each route renders the desktop page wrapped in `MobileShell` with `data-view="mobile"`.

### Phase M2 — Read-only enforcement
- Audit every page for buttons/forms/inputs and hide them when `useIsReadOnly()` is true:
  - Hide: Create/Edit/Delete buttons, "Run", "Apply", "Connect", upload zones, inline-edit toggles, rule creation routes, dashboard builder, AddWidget, AddKeyword, AddProductAd, integration flows, billing actions, account connect flows.
- Redirect blocked routes (`/workspace`, `/onboarding/*`, `/settings/accounts/connect/*`, `/advertising/rules/create*`, `/advertising/rules/edit/*`) to a `MobileBlockedRoute` showing "Open on desktop".

### Phase M3 — Profitability (5 screens) + table→card pattern
- Build `MobileCardList` adapter and apply to Trends, P&L (horizontal scroll), Geo, Unified P&L.
- Adapt scatter chart for touch (pinch-zoom inside chart only, tap = open product sheet).

### Phase M4 — Advertising (12 screens)
- Apply card-list pattern to all advertising tables.
- Convert 4-level drill (Campaign → Ad Group → Product Ad) to push-navigation with back arrow.
- Hide all edit/create entry points.

### Phase M5 — Catalog, BI, AMC, Day Parting, Reports
- Card-list adapter + responsive charts. Hide all write actions.

### Phase M6 — Panels (Insights, Notifications, Aan) as full-screen sheets
- Re-render each panel inside `MobileSheet`. Enforce single-panel rule.
- Aan workspace becomes full-screen chat (no attachments, no draft creation).

### Phase M7 — Settings + Profile
- Mobile Preferences page (theme, density, visibility toggles). Profile read-only. Other settings hidden.

### Phase M8 — Polish
- Per-page empty states, loading skeletons sized for mobile, safe-area padding (`pb-[env(safe-area-inset-bottom)]`), 44px tap targets, swipe-back gesture compatibility.
- Update `mem://` with a `viewport-variants/phase-X-mobile` memory entry per phase.

---

## Constraints respected
- No new features. No feature removed (only writes hidden, which the user explicitly asked for).
- One panel at a time on mobile.
- Right-side panels → full-screen overlays.
- Left nav → hamburger drawer.
- No layout changes to desktop; mobile lives entirely in `src/views/mobile/` and `/mobile/*` routes.

## Files affected (new)
- `src/views/mobile/MobileShell.tsx`, `MobileTopBar.tsx`, `MobileDrawerNav.tsx`, `MobileBottomBar.tsx`, `MobileSheet.tsx`, `MobilePageHeader.tsx`, `MobileCardList.tsx`, `MobileFiltersSheet.tsx`, `MobileBlockedRoute.tsx`
- `src/hooks/useIsReadOnly.ts`
- Per-page mobile wrappers under `src/views/mobile/pages/...` (thin adapters that import the existing pages and pass mobile-aware props).

## Files affected (edited)
- `src/App.tsx` — `/mobile/*` route tree
- `src/contexts/ActivePanelContext.tsx` — single-panel rule on mobile
- Each page file — read minor tweaks to call `useIsReadOnly()` for hiding write controls (no logic changes)

---

**Approve this plan and I'll start with Phase M0 + M1 (shell + drawer nav).** I'll pause after M1 so you can sanity-check the shell before I roll out every screen.
