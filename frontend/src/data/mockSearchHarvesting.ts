export interface HarvestCandidate {
  id: string;
  searchTerm: string;
  sourceCampaign: string;
  impressions: number;
  clicks: number;
  ctr: number;
  orders: number;
  cvr: number;
  adSpend: number;
  adSales: number;
  roas: number;
  acos: number;
  suggestedMatchType: "exact" | "phrase" | "broad";
  suggestedBid: number;
  confidence: number; // 0-100
  aanExplanation: string;
  status: "pending" | "added" | "dismissed";
}

export const mockHarvestCandidates: HarvestCandidate[] = [
  { id: "h1", searchTerm: "organic protein powder vanilla", sourceCampaign: "Auto - Protein Supplements", impressions: 12400, clicks: 342, ctr: 2.76, orders: 48, cvr: 14.04, adSpend: 285.60, adSales: 1920.00, roas: 6.72, acos: 14.88, suggestedMatchType: "exact", suggestedBid: 0.95, confidence: 96, aanExplanation: "High conversion rate (14%) with strong ROAS. This term has been consistently performing for 3 weeks. Adding as exact match will capture this traffic at a controlled bid.", status: "pending" },
  { id: "h2", searchTerm: "plant based protein shake", sourceCampaign: "Auto - Protein Supplements", impressions: 8900, clicks: 267, ctr: 3.00, orders: 31, cvr: 11.61, adSpend: 213.60, adSales: 1240.00, roas: 5.81, acos: 17.23, suggestedMatchType: "phrase", suggestedBid: 0.88, confidence: 89, aanExplanation: "Strong CTR and conversion signals. Phrase match recommended to also capture long-tail variants like 'best plant based protein shake for women'.", status: "pending" },
  { id: "h3", searchTerm: "whey isolate unflavored", sourceCampaign: "Auto - Whey Products", impressions: 5600, clicks: 196, ctr: 3.50, orders: 28, cvr: 14.29, adSpend: 176.40, adSales: 1120.00, roas: 6.35, acos: 15.75, suggestedMatchType: "exact", suggestedBid: 1.02, confidence: 93, aanExplanation: "Excellent CVR of 14.3%. This is a high-intent buyer term. Exact match recommended to maintain relevance and control CPC.", status: "pending" },
  { id: "h4", searchTerm: "meal replacement bars keto", sourceCampaign: "Auto - Nutrition Bars", impressions: 15200, clicks: 380, ctr: 2.50, orders: 35, cvr: 9.21, adSpend: 342.00, adSales: 1400.00, roas: 4.09, acos: 24.43, suggestedMatchType: "broad", suggestedBid: 0.72, confidence: 75, aanExplanation: "High volume term with decent ROAS. Broad match will expand reach into related keto nutrition searches. Monitor ACOS closely.", status: "pending" },
  { id: "h5", searchTerm: "collagen peptides powder grass fed", sourceCampaign: "Auto - Collagen", impressions: 3200, clicks: 128, ctr: 4.00, orders: 22, cvr: 17.19, adSpend: 115.20, adSales: 880.00, roas: 7.64, acos: 13.09, suggestedMatchType: "exact", suggestedBid: 1.10, confidence: 98, aanExplanation: "Highest confidence recommendation. 17% CVR and 7.6x ROAS make this a must-add. The specificity of the term warrants exact match.", status: "pending" },
  { id: "h6", searchTerm: "pre workout energy drink powder", sourceCampaign: "Auto - Pre Workout", impressions: 22100, clicks: 530, ctr: 2.40, orders: 42, cvr: 7.92, adSpend: 477.00, adSales: 1680.00, roas: 3.52, acos: 28.39, suggestedMatchType: "phrase", suggestedBid: 0.65, confidence: 68, aanExplanation: "High volume opportunity but ACOS is above target. Phrase match with a conservative bid to test profitability before scaling.", status: "pending" },
  { id: "h7", searchTerm: "bcaa amino acids recovery", sourceCampaign: "Auto - Amino Acids", impressions: 4500, clicks: 157, ctr: 3.49, orders: 19, cvr: 12.10, adSpend: 141.30, adSales: 760.00, roas: 5.38, acos: 18.59, suggestedMatchType: "exact", suggestedBid: 0.92, confidence: 85, aanExplanation: "Solid performer with 12% CVR. The term targets recovery-focused buyers which aligns well with your product positioning.", status: "pending" },
  { id: "h8", searchTerm: "electrolyte powder sugar free", sourceCampaign: "Auto - Hydration", impressions: 9800, clicks: 274, ctr: 2.80, orders: 38, cvr: 13.87, adSpend: 246.60, adSales: 1520.00, roas: 6.16, acos: 16.22, suggestedMatchType: "exact", suggestedBid: 0.98, confidence: 91, aanExplanation: "High-intent health-conscious buyer term. Strong ROAS and consistent performance over 2 weeks.", status: "pending" },
];
