import { HourlyDataPoint, DayPartingSchedule, ExecutionHistory, DayPartingCampaign, HourlyMetricsSummary } from "@/types/dayparting";

// Generate realistic hourly data
const generateHourlyData = (baseSpend: number, baseRevenue: number): HourlyDataPoint[] => {
  const data: HourlyDataPoint[] = [];
  const days = ["2026-01-27", "2026-01-28", "2026-01-29", "2026-01-30", "2026-01-31", "2026-02-01", "2026-02-02"];
  
  days.forEach((date, dayIndex) => {
    for (let hour = 0; hour < 24; hour++) {
      // Simulate traffic patterns - peak during afternoon/evening
      let multiplier = 0.3;
      if (hour >= 6 && hour < 9) multiplier = 0.6;
      else if (hour >= 9 && hour < 12) multiplier = 0.9;
      else if (hour >= 12 && hour < 14) multiplier = 0.8;
      else if (hour >= 14 && hour < 18) multiplier = 1.0;
      else if (hour >= 18 && hour < 22) multiplier = 1.2;
      else if (hour >= 22) multiplier = 0.5;
      
      // Add some randomness
      multiplier *= (0.8 + Math.random() * 0.4);
      
      const spend = baseSpend * multiplier;
      const revenue = baseRevenue * multiplier * (0.9 + Math.random() * 0.3);
      const orders = Math.floor(revenue / 85);
      const units = orders + Math.floor(Math.random() * orders * 0.3);
      const impressions = Math.floor(spend * 150 * (0.8 + Math.random() * 0.4));
      const clicks = Math.floor(impressions * (0.02 + Math.random() * 0.01));
      
      data.push({
        hour,
        dayOfWeek: dayIndex,
        date,
        spend: Math.round(spend * 100) / 100,
        revenue: Math.round(revenue * 100) / 100,
        orders,
        units,
        impressions,
        clicks,
        roas: revenue / spend,
        acos: (spend / revenue) * 100,
        ctr: (clicks / impressions) * 100,
        cvr: (orders / clicks) * 100,
      });
    }
  });
  
  return data;
};

export const hourlyData = generateHourlyData(45, 180);

export const calculateHourlySummary = (data: HourlyDataPoint[]): HourlyMetricsSummary => {
  const totals = data.reduce((acc, d) => ({
    totalSpend: acc.totalSpend + d.spend,
    totalRevenue: acc.totalRevenue + d.revenue,
    totalOrders: acc.totalOrders + d.orders,
    totalUnits: acc.totalUnits + d.units,
  }), { totalSpend: 0, totalRevenue: 0, totalOrders: 0, totalUnits: 0 });
  
  return {
    ...totals,
    avgRoas: totals.totalRevenue / totals.totalSpend,
    avgAcos: (totals.totalSpend / totals.totalRevenue) * 100,
  };
};

export const dayPartingCampaigns: DayPartingCampaign[] = [
  {
    id: "camp-1",
    name: "SP - NapQueen Memory Foam - Exact",
    status: "enabled",
    budget: 150,
    spend: 142.50,
    revenue: 567.80,
    roas: 3.98,
    hasSchedule: true,
    scheduleCount: 2,
    hourlyData: generateHourlyData(6, 24),
  },
  {
    id: "camp-2",
    name: "SP - NapQueen Hybrid - Broad",
    status: "enabled",
    budget: 200,
    spend: 185.20,
    revenue: 689.45,
    roas: 3.72,
    hasSchedule: true,
    scheduleCount: 1,
    hourlyData: generateHourlyData(8, 29),
  },
  {
    id: "camp-3",
    name: "SB - Brand Defense",
    status: "enabled",
    budget: 100,
    spend: 89.40,
    revenue: 423.10,
    roas: 4.73,
    hasSchedule: false,
    scheduleCount: 0,
    hourlyData: generateHourlyData(4, 18),
  },
  {
    id: "camp-4",
    name: "SP - Competitor Targeting",
    status: "paused",
    budget: 75,
    spend: 0,
    revenue: 0,
    roas: 0,
    hasSchedule: true,
    scheduleCount: 1,
    hourlyData: generateHourlyData(3, 10),
  },
  {
    id: "camp-5",
    name: "SB - Category - Mattress",
    status: "enabled",
    budget: 250,
    spend: 234.80,
    revenue: 1023.45,
    roas: 4.36,
    hasSchedule: false,
    scheduleCount: 0,
    hourlyData: generateHourlyData(10, 43),
  },
];

export const schedules: DayPartingSchedule[] = [
  {
    id: "sched-1",
    name: "Night Hours Pause",
    campaignIds: ["camp-1", "camp-2"],
    campaignNames: ["SP - NapQueen Memory Foam - Exact", "SP - NapQueen Hybrid - Broad"],
    actionType: "pause",
    hours: [0, 1, 2, 3, 4, 5],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    startDate: "2026-01-15",
    repeatType: "daily",
    status: "active",
    createdAt: "2026-01-14T10:00:00Z",
    updatedAt: "2026-01-14T10:00:00Z",
    nextRun: "2026-02-02T00:00:00Z",
    lastRun: "2026-02-01T00:00:00Z",
  },
  {
    id: "sched-2",
    name: "Peak Hours Budget Boost",
    campaignIds: ["camp-1"],
    campaignNames: ["SP - NapQueen Memory Foam - Exact"],
    actionType: "increase_budget",
    budgetModifier: 30,
    hours: [18, 19, 20, 21],
    daysOfWeek: [1, 2, 3, 4, 5],
    startDate: "2026-01-20",
    repeatType: "weekly",
    status: "active",
    createdAt: "2026-01-19T14:30:00Z",
    updatedAt: "2026-01-25T09:00:00Z",
    nextRun: "2026-02-03T18:00:00Z",
    lastRun: "2026-01-31T18:00:00Z",
  },
  {
    id: "sched-3",
    name: "Weekend Reduction",
    campaignIds: ["camp-4"],
    campaignNames: ["SP - Competitor Targeting"],
    actionType: "reduce_budget",
    budgetModifier: -40,
    hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    daysOfWeek: [0, 6],
    startDate: "2026-01-10",
    repeatType: "weekly",
    status: "paused",
    createdAt: "2026-01-09T16:00:00Z",
    updatedAt: "2026-01-28T11:00:00Z",
    lastRun: "2026-01-26T00:00:00Z",
  },
  {
    id: "sched-4",
    name: "Morning Slow Start",
    campaignIds: ["camp-2", "camp-5"],
    campaignNames: ["SP - NapQueen Hybrid - Broad", "SB - Category - Mattress"],
    actionType: "reduce_budget",
    budgetModifier: -20,
    hours: [6, 7, 8],
    daysOfWeek: [1, 2, 3, 4, 5],
    startDate: "2026-02-01",
    repeatType: "daily",
    status: "draft",
    createdAt: "2026-01-31T09:00:00Z",
    updatedAt: "2026-01-31T09:00:00Z",
  },
];

export const executionHistory: ExecutionHistory[] = [
  {
    id: "exec-1",
    scheduleId: "sched-1",
    scheduleName: "Night Hours Pause",
    campaignId: "camp-1",
    campaignName: "SP - NapQueen Memory Foam - Exact",
    executedAt: "2026-02-01T00:00:15Z",
    action: "pause",
    actionDetails: "Campaign paused for night hours (12AM - 6AM)",
    status: "success",
    duration: 1250,
  },
  {
    id: "exec-2",
    scheduleId: "sched-1",
    scheduleName: "Night Hours Pause",
    campaignId: "camp-2",
    campaignName: "SP - NapQueen Hybrid - Broad",
    executedAt: "2026-02-01T00:00:18Z",
    action: "pause",
    actionDetails: "Campaign paused for night hours (12AM - 6AM)",
    status: "success",
    duration: 980,
  },
  {
    id: "exec-3",
    scheduleId: "sched-2",
    scheduleName: "Peak Hours Budget Boost",
    campaignId: "camp-1",
    campaignName: "SP - NapQueen Memory Foam - Exact",
    executedAt: "2026-01-31T18:00:05Z",
    action: "increase_budget",
    actionDetails: "Budget increased by 30% ($150 → $195)",
    status: "success",
    duration: 1520,
    budgetBefore: 150,
    budgetAfter: 195,
  },
  {
    id: "exec-4",
    scheduleId: "sched-1",
    scheduleName: "Night Hours Pause",
    campaignId: "camp-1",
    campaignName: "SP - NapQueen Memory Foam - Exact",
    executedAt: "2026-01-31T06:00:10Z",
    action: "enable",
    actionDetails: "Campaign re-enabled after night hours pause",
    status: "success",
    duration: 1100,
  },
  {
    id: "exec-5",
    scheduleId: "sched-3",
    scheduleName: "Weekend Reduction",
    campaignId: "camp-4",
    campaignName: "SP - Competitor Targeting",
    executedAt: "2026-01-26T00:00:22Z",
    action: "reduce_budget",
    actionDetails: "Budget reduced by 40% ($75 → $45)",
    status: "failed",
    errorMessage: "Campaign is currently paused. Cannot modify budget.",
    duration: 450,
    budgetBefore: 75,
  },
  {
    id: "exec-6",
    scheduleId: "sched-2",
    scheduleName: "Peak Hours Budget Boost",
    campaignId: "camp-1",
    campaignName: "SP - NapQueen Memory Foam - Exact",
    executedAt: "2026-01-31T22:00:08Z",
    action: "reduce_budget",
    actionDetails: "Budget restored to original ($195 → $150)",
    status: "success",
    duration: 1340,
    budgetBefore: 195,
    budgetAfter: 150,
  },
];

export const getHourlyAggregates = (data: HourlyDataPoint[]): Record<number, HourlyDataPoint> => {
  const aggregates: Record<number, { spend: number; revenue: number; orders: number; count: number }> = {};
  
  data.forEach((d) => {
    if (!aggregates[d.hour]) {
      aggregates[d.hour] = { spend: 0, revenue: 0, orders: 0, count: 0 };
    }
    aggregates[d.hour].spend += d.spend;
    aggregates[d.hour].revenue += d.revenue;
    aggregates[d.hour].orders += d.orders;
    aggregates[d.hour].count += 1;
  });
  
  const result: Record<number, HourlyDataPoint> = {};
  Object.entries(aggregates).forEach(([hour, agg]) => {
    const h = parseInt(hour);
    result[h] = {
      hour: h,
      dayOfWeek: 0,
      date: "",
      spend: agg.spend / agg.count,
      revenue: agg.revenue / agg.count,
      orders: Math.round(agg.orders / agg.count),
      units: 0,
      impressions: 0,
      clicks: 0,
      roas: agg.revenue / agg.spend,
      acos: (agg.spend / agg.revenue) * 100,
      ctr: 0,
      cvr: 0,
    };
  });
  
  return result;
};
