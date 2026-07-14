export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  metric: string;
  threshold: number;
  operator: ">" | "<" | ">=" | "<=" | "==";
  status: "active" | "draft" | "paused";
  createdAt: string;
  backtestResult?: BacktestResult;
}

export interface BacktestResult {
  period: string;
  daysSimulated: number;
  triggeredCount: number;
  affectedCampaigns: number;
  projectedSavings: number;
  projectedRevenueLoss: number;
  netImpact: number;
  dailyResults: { date: string; triggered: boolean; savings: number; revenueLoss: number }[];
}

export const mockRules: AutomationRule[] = [
  { id: "r1", name: "Pause High ACOS Campaigns", condition: "ACOS > 40%", action: "Pause campaign", metric: "acos", threshold: 40, operator: ">", status: "active", createdAt: "2026-02-20",
    backtestResult: { period: "Last 30 days", daysSimulated: 30, triggeredCount: 12, affectedCampaigns: 3, projectedSavings: 2840, projectedRevenueLoss: 1200, netImpact: 1640, dailyResults: Array.from({ length: 30 }, (_, i) => ({ date: `2026-02-${String(i + 1).padStart(2, "0")}`, triggered: Math.random() > 0.6, savings: Math.random() * 200, revenueLoss: Math.random() * 80 })) }
  },
  { id: "r2", name: "Boost Low ROAS Keywords", condition: "ROAS < 2.0", action: "Reduce bid by 20%", metric: "roas", threshold: 2.0, operator: "<", status: "active", createdAt: "2026-02-18",
    backtestResult: { period: "Last 30 days", daysSimulated: 30, triggeredCount: 45, affectedCampaigns: 5, projectedSavings: 1560, projectedRevenueLoss: 420, netImpact: 1140, dailyResults: Array.from({ length: 30 }, (_, i) => ({ date: `2026-02-${String(i + 1).padStart(2, "0")}`, triggered: Math.random() > 0.4, savings: Math.random() * 120, revenueLoss: Math.random() * 40 })) }
  },
  { id: "r3", name: "Scale Winners", condition: "ROAS > 5.0", action: "Increase bid by 15%", metric: "roas", threshold: 5.0, operator: ">", status: "draft", createdAt: "2026-03-01",
    backtestResult: { period: "Last 30 days", daysSimulated: 30, triggeredCount: 8, affectedCampaigns: 2, projectedSavings: -680, projectedRevenueLoss: -1890, netImpact: 1210, dailyResults: Array.from({ length: 30 }, (_, i) => ({ date: `2026-02-${String(i + 1).padStart(2, "0")}`, triggered: Math.random() > 0.7, savings: -Math.random() * 50, revenueLoss: -Math.random() * 120 })) }
  },
  { id: "r4", name: "Kill Zero Converters", condition: "Spend > $50 AND Orders == 0", action: "Negate keyword", metric: "orders", threshold: 0, operator: "==", status: "paused", createdAt: "2026-02-10",
    backtestResult: { period: "Last 30 days", daysSimulated: 30, triggeredCount: 22, affectedCampaigns: 4, projectedSavings: 3200, projectedRevenueLoss: 0, netImpact: 3200, dailyResults: Array.from({ length: 30 }, (_, i) => ({ date: `2026-02-${String(i + 1).padStart(2, "0")}`, triggered: Math.random() > 0.3, savings: Math.random() * 180, revenueLoss: 0 })) }
  },
];
