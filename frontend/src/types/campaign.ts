export type CampaignStatus = 
  | "live" 
  | "paused" 
  | "archived" 
  | "scheduled" 
  | "out_of_budget" 
  | "completed";

export type CampaignType = "auto" | "manual";

export type BiddingStrategy = "Dynamic Down" | "Dynamic Up/Down" | "Fixed";

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  type: CampaignType;
  isActive: boolean;
  dailyBudget: number;
  totalBudget?: number; // Walmart only
  biddingStrategy: BiddingStrategy;
  spend: number;
  sales: number;
  roas: number;
  impressions: number;
  clicks: number;
  ctr: number;
  cpc: number;
  acos: number;
  orders: number;
  units: number;
  startDate: string;
  endDate?: string;
}

export interface KPIData {
  label: string;
  value: number;
  previousValue: number;
  format: "currency" | "number" | "percentage" | "decimal";
  trend: "up" | "down" | "neutral";
}

export interface ChartDataPoint {
  date: string;
  adSpend?: number;
  adSales?: number;
  roas?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cpc?: number;
  acos?: number;
}

export type MetricKey = 
  | "adSpend" 
  | "adSales" 
  | "roas" 
  | "impressions" 
  | "clicks" 
  | "ctr" 
  | "cpc" 
  | "acos";

export interface MetricConfig {
  key: MetricKey;
  label: string;
  color: string;
  format: "currency" | "number" | "percentage" | "decimal";
  yAxisId?: "left" | "right";
}
