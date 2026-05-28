## Problem

The Impact Analysis drill-down (Campaigns → Ad Groups → Products) is wired correctly, but the mock data is sparse:

- `mockImpactAdGroups` only has entries for `ic-1` and `ic-2`. Campaigns `ic-3`, `ic-4`, `ic-5` show an empty table when drilled into (current route `/advertising/impact/campaigns/ic-3` is empty).
- `mockImpactProducts` only has entries for ad groups `iag-1`, `iag-2`, `iag-3`. All other ad groups show empty product tables.
- One ad group (`iag-3`) is wrongly linked to `ic-2` while its children speak to "Clearance" (mismatch with `ic-4 Clearance Items Push`).

## Fix Plan

### 1. Expand `src/data/mockImpactData.ts`

**Ad groups** — guarantee every campaign has 2–3 ad groups:
- `ic-1 Brand Awareness`: keep `iag-1 Electronics - Top Sellers`, `iag-2 Kitchen Appliances`
- `ic-2 Summer Sale`: add `iag-4 Summer Apparel`, `iag-5 Outdoor & Beach`
- `ic-3 Organic Products Launch`: add `iag-6 Organic Skincare`, `iag-7 Organic Snacks`, `iag-8 Eco Home`
- `ic-4 Clearance Items Push`: move `iag-3 Clearance Items` here, add `iag-9 End of Season Footwear`
- `ic-5 Competitor Targeting`: add `iag-10 Competitor ASINs - Audio`, `iag-11 Competitor ASINs - Kitchen`

Each ad group gets realistic baseline/impact metrics whose rough sum aligns with its parent campaign (so totals feel believable).

**Products** — guarantee every ad group has 2–3 products:
- Keep existing 5 products, fix `ip-3` to point at the relocated `iag-3` under `ic-4`.
- Add ~2 products per new ad group (iag-4..iag-11), e.g. "Linen Beach Shirt", "Beach Umbrella XL", "Organic Vitamin C Serum", "Cold-Pressed Granola", "Bamboo Storage Bins", "Trail Running Shoes 2024", "Bluetooth Speaker Compete", "Smart Kettle Compete", etc.
- Each product carries `campaignId` + `adGroupId` so the existing `.filter()` in `ImpactAdGroupDetail` works.

### 2. No changes to logic/components
`ImpactCampaignDetail.tsx`, `ImpactAdGroupDetail.tsx`, `ImpactTable.tsx`, routes, and `ImpactAnalysis.tsx` already filter and navigate correctly — once the data is dense, every drill-down path renders. No new files, no UI changes.

### Files touched
- `src/data/mockImpactData.ts` (only)

### Out of scope
- No visual/layout changes
- No chart logic changes
- No type or route changes