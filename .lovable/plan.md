## 1. Fix the "missing day" in the Performance Comparison chart

**Problem:** With Previous = May 15–21 and Impact = May 22–28, the Previous line ends at May 21 and the Impact line begins at May 22. Because they are stored as separate series (`{metric}_previous` vs `{metric}_impact`), recharts renders them as two disconnected segments and the visual "step" between May 21 and May 22 reads as a missing day.

**Fix (in `src/lib/utils/impactSeries.ts`):**
- Add a bridging point so the two lines meet. On the last day of the Previous period, also emit the Impact series' first value (and vice versa on the first Impact day for Previous), so each line has a connecting endpoint at the boundary.
- Concretely: when building the last `previous` day point, also populate `${metric}_impact` using the Impact period's day-0 value. When building the first `impact` day point, also populate `${metric}_previous` using the Previous period's last-day value.
- Result: a continuous 14-day timeline (May 15–28) with no visual gap, both lines visibly meeting at the May 21 / May 22 boundary.
- No change to data semantics — tooltips still attribute each day to its true period (`point.period` unchanged).

## 2. Two-level drill-down in the Impact table

Mirror Campaign Manager's navigation pattern (no inline expand — route-based detail pages).

**Surface level → Level 1 → Level 2:**
- `Impact Analysis (Campaigns tab)` → click campaign row → `Ad Groups for that campaign`
- → click ad-group row → `Products for that ad group`

**Implementation:**

**Routes (`src/App.tsx`):**
- `/advertising/impact/campaigns/:campaignId` → `ImpactCampaignDetail` (shows Ad Groups under the campaign, with the same date-pair + metric + chart + table layout)
- `/advertising/impact/campaigns/:campaignId/:adGroupId` → `ImpactAdGroupDetail` (shows Products under the ad group)

**New pages (`src/pages/advertising/`):**
- `ImpactCampaignDetail.tsx` — reuses `ImpactDateRangePair`, `ImpactMetricMultiSelect`, `ImpactLineChart`, `ImpactTable`. Data source: `mockImpactAdGroups` filtered to the campaign id. Breadcrumb: Advertising › Impact Analysis › {Campaign Name}.
- `ImpactAdGroupDetail.tsx` — same shell. Data source: `mockImpactProducts` filtered to the ad group id. Breadcrumb adds › {Ad Group Name}.

**Mock data link-up (`src/data/mockImpactData.ts`):**
- Add `campaignId` to `mockImpactAdGroups` entries (mapping each to an existing campaign in `mockImpactCampaigns`).
- Add `adGroupId` to `mockImpactProducts` entries.
- Type addition in `src/types/advertising.ts`: optional `campaignId?: string; adGroupId?: string;` on `ImpactComparison`.

**Table click wiring (`src/components/tables/ImpactTable.tsx` + `src/pages/advertising/ImpactAnalysis.tsx`):**
- Add optional `onRowClick?: (id: string) => void` prop to `ImpactTable`. When provided, the Name cell becomes a button-like clickable area (cursor-pointer, hover row highlight). Checkbox column keeps its own click and uses `stopPropagation` so selection doesn't trigger navigation.
- In `ImpactAnalysis.tsx`, pass `onRowClick` only for the `campaigns` tab → `navigate(/advertising/impact/campaigns/${id})`. Other tabs (ad-groups, products, keywords, search-terms) stay non-clickable at the top level (those tabs are filtered views, not the drill-down hierarchy).
- In `ImpactCampaignDetail.tsx`, table `onRowClick` → `/advertising/impact/campaigns/${campaignId}/${adGroupId}`.
- In `ImpactAdGroupDetail.tsx`, no further drill (leaf level).

## Files touched
- `src/lib/utils/impactSeries.ts` — bridge boundary values
- `src/types/advertising.ts` — add optional parent ids
- `src/data/mockImpactData.ts` — link ad groups → campaigns, products → ad groups
- `src/components/tables/ImpactTable.tsx` — add `onRowClick` with safe checkbox handling
- `src/pages/advertising/ImpactAnalysis.tsx` — wire navigation on campaigns tab
- `src/pages/advertising/ImpactCampaignDetail.tsx` (new)
- `src/pages/advertising/ImpactAdGroupDetail.tsx` (new)
- `src/App.tsx` — register the two new routes

## Out of scope
- No new visual styling, no chart type changes, no tooltip changes beyond the bridge points.
- Other tabs (Keywords / Search Terms) remain non-hierarchical as today.