import { ImpactComparison } from "@/types/advertising";

export const mockImpactCampaigns: ImpactComparison[] = [
  {
    id: "ic-1",
    name: "Brand Awareness - Q1 2026",
    type: "auto",
    impactPercentage: 12.5,
    baseline: { impressions: 218456, clicks: 3012, ctr: 1.38, adSpend: 2456.78, adSales: 10234.56, roas: 4.17, acos: 24.01 },
    impact:   { impressions: 245678, clicks: 3421, ctr: 1.39, adSpend: 2847.32, adSales: 12453.87, roas: 4.37, acos: 22.86 },
  },
  {
    id: "ic-2",
    name: "Summer Sale Campaign",
    type: "manual",
    impactPercentage: -8.3,
    baseline: { impressions: 171234, clicks: 2328, ctr: 1.36, adSpend: 1661.45, adSales: 6192.34, roas: 3.73, acos: 26.83 },
    impact:   { impressions: 156789, clicks: 2134, ctr: 1.36, adSpend: 1523.45, adSales: 5678.90, roas: 3.73, acos: 26.83 },
  },
  {
    id: "ic-3",
    name: "Organic Products Launch",
    type: "auto",
    impactPercentage: 18.7,
    baseline: { impressions: 83123, clicks: 1298, ctr: 1.56, adSpend: 738.12, adSales: 3817.45, roas: 5.17, acos: 19.34 },
    impact:   { impressions: 98765, clicks: 1543, ctr: 1.56, adSpend: 876.54, adSales: 4532.10, roas: 5.17, acos: 19.34 },
  },
  {
    id: "ic-4",
    name: "Clearance Items Push",
    type: "manual",
    impactPercentage: 22.4,
    baseline: { impressions: 109876, clicks: 1914, ctr: 1.74, adSpend: 1008.32, adSales: 5546.78, roas: 5.50, acos: 18.18 },
    impact:   { impressions: 134567, clicks: 2345, ctr: 1.74, adSpend: 1234.56, adSales: 6789.01, roas: 5.50, acos: 18.18 },
  },
  {
    id: "ic-5",
    name: "Competitor Targeting",
    type: "manual",
    impactPercentage: -15.2,
    baseline: { impressions: 80045, clicks: 1164, ctr: 1.45, adSpend: 1769.28, adSales: 3827.12, roas: 2.16, acos: 46.22 },
    impact:   { impressions: 67890, clicks: 987, ctr: 1.45, adSpend: 1500.00, adSales: 3245.67, roas: 2.16, acos: 46.22 },
  },
];

export const mockImpactAdGroups: ImpactComparison[] = [
  // ic-1 Brand Awareness
  {
    id: "iag-1", name: "Electronics - Top Sellers", campaignId: "ic-1", impactPercentage: 15.3,
    baseline: { impressions: 108901, clicks: 1492, ctr: 1.37, adSpend: 1268.12, adSales: 5402.34, roas: 4.26, acos: 23.46 },
    impact:   { impressions: 125678, clicks: 1721, ctr: 1.37, adSpend: 1462.85, adSales: 6234.56, roas: 4.26, acos: 23.46 },
  },
  {
    id: "iag-2", name: "Kitchen Appliances", campaignId: "ic-1", impactPercentage: 8.7,
    baseline: { impressions: 90567, clicks: 1237, ctr: 1.37, adSpend: 964.86, adSales: 3793.45, roas: 3.93, acos: 25.44 },
    impact:   { impressions: 98456, clicks: 1345, ctr: 1.37, adSpend: 1049.10, adSales: 4123.87, roas: 3.93, acos: 25.44 },
  },
  // ic-2 Summer Sale
  {
    id: "iag-4", name: "Summer Apparel", campaignId: "ic-2", impactPercentage: -6.1,
    baseline: { impressions: 98234, clicks: 1342, ctr: 1.37, adSpend: 952.18, adSales: 3548.21, roas: 3.73, acos: 26.84 },
    impact:   { impressions: 92345, clicks: 1256, ctr: 1.36, adSpend: 894.32, adSales: 3334.56, roas: 3.73, acos: 26.82 },
  },
  {
    id: "iag-5", name: "Outdoor & Beach", campaignId: "ic-2", impactPercentage: -10.4,
    baseline: { impressions: 73000, clicks: 986, ctr: 1.35, adSpend: 709.27, adSales: 2644.13, roas: 3.73, acos: 26.82 },
    impact:   { impressions: 64444, clicks: 878, ctr: 1.36, adSpend: 629.13, adSales: 2344.34, roas: 3.73, acos: 26.85 },
  },
  // ic-3 Organic Products Launch
  {
    id: "iag-6", name: "Organic Skincare", campaignId: "ic-3", impactPercentage: 21.2,
    baseline: { impressions: 32145, clicks: 502, ctr: 1.56, adSpend: 285.43, adSales: 1476.18, roas: 5.17, acos: 19.34 },
    impact:   { impressions: 38967, clicks: 609, ctr: 1.56, adSpend: 345.92, adSales: 1788.34, roas: 5.17, acos: 19.35 },
  },
  {
    id: "iag-7", name: "Organic Snacks", campaignId: "ic-3", impactPercentage: 17.8,
    baseline: { impressions: 28456, clicks: 444, ctr: 1.56, adSpend: 252.65, adSales: 1306.45, roas: 5.17, acos: 19.34 },
    impact:   { impressions: 33512, clicks: 524, ctr: 1.56, adSpend: 297.61, adSales: 1538.91, roas: 5.17, acos: 19.34 },
  },
  {
    id: "iag-8", name: "Eco Home Essentials", campaignId: "ic-3", impactPercentage: 16.5,
    baseline: { impressions: 22522, clicks: 352, ctr: 1.56, adSpend: 200.04, adSales: 1034.82, roas: 5.17, acos: 19.33 },
    impact:   { impressions: 26286, clicks: 410, ctr: 1.56, adSpend: 233.01, adSales: 1204.85, roas: 5.17, acos: 19.34 },
  },
  // ic-4 Clearance Items Push
  {
    id: "iag-3", name: "Clearance Apparel", campaignId: "ic-4", impactPercentage: 21.8,
    baseline: { impressions: 46612, clicks: 810, ctr: 1.74, adSpend: 429.30, adSales: 1925.12, roas: 4.48, acos: 22.30 },
    impact:   { impressions: 56789, clicks: 987, ctr: 1.74, adSpend: 523.11, adSales: 2345.67, roas: 4.48, acos: 22.30 },
  },
  {
    id: "iag-9", name: "End of Season Footwear", campaignId: "ic-4", impactPercentage: 23.1,
    baseline: { impressions: 63264, clicks: 1104, ctr: 1.74, adSpend: 579.02, adSales: 3621.66, roas: 6.25, acos: 15.99 },
    impact:   { impressions: 77778, clicks: 1358, ctr: 1.75, adSpend: 711.45, adSales: 4443.34, roas: 6.25, acos: 16.01 },
  },
  // ic-5 Competitor Targeting
  {
    id: "iag-10", name: "Competitor ASINs - Audio", campaignId: "ic-5", impactPercentage: -14.5,
    baseline: { impressions: 46245, clicks: 672, ctr: 1.45, adSpend: 1021.78, adSales: 2210.24, roas: 2.16, acos: 46.23 },
    impact:   { impressions: 39456, clicks: 573, ctr: 1.45, adSpend: 873.45, adSales: 1887.34, roas: 2.16, acos: 46.28 },
  },
  {
    id: "iag-11", name: "Competitor ASINs - Kitchen", campaignId: "ic-5", impactPercentage: -16.0,
    baseline: { impressions: 33800, clicks: 492, ctr: 1.45, adSpend: 747.50, adSales: 1616.88, roas: 2.16, acos: 46.23 },
    impact:   { impressions: 28434, clicks: 414, ctr: 1.46, adSpend: 626.55, adSales: 1358.33, roas: 2.17, acos: 46.13 },
  },
];

export const mockImpactProducts: ImpactComparison[] = [
  // iag-1 Electronics - Top Sellers
  { id: "ip-1",  name: "Wireless Bluetooth Earbuds Pro", campaignId: "ic-1", adGroupId: "iag-1", impactPercentage: 14.8,
    baseline: { impressions: 39789, clicks: 542, ctr: 1.36, adSpend: 471.94, adSales: 2012.34, roas: 4.26, acos: 23.46 },
    impact:   { impressions: 45678, clicks: 623, ctr: 1.36, adSpend: 542.01, adSales: 2312.56, roas: 4.27, acos: 23.44 } },
  { id: "ip-1b", name: "Noise-Cancelling Headphones X2", campaignId: "ic-1", adGroupId: "iag-1", impactPercentage: 11.3,
    baseline: { impressions: 28456, clicks: 388, ctr: 1.36, adSpend: 338.21, adSales: 1442.10, roas: 4.26, acos: 23.45 },
    impact:   { impressions: 31678, clicks: 432, ctr: 1.36, adSpend: 376.45, adSales: 1605.20, roas: 4.26, acos: 23.45 } },
  { id: "ip-1c", name: "Smart Watch Series 7", campaignId: "ic-1", adGroupId: "iag-1", impactPercentage: 18.4,
    baseline: { impressions: 40656, clicks: 562, ctr: 1.38, adSpend: 457.97, adSales: 1947.90, roas: 4.25, acos: 23.51 },
    impact:   { impressions: 48322, clicks: 666, ctr: 1.38, adSpend: 544.39, adSales: 2316.80, roas: 4.26, acos: 23.50 } },
  // iag-2 Kitchen Appliances
  { id: "ip-2",  name: "Premium Air Fryer 5.8Qt", campaignId: "ic-1", adGroupId: "iag-2", impactPercentage: 9.2,
    baseline: { impressions: 52012, clicks: 713, ctr: 1.37, adSpend: 541.88, adSales: 2134.56, roas: 3.94, acos: 25.38 },
    impact:   { impressions: 56789, clicks: 778, ctr: 1.37, adSpend: 591.28, adSales: 2334.67, roas: 3.95, acos: 25.32 } },
  { id: "ip-2b", name: "Smart Toaster Oven Pro", campaignId: "ic-1", adGroupId: "iag-2", impactPercentage: 7.8,
    baseline: { impressions: 38555, clicks: 524, ctr: 1.36, adSpend: 422.98, adSales: 1658.31, roas: 3.92, acos: 25.51 },
    impact:   { impressions: 41667, clicks: 567, ctr: 1.36, adSpend: 457.82, adSales: 1789.20, roas: 3.91, acos: 25.59 } },
  // iag-4 Summer Apparel
  { id: "ip-4a", name: "Linen Beach Shirt", campaignId: "ic-2", adGroupId: "iag-4", impactPercentage: -5.6,
    baseline: { impressions: 54317, clicks: 742, ctr: 1.37, adSpend: 526.45, adSales: 1962.34, roas: 3.73, acos: 26.83 },
    impact:   { impressions: 51234, clicks: 700, ctr: 1.37, adSpend: 497.12, adSales: 1853.78, roas: 3.73, acos: 26.82 } },
  { id: "ip-4b", name: "Cotton Sun Hat", campaignId: "ic-2", adGroupId: "iag-4", impactPercentage: -6.8,
    baseline: { impressions: 43917, clicks: 600, ctr: 1.37, adSpend: 425.73, adSales: 1585.87, roas: 3.73, acos: 26.84 },
    impact:   { impressions: 41111, clicks: 556, ctr: 1.35, adSpend: 397.20, adSales: 1480.78, roas: 3.73, acos: 26.82 } },
  // iag-5 Outdoor & Beach
  { id: "ip-5a", name: "Beach Umbrella XL", campaignId: "ic-2", adGroupId: "iag-5", impactPercentage: -9.7,
    baseline: { impressions: 41250, clicks: 558, ctr: 1.35, adSpend: 400.76, adSales: 1493.97, roas: 3.73, acos: 26.83 },
    impact:   { impressions: 36234, clicks: 494, ctr: 1.36, adSpend: 354.21, adSales: 1320.45, roas: 3.73, acos: 26.83 } },
  { id: "ip-5b", name: "Portable Cooler Bag 30L", campaignId: "ic-2", adGroupId: "iag-5", impactPercentage: -11.2,
    baseline: { impressions: 31750, clicks: 428, ctr: 1.35, adSpend: 308.51, adSales: 1150.16, roas: 3.73, acos: 26.82 },
    impact:   { impressions: 28210, clicks: 384, ctr: 1.36, adSpend: 274.92, adSales: 1023.89, roas: 3.73, acos: 26.85 } },
  // iag-6 Organic Skincare
  { id: "ip-6a", name: "Organic Vitamin C Serum", campaignId: "ic-3", adGroupId: "iag-6", impactPercentage: 22.4,
    baseline: { impressions: 18234, clicks: 285, ctr: 1.56, adSpend: 161.92, adSales: 837.45, roas: 5.17, acos: 19.34 },
    impact:   { impressions: 22321, clicks: 349, ctr: 1.56, adSpend: 198.21, adSales: 1024.56, roas: 5.17, acos: 19.35 } },
  { id: "ip-6b", name: "Hyaluronic Acid Moisturizer", campaignId: "ic-3", adGroupId: "iag-6", impactPercentage: 19.8,
    baseline: { impressions: 13911, clicks: 217, ctr: 1.56, adSpend: 123.51, adSales: 638.73, roas: 5.17, acos: 19.34 },
    impact:   { impressions: 16646, clicks: 260, ctr: 1.56, adSpend: 147.71, adSales: 763.78, roas: 5.17, acos: 19.34 } },
  // iag-7 Organic Snacks
  { id: "ip-7a", name: "Cold-Pressed Granola", campaignId: "ic-3", adGroupId: "iag-7", impactPercentage: 18.2,
    baseline: { impressions: 16213, clicks: 253, ctr: 1.56, adSpend: 144.01, adSales: 744.45, roas: 5.17, acos: 19.34 },
    impact:   { impressions: 19108, clicks: 299, ctr: 1.56, adSpend: 169.65, adSales: 877.23, roas: 5.17, acos: 19.34 } },
  { id: "ip-7b", name: "Plant Protein Bites", campaignId: "ic-3", adGroupId: "iag-7", impactPercentage: 17.3,
    baseline: { impressions: 12243, clicks: 191, ctr: 1.56, adSpend: 108.64, adSales: 562.00, roas: 5.17, acos: 19.33 },
    impact:   { impressions: 14404, clicks: 225, ctr: 1.56, adSpend: 127.96, adSales: 661.68, roas: 5.17, acos: 19.34 } },
  // iag-8 Eco Home Essentials
  { id: "ip-8a", name: "Bamboo Storage Bins", campaignId: "ic-3", adGroupId: "iag-8", impactPercentage: 17.0,
    baseline: { impressions: 12881, clicks: 201, ctr: 1.56, adSpend: 114.42, adSales: 591.91, roas: 5.17, acos: 19.33 },
    impact:   { impressions: 15036, clicks: 234, ctr: 1.56, adSpend: 133.27, adSales: 689.34, roas: 5.17, acos: 19.33 } },
  { id: "ip-8b", name: "Recycled Glass Jars Set", campaignId: "ic-3", adGroupId: "iag-8", impactPercentage: 15.9,
    baseline: { impressions: 9641, clicks: 151, ctr: 1.57, adSpend: 85.62, adSales: 442.91, roas: 5.17, acos: 19.33 },
    impact:   { impressions: 11250, clicks: 176, ctr: 1.56, adSpend: 99.74, adSales: 515.51, roas: 5.17, acos: 19.34 } },
  // iag-3 Clearance Apparel (under ic-4)
  { id: "ip-3",  name: "Last Season Sneakers", campaignId: "ic-4", adGroupId: "iag-3", impactPercentage: 28.4,
    baseline: { impressions: 26912, clicks: 468, ctr: 1.74, adSpend: 243.36, adSales: 1345.67, roas: 5.53, acos: 18.09 },
    impact:   { impressions: 34567, clicks: 601, ctr: 1.74, adSpend: 312.52, adSales: 1728.45, roas: 5.53, acos: 18.08 } },
  { id: "ip-3b", name: "Last Season Hoodie", campaignId: "ic-4", adGroupId: "iag-3", impactPercentage: 18.6,
    baseline: { impressions: 19700, clicks: 342, ctr: 1.74, adSpend: 185.94, adSales: 579.45, roas: 3.12, acos: 32.09 },
    impact:   { impressions: 22222, clicks: 386, ctr: 1.74, adSpend: 210.59, adSales: 617.22, roas: 2.93, acos: 34.12 } },
  // iag-9 End of Season Footwear
  { id: "ip-9a", name: "Trail Running Shoes 2024", campaignId: "ic-4", adGroupId: "iag-9", impactPercentage: 24.6,
    baseline: { impressions: 38104, clicks: 665, ctr: 1.75, adSpend: 348.69, adSales: 2180.32, roas: 6.25, acos: 15.99 },
    impact:   { impressions: 47125, clicks: 822, ctr: 1.74, adSpend: 431.05, adSales: 2693.34, roas: 6.25, acos: 16.00 } },
  { id: "ip-9b", name: "Hiking Boots Pro", campaignId: "ic-4", adGroupId: "iag-9", impactPercentage: 21.5,
    baseline: { impressions: 25160, clicks: 439, ctr: 1.74, adSpend: 230.33, adSales: 1441.34, roas: 6.26, acos: 15.98 },
    impact:   { impressions: 30653, clicks: 536, ctr: 1.75, adSpend: 280.40, adSales: 1750.00, roas: 6.24, acos: 16.02 } },
  // iag-10 Competitor ASINs - Audio
  { id: "ip-10a", name: "Bluetooth Speaker Compete", campaignId: "ic-5", adGroupId: "iag-10", impactPercentage: -13.8,
    baseline: { impressions: 28147, clicks: 409, ctr: 1.45, adSpend: 621.78, adSales: 1345.34, roas: 2.16, acos: 46.22 },
    impact:   { impressions: 24123, clicks: 350, ctr: 1.45, adSpend: 532.18, adSales: 1149.81, roas: 2.16, acos: 46.28 } },
  { id: "ip-10b", name: "Wireless Earbuds Compete", campaignId: "ic-5", adGroupId: "iag-10", impactPercentage: -15.4,
    baseline: { impressions: 18098, clicks: 263, ctr: 1.45, adSpend: 400.00, adSales: 864.90, roas: 2.16, acos: 46.25 },
    impact:   { impressions: 15333, clicks: 223, ctr: 1.45, adSpend: 341.27, adSales: 737.53, roas: 2.16, acos: 46.27 } },
  // iag-11 Competitor ASINs - Kitchen
  { id: "ip-11a", name: "Smart Kettle Compete", campaignId: "ic-5", adGroupId: "iag-11", impactPercentage: -15.7,
    baseline: { impressions: 19656, clicks: 286, ctr: 1.45, adSpend: 434.71, adSales: 940.05, roas: 2.16, acos: 46.24 },
    impact:   { impressions: 16572, clicks: 241, ctr: 1.45, adSpend: 364.32, adSales: 789.45, roas: 2.17, acos: 46.15 } },
  { id: "ip-11b", name: "Air Fryer Compete", campaignId: "ic-5", adGroupId: "iag-11", impactPercentage: -16.4,
    baseline: { impressions: 14144, clicks: 206, ctr: 1.45, adSpend: 312.79, adSales: 676.83, roas: 2.16, acos: 46.22 },
    impact:   { impressions: 11862, clicks: 173, ctr: 1.46, adSpend: 262.23, adSales: 568.88, roas: 2.17, acos: 46.10 } },
];

export const mockImpactKeywords: ImpactComparison[] = [
  {
    id: "ik-1", name: "wireless earbuds", impactPercentage: 11.2,
    baseline: { impressions: 21098, clicks: 281, ctr: 1.33, adSpend: 249.69, adSales: 1065.45, roas: 4.27, acos: 23.43 },
    impact:   { impressions: 23456, clicks: 312, ctr: 1.33, adSpend: 277.68, adSales: 1184.56, roas: 4.27, acos: 23.44 },
  },
  {
    id: "ik-2", name: "air fryer", impactPercentage: 7.8,
    baseline: { impressions: 26812, clicks: 369, ctr: 1.38, adSpend: 280.44, adSales: 1134.56, roas: 4.04, acos: 24.72 },
    impact:   { impressions: 28901, clicks: 398, ctr: 1.38, adSpend: 302.48, adSales: 1223.45, roas: 4.04, acos: 24.72 },
  },
  {
    id: "ik-3", name: "clearance sneakers", impactPercentage: 19.6,
    baseline: { impressions: 14956, clicks: 260, ctr: 1.74, adSpend: 132.60, adSales: 734.56, roas: 5.54, acos: 18.05 },
    impact:   { impressions: 17890, clicks: 311, ctr: 1.74, adSpend: 158.61, adSales: 878.45, roas: 5.54, acos: 18.05 },
  },
];

export const mockImpactSearchTerms: ImpactComparison[] = [
  {
    id: "ist-1", name: "best wireless earbuds 2026", impactPercentage: 13.5,
    baseline: { impressions: 5001, clicks: 69, ctr: 1.38, adSpend: 62.54, adSales: 267.89, roas: 4.28, acos: 23.34 },
    impact:   { impressions: 5678, clicks: 78, ctr: 1.37, adSpend: 70.98, adSales: 304.12, roas: 4.28, acos: 23.34 },
  },
  {
    id: "ist-2", name: "best air fryer under 100", impactPercentage: 10.2,
    baseline: { impressions: 6162, clicks: 85, ctr: 1.38, adSpend: 65.70, adSales: 265.78, roas: 4.05, acos: 24.72 },
    impact:   { impressions: 6789, clicks: 94, ctr: 1.38, adSpend: 72.38, adSales: 292.89, roas: 4.05, acos: 24.71 },
  },
  {
    id: "ist-3", name: "running shoes clearance sale", impactPercentage: 24.8,
    baseline: { impressions: 3658, clicks: 63, ctr: 1.72, adSpend: 32.91, adSales: 182.34, roas: 5.54, acos: 18.05 },
    impact:   { impressions: 4567, clicks: 79, ctr: 1.73, adSpend: 41.08, adSales: 227.56, roas: 5.54, acos: 18.05 },
  },
];
