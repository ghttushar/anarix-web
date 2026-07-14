export interface AnomalyAlert {
  id: string;
  metric: string;
  campaign: string;
  deviation: number; // percentage deviation
  direction: "up" | "down";
  currentValue: string;
  expectedValue: string;
  message: string;
  severity: "critical" | "warning" | "info";
  detectedAt: Date;
  acknowledged: boolean;
}

export const mockAnomalyAlerts: AnomalyAlert[] = [
  { id: "an1", metric: "ACOS", campaign: "Brand Defense - Exact Match", deviation: 42, direction: "up", currentValue: "38.2%", expectedValue: "26.9%", message: "ACOS on Brand Defense jumped 42% in the last 6 hours. Possible competitor bidding war or keyword cannibalization.", severity: "critical", detectedAt: new Date(Date.now() - 1800000), acknowledged: false },
  { id: "an2", metric: "CTR", campaign: "Category Conquest - Broad", deviation: -35, direction: "down", currentValue: "0.82%", expectedValue: "1.26%", message: "CTR dropped 35% compared to 7-day average. Check if listing images or pricing changed.", severity: "critical", detectedAt: new Date(Date.now() - 3600000), acknowledged: false },
  { id: "an3", metric: "Spend", campaign: "Product Launch - Auto", deviation: 85, direction: "up", currentValue: "$342", expectedValue: "$185", message: "Spend surged 85% above daily average. Auto campaign may be picking up expensive broad terms.", severity: "warning", detectedAt: new Date(Date.now() - 7200000), acknowledged: false },
  { id: "an4", metric: "Conversion Rate", campaign: "Retargeting - Display", deviation: -28, direction: "down", currentValue: "3.1%", expectedValue: "4.3%", message: "CVR declining steadily over 48 hours. May indicate listing suppression or inventory issue.", severity: "warning", detectedAt: new Date(Date.now() - 14400000), acknowledged: true },
  { id: "an5", metric: "ROAS", campaign: "Seasonal Push - Holiday", deviation: 25, direction: "up", currentValue: "5.8x", expectedValue: "4.6x", message: "ROAS improved 25% — likely due to seasonal demand uplift. Consider increasing budget to capture momentum.", severity: "info", detectedAt: new Date(Date.now() - 21600000), acknowledged: true },
  { id: "an6", metric: "Impressions", campaign: "Brand Defense - Exact Match", deviation: -52, direction: "down", currentValue: "12,400", expectedValue: "25,800", message: "Impression volume halved. Check if campaign is paused, out of budget, or if a competitor won the top slot.", severity: "critical", detectedAt: new Date(Date.now() - 28800000), acknowledged: false },
];
