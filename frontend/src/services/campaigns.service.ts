import { api } from "@/lib/api-client";
import { Campaign, ChartDataPoint, KPIData } from "@/types/campaign";
import type { AdGroup, ProductAd } from "@/types/advertising";

export interface CampaignsService {
  getCampaigns: () => Promise<Campaign[]>;
  getChartData: () => Promise<ChartDataPoint[]>;
  getKPIData: () => Promise<KPIData[]>;
  getCampaignById: (id: string) => Promise<Campaign | undefined>;
  getAdGroups: (campaignId?: string) => Promise<AdGroup[]>;
  getProductAds: (adGroupId?: string) => Promise<ProductAd[]>;
}

const realService: CampaignsService = {
  getCampaigns: () => api.get<Campaign[]>("/advertising/v2/amazon/sp/table"),
  getChartData: () => api.get<ChartDataPoint[]>("/advertising/v2/amazon/sp/graph"),
  getKPIData: () => api.get<KPIData[]>("/advertising/v2/amazon/sp/performance"),
  getCampaignById: (id) => api.get<Campaign | undefined>(`/advertising/v2/amazon/sp/campaigns/${id}`),
  getAdGroups: (campaignId) => api.get<AdGroup[]>(`/advertising/v2/amazon/sp/ad-groups${campaignId ? `/${campaignId}` : ""}`),
  getProductAds: (adGroupId) => api.get<ProductAd[]>(`/advertising/v2/amazon/sp/table${adGroupId ? `?adGroupId=${adGroupId}` : ""}`),
};

let currentService: CampaignsService = realService;

export function setCampaignsService(service: CampaignsService) {
  currentService = service;
}

export function getCampaignsService(): CampaignsService {
  return currentService;
}

export const getCampaigns = () => currentService.getCampaigns();
export const getChartData = () => currentService.getChartData();
export const getKPIData = () => currentService.getKPIData();
export const getCampaignById = (id: string) => currentService.getCampaignById(id);
export const getAdGroups = (campaignId?: string) => currentService.getAdGroups(campaignId);
export const getProductAds = (adGroupId?: string) => currentService.getProductAds(adGroupId);
