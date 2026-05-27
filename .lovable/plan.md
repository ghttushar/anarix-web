## A. Impact Analysis page (`/advertising/impact`)

### A1. App-level selector — functional date pairing
- Rename "Current period" → **Impact period**. "Previous period" stays.
- Both pickers become real `Popover` + `Calendar` (range mode), wrapped in a new local component `ImpactDateRangePair`.
- Pairing logic (state lifted into `ImpactAnalysis.tsx`):
  - When the user changes the **Impact period** to a range of N days starting on date X, set **Previous period** = N days ending the day before X.
  - When the user changes the **Previous period** to a range of N days starting on date X, set **Impact period** = N days starting the day after the previous period ends.
  - Example: Impact = 1–5 → Previous auto = 26–30 of prior month. Previous = 1–5 → Impact auto = 6–10.
- Default state matches the existing labels (Jan 1–7 / Jan 15–22 replaced by a sensible paired default like last-7 vs prior-7).

### A2. Metrics dropdown — multi-select (max 4)
- Replace the single `<Select>` with a `Popover` containing checkbox rows (reuse the pattern in `src/components/charts/MetricSelector.tsx`).
- Options = all impact metrics: **Impressions, Clicks, CTR, Ad Spend, Ad Sales, ROAS, ACOS, Orders, Units, CPC, CVR, AOV** (full list lives in a new `IMPACT_METRICS` constant; uses same keys as `ImpactComparison.baseline/impact`). Mock data only carries 7 today — extras render as "no data" until backend; we'll keep options consistent with available metric keys (`impressions, clicks, ctr, adSpend, adSales, roas, acos`) and mark the rest as disabled with a "soon" hint. Default selected: `adSpend, adSales`.
- Cap at 4; further options become disabled until one is removed (mirrors `MetricSelector`).

### A3. Bar chart → Line chart with date-bridged x-axis
- Replace the Recharts `<BarChart>` with `<LineChart>` in the same card.
- X axis = the **bridged date range** from start of Previous period to end of Impact period (e.g. Jan 23 → Feb 7). Daily ticks.
- Two visually distinct line segments per selected metric:
  - **Previous period** segment → muted color (`hsl(var(--muted-foreground))`).
  - **Impact period** segment → metric color from `CHART_COLORS`.
  - Connect with a dashed bridge line across any gap days.
- Data source: new helper `buildImpactSeries(selectedItems, previousRange, impactRange, selectedMetrics)` that returns one combined dataset with `{ date, [metricKey_previous]: n, [metricKey_impact]: n }`. Since mock data has aggregates only, we synthesize a daily distribution per item across the range deterministically (same approach used elsewhere in mocks). No backend changes.
- Tooltip on hover shows the date, period label (Previous vs Impact), metric values, and a small list of the top contributing items (campaigns / products from the selected rows). This is the "campaigns or products visualization popup" — rendered as a custom `<Tooltip content>`.
- Only render lines for items selected in the table (see A4). If none selected, fall back to "all items in current tab" so the chart is never empty.

### A4. Table item selection drives the chart
- Add a leading checkbox column to `ImpactTable.tsx`:
  - Header checkbox = select all on current page (tri-state).
  - Row checkbox → toggles selection in a new `selectedIds: Set<string>` prop.
- Lift selection into `ImpactAnalysis.tsx` as `selectedRowIds` (per-tab map keyed by `activeTab` so switching tabs doesn't bleed selection).
- Pass `selectedRowIds` down to the line chart helper. Selecting/deselecting updates lines live.

### A5. Out of scope (do not touch)
- Table columns, sorting, pagination, KPI math.
- Toolbar download/search.
- Any other advertising page.

---

## B. Preferences page (`/settings/preferences`)

### B1. Color scheme — lock to Periwinkle Refined
- In `ColorSchemeContext.tsx`: keep only the `periwinkle-refined` entry in the `schemes` array. Default + fallback id = `"periwinkle-refined"`. If `localStorage` holds a stale id, coerce to refined.
- In `Preferences.tsx`: remove the entire "Color Scheme" section (selector + grid). The single scheme is applied automatically; no UI needed.

### B2. Display Density — lock to Comfortable
- Remove the Display Density section from `Preferences.tsx`.
- In `DensityContext.tsx` (already wired): hardcode `density = "comfortable"`, make `setDensity` a no-op, clear any stored override on mount. Keeps the hook contract so consumers don't break.

### B3. Default toggles OFF
- `FeatureToggleContext.tsx`: default `newFeaturesVisible` → `false` (initial state and fallback both `false`).
- `BillingFlowContext.tsx`: already defaults to `false` — verified, no change.
- Existing users with stored `true` keep their choice (we only change the default for fresh state).

### B4. Remove Visual Effects section
- Delete the entire "Visual Effects" `<section>` from `Preferences.tsx` (Ambient Background, Number Animations, Floating Action Island toggles).
- Leave `VisualEffectsContext` + creative feature wiring intact (still used by `CreativeFeatures.tsx`); just no user-facing toggles. Defaults in `VisualEffectsContext.tsx` stay as today so the app behavior is unchanged.

### B5. Out of scope
- Theme (light/dark) switcher stays.
- Currency, Keyboard Shortcuts, New Branding, Billing Flow sections stay.

---

## Files touched

**Impact Analysis**
- `src/pages/advertising/ImpactAnalysis.tsx` — rename label, real date pickers, multi-metric state, lifted row selection, swap chart, wire helper.
- `src/components/tables/ImpactTable.tsx` — add selection checkbox column + `selectedIds`/`onSelectionChange` props.
- `src/components/advertising/ImpactDateRangePair.tsx` *(new)* — two paired range popovers + pairing math.
- `src/components/advertising/ImpactMetricMultiSelect.tsx` *(new)* — multi-select checkbox popover, max 4.
- `src/components/charts/ImpactLineChart.tsx` *(new)* — bridged line chart + custom hover tooltip.
- `src/lib/utils/impactSeries.ts` *(new)* — `buildImpactSeries` daily synthesis helper.

**Preferences**
- `src/pages/settings/Preferences.tsx` — remove Color Scheme, Display Density, Visual Effects sections.
- `src/contexts/ColorSchemeContext.tsx` — single scheme.
- `src/contexts/DensityContext.tsx` — lock to comfortable.
- `src/contexts/FeatureToggleContext.tsx` — default `false`.

No backend / schema / mock data structure changes.
