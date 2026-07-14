// Extended types for the complete Advertising section

export type CampaignStatus = 
  | "live" 
  | "paused" 
  | "archived" 
  | "scheduled" 
  | "out_of_budget" 
  | "completed";

export type CampaignType = "auto" | "manual";
export type MatchType = "broad" | "exact" | "phrase";
export type SearchTermType = "branded" | "competitor" | "generic";

// Ad Groups
export interface AdGroup {
  id: string;
  name: string;
  campaignId: string;
  campaignName: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  bidAutomation: boolean;
  minBid: number;
  maxBid: number;
  targetRoas: number;
  impressions: number;
  clicks: number;
  ctr: number;
  adUnits: number;
  cvr: number;
  cpc: number;
  adSpend: number;
  adSales: number;
  roas: number;
  acos: number;
}

// Product Ads
export interface ProductAd {
  id: string;
  productName: string;
  productImage: string;
  itemId: string;
  sku: string;
  adGroupId: string;
  adGroupName: string;
  campaignId: string;
  campaignName: string;
  status: CampaignStatus;
  bidAutomation: boolean;
  minBid: number;
  maxBid: number;
  targetRoas: number;
  productBid: number;
  impressions: number;
  clicks: number;
  ctr: number;
  adUnits: number;
  cvr: number;
  cpc: number;
  adSpend: number;
}

// Keywords
export interface Keyword {
  id: string;
  keyword: string;
  matchType: MatchType;
  adGroupId: string;
  adGroupName: string;
  campaignId: string;
  campaignName: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  bidAutomation: boolean;
  minBid: number;
  maxBid: number;
  targetRoas: number;
  bid: number;
  impressions: number;
  clicks: number;
  ctr: number;
  adUnits: number;
  cvr: number;
  cpc: number;
  adSpend: number;
}

// Search Terms
export interface SearchTerm {
  id: string;
  searchTerm: string;
  productAdId: string;
  productName: string;
  productImage: string;
  itemId: string;
  keywordId: string;
  keyword: string;
  matchType: MatchType;
  adGroupId: string;
  adGroupName: string;
  campaignId: string;
  campaignName: string;
  impressions: number;
  clicks: number;
  ctr: number;
  adUnits: number;
  cvr: number;
  cpc: number;
  adSpend: number;
}

// Page Type (Walmart specific)
export interface PageTypeData {
  id: string;
  pageType: string;
  bidModifier: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  adSpend: number;
  adSales: number;
  roas: number;
  acos: number;
}

// Product Targeting
export interface ProductTarget {
  id: string;
  targetType: "asin" | "category";
  targetValue: string;
  targetLabel: string;
  adGroupId: string;
  adGroupName: string;
  campaignId: string;
  campaignName: string;
  campaignType: CampaignType;
  status: CampaignStatus;
  bidAutomation: boolean;
  minBid: number;
  maxBid: number;
  targetBid: number;
  impressions: number;
  clicks: number;
  ctr: number;
  adUnits: number;
  cvr: number;
  cpc: number;
  adSpend: number;
  adSales: number;
  roas: number;
  acos: number;
}

// Platform (Walmart specific)
export interface PlatformData {
  id: string;
  platform: string;
  bidModifier: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  adSpend: number;
  adSales: number;
  roas: number;
  acos: number;
}

// Impact Analysis
export interface ImpactComparison {
  id: string;
  name: string;
  type?: string;
  campaignId?: string;
  adGroupId?: string;
  impactPercentage: number;
  baseline: {
    impressions: number;
    clicks: number;
    ctr: number;
    adSpend: number;
    adSales: number;
    roas: number;
    acos: number;
  };
  impact: {
    impressions: number;
    clicks: number;
    ctr: number;
    adSpend: number;
    adSales: number;
    roas: number;
    acos: number;
  };
}

// Targeting Actions
export interface TargetingAction {
  id: string;
  searchTerm: string;
  termType: SearchTermType;
  normalizedTerm: string;
  sourceCampaignId: string;
  sourceCampaignName: string;
  sourceAdGroupId: string;
  sourceAdGroupName: string;
  targetCampaignId?: string;
  targetAdGroupId?: string;
  matchTypes: {
    broad: { selected: boolean; bid: number };
    exact: { selected: boolean; bid: number };
    phrase: { selected: boolean; bid: number };
  };
  archived: boolean;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  adSpend: number;
  adSales: number;
  adUnits: number;
  cvr: number;
  roas: number;
}
