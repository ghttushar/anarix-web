import { api } from "@/lib/api-client";
import type { TargetingAction, ImpactComparison, SearchTerm, ProductTarget, PlatformData, PageTypeData, HarvestCandidate, PacingCampaign, AnomalyAlert } from "@/types/advertising";

export interface AdvertisingService {
  getTargetingActions: () => Promise<TargetingAction[]>;
  getTargetingCampaigns: () => Promise<{ id: string; name: string }[]>;
  getTargetingAdGroups: () => Promise<{ id: string; name: string; campaignId: string }[]>;
  getSearchHarvesting: () => Promise<HarvestCandidate[]>;
  getPacingCampaigns: () => Promise<PacingCampaign[]>;
  getPacingAlerts: () => Promise<{ id: string; campaignId: string; message: string; severity: string; timestamp: string }[]>;
  getAnomalyAlerts: () => Promise<AnomalyAlert[]>;
  getImpactCampaigns: () => Promise<ImpactComparison[]>;
  getImpactAdGroups: () => Promise<ImpactComparison[]>;
  getImpactProducts: () => Promise<ImpactComparison[]>;
  getCreativeAssets: () => Promise<{ id: string; name: string; type: string; thumbnail?: string }[]>;
  getCreativeInsights: () => Promise<{ id: string; assetId: string; metric: string; value: number; benchmark: number }[]>;
}

const realService: AdvertisingService = {
  getTargetingActions: () => api.get<TargetingAction[]>("/targeting-action/amazon/data"),
  getTargetingCampaigns: () => api.get<{ id: string; name: string }[]>("/advertising/v2/amazon/sp/campaigns"),
  getTargetingAdGroups: () => api.get<{ id: string; name: string; campaignId: string }[]>("/advertising/v2/amazon/sp/ad-groups"),
  getSearchHarvesting: () => api.get<HarvestCandidate[]>("/targeting-action/amazon/search-term"),
  getPacingCampaigns: () => api.get<PacingCampaign[]>("/bidder/amazon/job"),
  getPacingAlerts: () => api.get<{ id: string; campaignId: string; message: string; severity: string; timestamp: string }[]>("/monitoring/data"),
  getAnomalyAlerts: () => api.get<AnomalyAlert[]>("/monitoring/data"),
  getImpactCampaigns: () => api.get<ImpactComparison[]>("/advertising/v2/impact-analysis/amazon/all/graph"),
  getImpactAdGroups: () => api.get<ImpactComparison[]>("/advertising/v2/impact-analysis/amazon/all/graph"),
  getImpactProducts: () => api.get<ImpactComparison[]>("/advertising/v2/impact-analysis/amazon/all/graph"),
  getCreativeAssets: () => api.get<{ id: string; name: string; type: string; thumbnail?: string }[]>("/advertising/v2/amazon/sb/assets"),
  getCreativeInsights: () => api.get<{ id: string; assetId: string; metric: string; value: number; benchmark: number }[]>("/advertising/v2/amazon/sb/performance"),
};

let currentService: AdvertisingService = realService;

export function setAdvertisingService(service: AdvertisingService) {
  currentService = service;
}

export function getAdvertisingService(): AdvertisingService {
  return currentService;
}

export const getTargetingActions = () => currentService.getTargetingActions();
export const getTargetingCampaigns = () => currentService.getTargetingCampaigns();
export const getTargetingAdGroups = () => currentService.getTargetingAdGroups();
export const getSearchHarvesting = () => currentService.getSearchHarvesting();
export const getPacingCampaigns = () => currentService.getPacingCampaigns();
export const getPacingAlerts = () => currentService.getPacingAlerts();
export const getAnomalyAlerts = () => currentService.getAnomalyAlerts();
export const getImpactCampaigns = () => currentService.getImpactCampaigns();
export const getImpactAdGroups = () => currentService.getImpactAdGroups();
export const getImpactProducts = () => currentService.getImpactProducts();
export const getCreativeAssets = () => currentService.getCreativeAssets();
export const getCreativeInsights = () => currentService.getCreativeInsights();
