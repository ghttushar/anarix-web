import { MetricConfig, MetricKey } from "@/types/campaign";

// Chart colors locked per metric - using CSS custom properties for theme support
export const CHART_COLORS: Record<MetricKey, string> = {
  adSpend: "hsl(229, 65%, 57%)",      // Primary - #4A62D9
  adSales: "hsl(142, 71%, 45%)",      // Success - #22C55E
  roas: "hsl(38, 92%, 50%)",          // Warning - #F59E0B
  impressions: "hsl(230, 29%, 69%)",  // Muted - #9CA2C8
  clicks: "hsl(231, 88%, 70%)",       // Primary light - #6E82F5
  ctr: "hsl(231, 74%, 81%)",          // Accent - #A7AEF2
  cpc: "hsl(234, 30%, 24%)",          // Secondary - #2A2D4F
  acos: "hsl(0, 84%, 60%)",           // Destructive - #EF4444
};

export const METRIC_CONFIGS: MetricConfig[] = [
  { key: "adSpend", label: "Ad Spend", color: CHART_COLORS.adSpend, format: "currency", yAxisId: "left" },
  { key: "adSales", label: "Ad Sales", color: CHART_COLORS.adSales, format: "currency", yAxisId: "left" },
  { key: "roas", label: "ROAS", color: CHART_COLORS.roas, format: "decimal", yAxisId: "right" },
  { key: "impressions", label: "Impressions", color: CHART_COLORS.impressions, format: "number", yAxisId: "right" },
  { key: "clicks", label: "Clicks", color: CHART_COLORS.clicks, format: "number", yAxisId: "right" },
  { key: "ctr", label: "CTR", color: CHART_COLORS.ctr, format: "percentage", yAxisId: "right" },
  { key: "cpc", label: "CPC", color: CHART_COLORS.cpc, format: "currency", yAxisId: "right" },
  { key: "acos", label: "ACOS", color: CHART_COLORS.acos, format: "percentage", yAxisId: "right" },
];

export const MAX_VISIBLE_METRICS = 4;

export const DEFAULT_SELECTED_METRICS: MetricKey[] = ["adSpend", "adSales", "roas", "acos"];
