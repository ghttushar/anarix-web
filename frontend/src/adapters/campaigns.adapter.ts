import { Campaign, ChartDataPoint, KPIData, MetricConfig } from "@/types/campaign";

// ============================================================
// API response interfaces
// ============================================================

export interface ApiCampaign {
  id: string;
  campaign_name: string;
  status: "live" | "paused" | "archived" | "scheduled" | "out_of_budget" | "completed";
  campaign_type: "auto" | "manual";
  is_active: boolean;
  daily_budget: number;
  total_budget?: number;
  bidding_strategy: "Dynamic Down" | "Dynamic Up/Down" | "Fixed";
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
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  portfolio_id?: string;
  portfolio_name?: string;
  marketplace: string;
  currency: string;
}

export interface ApiChartDataPoint {
  date: string;
  ad_spend?: number;
  ad_sales?: number;
  roas?: number;
  impressions?: number;
  clicks?: number;
  ctr?: number;
  cpc?: number;
  acos?: number;
}

export interface ApiKPIData {
  label: string;
  value: number;
  previous_value: number;
  format: "currency" | "number" | "percentage" | "decimal";
  trend: "up" | "down" | "neutral";
}

export interface ApiMetricConfig {
  key: string;
  label: string;
  color: string;
  format: "currency" | "number" | "percentage" | "decimal";
  y_axis_id?: "left" | "right";
}

// ============================================================
// Adapter functions
// ============================================================

export function adaptCampaign(api: ApiCampaign): Campaign {
  return {
    id: api.id,
    name: api.campaign_name,
    status: api.status,
    type: api.campaign_type,
    isActive: api.is_active,
    dailyBudget: api.daily_budget,
    totalBudget: api.total_budget,
    biddingStrategy: api.bidding_strategy,
    spend: api.spend,
    sales: api.sales,
    roas: api.roas,
    impressions: api.impressions,
    clicks: api.clicks,
    ctr: api.ctr,
    cpc: api.cpc,
    acos: api.acos,
    orders: api.orders,
    units: api.units,
    startDate: api.start_date,
    endDate: api.end_date,
  };
}

export function adaptCampaigns(apiList: ApiCampaign[]): Campaign[] {
  return apiList.map(adaptCampaign);
}

export function adaptChartDataPoint(api: ApiChartDataPoint): ChartDataPoint {
  return {
    date: api.date,
    adSpend: api.ad_spend,
    adSales: api.ad_sales,
    roas: api.roas,
    impressions: api.impressions,
    clicks: api.clicks,
    ctr: api.ctr,
    cpc: api.cpc,
    acos: api.acos,
  };
}

export function adaptChartDataPoints(apiList: ApiChartDataPoint[]): ChartDataPoint[] {
  return apiList.map(adaptChartDataPoint);
}

export function adaptKPIData(api: ApiKPIData): KPIData {
  return {
    label: api.label,
    value: api.value,
    previousValue: api.previous_value,
    format: api.format,
    trend: api.trend,
  };
}

export function adaptKPIDataList(apiList: ApiKPIData[]): KPIData[] {
  return apiList.map(adaptKPIData);
}

export function adaptMetricConfig(api: ApiMetricConfig): MetricConfig {
  return {
    key: api.key as MetricConfig["key"],
    label: api.label,
    color: api.color,
    format: api.format,
    yAxisId: api.y_axis_id,
  };
}

// ============================================================
// Reverse adapters (UI → API request)
// ============================================================

export function toApiCampaign(campaign: Campaign): Partial<ApiCampaign> {
  return {
    campaign_name: campaign.name,
    status: campaign.status,
    campaign_type: campaign.type,
    is_active: campaign.isActive,
    daily_budget: campaign.dailyBudget,
    total_budget: campaign.totalBudget,
    bidding_strategy: campaign.biddingStrategy,
    start_date: campaign.startDate,
    end_date: campaign.endDate,
  };
}
