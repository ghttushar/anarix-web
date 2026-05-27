# Cross-page refinements

Scoped strictly to what was requested. No layout reflows, no scope expansion.

## 1. Impact Analysis (`/advertising/impact`)

1. **Remove Auto/Manual tags** from the Campaigns tab — delete the `Badge` block in `src/components/tables/ImpactTable.tsx` (line 113–117) and stop passing `showType` from `ImpactAnalysis.tsx`. Drop the `showType` prop entirely.
2. **Rename "Baseline" → "Previous period"** everywhere on this page:
   - Taskbar pill label (`ImpactAnalysis.tsx` line 91).
   - Bar chart legend keys `"Baseline Spend"` / `"Baseline Sales"` → `"Previous Spend"` / `"Previous Sales"`.
   - Any "Baseline" header/label in `ImpactTable.tsx` (the data field `baseline` in code stays — internal only).
3. **Targeting match types (Broad / Exact / Phrase) simplification** — currently rendered as large match-type cards. Replace with compact inline pills/segmented control so each row reads as a single line, not a multi-card block. Scope: keyword target rendering in Impact Analysis context only.

## 2. Profitability

1. **Trend graph metric dropdown** — `ProfitabilityTrendChart.tsx` currently uses multi-toggle chips. Add a single `Select` dropdown bound to `activeMetrics` (single-metric mode) in the chart header. Keep existing chart types intact.
2. **Date picker on hero cards must be clickable** — `CardDatePicker` in `ProfitabilityHeroCard.tsx`. The parent card has `onClick={onSelect}` which swallows the popover trigger click. Add `e.stopPropagation()` on the `PopoverTrigger` button and on calendar interactions so opening the date picker does not also re-select the card.
3. **Limit column pinning to 3** — in `DataTableToolbar.tsx` pin handler (used by `ProductsPnLTable`), block a 4th pin: show a toast "You can pin up to 3 columns" and no-op. Existing pinned columns count is the gate.
4. **P&L side panel — "Expand all" button** — in `ProductDetailPanel.tsx` P&L Breakdown block, add a small "Expand all / Collapse all" toggle in the section header that sets `expandedSections` to all section IDs (or empty).

## 3. Campaign Manager

1. **Edit button position** — move the bulk "Edit" action to the **first** position in the toolbar/actions row (before search, filters, etc.) in `CampaignManager.tsx`.
2. **Auto/Manual tag at every level** — currently shown only on Campaigns. Propagate the same tag rendering to:
   - Ad Groups table (`AdGroupsTable.tsx`) — derive from parent campaign type.
   - Product Ads table (`ProductAdsTable.tsx`).
   - Keyword Targeting table (`KeywordTargetingTable.tsx`).
   - Product Targeting table (`ProductTargetingTable.tsx`).
   - Search Terms table (`SearchTermsTable.tsx`).
   Use the same Badge styling as in `CampaignTable.tsx` line 186–191.

## 4. Targeting Actions (`/advertising/targeting-actions`)

Re-verify the page's functionality (Add Keyword Target modal, bulk apply, action queue). Concretely:
- Confirm the **Add Keyword Target** modal still opens, multi-match-type selection works, and submits add a row to the actions table.
- Confirm bulk-select + bulk action buttons work and reflect selection count.
- Confirm filter/search on the actions table filters rows.
Fix any broken handlers found. No design changes unless a control is non-functional.

## 5. Rule pages (`/advertising/rule-agents`, `/advertising/applied-rules`, `/advertising/rule-creation`)

Reduce text density only — no logic change:
- Trim helper/description copy on rule cards and form rows to one sentence.
- Replace inline long descriptions with a small "info" icon + tooltip where the long text was purely supplemental.
- Tighten spacing between rule blocks (`space-y-6` → `space-y-4`) so the page reads less wall-of-text.

## Technical notes

- All edits stay in presentation/frontend files. No backend, no data shape changes.
- `baseline` data field name in mock + types is internal — only user-facing strings change.
- Pin-limit logic lives next to existing pin state in `DataTableToolbar`.
- Tag propagation reuses the existing Badge classes; do not introduce a new variant.

## Out of scope

- Any change to navigation, theme tokens, sidebar, or AppTaskbar.
- Settings, Preferences, Aan, Billing, Reports pages.
- Sync/Expired trial states.
