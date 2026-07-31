// Day Parting Types

export interface HourlyDataPoint {
  hour: number; // 0-23
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  date: string;
  spend: number;
  revenue: number;
  orders: number;
  units: number;
  impressions: number;
  clicks: number;
  roas: number;
  acos: number;
  ctr: number;
  cvr: number;
}

export interface DayPartingSchedule {
  id: string;
  name: string;
  campaignIds: string[];
  campaignNames: string[];
  actionType: "pause" | "reduce_budget" | "increase_budget";
  budgetModifier?: number; // percentage (e.g., -30 for 30% reduction)
  hours: number[]; // array of hours (0-23)
  daysOfWeek: number[]; // array of days (0-6)
  startDate: string;
  endDate?: string;
  repeatType: "daily" | "weekly" | "custom" | "once";
  status: "active" | "paused" | "completed" | "draft";
  createdAt: string;
  updatedAt: string;
  nextRun?: string;
  lastRun?: string;
}

export interface ExecutionHistory {
  id: string;
  scheduleId: string;
  scheduleName: string;
  campaignId: string;
  campaignName: string;
  executedAt: string;
  action: string;
  actionDetails: string;
  status: "success" | "failed" | "partial" | "cancelled";
  errorMessage?: string;
  duration: number; // in milliseconds
  budgetBefore?: number;
  budgetAfter?: number;
}

export interface DayPartingCampaign {
  id: string;
  name: string;
  status: "enabled" | "paused";
  budget: number;
  spend: number;
  revenue: number;
  roas: number;
  hasSchedule: boolean;
  scheduleCount: number;
  hourlyData: HourlyDataPoint[];
}

export interface HourlyMetricsSummary {
  totalSpend: number;
  totalRevenue: number;
  totalOrders: number;
  totalUnits: number;
  avgRoas: number;
  avgAcos: number;
}

export type MetricType = "spend" | "revenue" | "roas" | "acos" | "orders" | "units" | "impressions" | "clicks" | "ctr" | "cvr";
