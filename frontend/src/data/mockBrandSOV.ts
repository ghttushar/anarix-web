import { Brand, TrackedKeyword, SOVDataPoint, KeywordSOVData, ProductSOVData, SOVMetrics } from "@/types/bi";

export const sovMetrics: SOVMetrics = {
  yourBrand: 2.5,
  organicSOV: 1.2,
  organicSOVDelta: 0.3,
  sponsoredSOV: 1.3,
  sponsoredSOVDelta: -0.1,
  totalSOV: 2.5,
  totalSOVDelta: 0.2,
  productCount: 47,
};

export const brands: Brand[] = [
  { id: "1", name: "Napqueen", productCount: 47, appearance: 89.5, organicSOV: 1.2, sponsoredSOV: 1.3, totalSOV: 2.5 },
  { id: "2", name: "Zinus", productCount: 156, appearance: 95.2, organicSOV: 8.5, sponsoredSOV: 12.3, totalSOV: 20.8 },
  { id: "3", name: "Linenspa", productCount: 89, appearance: 78.4, organicSOV: 5.2, sponsoredSOV: 6.8, totalSOV: 12.0 },
  { id: "4", name: "Lucid", productCount: 134, appearance: 82.1, organicSOV: 4.8, sponsoredSOV: 7.2, totalSOV: 12.0 },
  { id: "5", name: "Casper", productCount: 45, appearance: 65.3, organicSOV: 6.1, sponsoredSOV: 4.5, totalSOV: 10.6 },
  { id: "6", name: "Tuft & Needle", productCount: 38, appearance: 58.7, organicSOV: 4.2, sponsoredSOV: 3.8, totalSOV: 8.0 },
  { id: "7", name: "Nectar", productCount: 52, appearance: 71.2, organicSOV: 3.5, sponsoredSOV: 4.2, totalSOV: 7.7 },
  { id: "8", name: "Purple", productCount: 28, appearance: 48.9, organicSOV: 3.8, sponsoredSOV: 2.9, totalSOV: 6.7 },
  { id: "9", name: "Tempur-Pedic", productCount: 67, appearance: 42.5, organicSOV: 2.9, sponsoredSOV: 3.1, totalSOV: 6.0 },
  { id: "10", name: "Serta", productCount: 98, appearance: 55.8, organicSOV: 2.1, sponsoredSOV: 3.4, totalSOV: 5.5 },
];

export const sovTrendData: SOVDataPoint[] = Array.from({ length: 24 }, (_, i) => ({
  timestamp: `${String(i).padStart(2, "0")}:00`,
  hour: i,
  brands: {
    "Napqueen": 1.5 + Math.random() * 2,
    "Zinus": 18 + Math.random() * 5,
    "Linenspa": 10 + Math.random() * 4,
    "Lucid": 10 + Math.random() * 4,
    "Casper": 8 + Math.random() * 4,
    "Others": 45 + Math.random() * 10,
  },
}));

export const trackedKeywords: TrackedKeyword[] = [
  { id: "1", keyword: "memory foam mattress", addedAt: "2026-01-15T10:30:00Z", updatedAt: "2026-01-31T14:22:00Z", region: "US", regionFlag: "🇺🇸", channels: ["organic", "sponsored"], status: "active" },
  { id: "2", keyword: "queen mattress", addedAt: "2026-01-12T09:15:00Z", updatedAt: "2026-01-30T11:45:00Z", region: "US", regionFlag: "🇺🇸", channels: ["organic", "sponsored"], status: "active" },
  { id: "3", keyword: "king size mattress", addedAt: "2026-01-10T08:00:00Z", updatedAt: "2026-01-29T16:30:00Z", region: "US", regionFlag: "🇺🇸", channels: ["organic"], status: "active" },
  { id: "4", keyword: "twin mattress", addedAt: "2026-01-08T14:20:00Z", updatedAt: "2026-01-28T09:10:00Z", region: "US", regionFlag: "🇺🇸", channels: ["sponsored"], status: "active" },
  { id: "5", keyword: "mattress topper", addedAt: "2026-01-05T11:45:00Z", updatedAt: "2026-01-27T13:55:00Z", region: "US", regionFlag: "🇺🇸", channels: ["organic", "sponsored"], status: "active" },
  { id: "6", keyword: "firm mattress", addedAt: "2026-01-03T16:30:00Z", updatedAt: "2026-01-26T10:20:00Z", region: "CA", regionFlag: "🇨🇦", channels: ["organic"], status: "inactive" },
  { id: "7", keyword: "cooling mattress", addedAt: "2026-01-02T13:00:00Z", updatedAt: "2026-01-25T15:40:00Z", region: "US", regionFlag: "🇺🇸", channels: ["organic", "sponsored"], status: "active" },
  { id: "8", keyword: "hybrid mattress", addedAt: "2025-12-28T10:15:00Z", updatedAt: "2026-01-24T12:30:00Z", region: "US", regionFlag: "🇺🇸", channels: ["sponsored"], status: "active" },
];

export const keywordSOVData: KeywordSOVData[] = [
  { id: "1", keyword: "memory foam mattress", searchVolume: 245000, organicSOV: 2.1, sponsoredSOV: 3.2, totalSOV: 5.3, trend: "up", trendValue: 0.8 },
  { id: "2", keyword: "queen mattress", searchVolume: 189000, organicSOV: 1.8, sponsoredSOV: 2.5, totalSOV: 4.3, trend: "up", trendValue: 0.5 },
  { id: "3", keyword: "king size mattress", searchVolume: 156000, organicSOV: 1.5, sponsoredSOV: 1.8, totalSOV: 3.3, trend: "stable", trendValue: 0.1 },
  { id: "4", keyword: "twin mattress", searchVolume: 98000, organicSOV: 0.9, sponsoredSOV: 1.2, totalSOV: 2.1, trend: "down", trendValue: -0.3 },
  { id: "5", keyword: "mattress topper", searchVolume: 134000, organicSOV: 1.2, sponsoredSOV: 1.5, totalSOV: 2.7, trend: "up", trendValue: 0.4 },
];

export const productSOVData: ProductSOVData[] = [
  { id: "1", name: "NapQueen 10\" Memory Foam Mattress", image: "/placeholder.svg", sku: "NQ-MF-10-Q", organicSOV: 0.8, sponsoredSOV: 1.2, totalSOV: 2.0, position: 5, impressions: 45000 },
  { id: "2", name: "NapQueen 12\" Hybrid Mattress", image: "/placeholder.svg", sku: "NQ-HB-12-Q", organicSOV: 0.6, sponsoredSOV: 0.9, totalSOV: 1.5, position: 8, impressions: 32000 },
  { id: "3", name: "NapQueen 8\" Gel Memory Foam", image: "/placeholder.svg", sku: "NQ-GMF-8-T", organicSOV: 0.4, sponsoredSOV: 0.7, totalSOV: 1.1, position: 12, impressions: 28000 },
  { id: "4", name: "NapQueen Mattress Topper 3\"", image: "/placeholder.svg", sku: "NQ-TOP-3-Q", organicSOV: 0.3, sponsoredSOV: 0.5, totalSOV: 0.8, position: 15, impressions: 21000 },
];
