// Business Intelligence Types

export interface Brand {
  id: string;
  name: string;
  productCount: number;
  appearance: number; // percentage
  organicSOV: number;
  sponsoredSOV: number;
  totalSOV: number;
}

export interface TrackedKeyword {
  id: string;
  keyword: string;
  addedAt: string;
  updatedAt: string;
  region: string;
  regionFlag: string;
  channels: ("organic" | "sponsored")[];
  status: "active" | "inactive";
}

export interface SOVDataPoint {
  timestamp: string;
  hour?: number;
  date?: string;
  brands: Record<string, number>;
}

export interface KeywordSOVData {
  id: string;
  keyword: string;
  searchVolume: number;
  organicSOV: number;
  sponsoredSOV: number;
  totalSOV: number;
  trend: "up" | "down" | "stable";
  trendValue: number;
}

export interface ProductSOVData {
  id: string;
  name: string;
  image: string;
  sku: string;
  organicSOV: number;
  sponsoredSOV: number;
  totalSOV: number;
  position: number;
  impressions: number;
}

export interface SOVMetrics {
  yourBrand: number;
  organicSOV: number;
  organicSOVDelta: number;
  sponsoredSOV: number;
  sponsoredSOVDelta: number;
  totalSOV: number;
  totalSOVDelta: number;
  productCount: number;
}
