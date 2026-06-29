# Rules Engine — Review Feedback Implementation Plan

Scope: apply the documented Rules Engine feedback across the Rule Form, Applied Rules, and Configuration (mapping / keyword actions) flows. Underlying rule-execution logic stays untouched; this is UX, labels, defaults, and a couple of small data-model additions.

The attached `Untitled_1.fig` is a binary Figma file and can't be parsed in-sandbox, so the spec text in the message is the source of truth.

---

## 1. Data layer — `src/data/mockRules.ts`

- Extend `RuleCondition` with optional `maxValue?: number` to support the new **Between** operator.
- Extend `AppliedRule["status"]` union to include `"ended"`.
- `operatorOptions`: append `{ value: "between", label: "Between" }`.
- `actionOptions`: rename absolute bid actions to match spec — `"Increase Bid by $"` and `"Decrease Bid by $"` (keep the percentage ones as they are).
- `frequencyOptions`: prepend `{ value: "not_set", label: "Not Set" }` so it can be the default.
- Add a `dateRangeOptions` array: `Not Set`, `Last 7 days`, `Last 14 days`, `Last 30 days`, `Custom`.
- `appliedRules` mock: mark 1–2 rows as `status: "ended"` with a past end date so the new badge has data.

## 2. Rule Form — `src/pages/advertising/RuleCreation.tsx`

Status & basic info
- Bump the **Status** label from `text-xs` to `text-sm font-semibold` (the spec explicitly calls out the label being hard to notice).
- Add a **Select Date Range** field (formerly "Run Between") in Basic Information, defaulting to `not_set`.
- Change **Frequency** default from `"daily"` to `"not_set"`.

Conditions
- `createCondition()` keeps `metric: "acos"` so newly added conditions are pre-selected (spec 2.6 — already satisfied, just verify).
- When `operator === "between"`, render two numeric inputs (min / max) wired to `value` and `maxValue`; for all other operators, the existing single input.
- No `scrollIntoView` / autoscroll is introduced when adding conditions (spec 2.7).
- Keep `Add Condition` button **below** the existing conditions list (already structured this way — keep, remove any duplicate top-right placement if present).

Edit-draft mode (`isEdit === true`)
- Footer primary action label: `"Select Campaigns"` → `"Update Campaigns"`.
- Top-right `"Save Draft"` action: hide entirely when `isEdit` (drafts being edited save as `"Save"` via the campaign-selector footer instead).

Bidder-rule template
- For the Bidder Rule template (`templateId === "bidder"`), the tROAS / Min Bid / Max Bid inputs (when surfaced in the future) are optional by default; only tROAS becomes required when the selected condition metric is `roas/troas`. Today these inputs aren't rendered, so add a `// TODO(bidder-optional)` marker next to the criteria block to document the contract — no UI added beyond that until the bidder template panel exists.

## 3. Campaign Selector — `src/components/advertising/RuleCampaignSelector.tsx`

- Add `isEdit?: boolean` prop, passed from `RuleCreation`.
- **Remove** the `Save as Draft` button from the footer entirely (spec 2.10 — drop Save & Draft from Entity Selection page).
- Primary button label:
  - new rule → `"Apply Rule"` (unchanged)
  - editing a draft → `"Update Campaigns"`
- Default the left-pane campaign list to **Active** campaigns (use `c.status === "active"` filter; expose a small "All / Active" segmented control with Active pre-selected so users can opt out).

## 4. Applied Rules — `src/pages/advertising/AppliedRules.tsx`

- Add `ended` entry to `statusStyles` (muted/red border) and a new **Ended** tab in `statusTabs`.
- If a rule has `status === "ended"`, force the running toggle into the paused visual state and disable it (no execution).
- Rename any displayed "Run Between" copy to **"Schedule"** (today the column is "Frequency" — add a tooltip/header alias rather than restructure if the column doesn't exist).

## 5. Mapping / Keyword Actions — `src/pages/advertising/TargetingActions.tsx`

- Page-level terminology pass:
  - `Match Type` column header → **Match Type to Add**.
  - Any `Exclude Branded` toggle copy → **Exclude Branded Terms**.
  - Section heading `Source & Targeting Mapping` → **Keyword Actions** (apply wherever it surfaces in toolbar/headers).
- **Existing-mapping indicator**: when a row's `targetAdGroupId` is already set, render an `Existing Mapping` badge inside the Target Ad Group cell and prevent re-selecting the same ad group (disabled option + tooltip).
- **Amazon-only**: surface a `Negate in Source Ad Group` switch in the bulk-action popover; hide it entirely when `isWalmart`.
- **Mapping creation feedback**: after a successful add/update, briefly highlight the affected row (`bg-success/5` for ~2s via a `recentlyMappedIds` set) and emit a `toast.success` describing the new mapping (campaign → ad group).

## 6. Add Keyword Modal — `src/components/advertising/AddKeywordTargetModal.tsx`

- Add a `Match Type to Add` label row above the Broad/Exact/Phrase column group.
- Primary button label: `Add Keywords` → `Save` (spec 4.4 shorter labels).

## 7. "Save Changes" → "Save" rename

Single-character labels updated in:
- `src/components/advertising/AdGroupSettingsPanel.tsx`
- `src/components/advertising/AdGroupSettingsDialog.tsx`
- `src/components/advertising/CampaignSettingsPanel.tsx`
- `src/components/advertising/CampaignSettingsDialog.tsx`
- `src/components/advertising/DataTableToolbar.tsx` (both the AlertDialog title `Save Changes?` → `Save?` and its action button label)
- `src/pages/settings/ComponentLibrary.tsx` mockups (cosmetic parity)

## 8. Updated user flow (spec 4.5)

Document — no immediate routing change — the intended entry-point shift: mapping selection becomes the **start** of the rule-creation flow rather than its result. Concretely, add a "Start from Mapping" call-to-action on `TargetingActions` that deep-links into `RuleCreation` with the chosen mapping pre-filled via query params (`?mappingId=...`). `RuleCreation` reads the param and hydrates the campaign-selector with that mapping pre-added.

## 9. Out of scope (explicitly NOT implemented)

- Multi-condition AND/OR grouping (spec 2.5, future).
- Custom frequency (run N times in M days) — spec section 5.

---

## File-touch summary

Edit:
- `src/data/mockRules.ts`
- `src/pages/advertising/RuleCreation.tsx`
- `src/pages/advertising/AppliedRules.tsx`
- `src/pages/advertising/TargetingActions.tsx`
- `src/components/advertising/RuleCampaignSelector.tsx`
- `src/components/advertising/AddKeywordTargetModal.tsx`
- `src/components/advertising/MatchTypePicker.tsx` (column-label alignment with "Match Type to Add")
- `src/components/advertising/AdGroupSettingsPanel.tsx`
- `src/components/advertising/AdGroupSettingsDialog.tsx`
- `src/components/advertising/CampaignSettingsPanel.tsx`
- `src/components/advertising/CampaignSettingsDialog.tsx`
- `src/components/advertising/DataTableToolbar.tsx`
- `src/pages/settings/ComponentLibrary.tsx`

No new routes, no business-logic changes, no design-system primitives added.
