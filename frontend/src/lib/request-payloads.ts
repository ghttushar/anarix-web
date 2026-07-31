export interface AdvertisingPayload {
  filters: unknown[];
  payload: {
    range: string;
    startDate: string;
    endDate: string;
    isDownload: boolean;
    downloadWithFilter: boolean;
  };
  searchText: string;
  tab?: string;
  sortCriteria: Array<{ columnName: string; sortOrder: string }>;
  searchColumns: string[];
}

export interface ProfitabilityPayload {
  range: string;
  startDate?: string;
  endDate?: string;
  frequency?: string;
  sortCriteria?: Array<{ columnName: string; sortOrder: string }>;
  filters?: unknown[];
  page?: number;
  pageSize?: number;
  searchText?: string;
  searchColumns?: string[];
  asinSkuMapping?: Array<{ asin: string; sku: string }>;
  asinSkuGroupBy?: boolean;
  isDownload?: boolean;
  downloadWithFilter?: boolean;
}

export interface CatalogPayload {
  filters: unknown[];
  searchText: string;
  searchColumns: string[];
  sortCriteria: Array<{ columnName: string; sortOrder: string }>;
  startDate: string;
  endDate: string;
  range: string;
  isDownload: boolean;
  downloadWithFilter: boolean;
}

export function getAdvertisingPayload(
  overrides: Partial<AdvertisingPayload> = {}
): AdvertisingPayload {
  return {
    filters: [],
    payload: {
      range: "LAST_30_DAYS",
      startDate: "",
      endDate: "",
      isDownload: false,
      downloadWithFilter: false,
    },
    searchText: "",
    sortCriteria: [],
    searchColumns: [],
    ...overrides,
  };
}

export function getProfitabilityPayload(
  overrides: Partial<ProfitabilityPayload> = {}
): ProfitabilityPayload {
  return {
    range: "LAST_30_DAYS",
    startDate: "",
    endDate: "",
    frequency: "",
    sortCriteria: [],
    filters: [],
    page: 1,
    pageSize: 10,
    searchText: "",
    searchColumns: [],
    asinSkuMapping: [],
    asinSkuGroupBy: false,
    isDownload: false,
    downloadWithFilter: false,
    ...overrides,
  };
}

export function getCatalogPayload(
  overrides: Partial<CatalogPayload> = {}
): CatalogPayload {
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
    ...overrides,
  };
}
