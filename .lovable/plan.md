
# Recheck of Phases 1–3 — what is actually missing

I audited the codebase against every claim from the last three "continue" loops. Most items are in fact wired up, but the user is right that several were never landed. Here is the verified gap list and the exact work to close it.

## Verified done (no action needed)
- Dual Y-axis on `PerformanceChart` and `ImpactLineChart`
- Show Impact tooltip with Top 3 / Bottom 2 + "View in Table" button
- `ImpactTable` `hideSelection` prop wired in `ImpactAnalysis`
- Alert nudge icons in `CampaignTable` (ACOS > 30 / out_of_budget)
- Targeting Actions: marketplace tabs, row checkboxes, bulk Archive, Archive column removed
- `AppTaskbar` date presets: Last 3 / 7 / 14 / 30 / 60 days
- `AppSidebar` `overflow-hidden` on `SidebarContent`
- Mock data expanded to 45 rows (Campaigns, Keywords, Search Terms, Product Ads, Ad Groups, Product Targeting, Catalog, Competitor Pricing, Targeting Actions — runtime length verified)
- Profitability Dashboard parent/child expand in `ProductsPnLTable`
- `MetricFrequencyChart` exists
- ProfitLoss product multi-select search

## Verified NOT done — to fix

### Gap 1 — `AddProductAds` bid fields still present
`AddProductAdsModal.tsx` and `AddProductAdsPanel.tsx` still declare and seed `suggestedBid: 0.75`. Strip the `suggestedBid` field from the row type, mock seed, and any rendered cell so the modal is product-selection only (Phase 2.1 spec).

### Gap 2 — 11 pages still render `PageBreadcrumb` instead of `AppTaskbar`
Files still importing `PageBreadcrumb`:
- `src/pages/workspace/Dashboard.tsx`
- `src/pages/advertising/RuleAgents.tsx`
- `src/pages/advertising/AppliedRules.tsx`
- `src/pages/settings/Team.tsx`
- `src/pages/settings/System.tsx`
- `src/pages/settings/ComponentLibrary.tsx`
- `src/pages/settings/Integrations.tsx`
- `src/pages/settings/Accounts.tsx`
- `src/pages/settings/ConnectAmazon.tsx`
- `src/pages/settings/ConnectWalmart.tsx`
- `src/pages/settings/Preferences.tsx`

Replace `PageBreadcrumb` with `AppTaskbar breadcrumbItems={…}` on each (same pattern already used elsewhere). Keep `showDateRange`/`showRunButton` off for Settings pages; turn them on for the two advertising pages and Workspace Dashboard.

### Gap 3 — Trends scatter area-select tool missing
`ScatterPlotChart.tsx` and `pages/profitability/Trends.tsx` contain no brush / area-select code. Add a `<Brush>` (or Recharts `ReferenceArea` drag-to-select) toggleable from the chart toolbar alongside the existing zoom controls. Selected points feed the existing selection state.

### Gap 4 — `CampaignTable` not on `usePinning`
`CampaignTable.tsx` is the only primary advertising table without `usePinning` / sticky-pinned columns. Add `usePinning` with Campaign Name pinned by default to match the other 10 tables already on it.

### Gap 5 — Campaign one-tag enforcement
`CampaignTagBar` currently allows multi-tag. Enforce single-select at the picker level (replace add-tag handler with `setTag(tagId)` and disable checkbox-style multi UI).

### Gap 6 — Filter button on Product-level page
The Product Ads / Product-level page in advertising is missing the `DataTableToolbar` filter affordance — add `activeFilters` + `filterFields` props so the Filter button renders, matching Impact Analysis.

### Gap 7 — Tablet parity for Phase 1 & 2 work
`src/views/tablet/` contains only `TabletRedirect.tsx`. Tablet variants for Profitability (Dashboard / Trends / P&L) and Advertising (Campaign Manager / Impact / Targeting Actions) were never created. Add tablet variants that reuse the desktop pages inside the tablet shell with touch-sized controls (44px hit targets, collapsible Right Panel, dropdowns full-width).

### Gap 8 — `Campaign Manager`: standalone metric dropdown
Verify and, if still present, remove the standalone `MetricSelector` so KPI cards are the single source of truth for chart metrics (cap of 4). Current grep finds no `MetricSelector` usage on the page — confirm during build and remove any lingering dead import.

## Execution order
1. Gaps 1, 4, 5, 6, 8 — small surgical edits in advertising components.
2. Gap 2 — bulk swap `PageBreadcrumb` → `AppTaskbar` across 11 pages.
3. Gap 3 — Trends area-select tool.
4. Gap 7 — Tablet variants (largest change; one file per screen under `src/views/tablet/`).

## Out of scope
- Re-doing items already verified above.
- Backend / data-shape changes.
- Any new design tokens — strictly periwinkle system.

## Validation
- For each gap, grep the previous failing signal and confirm it is gone.
- Visual check at 1546px and tablet viewport for the migrated pages.
- Console clean, no TS errors.

Reply **approve** to switch to build mode and execute in the order above, or tell me which gaps to drop / reorder.
