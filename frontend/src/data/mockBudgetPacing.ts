export interface PacingCampaign {
  id: string;
  name: string;
  dailyBudget: number;
  monthlyBudget: number;
  spentToday: number;
  spentThisMonth: number;
  daysElapsed: number;
  daysInMonth: number;
  projectedMonthlySpend: number;
  burnRate: number; // percentage of daily budget consumed
  status: "on_track" | "overspending" | "underspending" | "depleted";
  hourlySpend: number[]; // 24 hours of spend data
}

export interface PacingAlert {
  id: string;
  campaignId: string;
  campaignName: string;
  type: "overspend" | "underspend" | "depleted" | "pacing_high";
  message: string;
  severity: "critical" | "warning" | "info";
  timestamp: Date;
}

const generateHourlySpend = (dailyBudget: number, burnRate: number): number[] => {
  const hours: number[] = [];
  const currentHour = new Date().getHours();
  let remaining = dailyBudget * (burnRate / 100);
  for (let i = 0; i < 24; i++) {
    if (i <= currentHour) {
      const peak = i >= 8 && i <= 20 ? 1.4 : 0.6;
      const hourSpend = (remaining / (currentHour + 1)) * peak * (0.8 + Math.random() * 0.4);
      hours.push(Math.max(0, hourSpend));
    } else {
      hours.push(0);
    }
  }
  return hours;
};

export const mockPacingCampaigns: PacingCampaign[] = [
  {
    id: "pc-1", name: "Brand Defense - Exact Match", dailyBudget: 500, monthlyBudget: 15000,
    spentToday: 423, spentThisMonth: 8450, daysElapsed: 17, daysInMonth: 30,
    projectedMonthlySpend: 14912, burnRate: 84.6, status: "on_track",
    hourlySpend: generateHourlySpend(500, 84.6),
  },
  {
    id: "pc-2", name: "Category Conquest - Broad", dailyBudget: 300, monthlyBudget: 9000,
    spentToday: 298, spentThisMonth: 6120, daysElapsed: 17, daysInMonth: 30,
    projectedMonthlySpend: 10800, burnRate: 99.3, status: "overspending",
    hourlySpend: generateHourlySpend(300, 99.3),
  },
  {
    id: "pc-3", name: "Product Launch - Auto", dailyBudget: 200, monthlyBudget: 6000,
    spentToday: 88, spentThisMonth: 2100, daysElapsed: 17, daysInMonth: 30,
    projectedMonthlySpend: 3706, burnRate: 44.0, status: "underspending",
    hourlySpend: generateHourlySpend(200, 44.0),
  },
  {
    id: "pc-4", name: "Retargeting - Display", dailyBudget: 150, monthlyBudget: 4500,
    spentToday: 150, spentThisMonth: 3200, daysElapsed: 17, daysInMonth: 30,
    projectedMonthlySpend: 5647, burnRate: 100, status: "depleted",
    hourlySpend: generateHourlySpend(150, 100),
  },
  {
    id: "pc-5", name: "Seasonal Push - Holiday", dailyBudget: 800, monthlyBudget: 24000,
    spentToday: 612, spentThisMonth: 12800, daysElapsed: 17, daysInMonth: 30,
    projectedMonthlySpend: 22588, burnRate: 76.5, status: "on_track",
    hourlySpend: generateHourlySpend(800, 76.5),
  },
];

export const mockPacingAlerts: PacingAlert[] = [
  { id: "a1", campaignId: "pc-4", campaignName: "Retargeting - Display", type: "depleted", message: "Daily budget fully consumed by 2:00 PM. Missing peak evening traffic.", severity: "critical", timestamp: new Date(Date.now() - 3600000) },
  { id: "a2", campaignId: "pc-2", campaignName: "Category Conquest - Broad", type: "overspend", message: "Projected to exceed monthly budget by $1,800 (20%). Consider reducing bids.", severity: "warning", timestamp: new Date(Date.now() - 7200000) },
  { id: "a3", campaignId: "pc-3", campaignName: "Product Launch - Auto", type: "underspend", message: "Only 44% of daily budget consumed. Low impression volume may indicate targeting issues.", severity: "warning", timestamp: new Date(Date.now() - 10800000) },
  { id: "a4", campaignId: "pc-1", campaignName: "Brand Defense - Exact Match", type: "pacing_high", message: "Pacing is healthy at 84.6%. On track for monthly target.", severity: "info", timestamp: new Date(Date.now() - 14400000) },
];
