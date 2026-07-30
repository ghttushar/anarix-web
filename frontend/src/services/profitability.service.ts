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
  PnLProductItem,
  ScatterDataPoint,
  AggregatedProductData,
  AggregatedOrderData,
  GeographicalData,
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

function graphRequestBody(range: string, overrides: {
  frequency?: string;
  searchText?: string;
  filters?: any[];
  sortCriteria?: any[];
  asinSkuGroupBy?: boolean;
  asinSkuMapping?: Array<{ asin: string; sku: string }>;
} = {}): Record<string, any> {
  return {
    frequency: "daily",
    filters: [],
    searchText: "",
    range,
    sortCriteria: [],
    asinSkuGroupBy: false,
    asinSkuMapping: [],
    executionMode: "PUBLISH",
    version: "v2",
    ...overrides,
  };
}

export function buildPeriodRange(from: Date, to: Date): { range: string; startDate?: string; endDate?: string } {
  const diffDays = Math.round((to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return { range: "TODAY" };
  if (diffDays === 1) return { range: "YESTERDAY" };
  if (diffDays <= 7) return { range: "LAST_7_DAYS_FROM_TODAY", startDate: from.toISOString().split("T")[0], endDate: to.toISOString().split("T")[0] };
  if (diffDays <= 30) return { range: "LAST_30_DAYS_FROM_TODAY", startDate: from.toISOString().split("T")[0], endDate: to.toISOString().split("T")[0] };
  return { range: "CUSTOM_RANGE", startDate: from.toISOString().split("T")[0], endDate: to.toISOString().split("T")[0] };
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
    sku: item.childItems?.[0]?.sku || "",
    price: item.childItems?.[0]?.price || 0,
    cogs: item.cogs || 0,
    units: item.totalUnitsSold || 0,
    refundUnits: item.totalReturns || 0,
    cancelledUnits: 0,
    gmv: item.totalSales || 0,
    authSales: item.totalSales || 0,
    refundSales: Math.abs(item.totalReturnSales || 0),
    cancelledSales: 0,
    adSpend: item.overallAdSpend || 0,
    commissionProduct: item.referralFees || 0,
    commissionShipping: 0,
    wfsFulfillmentFee: item.fbafullfillment || item.fbaFees || 0,
    shippingFees: 0,
    netProfit: item.netProfit || 0,
    additionalFee: 0,
    profitMargin: item.margin,
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
    cogs: item.totalCogs || 0,
    wfsFulfillmentFee: item.totalOrdersFbaFulfillmentFees || 0,
    shippingFees: 0,
    commissionProduct: item.totalOrdersReferralFee || 0,
    commissionShipping: 0,
    additionalFee: Math.abs(item.promotion || 0),
    refundUnits: item.totalReturnUnits || 0,
    adSpend: 0,
    authSales: item.totalPrincipalAmount || 0,
    refundSales: Math.abs(item.totalReturnPrincipalAmount || 0),
    cancelledSales: 0,
    cancelledUnits: 0,
    products: (item.items || []).map((i: any) => ({
      id: i.asin || "",
      name: i.itemName || "",
      image: i.imageUrl || "",
      itemId: i.asin || "",
      sku: i.sku || "",
      price: i.price || 0,
      cogs: 0,
      units: i.quantity || 0,
      refundUnits: 0,
      cancelledUnits: 0,
      gmv: i.totalPrincipalAmount || 0,
      authSales: i.totalPrincipalAmount || 0,
      refundSales: 0,
      cancelledSales: 0,
      adSpend: 0,
      commissionProduct: 0,
      commissionShipping: 0,
      wfsFulfillmentFee: 0,
      shippingFees: 0,
      netProfit: 0,
      additionalFee: 0,
    })),
  };
}

const RANGE_PERIODS = ["today", "yesterday", "this_month", "last_month"];

export async function getSummaries(
  range?: string,
  startDate?: string,
  endDate?: string,
  frequency?: string
): Promise<ProfitabilitySummary[]> {
  const r = range || "TODAY/YESTERDAY/THIS_MONTH/LAST_MONTH";
  const headers = getHeaders();
  const res = await api.post<ApiResponse<PerformanceDataItem[]>>(
    "/advertising/v2/amazon/profitability/performance",
    baseBody(r, { startDate, endDate, frequency }),
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
  searchText = "",
  range?: string,
  startDate?: string,
  endDate?: string,
  frequency?: string
): Promise<ProfitabilityProduct[]> {
  const headers = getHeaders();
  const r = range || "TODAY/YESTERDAY/THIS_MONTH/LAST_MONTH";
  const res = await api.post<ApiResponse<ApiPaginatedData<ProductDataItem>>>(
    `/advertising/v2/amazon/profitability/products?page=${page}&pageSize=${pageSize}`,
    baseBody(r, {
      page, pageSize, searchText, startDate, endDate, frequency,
      searchColumns: ["asin", "itemName", "childItems->>asin", "childItems->>sku"],
    }),
    headers
  );
  const items = res.data?.data || [];
  return items.map(mapProduct);
}

export async function getOrders(
  page = 1,
  pageSize = 50,
  searchText = "",
  range?: string,
  startDate?: string,
  endDate?: string,
  frequency?: string
): Promise<ProfitabilityOrder[]> {
  const headers = getHeaders();
  const r = range || "TODAY/YESTERDAY/THIS_MONTH/LAST_MONTH";
  const res = await api.post<ApiResponse<ApiPaginatedData<OrderDataItem>>>(
    `/advertising/v2/amazon/profitability/orders?page=${page}&pageSize=${pageSize}`,
    baseBody(r, {
      page, pageSize, searchText, startDate, endDate, frequency,
      searchColumns: ["orderId", "items->>asin", "asin", "sku"],
    }),
    headers
  );
  const items = res.data?.data || [];
  return items.map(mapOrder);
}

export async function getAggregatedProducts(
  range?: string,
  startDate?: string,
  endDate?: string,
  frequency?: string
): Promise<AggregatedProductData | null> {
  const headers = getHeaders();
  const r = range || "TODAY/YESTERDAY/THIS_MONTH/LAST_MONTH";
  const res = await api.post<ApiResponse<AggregatedProductData>>(
    "/advertising/v2/amazon/profitability/products/aggregated",
    baseBody(r, {
      startDate, endDate, frequency,
      searchText: "",
      searchColumns: ["asin", "itemName", "childItems->>asin", "childItems->>sku"],
    }),
    headers
  );
  return res.data || null;
}

export async function getAggregatedOrders(
  range?: string,
  startDate?: string,
  endDate?: string,
  frequency?: string
): Promise<AggregatedOrderData | null> {
  const headers = getHeaders();
  const r = range || "TODAY/YESTERDAY/THIS_MONTH/LAST_MONTH";
  const res = await api.post<ApiResponse<AggregatedOrderData>>(
    "/advertising/v2/amazon/profitability/orders/aggregated",
    baseBody(r, {
      startDate, endDate, frequency,
      searchText: "",
      searchColumns: ["orderId", "items->>asin", "asin", "sku"],
    }),
    headers
  );
  return res.data || null;
}

function mapToTrendDataPoint(d: GraphDataPoint): TrendDataPoint {
  return {
    week: d.label || "",
    orders: d.totalOrders || 0,
    units: d.totalUnits || 0,
    totalSales: d.totalSales || 0,
    totalReturnAmount: d.totalReturnAmount || 0,
    totalReturnedUnits: d.totalReturnedUnits || 0,
    cancelledOrdersCount: d.cancelledOrdersCount || 0,
    totalReturns: d.totalReturns || 0,
    totalReturnCommissionAmount: d.totalReturnCommissionAmount || 0,
    totalReturnReferralAmount: d.totalReturnReferralAmount || 0,
    totalCogs: d.totalCogs || 0,
    totalAdSpend: d.totalAdSpend || 0,
    spAdSpend: d.spAdSpend || 0,
    sbAdSpend: d.sbAdSpend || 0,
    sdAdSpend: d.sdAdSpend || 0,
    totalAdSales: d.totalAdSales || 0,
    organicAdSales: d.organicAdSales || 0,
    spAdSales: d.spAdSales || 0,
    sbAdSales: d.sbAdSales || 0,
    sdAdSales: d.sdAdSales || 0,
    totalAdUnits: d.totalAdUnits || 0,
    organicAdUnits: d.organicAdUnits || 0,
    spAdUnits: d.spAdUnits || 0,
    sbAdUnits: d.sbAdUnits || 0,
    sdAdUnits: d.sdAdUnits || 0,
    tacos: d.tacos || 0,
    roas: d.roas || 0,
    acos: d.acos || 0,
    fbaFulfillmentFees: d.fbaFulfillmentFees || 0,
    referralFees: d.referralFees || 0,
    netProfit: d.netProfit || 0,
    estimatedPayout: d.estimatedPayout || 0,
    margin: d.margin || 0,
    roi: d.roi || 0,
    refundPercentage: d.refundPercentage || 0,
    settlementDetails: d.settlementDetails,
  };
}

export async function getTrendDataByPeriod(
  range?: string,
  startDate?: string,
  endDate?: string,
  frequency?: string
): Promise<Record<string, TrendDataPoint[]>> {
  const headers = getHeaders();
  const periods = ["LAST_7_DAYS_FROM_TODAY", "YESTERDAY", "LAST_30_DAYS_FROM_TODAY", "LAST_30_DAYS_FROM_TODAY"];
  const keys = ["today", "yesterday", "this_month", "last_month"];

  const results = await Promise.all(
    periods.map((p) =>
      api.post<ApiResponse<GraphDataPoint[]>>(
        "/advertising/v2/amazon/profitability/graph",
        graphRequestBody(p, { frequency: frequency || "daily" }),
        headers
      ).then((res) => (res.data || []).map(mapToTrendDataPoint)).catch(() => [] as TrendDataPoint[])
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

export async function getPnLProducts(): Promise<ProfitabilityProduct[]> {
  const headers = getHeaders();
  const res = await api.post<ApiResponse<PnLProductItem[]>>(
    "/advertising/v2/amazon/profitability/pnl/products",
    { executionMode: "PUBLISH", version: "v2" },
    headers
  );
  const items = res.data || [];
  return items.map((item) => ({
    id: item.asin || "",
    name: item.productName || "",
    image: item.imageUrl || "",
    itemId: item.asin || "",
    sku: item.sku || "",
    price: item.price || 0,
    cogs: 0,
    units: 0,
    refundUnits: 0,
    cancelledUnits: 0,
    gmv: 0,
    authSales: 0,
    refundSales: 0,
    cancelledSales: 0,
    adSpend: 0,
    commissionProduct: 0,
    commissionShipping: 0,
    wfsFulfillmentFee: 0,
    shippingFees: 0,
    netProfit: 0,
    additionalFee: 0,
  }));
}

export async function getScatterData(): Promise<ScatterDataPoint[]> {
  const headers = getHeaders();
  const products = await getPnLProducts();
  if (products.length === 0) return [];

  const results = await Promise.allSettled(
    products.map((p) =>
      api.post<ApiResponse<GraphDataPoint[]>>(
        "/advertising/v2/amazon/profitability/graph",
        graphRequestBody("LAST_7_DAYS_FROM_TODAY", {
          asinSkuMapping: [{ asin: p.itemId, sku: p.sku }],
          asinSkuGroupBy: false,
        }),
        headers
      )
    )
  );

  const scatterPoints: ScatterDataPoint[] = [];
  for (let i = 0; i < products.length; i++) {
    const result = results[i];
    if (result.status !== "fulfilled") continue;
    const data = result.value.data || [];
    let totalSales = 0;
    let totalAdSpend = 0;
    let totalNetProfit = 0;
    for (const d of data) {
      totalSales += d.totalSales || 0;
      totalAdSpend += d.totalAdSpend || 0;
      totalNetProfit += d.netProfit || 0;
    }
    const profitMargin = totalSales > 0 ? (totalNetProfit / totalSales) * 100 : 0;
    scatterPoints.push({
      id: products[i].id,
      name: products[i].name,
      profitMargin: Math.round(profitMargin * 100) / 100,
      totalSales,
      adSpend: totalAdSpend,
      quadrant: "review",
    });
  }

  const medianSales = scatterPoints.length > 0
    ? scatterPoints.map((s) => s.totalSales).sort((a, b) => a - b)[Math.floor(scatterPoints.length / 2)]
    : 0;
  const medianMargin = scatterPoints.length > 0
    ? scatterPoints.map((s) => s.profitMargin).sort((a, b) => a - b)[Math.floor(scatterPoints.length / 2)]
    : 0;

  for (const sp of scatterPoints) {
    if (sp.profitMargin >= medianMargin && sp.totalSales >= medianSales) sp.quadrant = "winners";
    else if (sp.profitMargin >= medianMargin && sp.totalSales < medianSales) sp.quadrant = "grow";
    else if (sp.profitMargin < medianMargin && sp.totalSales >= medianSales) sp.quadrant = "optimize";
    else sp.quadrant = "review";
  }

  return scatterPoints;
}

const COUNTRY_MAP: Record<string, { region: string; flag: string }> = {
  US: { region: "United States", flag: "🇺🇸" },
  CA: { region: "Canada", flag: "🇨🇦" },
  MX: { region: "Mexico", flag: "🇲🇽" },
  GB: { region: "United Kingdom", flag: "🇬🇧" },
  DE: { region: "Germany", flag: "🇩🇪" },
  FR: { region: "France", flag: "🇫🇷" },
  IT: { region: "Italy", flag: "🇮🇹" },
  ES: { region: "Spain", flag: "🇪🇸" },
  JP: { region: "Japan", flag: "🇯🇵" },
  AU: { region: "Australia", flag: "🇦🇺" },
  IN: { region: "India", flag: "🇮🇳" },
  BR: { region: "Brazil", flag: "🇧🇷" },
  AE: { region: "UAE", flag: "🇦🇪" },
  SA: { region: "Saudi Arabia", flag: "🇸🇦" },
  SG: { region: "Singapore", flag: "🇸🇬" },
  NL: { region: "Netherlands", flag: "🇳🇱" },
  SE: { region: "Sweden", flag: "🇸🇪" },
  PL: { region: "Poland", flag: "🇵🇱" },
  TR: { region: "Turkey", flag: "🇹🇷" },
  EG: { region: "Egypt", flag: "🇪🇬" },
  ZA: { region: "South Africa", flag: "🇿🇦" },
};

export async function getGeographicalData(
  range?: string,
  startDate?: string,
  endDate?: string,
  frequency?: string
): Promise<GeographicalData[]> {
  const headers = getHeaders();
  const r = range || "LAST_30_DAYS_FROM_TODAY";
  try {
    const res = await api.post<ApiResponse<ApiPaginatedData<OrderDataItem>>>(
      `/advertising/v2/amazon/profitability/orders?page=1&pageSize=500`,
      baseBody(r, {
        page: 1,
        pageSize: 500,
        startDate,
        endDate,
        frequency,
        searchColumns: ["orderId", "items->>asin", "asin", "sku"],
      }),
      headers
    );
    const orders = res.data?.data || [];
    const countryMap = new Map<string, {
      orders: number; unitsSold: number; refunds: number;
      sales: number; amazonFees: number;
    }>();
    for (const order of orders) {
      const cc = order.countryCode || "US";
      const entry = countryMap.get(cc) || { orders: 0, unitsSold: 0, refunds: 0, sales: 0, amazonFees: 0 };
      entry.orders += 1;
      entry.unitsSold += order.totalOrderUnits || 0;
      entry.refunds += order.totalReturnUnits || 0;
      entry.sales += order.totalPrincipalAmount || 0;
      entry.amazonFees += (order.totalOrdersReferralFee || 0) + (order.totalOrdersFbaFulfillmentFees || 0);
      countryMap.set(cc, entry);
    }
    const result: GeographicalData[] = [];
    for (const [code, data] of countryMap) {
      const info = COUNTRY_MAP[code] || { region: code, flag: "" };
      result.push({
        id: code,
        region: info.region,
        countryCode: code,
        flag: info.flag,
        stocks: 0,
        orders: data.orders,
        unitsSold: data.unitsSold,
        refunds: data.refunds,
        sales: data.sales,
        amazonFees: data.amazonFees,
        sellableReturns: 0,
      });
    }
    result.sort((a, b) => b.sales - a.sales);
    return result;
  } catch {
    return [];
  }
}

/* Stubs for unused functions — kept to avoid import breakage */
export async function getPnLData(): Promise<any[]> { return []; }
export async function getTrendData(): Promise<any[]> { return []; }
export async function getUnifiedPnL(): Promise<any[]> { return []; }
