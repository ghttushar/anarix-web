import { api } from "@/lib/api-client";
import {
  Brand,
  TrackedKeyword,
  SOVDataPoint,
  KeywordSOVData,
  ProductSOVData,
  SOVMetrics,
} from "@/types/bi";

export interface BIService {
  getSOVMetrics: () => Promise<SOVMetrics>;
  getBrands: () => Promise<Brand[]>;
  getSOVTrendData: () => Promise<SOVDataPoint[]>;
  getTrackedKeywords: () => Promise<TrackedKeyword[]>;
  getKeywordSOVData: () => Promise<KeywordSOVData[]>;
  getProductSOVData: () => Promise<ProductSOVData[]>;
}

const realService: BIService = {
  getSOVMetrics: () => api.get<SOVMetrics>("/market-intelligence/serp/sov"),
  getBrands: () => api.get<Brand[]>("/market-intelligence/serp/analytics/{brandName}"),
  getSOVTrendData: () => api.get<SOVDataPoint[]>("/market-intelligence/serp/sov"),
  getTrackedKeywords: () => api.get<TrackedKeyword[]>("/market-intelligence/serp/keywords"),
  getKeywordSOVData: () => api.post<KeywordSOVData[]>("/market-intelligence/serp/keyword-sov", {}),
  getProductSOVData: () => api.post<ProductSOVData[]>("/market-intelligence/serp/product-sov", {}),
};

let currentService: BIService = realService;

export function setBIService(service: BIService) {
  currentService = service;
}

export function getBIService(): BIService {
  return currentService;
}

export const getSOVMetrics = () => currentService.getSOVMetrics();
export const getBrands = () => currentService.getBrands();
export const getSOVTrendData = () => currentService.getSOVTrendData();
export const getTrackedKeywords = () => currentService.getTrackedKeywords();
export const getKeywordSOVData = () => currentService.getKeywordSOVData();
export const getProductSOVData = () => currentService.getProductSOVData();
