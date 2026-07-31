import {
  HourlyDataPoint,
  DayPartingSchedule,
  ExecutionHistory,
  DayPartingCampaign,
  HourlyMetricsSummary,
} from "@/types/dayparting";

// ============================================================
// API response interfaces
// ============================================================

export interface ApiHourlyDataPoint {
  hour: number;
  day_of_week: number;
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

export interface ApiDayPartingSchedule {
  id: string;
  name: string;
  campaign_ids: string[];
  campaign_names: string[];
  action_type: "pause" | "reduce_budget" | "increase_budget";
  budget_modifier?: number;
  hours: number[];
  days_of_week: number[];
  start_date: string;
  end_date?: string;
  repeat_type: "daily" | "weekly" | "custom" | "once";
  status: "active" | "paused" | "completed" | "draft";
  created_at: string;
  updated_at: string;
  next_run?: string;
  last_run?: string;
}

export interface ApiExecutionHistory {
  id: string;
  schedule_id: string;
  schedule_name: string;
  campaign_id: string;
  campaign_name: string;
  executed_at: string;
  action: string;
  action_details: string;
  status: "success" | "failed" | "partial" | "cancelled";
  error_message?: string;
  duration: number;
  budget_before?: number;
  budget_after?: number;
}

export interface ApiDayPartingCampaign {
  id: string;
  name: string;
  status: "enabled" | "paused";
  budget: number;
  spend: number;
  revenue: number;
  roas: number;
  has_schedule: boolean;
  schedule_count: number;
  hourly_data: ApiHourlyDataPoint[];
}

export interface ApiHourlyMetricsSummary {
  total_spend: number;
  total_revenue: number;
  total_orders: number;
  total_units: number;
  avg_roas: number;
  avg_acos: number;
}

// ============================================================
// Adapter functions
// ============================================================

export function adaptHourlyDataPoint(api: ApiHourlyDataPoint): HourlyDataPoint {
  return {
    hour: api.hour,
    dayOfWeek: api.day_of_week,
    date: api.date,
    spend: api.spend,
    revenue: api.revenue,
    orders: api.orders,
    units: api.units,
    impressions: api.impressions,
    clicks: api.clicks,
    roas: api.roas,
    acos: api.acos,
    ctr: api.ctr,
    cvr: api.cvr,
  };
}

export function adaptHourlyDataPoints(apiList: ApiHourlyDataPoint[]): HourlyDataPoint[] {
  return apiList.map(adaptHourlyDataPoint);
}

export function adaptDayPartingSchedule(api: ApiDayPartingSchedule): DayPartingSchedule {
  return {
    id: api.id,
    name: api.name,
    campaignIds: api.campaign_ids,
    campaignNames: api.campaign_names,
    actionType: api.action_type,
    budgetModifier: api.budget_modifier,
    hours: api.hours,
    daysOfWeek: api.days_of_week,
    startDate: api.start_date,
    endDate: api.end_date,
    repeatType: api.repeat_type,
    status: api.status,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
    nextRun: api.next_run,
    lastRun: api.last_run,
  };
}

export function adaptDayPartingSchedules(apiList: ApiDayPartingSchedule[]): DayPartingSchedule[] {
  return apiList.map(adaptDayPartingSchedule);
}

export function adaptExecutionHistory(api: ApiExecutionHistory): ExecutionHistory {
  return {
    id: api.id,
    scheduleId: api.schedule_id,
    scheduleName: api.schedule_name,
    campaignId: api.campaign_id,
    campaignName: api.campaign_name,
    executedAt: api.executed_at,
    action: api.action,
    actionDetails: api.action_details,
    status: api.status,
    errorMessage: api.error_message,
    duration: api.duration,
    budgetBefore: api.budget_before,
    budgetAfter: api.budget_after,
  };
}

export function adaptExecutionHistories(apiList: ApiExecutionHistory[]): ExecutionHistory[] {
  return apiList.map(adaptExecutionHistory);
}

export function adaptDayPartingCampaign(api: ApiDayPartingCampaign): DayPartingCampaign {
  return {
    id: api.id,
    name: api.name,
    status: api.status,
    budget: api.budget,
    spend: api.spend,
    revenue: api.revenue,
    roas: api.roas,
    hasSchedule: api.has_schedule,
    scheduleCount: api.schedule_count,
    hourlyData: adaptHourlyDataPoints(api.hourly_data),
  };
}

export function adaptDayPartingCampaigns(apiList: ApiDayPartingCampaign[]): DayPartingCampaign[] {
  return apiList.map(adaptDayPartingCampaign);
}

export function adaptHourlyMetricsSummary(api: ApiHourlyMetricsSummary): HourlyMetricsSummary {
  return {
    totalSpend: api.total_spend,
    totalRevenue: api.total_revenue,
    totalOrders: api.total_orders,
    totalUnits: api.total_units,
    avgRoas: api.avg_roas,
    avgAcos: api.avg_acos,
  };
}

// ============================================================
// Reverse adapters (UI → API request)
// ============================================================

export function toApiSchedule(schedule: DayPartingSchedule): ApiDayPartingSchedule {
  return {
    id: schedule.id,
    name: schedule.name,
    campaign_ids: schedule.campaignIds,
    campaign_names: schedule.campaignNames,
    action_type: schedule.actionType,
    budget_modifier: schedule.budgetModifier,
    hours: schedule.hours,
    days_of_week: schedule.daysOfWeek,
    start_date: schedule.startDate,
    end_date: schedule.endDate,
    repeat_type: schedule.repeatType,
    status: schedule.status,
    created_at: schedule.createdAt,
    updated_at: schedule.updatedAt,
    next_run: schedule.nextRun,
    last_run: schedule.lastRun,
  };
}
