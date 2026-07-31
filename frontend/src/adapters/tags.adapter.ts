// ============================================================
// API response interfaces (what the backend would return)
// ============================================================

export interface ApiTag {
  id: string;
  name: string;
  color?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiCampaignTag {
  id: string;
  campaign_id: string;
  tag_id: string;
  tag_name: string;
  created_at: string;
}

export interface ApiCreateTagRequest {
  name: string;
  color?: string;
}

export interface ApiRenameTagRequest {
  name: string;
}

export interface ApiBulkTagRequest {
  campaign_ids: string[];
  tag_name: string;
  action: "add" | "remove";
}

// ============================================================
// UI types (what the components expect)
// ============================================================

export interface TagDetails {
  id: string;
  name: string;
  color?: string;
}

// ============================================================
// Adapter functions (API response → UI type)
// ============================================================

export function adaptTag(api: ApiTag): TagDetails {
  return {
    id: api.id,
    name: api.name,
    color: api.color,
  };
}

export function adaptTags(apiList: ApiTag[]): TagDetails[] {
  return apiList.map(adaptTag);
}

export function adaptTagToName(api: ApiTag): string {
  return api.name;
}

export function adaptTagsToNameList(apiList: ApiTag[]): string[] {
  return apiList.map(adaptTagToName);
}

export function adaptCampaignTagsToMap(
  apiList: ApiCampaignTag[]
): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const ct of apiList) {
    if (!map[ct.campaign_id]) map[ct.campaign_id] = [];
    map[ct.campaign_id].push(ct.tag_name);
  }
  return map;
}

// ============================================================
// Reverse adapter (UI type → API request)
// ============================================================

export function toCreateTagRequest(name: string): ApiCreateTagRequest {
  return { name };
}

export function toRenameTagRequest(name: string): ApiRenameTagRequest {
  return { name };
}

export function toBulkTagRequest(
  campaignIds: string[],
  tagName: string,
  action: "add" | "remove"
): ApiBulkTagRequest {
  return { campaign_ids: campaignIds, tag_name: tagName, action };
}

export const ADAPTER_VERSION = "1.0.0";
