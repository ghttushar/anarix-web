# Phase 4 — Advertising Module (Tablet)

Goal: port the Advertising module screens to the tablet shell using Phase 3 primitives. Same routes, same data, no feature or behavior changes. Only presentation forks.

## Scope (in)

Tablet routes mounted under the existing `TabletAppShell` nested `<Routes>`:

| Route | Tablet screen | Underlying data / hooks |
|---|---|---|
| `/tablet/advertising` | redirect → `/tablet/advertising/campaigns` | — |
| `/tablet/advertising/campaigns` | `TabletCampaignManager` | reuses mock data + hooks from `src/pages/advertising/CampaignManager.tsx` |
| `/tablet/advertising/campaigns/:campaignId` | `TabletCampaignDetail` | reuses `CampaignDetail` data |
| `/tablet/advertising/campaigns/:campaignId/:adGroupId` | `TabletAdGroupDetail` | reuses `AdGroupDetail` data |
| `/tablet/advertising/impact` | `TabletImpactAnalysis` | reuses `ImpactAnalysis` data |
| `/tablet/advertising/impact/campaigns/:campaignId` | `TabletImpactCampaignDetail` | reuses data |
| `/tablet/advertising/impact/campaigns/:campaignId/:adGroupId` | `TabletImpactAdGroupDetail` | reuses data |
| `/tablet/advertising/targeting` | `TabletTargetingActions` | reuses data |
| `/tablet/advertising/budget-pacing` | `TabletBudgetPacing` | reuses data |
| `/tablet/advertising/search-harvesting` | `TabletSearchHarvesting` | reuses data |
| `/tablet/advertising/anomaly-alerts` | `TabletAnomalyAlerts` | reuses data |
| `/tablet/advertising/creative-analyzer` | `TabletCreativeAnalyzer` | reuses data |
| `/tablet/advertising/rules/agents` | `TabletRuleAgents` | reuses data |
| `/tablet/advertising/rules/applied` | `TabletAppliedRules` | reuses data |
| `/tablet/advertising/rules/create[/:templateId]` | `TabletRuleCreation` | reuses data |
| `/tablet/advertising/rules/edit/:ruleId` | `TabletRuleCreation` | reuses data |

Each tablet screen is a thin presentational shell that:
- Pulls the existing data / mock structures from the matching desktop page (import or extract into a small `src/views/tablet/advertising/data.ts` if reuse is non-trivial).
- Renders a `TabletTableToolbar` (title, KPI chips, filter, columns, date range, export).
- Renders a `TabletDataTable<T>` with column defs mapping the same fields as desktop.
- Opens config workflows (Rule Create/Edit, Targeting actions) in a `TabletRightPanel` instead of inline-everything.
- Detail screens reuse the existing 3-level analytical hierarchy and breadcrumb trail rendered by `TabletTaskbar`.

## Scope (out)
- Any change to data, business logic, KPIs, validation rules, or feature set.
- Mobile screens.
- Desktop screens.
- Building a full Aan Copilot port (Phase 6).
- Reports / Profitability / BI / Catalog / AMC / Settings ports (later phases).

## Technical approach

1. **Data extraction**: For each desktop page that defines mock data inline, extract it into `src/views/tablet/advertising/data/<name>.ts` (or import directly when already centralized in `src/data/*`). No semantic changes — same shapes, same values.
2. **Column defs**: Each tablet screen defines `TabletColumn<T>[]` matching the desktop columns. Numeric columns get `align: "right"`; first column is `sticky: true`.
3. **Toolbar wiring**: `TabletTableToolbar` is the universal control surface — title slot for KPI band (rendered as inline chips on portrait, full row on landscape).
4. **Workflows**: Rule creation and Targeting "Add Keyword Target" mount in `TabletRightPanel` (440px wide), reusing existing form logic.
5. **Routing**: Extend the nested `<Routes>` in `TabletAppShell` with the advertising subtree. Existing tablet shell + sidebar already has the Advertising nav entry from Phase 2.
6. **Sidebar**: Update `TabletSidebar` so the "Advertising" item routes to `/tablet/advertising/campaigns` and adds a secondary collapsed group of sub-items visible only when active (Campaigns, Impact, Targeting, Budget Pacing, Search Harvesting, Anomaly Alerts, Creative Analyzer, Rule Agents, Applied Rules).
7. **No new deps**.

## File map

Create:
```
src/views/tablet/advertising/index.ts                       (route export aggregator)
src/views/tablet/advertising/AdvertisingRoutes.tsx          (Routes element)
src/views/tablet/advertising/data/campaigns.ts              (extracted mock if needed)
src/views/tablet/advertising/data/impact.ts
src/views/tablet/advertising/data/targeting.ts
src/views/tablet/advertising/data/rules.ts
src/views/tablet/advertising/data/misc.ts                   (budget-pacing, search-harvesting, anomaly, creative)
src/views/tablet/advertising/screens/TabletCampaignManager.tsx
src/views/tablet/advertising/screens/TabletCampaignDetail.tsx
src/views/tablet/advertising/screens/TabletAdGroupDetail.tsx
src/views/tablet/advertising/screens/TabletImpactAnalysis.tsx
src/views/tablet/advertising/screens/TabletImpactCampaignDetail.tsx
src/views/tablet/advertising/screens/TabletImpactAdGroupDetail.tsx
src/views/tablet/advertising/screens/TabletTargetingActions.tsx
src/views/tablet/advertising/screens/TabletBudgetPacing.tsx
src/views/tablet/advertising/screens/TabletSearchHarvesting.tsx
src/views/tablet/advertising/screens/TabletAnomalyAlerts.tsx
src/views/tablet/advertising/screens/TabletCreativeAnalyzer.tsx
src/views/tablet/advertising/screens/TabletRuleAgents.tsx
src/views/tablet/advertising/screens/TabletAppliedRules.tsx
src/views/tablet/advertising/screens/TabletRuleCreation.tsx
src/views/tablet/advertising/workflows/TabletRuleCreationPanel.tsx
src/views/tablet/advertising/workflows/TabletAddKeywordPanel.tsx
src/views/tablet/advertising/kpi/TabletKpiBand.tsx          (touch KPI chip strip)
```

Edit:
```
src/views/tablet/shell/TabletAppShell.tsx   (add /advertising/* nested route + index redirect)
src/views/tablet/shell/TabletSidebar.tsx    (Advertising -> /tablet/advertising/campaigns + secondary group)
```

## Verification
- Switch to Tab view → tap Advertising in sidebar → lands on `/tablet/advertising/campaigns` with KPI band + touch-friendly table.
- Navigate into a campaign → ad group → product ad via row taps; back via breadcrumbs.
- Open Rule Create from `/tablet/advertising/rules/create` → workflow renders in a right panel; Apply/Cancel footer visible above keyboard.
- Filter + columns + date range work as in Phase 3 preview.
- Desktop routes unchanged.

## Caveats
- Some desktop pages contain large bespoke layouts (e.g. `ImpactCampaignDetail`, `RuleCreation`, `CreativeAnalyzer`) that mix tables + cards + workflows. Tablet ports preserve content fidelity but **simplify layout to a vertically stacked table-first composition** (toolbar → KPI band → primary table → optional right panel). No analytical fields are removed.
- For screens that are not table-centric (CreativeAnalyzer, BudgetPacing visualizations), the tablet port renders the existing chart components from `src/components/**` directly inside a `bg-card` container with touch-sized controls. No chart rewrites.

This is the largest single phase. Approve to execute as one batch; otherwise I can split into Phase 4a (Campaigns + Impact) and Phase 4b (Targeting, Rules, misc).

Awaiting approval.