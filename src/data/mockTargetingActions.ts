import { TargetingAction } from "@/types/advertising";

export const mockTargetingActions: TargetingAction[] = [
  {
    id: "ta-1",
    searchTerm: "premium wireless earbuds",
    termType: "branded",
    normalizedTerm: "wireless earbuds premium",
    sourceCampaignId: "1",
    sourceCampaignName: "Brand Awareness - Q1 2026",
    sourceAdGroupId: "ag-1",
    sourceAdGroupName: "Electronics - Top Sellers",
    targetCampaignId: undefined,
    targetAdGroupId: undefined,
    matchTypes: {
      broad: { selected: true, bid: 0.85 },
      exact: { selected: true, bid: 1.25 },
      phrase: { selected: false, bid: 0.95 },
    },
    archived: false,
    impressions: 4567,
    clicks: 62,
    ctr: 1.36,
    cpc: 0.87,
    adSpend: 53.94,
    adSales: 234.56,
    adUnits: 3,
    cvr: 4.84,
    roas: 4.35,
  },
  {
    id: "ta-2",
    searchTerm: "competitor brand xyz headphones",
    termType: "competitor",
    normalizedTerm: "competitor headphones xyz",
    sourceCampaignId: "5",
    sourceCampaignName: "Competitor Targeting",
    sourceAdGroupId: "ag-8",
    sourceAdGroupName: "Competitor Keywords",
    targetCampaignId: undefined,
    targetAdGroupId: undefined,
    matchTypes: {
      broad: { selected: false, bid: 1.50 },
      exact: { selected: true, bid: 2.15 },
      phrase: { selected: true, bid: 1.85 },
    },
    archived: false,
    impressions: 2345,
    clicks: 34,
    ctr: 1.45,
    cpc: 1.54,
    adSpend: 52.36,
    adSales: 112.45,
    adUnits: 1,
    cvr: 2.94,
    roas: 2.15,
  },
  {
    id: "ta-3",
    searchTerm: "best air fryer for family",
    termType: "generic",
    normalizedTerm: "air fryer family best",
    sourceCampaignId: "1",
    sourceCampaignName: "Brand Awareness - Q1 2026",
    sourceAdGroupId: "ag-2",
    sourceAdGroupName: "Kitchen Appliances",
    targetCampaignId: undefined,
    targetAdGroupId: undefined,
    matchTypes: {
      broad: { selected: true, bid: 0.65 },
      exact: { selected: false, bid: 0.95 },
      phrase: { selected: true, bid: 0.78 },
    },
    archived: false,
    impressions: 5678,
    clicks: 78,
    ctr: 1.37,
    cpc: 0.76,
    adSpend: 59.28,
    adSales: 267.89,
    adUnits: 4,
    cvr: 5.13,
    roas: 4.52,
  },
  {
    id: "ta-4",
    searchTerm: "organic matcha green tea",
    termType: "branded",
    normalizedTerm: "green tea matcha organic",
    sourceCampaignId: "4",
    sourceCampaignName: "Organic Products Launch",
    sourceAdGroupId: "ag-5",
    sourceAdGroupName: "Organic Products",
    targetCampaignId: undefined,
    targetAdGroupId: undefined,
    matchTypes: {
      broad: { selected: true, bid: 0.55 },
      exact: { selected: true, bid: 0.85 },
      phrase: { selected: false, bid: 0.68 },
    },
    archived: false,
    impressions: 1987,
    clicks: 31,
    ctr: 1.56,
    cpc: 0.54,
    adSpend: 16.74,
    adSales: 89.45,
    adUnits: 2,
    cvr: 6.45,
    roas: 5.34,
  },
  {
    id: "ta-5",
    searchTerm: "discount running shoes",
    termType: "generic",
    normalizedTerm: "running shoes discount",
    sourceCampaignId: "7",
    sourceCampaignName: "Clearance Items Push",
    sourceAdGroupId: "ag-4",
    sourceAdGroupName: "Clearance Items",
    targetCampaignId: undefined,
    targetAdGroupId: undefined,
    matchTypes: {
      broad: { selected: false, bid: 0.45 },
      exact: { selected: true, bid: 0.65 },
      phrase: { selected: true, bid: 0.55 },
    },
    archived: false,
    impressions: 3456,
    clicks: 60,
    ctr: 1.74,
    cpc: 0.52,
    adSpend: 31.20,
    adSales: 167.89,
    adUnits: 3,
    cvr: 5.00,
    roas: 5.38,
  },
  {
    id: "ta-6",
    searchTerm: "competitor brand abc wireless",
    termType: "competitor",
    normalizedTerm: "wireless competitor abc",
    sourceCampaignId: "5",
    sourceCampaignName: "Competitor Targeting",
    sourceAdGroupId: "ag-8",
    sourceAdGroupName: "Competitor Keywords",
    targetCampaignId: undefined,
    targetAdGroupId: undefined,
    matchTypes: {
      broad: { selected: true, bid: 1.35 },
      exact: { selected: true, bid: 1.95 },
      phrase: { selected: true, bid: 1.65 },
    },
    archived: true,
    impressions: 1890,
    clicks: 27,
    ctr: 1.43,
    cpc: 1.51,
    adSpend: 40.77,
    adSales: 87.34,
    adUnits: 1,
    cvr: 3.70,
    roas: 2.14,
  },
];

export const mockTargetCampaigns = [
  { id: "tc-1", name: "Manual Keywords - Electronics" },
  { id: "tc-2", name: "Manual Keywords - Kitchen" },
  { id: "tc-3", name: "Manual Keywords - Organic" },
  { id: "tc-4", name: "Manual Keywords - Clearance" },
  { id: "tc-5", name: "Brand Defense - Main" },
];

export const mockTargetAdGroups = [
  { id: "tag-1", name: "Exact Match - High Intent", campaignId: "tc-1" },
  { id: "tag-2", name: "Phrase Match - Discovery", campaignId: "tc-1" },
  { id: "tag-3", name: "Broad Match - Volume", campaignId: "tc-1" },
  { id: "tag-4", name: "Kitchen Exact", campaignId: "tc-2" },
  { id: "tag-5", name: "Kitchen Phrase", campaignId: "tc-2" },
  { id: "tag-6", name: "Organic Exact", campaignId: "tc-3" },
  { id: "tag-7", name: "Clearance All Match", campaignId: "tc-4" },
  { id: "tag-8", name: "Brand Defense Exact", campaignId: "tc-5" },
];


// ──────────── Synthetic expansion (Phase 3.3) ────────────
// Procedurally clones existing rows to reach 45 total records
// for realistic pagination demos. Generated at module load.
(() => {
  const base = mockTargetingActions.slice();
  const baseLen = base.length;
  if (baseLen === 0) return;
  let nextId = baseLen + 1;
  while (mockTargetingActions.length < 45) {
    const src = base[(mockTargetingActions.length - baseLen) % baseLen];
    const variance = 0.7 + ((mockTargetingActions.length * 37) % 60) / 100;
    const clone: any = { ...src };
    clone.id = "ta-" + nextId;
    if ((clone as any)["searchTerm"]) (clone as any)["searchTerm"] = (clone as any)["searchTerm"] + " #" + nextId;
    for (const k of Object.keys(clone)) {
      const v = (clone as any)[k];
      if (typeof v === "number" && k !== "id" && !k.toLowerCase().includes("date")) {
        (clone as any)[k] = Math.round(v * variance * 100) / 100;
      }
    }
    mockTargetingActions.push(clone);
    nextId++;
  }
})();
