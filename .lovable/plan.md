
# Rules Engine — Review Feedback Implementation

Scope: UX, labels, defaults, and small data-model additions across Rule Form, Applied Rules, Campaign Selector, and the Mapping / Keyword Actions surfaces. No rule-execution logic touched.

## 1. Data layer — `src/data/mockRules.ts`
- `RuleCondition`: add optional `maxValue?: number` (for "Between").
- `AppliedRule["status"]`: add `"ended"`.
- `operatorOptions`: append `{ value: "between", label: "Between" }`.
- `actionOptions`: rename absolute bid actions to `"Increase Bid by $"` / `"Decrease Bid by $"`.
- `frequencyOptions`: prepend `{ value: "not_set", label: "Not Set" }`.
- Add `dateRangeOptions`: `Not Set`, `Last 7 / 14 / 30 days`, `Custom`.
- `appliedRules` mock: mark 1–2 rows as `ended` with a past end date.

## 2. Rule Form — `src/pages/advertising/RuleCreation.tsx`
- **Status** label: `text-sm font-semibold` (was `text-xs`).
- Add **Select Date Range** field in Basic Information, default `not_set`.
- **Frequency** default → `not_set`.
- When `operator === "between"`, render two numeric inputs (min / max → `value`, `maxValue`).
- Keep `Add Condition` button below the conditions list (already there — verified, no duplicate).
- No autoscroll on add condition (none today — keep that way).
- New condition pre-selects metric `acos` (already does).
- `isEdit === true`:
  - Hide top-right `Save Draft` button.
  - Footer primary label: `Select Campaigns` → `Update Campaigns`.
- Bidder Rule template: add `// TODO(bidder-optional)` comment near criteria block documenting the contract; no UI added until that template panel exists.

## 3. Campaign Selector — `src/components/advertising/RuleCampaignSelector.tsx`
- New prop `isEdit?: boolean` from `RuleCreation`.
- Remove `Save as Draft` from footer entirely.
- Primary button: `Apply Rule` (new) / `Update Campaigns` (edit).
- Default left-pane filter to **Active** campaigns with a small "All / Active" segmented toggle (Active pre-selected).

## 4. Applied Rules — `src/pages/advertising/AppliedRules.tsx`
- Add `ended` entry to `statusStyles` + new **Ended** tab in `statusTabs`.
- Rules with `status === "ended"`: force toggle into paused visual + disabled.
- Rename any displayed "Run Between" copy to **"Schedule"** (header alias only — no column restructure).

## 5. Mapping / Keyword Actions — `src/pages/advertising/TargetingActions.tsx`
- `Match Type` column header → **Match Type to Add**.
- Any `Exclude Branded` copy → **Exclude Branded Terms**.
- Section heading `Source & Targeting Mapping` → **Keyword Actions** (where it surfaces).
- **Existing Mapping** badge inside the Target Ad Group cell when `targetAdGroupId` already set; disable selecting the same ad group again (tooltip).
- Amazon-only: `Negate in Source Ad Group` switch in the bulk-action popover; hidden when `isWalmart`.
- Mapping creation feedback: `recentlyMappedIds` set highlights affected row with `bg-success/5` for ~2s; toast describes new mapping (campaign → ad group).

## 6. Add Keyword Modal — `src/components/advertising/AddKeywordTargetModal.tsx`
- Add **Match Type to Add** label row above Broad/Exact/Phrase column group.
- Primary button: `Add Keywords` → `Save`.

## 7. "Save Changes" → "Save" rename
Applied in:
- `AdGroupSettingsPanel.tsx`
- `AdGroupSettingsDialog.tsx`
- `CampaignSettingsPanel.tsx`
- `CampaignSettingsDialog.tsx`
- `DataTableToolbar.tsx` (AlertDialog title `Save Changes?` → `Save?` + action button)
- `pages/settings/ComponentLibrary.tsx` mockups (parity)

## 8. New flow seed (spec 4.5)
Add a "Start from Mapping" CTA on `TargetingActions` that deep-links to `RuleCreation` with `?mappingId=...`; `RuleCreation` reads the param and pre-adds that mapping in the campaign selector. No route changes.

## 9. Explicitly out of scope
- Multi-condition AND/OR grouping.
- Custom frequency (run N times in M days).
- New bidder-template UI panel.

## File-touch summary
Edit: `src/data/mockRules.ts`, `src/pages/advertising/RuleCreation.tsx`, `src/pages/advertising/AppliedRules.tsx`, `src/pages/advertising/TargetingActions.tsx`, `src/components/advertising/RuleCampaignSelector.tsx`, `src/components/advertising/AddKeywordTargetModal.tsx`, `src/components/advertising/MatchTypePicker.tsx`, `src/components/advertising/AdGroupSettingsPanel.tsx`, `src/components/advertising/AdGroupSettingsDialog.tsx`, `src/components/advertising/CampaignSettingsPanel.tsx`, `src/components/advertising/CampaignSettingsDialog.tsx`, `src/components/advertising/DataTableToolbar.tsx`, `src/pages/settings/ComponentLibrary.tsx`.

No new routes, no business-logic changes, no new design primitives.
