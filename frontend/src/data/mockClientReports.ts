export interface ClientReport {
  id: string;
  name: string;
  clientName: string;
  status: "draft" | "generated" | "sent" | "scheduled";
  period: string;
  generatedAt?: string;
  sentAt?: string;
  scheduleCron?: string;
  sections: string[];
}

export const mockClientReports: ClientReport[] = [
  { id: "rpt1", name: "Monthly Performance Summary", clientName: "Acme Nutrition", status: "sent", period: "February 2026", generatedAt: "2026-03-01T10:00:00Z", sentAt: "2026-03-01T10:05:00Z", sections: ["Executive Summary", "Revenue & Profitability", "Advertising Performance", "Keyword Analysis", "Recommendations"] },
  { id: "rpt2", name: "Weekly Ad Performance", clientName: "Acme Nutrition", status: "scheduled", period: "Week of Mar 3", scheduleCron: "Every Monday at 9 AM", sections: ["Ad Spend Summary", "Top Campaigns", "New Keywords", "Budget Pacing"] },
  { id: "rpt3", name: "Quarterly Business Review", clientName: "FitLife Brands", status: "draft", period: "Q1 2026", sections: ["Market Overview", "Revenue Trends", "Competitive Analysis", "Growth Opportunities", "Action Plan"] },
  { id: "rpt4", name: "Monthly Performance Summary", clientName: "FitLife Brands", status: "generated", period: "February 2026", generatedAt: "2026-03-02T14:30:00Z", sections: ["Executive Summary", "Revenue & Profitability", "Advertising Performance", "Recommendations"] },
  { id: "rpt5", name: "Campaign Launch Report", clientName: "PureVitality", status: "sent", period: "Feb 15-28", generatedAt: "2026-03-01T08:00:00Z", sentAt: "2026-03-01T08:15:00Z", sections: ["Launch Overview", "Initial Performance", "Keyword Discovery", "Optimization Plan"] },
];
