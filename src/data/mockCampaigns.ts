import { Campaign, ChartDataPoint, KPIData } from "@/types/campaign";

export const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Brand Awareness - Q1 2026",
    status: "live",
    type: "auto",
    isActive: true,
    dailyBudget: 150,
    totalBudget: 4500,
    biddingStrategy: "Dynamic Down",
    spend: 2847.32,
    sales: 12453.87,
    roas: 4.37,
    impressions: 245678,
    clicks: 3421,
    ctr: 1.39,
    cpc: 0.83,
    acos: 22.86,
    orders: 187,
    units: 234,
    startDate: "2026-01-01",
  },
  {
    id: "2",
    name: "Summer Sale Campaign",
    status: "paused",
    type: "manual",
    isActive: false,
    dailyBudget: 200,
    totalBudget: 6000,
    biddingStrategy: "Dynamic Up/Down",
    spend: 1523.45,
    sales: 5678.90,
    roas: 3.73,
    impressions: 156789,
    clicks: 2134,
    ctr: 1.36,
    cpc: 0.71,
    acos: 26.83,
    orders: 89,
    units: 112,
    startDate: "2025-12-15",
    endDate: "2026-02-28",
  },
  {
    id: "3",
    name: "Holiday Specials 2025",
    status: "completed",
    type: "manual",
    isActive: false,
    dailyBudget: 300,
    totalBudget: 9000,
    biddingStrategy: "Fixed",
    spend: 8756.23,
    sales: 34521.67,
    roas: 3.94,
    impressions: 567890,
    clicks: 8765,
    ctr: 1.54,
    cpc: 1.00,
    acos: 25.37,
    orders: 456,
    units: 567,
    startDate: "2025-11-15",
    endDate: "2025-12-31",
  },
  {
    id: "4",
    name: "Organic Products Launch",
    status: "live",
    type: "auto",
    isActive: true,
    dailyBudget: 100,
    totalBudget: 3000,
    biddingStrategy: "Dynamic Down",
    spend: 876.54,
    sales: 4532.10,
    roas: 5.17,
    impressions: 98765,
    clicks: 1543,
    ctr: 1.56,
    cpc: 0.57,
    acos: 19.34,
    orders: 76,
    units: 89,
    startDate: "2026-01-10",
  },
  {
    id: "5",
    name: "Competitor Targeting",
    status: "out_of_budget",
    type: "manual",
    isActive: true,
    dailyBudget: 50,
    totalBudget: 1500,
    biddingStrategy: "Dynamic Up/Down",
    spend: 1500.00,
    sales: 3245.67,
    roas: 2.16,
    impressions: 67890,
    clicks: 987,
    ctr: 1.45,
    cpc: 1.52,
    acos: 46.22,
    orders: 34,
    units: 45,
    startDate: "2026-01-05",
  },
  {
    id: "6",
    name: "New Product Line - Auto",
    status: "scheduled",
    type: "auto",
    isActive: false,
    dailyBudget: 75,
    totalBudget: 2250,
    biddingStrategy: "Fixed",
    spend: 0,
    sales: 0,
    roas: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    cpc: 0,
    acos: 0,
    orders: 0,
    units: 0,
    startDate: "2026-02-01",
    endDate: "2026-03-31",
  },
  {
    id: "7",
    name: "Clearance Items Push",
    status: "live",
    type: "manual",
    isActive: true,
    dailyBudget: 125,
    totalBudget: 3750,
    biddingStrategy: "Dynamic Down",
    spend: 1234.56,
    sales: 6789.01,
    roas: 5.50,
    impressions: 134567,
    clicks: 2345,
    ctr: 1.74,
    cpc: 0.53,
    acos: 18.18,
    orders: 123,
    units: 156,
    startDate: "2026-01-08",
  },
  {
    id: "8",
    name: "Brand Defense Keywords",
    status: "archived",
    type: "manual",
    isActive: false,
    dailyBudget: 80,
    totalBudget: 2400,
    biddingStrategy: "Dynamic Up/Down",
    spend: 2400.00,
    sales: 9876.54,
    roas: 4.12,
    impressions: 234567,
    clicks: 3456,
    ctr: 1.47,
    cpc: 0.69,
    acos: 24.30,
    orders: 145,
    units: 178,
    startDate: "2025-10-01",
    endDate: "2025-12-31",
  },
];

export const mockChartData: ChartDataPoint[] = [
  { date: "Jan 15", adSpend: 412.34, adSales: 1823.45, roas: 4.42, impressions: 34567, clicks: 478, ctr: 1.38, cpc: 0.86, acos: 22.61 },
  { date: "Jan 16", adSpend: 389.21, adSales: 1654.32, roas: 4.25, impressions: 31234, clicks: 445, ctr: 1.42, cpc: 0.87, acos: 23.53 },
  { date: "Jan 17", adSpend: 456.78, adSales: 2134.56, roas: 4.67, impressions: 38901, clicks: 534, ctr: 1.37, cpc: 0.86, acos: 21.40 },
  { date: "Jan 18", adSpend: 523.45, adSales: 2456.78, roas: 4.69, impressions: 42345, clicks: 612, ctr: 1.45, cpc: 0.86, acos: 21.31 },
  { date: "Jan 19", adSpend: 478.90, adSales: 1987.65, roas: 4.15, impressions: 36789, clicks: 523, ctr: 1.42, cpc: 0.92, acos: 24.10 },
  { date: "Jan 20", adSpend: 345.67, adSales: 1567.89, roas: 4.54, impressions: 28901, clicks: 398, ctr: 1.38, cpc: 0.87, acos: 22.04 },
  { date: "Jan 21", adSpend: 298.43, adSales: 1234.56, roas: 4.14, impressions: 24567, clicks: 356, ctr: 1.45, cpc: 0.84, acos: 24.17 },
  { date: "Jan 22", adSpend: 467.89, adSales: 2098.76, roas: 4.49, impressions: 39012, clicks: 545, ctr: 1.40, cpc: 0.86, acos: 22.29 },
];

export const mockKPIData: KPIData[] = [
  { label: "Ad Spend", value: 8456.32, previousValue: 7234.56, format: "currency", trend: "up" },
  { label: "Ad Sales", value: 38234.87, previousValue: 32456.78, format: "currency", trend: "up" },
  { label: "Ad Units", value: 1203, previousValue: 1087, format: "number", trend: "up" },
  { label: "ROAS", value: 4.52, previousValue: 4.49, format: "decimal", trend: "up" },
  { label: "Impressions", value: 1245678, previousValue: 1098234, format: "number", trend: "up" },
];

export const campaignTotals = {
  spend: mockCampaigns.reduce((sum, c) => sum + c.spend, 0),
  sales: mockCampaigns.reduce((sum, c) => sum + c.sales, 0),
  impressions: mockCampaigns.reduce((sum, c) => sum + c.impressions, 0),
  clicks: mockCampaigns.reduce((sum, c) => sum + c.clicks, 0),
  orders: mockCampaigns.reduce((sum, c) => sum + c.orders, 0),
  units: mockCampaigns.reduce((sum, c) => sum + c.units, 0),
  get roas() { return this.spend > 0 ? this.sales / this.spend : 0; },
  get ctr() { return this.impressions > 0 ? (this.clicks / this.impressions) * 100 : 0; },
  get cpc() { return this.clicks > 0 ? this.spend / this.clicks : 0; },
  get acos() { return this.sales > 0 ? (this.spend / this.sales) * 100 : 0; },
};


// ──────────── Synthetic expansion (Phase 3.3) ────────────
// Procedurally clones existing rows to reach 45 total records
// for realistic pagination demos. Generated at module load.
(() => {
  const base = mockCampaigns.slice();
  const baseLen = base.length;
  if (baseLen === 0) return;
  let nextId = baseLen + 1;
  while (mockCampaigns.length < 45) {
    const src = base[(mockCampaigns.length - baseLen) % baseLen];
    const variance = 0.7 + ((mockCampaigns.length * 37) % 60) / 100;
    const clone: any = { ...src };
    clone.id = "camp-" + nextId;
    if ((clone as any)["name"]) (clone as any)["name"] = (clone as any)["name"] + " #" + nextId;
    for (const k of Object.keys(clone)) {
      const v = (clone as any)[k];
      if (typeof v === "number" && k !== "id" && !k.toLowerCase().includes("date")) {
        (clone as any)[k] = Math.round(v * variance * 100) / 100;
      }
    }
    mockCampaigns.push(clone);
    nextId++;
  }
})();
