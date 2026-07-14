import { PageTypeData, PlatformData } from "@/types/advertising";

export const mockPageTypes: PageTypeData[] = [
  {
    id: "pt-1",
    pageType: "Search In-grid",
    bidModifier: 100,
    impressions: 345678,
    clicks: 4789,
    ctr: 1.39,
    cpc: 0.82,
    adSpend: 3926.98,
    adSales: 17234.56,
    roas: 4.39,
    acos: 22.79,
  },
  {
    id: "pt-2",
    pageType: "Buy Box",
    bidModifier: 150,
    impressions: 234567,
    clicks: 3456,
    ctr: 1.47,
    cpc: 0.95,
    adSpend: 3283.20,
    adSales: 13567.89,
    roas: 4.13,
    acos: 24.20,
  },
  {
    id: "pt-3",
    pageType: "Home Page",
    bidModifier: 80,
    impressions: 156789,
    clicks: 2123,
    ctr: 1.35,
    cpc: 0.68,
    adSpend: 1443.64,
    adSales: 6234.56,
    roas: 4.32,
    acos: 23.15,
  },
  {
    id: "pt-4",
    pageType: "Stock Up",
    bidModifier: 120,
    impressions: 98765,
    clicks: 1345,
    ctr: 1.36,
    cpc: 0.75,
    adSpend: 1008.75,
    adSales: 4567.89,
    roas: 4.53,
    acos: 22.08,
  },
  {
    id: "pt-5",
    pageType: "Browse",
    bidModifier: 90,
    impressions: 123456,
    clicks: 1678,
    ctr: 1.36,
    cpc: 0.72,
    adSpend: 1208.16,
    adSales: 5123.45,
    roas: 4.24,
    acos: 23.58,
  },
];

export const mockPlatforms: PlatformData[] = [
  {
    id: "plat-1",
    platform: "Desktop",
    bidModifier: 100,
    impressions: 456789,
    clicks: 6234,
    ctr: 1.36,
    cpc: 0.85,
    adSpend: 5298.90,
    adSales: 23456.78,
    roas: 4.43,
    acos: 22.59,
  },
  {
    id: "plat-2",
    platform: "Mobile Web",
    bidModifier: 110,
    impressions: 345678,
    clicks: 4789,
    ctr: 1.39,
    cpc: 0.78,
    adSpend: 3735.42,
    adSales: 15678.90,
    roas: 4.20,
    acos: 23.82,
  },
  {
    id: "plat-3",
    platform: "Mobile App",
    bidModifier: 120,
    impressions: 234567,
    clicks: 3456,
    ctr: 1.47,
    cpc: 0.82,
    adSpend: 2833.92,
    adSales: 12345.67,
    roas: 4.36,
    acos: 22.96,
  },
];

export const pageTypesTotals = {
  impressions: mockPageTypes.reduce((sum, p) => sum + p.impressions, 0),
  clicks: mockPageTypes.reduce((sum, p) => sum + p.clicks, 0),
  adSpend: mockPageTypes.reduce((sum, p) => sum + p.adSpend, 0),
  adSales: mockPageTypes.reduce((sum, p) => sum + p.adSales, 0),
  get ctr() {
    return this.impressions > 0 ? (this.clicks / this.impressions) * 100 : 0;
  },
  get cpc() {
    return this.clicks > 0 ? this.adSpend / this.clicks : 0;
  },
  get roas() {
    return this.adSpend > 0 ? this.adSales / this.adSpend : 0;
  },
  get acos() {
    return this.adSales > 0 ? (this.adSpend / this.adSales) * 100 : 0;
  },
};

export const platformsTotals = {
  impressions: mockPlatforms.reduce((sum, p) => sum + p.impressions, 0),
  clicks: mockPlatforms.reduce((sum, p) => sum + p.clicks, 0),
  adSpend: mockPlatforms.reduce((sum, p) => sum + p.adSpend, 0),
  adSales: mockPlatforms.reduce((sum, p) => sum + p.adSales, 0),
  get ctr() {
    return this.impressions > 0 ? (this.clicks / this.impressions) * 100 : 0;
  },
  get cpc() {
    return this.clicks > 0 ? this.adSpend / this.clicks : 0;
  },
  get roas() {
    return this.adSpend > 0 ? this.adSales / this.adSpend : 0;
  },
  get acos() {
    return this.adSales > 0 ? (this.adSpend / this.adSales) * 100 : 0;
  },
};
