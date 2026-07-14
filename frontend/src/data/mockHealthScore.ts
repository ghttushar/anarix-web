export interface HealthDimension {
  id: string;
  label: string;
  score: number; // 0-100
  weight: number; // percentage weight in composite
  trend: "up" | "down" | "flat";
  details: string;
  subMetrics: { label: string; value: string; status: "good" | "warning" | "critical" }[];
}

export interface HealthScoreData {
  compositeScore: number;
  previousScore: number;
  trend: "up" | "down" | "flat";
  dimensions: HealthDimension[];
  lastUpdated: Date;
}

export const mockHealthScore: HealthScoreData = {
  compositeScore: 74,
  previousScore: 71,
  trend: "up",
  lastUpdated: new Date(),
  dimensions: [
    {
      id: "profitability", label: "Profitability", score: 82, weight: 25, trend: "up",
      details: "Strong margins on core products. 3 products below target margin.",
      subMetrics: [
        { label: "Avg Profit Margin", value: "24.3%", status: "good" },
        { label: "Products Below Target", value: "3 / 45", status: "warning" },
        { label: "Revenue Growth (30d)", value: "+12.4%", status: "good" },
      ],
    },
    {
      id: "ad_efficiency", label: "Ad Efficiency", score: 68, weight: 25, trend: "down",
      details: "ROAS declined 8% this week. ACOS trending above target on 4 campaigns.",
      subMetrics: [
        { label: "Overall ROAS", value: "4.2x", status: "good" },
        { label: "Avg ACOS", value: "23.8%", status: "warning" },
        { label: "Campaigns Above Target ACOS", value: "4 / 12", status: "warning" },
      ],
    },
    {
      id: "inventory", label: "Inventory Health", score: 91, weight: 20, trend: "flat",
      details: "All products well-stocked. 2 SKUs approaching reorder point in 10 days.",
      subMetrics: [
        { label: "In-Stock Rate", value: "98.2%", status: "good" },
        { label: "Days of Supply (Avg)", value: "42 days", status: "good" },
        { label: "Approaching Stockout", value: "2 SKUs", status: "warning" },
      ],
    },
    {
      id: "keyword_coverage", label: "Keyword Coverage", score: 56, weight: 15, trend: "up",
      details: "23 products missing backend search terms. SOV below 40% on top keywords.",
      subMetrics: [
        { label: "Keyword Coverage Rate", value: "72%", status: "warning" },
        { label: "Avg SOV (Top 20 KW)", value: "38%", status: "critical" },
        { label: "Unharvested Terms", value: "145", status: "warning" },
      ],
    },
    {
      id: "buybox", label: "Buy Box", score: 78, weight: 15, trend: "flat",
      details: "Buy Box win rate is healthy overall. 5 ASINs with < 70% win rate.",
      subMetrics: [
        { label: "Avg Win Rate", value: "87.4%", status: "good" },
        { label: "ASINs < 70% Win Rate", value: "5 / 45", status: "warning" },
        { label: "Lost Due to Price", value: "3 ASINs", status: "warning" },
      ],
    },
  ],
};
