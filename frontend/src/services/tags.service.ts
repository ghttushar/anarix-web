import { api } from "@/lib/api-client";

export interface TagsService {
  getAllTags: () => Promise<string[]>;
  createTag: (name: string) => Promise<string>;
  renameTag: (oldName: string, newName: string) => Promise<void>;
  deleteTag: (name: string) => Promise<void>;
  getCampaignTags: (campaignId: string) => Promise<string[]>;
  setCampaignTags: (campaignId: string, tags: string[]) => Promise<void>;
}

const realService: TagsService = {
  getAllTags: () => api.get<string[]>("/advertising/v2/tags"),
  createTag: (name) => api.post<string>("/advertising/v2/tags", { name }),
  renameTag: (oldName, newName) => api.put<void>("/advertising/v2/tags", { oldName, newName }),
  deleteTag: (name) => api.delete<void>(`/advertising/v2/tags/${encodeURIComponent(name)}`),
  getCampaignTags: (campaignId) => api.get<string[]>(`/advertising/v2/tags/campaign/${campaignId}`),
  setCampaignTags: (campaignId, tags) =>
    api.put<void>(`/advertising/v2/tags/campaign/${campaignId}`, { tags }),
};

let currentService: TagsService = realService;

export function setTagsService(service: TagsService) {
  currentService = service;
}

export function getTagsService(): TagsService {
  return currentService;
}

export const getAllTags = () => currentService.getAllTags();
export const createTag = (name: string) => currentService.createTag(name);
export const renameTag = (oldName: string, newName: string) =>
  currentService.renameTag(oldName, newName);
export const deleteTag = (name: string) => currentService.deleteTag(name);
export const getCampaignTags = (campaignId: string) =>
  currentService.getCampaignTags(campaignId);
export const setCampaignTags = (campaignId: string, tags: string[]) =>
  currentService.setCampaignTags(campaignId, tags);
