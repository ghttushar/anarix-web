import { api } from "@/lib/api-client";
import type { CatalogProduct, AggregatedCatalogData, CatalogApiResponse } from "@/types/catalog";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const profileId = localStorage.getItem("anarix_amazon_profile_id");
  const partnerId = localStorage.getItem("anarix_selling_partner_id");
  if (profileId) headers["amazonProfileId"] = profileId;
  if (partnerId) headers["sellingpartnerid"] = partnerId;
  return headers;
}

function catalogBody(overrides: Record<string, any> = {}) {
  return {
    filters: [],
    searchText: "",
    searchColumns: ["itemName", "asin", "upcCode", "sellerSku"],
    sortCriteria: [],
    startDate: "",
    endDate: "",
    range: "LAST_30_DAYS",
    isDownload: false,
    downloadWithFilter: false,
    executionMode: "PUBLISH",
    ...overrides,
  };
}

export async function getCatalogProducts(
  page = 1,
  pageSize = 50,
  searchText = "",
  range = "LAST_30_DAYS",
  sortCriteria: Array<{ columnName: string; sortOrder: string }> = []
): Promise<{ data: CatalogProduct[]; total: number }> {
  const headers = getHeaders();
  const res = await api.post<CatalogApiResponse<CatalogProduct[]>>(
    `/amazon-ads/catalog?page=${page}&pageSize=${pageSize}`,
    catalogBody({ searchText, range, sortCriteria }),
    headers
  );
  return { data: res.data || [], total: res.total ?? 0 };
}

export async function getCatalogAggregated(
  range = "LAST_30_DAYS"
): Promise<AggregatedCatalogData | null> {
  const headers = getHeaders();
  try {
    const res = await api.post<CatalogApiResponse<AggregatedCatalogData>>(
      "/amazon-ads/catalog/aggregated",
      catalogBody({ range }),
      headers
    );
    return res.data || null;
  } catch {
    return null;
  }
}

export async function getCatalogProductById(
  id: string,
  range = "LAST_30_DAYS"
): Promise<CatalogProduct | undefined> {
  const headers = getHeaders();
  try {
    const res = await api.post<CatalogApiResponse<CatalogProduct[]>>(
      "/amazon-ads/catalog?page=1&pageSize=1",
      catalogBody({ searchText: id, range }),
      headers
    );
    return res.data?.[0];
  } catch {
    return undefined;
  }
}
