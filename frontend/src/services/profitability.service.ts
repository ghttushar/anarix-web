import { api } from "@/lib/api-client";
import type {
  ProfitabilitySummary,
  ProfitabilityProduct,
  ProfitabilityOrder,
  TrendDataPoint,
  ApiResponse,
  PerformanceDataItem,
  GraphDataPoint,
  ProductDataItem,
  OrderDataItem,
  ApiPaginatedData,
  ProfitabilityRequestBody,
} from "@/types/profitability";

function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {};
  const profileId = localStorage.getItem("anarix_amazon_profile_id");
  const partnerId = localStorage.getItem("anarix_selling_partner_id");
  if (profileId) headers["amazonProfileId"] = profileId;
  if (partnerId) headers["sellingpartnerid"] = partnerId;
  return headers;
}

function baseBody(range: string, overrides: Partial<ProfitabilityRequestBody> = {}): ProfitabilityRequestBody {
  return {
    frequency: "daily",
    filters: [],
    page: 1,
    pageSize: 50,
    searchText: "",
    searchColumns: ["itemName", "asin", "sku"],
    range,
    sortCriteria: [],
    isDownload: false,
    downloadWithFilter: true,
    executionMode: "PUBLISH",
    version: "v2",
    ...overrides,
  };
}

function mapPerformanceToSummary(item: PerformanceDataItem, period: string): ProfitabilitySummary {
  return {
    period: period as any,
    dateLabel: period.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    gmv: item.totalSales || 0,
    authSales: item.totalSales || 0,
    orders: item.totalOrders || 0,
    units: item.totalUnits || 0,
    returns: item.totalReturns || 0,
    cancelled: item.cancelledOrdersCount || 0,
    adCost: item.totalAdSpend || 0,
    estPayout: item.estimatedPayout || 0,
    netProfit: item.netProfit || 0,
    breakdown: {
      organic: item.organicSales || 0,
      sponsoredProducts: item.spAdSales || 0,
      sponsoredBrands: item.sbAdSales || 0,
      sponsoredVideo: item.sdAdSales || 0,
      cogs: item.cogs || 0,
      totalExpenses: (item.totalAdSpend || 0) + (item.cogs || 0),
      tacos: item.tacos || 0,
      roas: item.roas || 0,
    },
  };
}

function mapProduct(item: ProductDataItem): ProfitabilityProduct {
  return {
    id: item.asin || "",
    name: item.itemName || "",
    image: item.imageUrl || "",
    itemId: item.asin || "",
    sku: "",
    price: 0,
    cogs: item.cogs || 0,
    units: item.totalUnitsSold || 0,
    refundUnits: 0,
    cancelledUnits: 0,
    gmv: item.totalSales || 0,
    authSales: item.totalSales || 0,
    refundSales: 0,
    cancelledSales: 0,
    adSpend: item.overallAdSpend || 0,
    commissionProduct: 0,
    commissionShipping: 0,
    wfsFulfillmentFee: 0,
    shippingFees: 0,
    netProfit: item.netProfit || 0,
    additionalFee: 0,
    totalSales: item.totalSales || 0,
  };
}

function mapOrder(item: OrderDataItem): ProfitabilityOrder {
  const datePart = item.orderDate ? item.orderDate.split("T")[0] : "";
  const timePart = item.orderDate ? (item.orderDate.split("T")[1] || "").substring(0, 5) : "";
  const rawStatus = (item.orderStatus || "").toLowerCase();
  const status = rawStatus === "shipped" ? "shipped"
    : rawStatus === "delivered" ? "delivered"
    : rawStatus === "canceled" ? "cancelled"
    : rawStatus === "returned" ? "returned"
    : "processing" as const;

  return {
    id: item.orderId || "",
    orderId: item.orderId || "",
    date: datePart,
    time: timePart,
    status,
    price: item.totalPrincipalAmount || 0,
    country: item.countryCode || "",
    flag: (item.countryCode || "").toLowerCase(),
    netProfit: item.netProfit || 0,
    gmv: item.totalPrincipalAmount || 0,
    units: item.totalOrderUnits || 0,
    cogs: 0,
    wfsFulfillmentFee: 0,
    shippingFees: 0,
    commissionProduct: 0,
    commissionShipping: 0,
    additionalFee: 0,
    refundUnits: 0,
    adSpend: 0,
    authSales: item.totalPrincipalAmount || 0,
    refundSales: 0,
    cancelledSales: 0,
    cancelledUnits: 0,
    products: [],
  };
}

const RANGE_PERIODS = ["today", "yesterday", "this_month", "last_month"];

export async function getSummaries(range?: string): Promise<ProfitabilitySummary[]> {
  const r = range || "TODAY/YESTERDAY/THIS_MONTH/LAST_MONTH";
  const headers = getHeaders();
  const res = await api.post<ApiResponse<PerformanceDataItem[]>>(
    "/advertising/v2/amazon/profitability/performance",
    baseBody(r),
    headers
  );
  const items = res.data || [];
  return items.map((item, i) =>
    mapPerformanceToSummary(item, RANGE_PERIODS[i] || `period_${i}`)
  );
}

export async function getProducts(
  page = 1,
  pageSize = 50,
  searchText = ""
): Promise<ProfitabilityProduct[]> {
  const headers = getHeaders();
  const res = await api.post<ApiResponse<ApiPaginatedData<ProductDataItem>>>(
    `/advertising/v2/amazon/profitability/products?page=${page}&pageSize=${pageSize}`,
    baseBody("TODAY/YESTERDAY/THIS_MONTH/LAST_MONTH", { page, pageSize, searchText }),
    headers
  );
  const items = res.data?.data || [];
  return items.map(mapProduct);
}

export async function getOrders(
  page = 1,
  pageSize = 50,
  searchText = ""
): Promise<ProfitabilityOrder[]> {
  const headers = getHeaders();
  const res = await api.post<ApiResponse<ApiPaginatedData<OrderDataItem>>>(
    `/advertising/v2/amazon/profitability/orders?page=${page}&pageSize=${pageSize}`,
    baseBody("TODAY/YESTERDAY/THIS_MONTH/LAST_MONTH", { page, pageSize, searchText }),
    headers
  );
  const items = res.data?.data || [];
  return items.map(mapOrder);
}

export async function getTrendDataByPeriod(): Promise<Record<string, TrendDataPoint[]>> {
  const headers = getHeaders();
  const periods = ["TODAY", "YESTERDAY", "THIS_MONTH", "LAST_MONTH"];
  const keys = ["today", "yesterday", "this_month", "last_month"];

  const results = await Promise.all(
    periods.map((p) =>
      api.post<ApiResponse<GraphDataPoint[]>>(
        "/advertising/v2/amazon/profitability/graph",
        { ...baseBody(p), filters: [] as any[], sortCriteria: [] as any[] },
        headers
      ).then((res) => (res.data || []).map((d: GraphDataPoint) => ({
        week: d.label || "",
        orders: d.totalOrders || 0,
        units: d.totalUnits || 0,
      })))
    )
  );

  const map: Record<string, TrendDataPoint[]> = {};
  keys.forEach((key, i) => { map[key] = results[i]; });
  return map;
}

export async function updateCogs(productId: string, newCogs: number): Promise<void> {
  const headers = getHeaders();
  await api.post<ApiResponse<any>>(
    "/advertising/v2/amazon/profitability/products",
    baseBody("TODAY", { searchText: productId, searchColumns: ["asin"] }),
    headers
  );
}

/* Stubs for unused functions — kept to avoid import breakage */
export async function getGeographicalData(): Promise<any[]> { return []; }
export async function getPnLData(): Promise<any[]> { return []; }
export async function getTrendData(): Promise<any[]> { return []; }
export async function getScatterData(): Promise<any[]> { return []; }
export async function getUnifiedPnL(): Promise<any[]> { return []; }
