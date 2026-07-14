export interface CreativeAsset {
  id: string;
  name: string;
  type: "image" | "video";
  thumbnail: string;
  campaign: string;
  adGroup: string;
  impressions: number;
  clicks: number;
  ctr: number;
  orders: number;
  cvr: number;
  adSpend: number;
  adSales: number;
  roas: number;
  tags: string[];
  uploadedAt: string;
}

export interface CreativeInsight {
  id: string;
  insight: string;
  impact: "high" | "medium" | "low";
  metric: string;
  correlation: number; // -1 to 1
}

export const mockCreativeAssets: CreativeAsset[] = [
  { id: "cr1", name: "Lifestyle Hero - Kitchen", type: "image", thumbnail: "/placeholder.svg", campaign: "Brand Defense", adGroup: "Lifestyle Ads", impressions: 45200, clicks: 1356, ctr: 3.0, orders: 189, cvr: 13.94, adSpend: 1220, adSales: 7560, roas: 6.2, tags: ["lifestyle", "kitchen", "bright", "human"], uploadedAt: "2026-02-15" },
  { id: "cr2", name: "Product Only - White BG", type: "image", thumbnail: "/placeholder.svg", campaign: "Brand Defense", adGroup: "Product Ads", impressions: 38900, clicks: 778, ctr: 2.0, orders: 101, cvr: 12.98, adSpend: 700, adSales: 4040, roas: 5.77, tags: ["product-only", "white-bg", "clean"], uploadedAt: "2026-02-15" },
  { id: "cr3", name: "Infographic - Benefits", type: "image", thumbnail: "/placeholder.svg", campaign: "Category Conquest", adGroup: "Infographic Ads", impressions: 52100, clicks: 1563, ctr: 3.0, orders: 156, cvr: 9.98, adSpend: 1407, adSales: 6240, roas: 4.43, tags: ["infographic", "text-heavy", "benefits"], uploadedAt: "2026-02-10" },
  { id: "cr4", name: "Video - Unboxing 15s", type: "video", thumbnail: "/placeholder.svg", campaign: "Product Launch", adGroup: "Video Ads", impressions: 28400, clicks: 994, ctr: 3.5, orders: 134, cvr: 13.48, adSpend: 895, adSales: 5360, roas: 5.99, tags: ["video", "unboxing", "short-form"], uploadedAt: "2026-02-08" },
  { id: "cr5", name: "Comparison Chart", type: "image", thumbnail: "/placeholder.svg", campaign: "Category Conquest", adGroup: "Comparison Ads", impressions: 31200, clicks: 624, ctr: 2.0, orders: 75, cvr: 12.02, adSpend: 562, adSales: 3000, roas: 5.34, tags: ["comparison", "chart", "data"], uploadedAt: "2026-01-28" },
  { id: "cr6", name: "Video - How To Use 30s", type: "video", thumbnail: "/placeholder.svg", campaign: "Product Launch", adGroup: "Video Ads", impressions: 19800, clicks: 693, ctr: 3.5, orders: 90, cvr: 12.99, adSpend: 624, adSales: 3600, roas: 5.77, tags: ["video", "tutorial", "long-form"], uploadedAt: "2026-01-20" },
];

export const mockCreativeInsights: CreativeInsight[] = [
  { id: "ci1", insight: "Creatives with humans in lifestyle settings have 50% higher CTR than product-only images", impact: "high", metric: "CTR", correlation: 0.72 },
  { id: "ci2", insight: "Short-form video (≤15s) outperforms static images on CVR by 18%", impact: "high", metric: "CVR", correlation: 0.65 },
  { id: "ci3", insight: "White background product shots have lowest CTR but competitive CVR — use for retargeting", impact: "medium", metric: "CTR/CVR", correlation: -0.3 },
  { id: "ci4", insight: "Infographic-style creatives drive highest impressions but lower ROAS", impact: "medium", metric: "ROAS", correlation: -0.22 },
  { id: "ci5", insight: "Comparison charts correlate with higher CVR among price-sensitive audiences", impact: "low", metric: "CVR", correlation: 0.41 },
];
