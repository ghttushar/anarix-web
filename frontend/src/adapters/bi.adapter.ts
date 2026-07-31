import {
  Brand,
  TrackedKeyword,
  SOVDataPoint,
  KeywordSOVData,
  ProductSOVData,
  SOVMetrics,
} from "@/types/bi";

// ============================================================
// API response interfaces (snake_case — typical backend)
// ============================================================

export interface ApiBrand {
  id: string;
  name: string;
  product_count: number;
  appearance: number;
  organic_sov: number;
  sponsored_sov: number;
  total_sov: number;
}

export interface ApiTrackedKeyword {
  id: string;
  keyword: string;
  added_at: string;
  updated_at: string;
  region: string;
  region_flag: string;
  channels: ("organic" | "sponsored")[];
  status: "active" | "inactive";
}

export interface ApiSOVDataPoint {
  timestamp: string;
  hour?: number;
  date?: string;
  brands: Record<string, number>;
}

export interface ApiKeywordSOVData {
  id: string;
  keyword: string;
  search_volume: number;
  organic_sov: number;
  sponsored_sov: number;
  total_sov: number;
  trend: "up" | "down" | "stable";
  trend_value: number;
}

export interface ApiProductSOVData {
  id: string;
  name: string;
  image: string;
  sku: string;
  organic_sov: number;
  sponsored_sov: number;
  total_sov: number;
  position: number;
  impressions: number;
}

export interface ApiSOVMetrics {
  your_brand: number;
  organic_sov: number;
  organic_sov_delta: number;
  sponsored_sov: number;
  sponsored_sov_delta: number;
  total_sov: number;
  total_sov_delta: number;
  product_count: number;
}

// ============================================================
// Adapter functions
// ============================================================

export function adaptBrand(api: ApiBrand): Brand {
  return {
    id: api.id,
    name: api.name,
    productCount: api.product_count,
    appearance: api.appearance,
    organicSOV: api.organic_sov,
    sponsoredSOV: api.sponsored_sov,
    totalSOV: api.total_sov,
  };
}

export function adaptBrands(apiList: ApiBrand[]): Brand[] {
  return apiList.map(adaptBrand);
}

export function adaptTrackedKeyword(api: ApiTrackedKeyword): TrackedKeyword {
  return {
    id: api.id,
    keyword: api.keyword,
    addedAt: api.added_at,
    updatedAt: api.updated_at,
    region: api.region,
    regionFlag: api.region_flag,
    channels: api.channels,
    status: api.status,
  };
}

export function adaptTrackedKeywords(apiList: ApiTrackedKeyword[]): TrackedKeyword[] {
  return apiList.map(adaptTrackedKeyword);
}

export function adaptSOVDataPoint(api: ApiSOVDataPoint): SOVDataPoint {
  return {
    timestamp: api.timestamp,
    hour: api.hour,
    date: api.date,
    brands: api.brands,
  };
}

export function adaptSOVDataPoints(apiList: ApiSOVDataPoint[]): SOVDataPoint[] {
  return apiList.map(adaptSOVDataPoint);
}

export function adaptKeywordSOVData(api: ApiKeywordSOVData): KeywordSOVData {
  return {
    id: api.id,
    keyword: api.keyword,
    searchVolume: api.search_volume,
    organicSOV: api.organic_sov,
    sponsoredSOV: api.sponsored_sov,
    totalSOV: api.total_sov,
    trend: api.trend,
    trendValue: api.trend_value,
  };
}

export function adaptKeywordSOVDataList(apiList: ApiKeywordSOVData[]): KeywordSOVData[] {
  return apiList.map(adaptKeywordSOVData);
}

export function adaptProductSOVData(api: ApiProductSOVData): ProductSOVData {
  return {
    id: api.id,
    name: api.name,
    image: api.image,
    sku: api.sku,
    organicSOV: api.organic_sov,
    sponsoredSOV: api.sponsored_sov,
    totalSOV: api.total_sov,
    position: api.position,
    impressions: api.impressions,
  };
}

export function adaptProductSOVDataList(apiList: ApiProductSOVData[]): ProductSOVData[] {
  return apiList.map(adaptProductSOVData);
}

export function adaptSOVMetrics(api: ApiSOVMetrics): SOVMetrics {
  return {
    yourBrand: api.your_brand,
    organicSOV: api.organic_sov,
    organicSOVDelta: api.organic_sov_delta,
    sponsoredSOV: api.sponsored_sov,
    sponsoredSOVDelta: api.sponsored_sov_delta,
    totalSOV: api.total_sov,
    totalSOVDelta: api.total_sov_delta,
    productCount: api.product_count,
  };
}
