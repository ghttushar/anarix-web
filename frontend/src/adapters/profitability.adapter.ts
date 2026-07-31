import {
  ProfitabilitySummary,
  ProfitabilityProduct,
  ProfitabilityOrder,
  GeographicalData,
  PnLRow,
  TrendDataPoint,
  ScatterDataPoint,
} from "@/types/profitability";

// ============================================================
// API response interfaces
// ============================================================

export interface ApiProfitabilitySummary {
  id: string;
  period: "today" | "yesterday" | "this_month" | "last_month";
  date_label: string;
  date_range?: string;
  gmv: number;
  auth_sales: number;
  orders: number;
  units: number;
  returns: number;
  cancelled: number;
  overall_ad_spend: number;
  estimated_payout: number;
  net_profit: number;
  breakdown: {
    organic: number;
    sponsored_products: number;
    sponsored_brands: number;
    sponsored_video: number;
    cogs: number;
    total_expenses: number;
    tacos: number;
    roas: number;
  };
  created_at: string;
  updated_at: string;
}

export interface ApiProfitabilityProduct {
  id: string;
  name: string;
  image: string;
  item_id: string;
  sku: string;
  price: number;
  cogs: number;
  units: number;
  refund_units: number;
  cancelled_units: number;
  gmv: number;
  auth_sales: number;
  refund_sales: number;
  cancelled_sales: number;
  overall_ad_spend: number;
  commission_on_product: number;
  commission_on_shipping: number;
  wfs_fulfillment_fee: number;
  total_shipping_cost: number;
  net_profit: number;
  additional_fee: number;
  profit_margin?: number;
  total_sales?: number;
  weekly_data?: Record<string, number>;
  created_at: string;
  updated_at: string;
}

export interface ApiProfitabilityOrder {
  id: string;
  order_id: string;
  date: string;
  time: string;
  status: "delivered" | "shipped" | "processing" | "cancelled" | "returned";
  price: number;
  country: string;
  flag: string;
  net_profit: number;
  gmv: number;
  units: number;
  cogs: number;
  wfs_fulfillment_fee: number;
  total_shipping_cost: number;
  commission_on_product: number;
  commission_on_shipping: number;
  additional_fee: number;
  refund_units: number;
  overall_ad_spend: number;
  auth_sales: number;
  refund_sales: number;
  cancelled_sales: number;
  cancelled_units: number;
  products: ApiProfitabilityProduct[];
  created_at: string;
}

export interface ApiGeographicalData {
  id: string;
  region: string;
  country_code: string;
  flag: string;
  stocks: number;
  orders: number;
  units_sold: number;
  refunds: number;
  sales: number;
  amazon_fees: number;
  sellable_returns: number;
  children?: ApiGeographicalData[];
}

export interface ApiPnLRow {
  id: string;
  parameter: string;
  is_parent: boolean;
  is_expanded?: boolean;
  indent: number;
  weekly_values: Record<string, number | null>;
  total: number | null;
  children?: ApiPnLRow[];
}

export interface ApiTrendDataPoint {
  week: string;
  orders: number;
  units: number;
}

export interface ApiScatterDataPoint {
  id: string;
  name: string;
  profit_margin: number;
  total_sales: number;
  overall_ad_spend: number;
  quadrant: "winners" | "grow" | "optimize" | "review";
}

// ============================================================
// Adapter functions
// ============================================================

export function adaptProfitabilitySummary(api: ApiProfitabilitySummary): ProfitabilitySummary {
  return {
    period: api.period,
    dateLabel: api.date_label,
    dateRange: api.date_range,
    gmv: api.gmv,
    authSales: api.auth_sales,
    orders: api.orders,
    units: api.units,
    returns: api.returns,
    cancelled: api.cancelled,
    adCost: api.overall_ad_spend,
    estPayout: api.estimated_payout,
    netProfit: api.net_profit,
    breakdown: {
      organic: api.breakdown.organic,
      sponsoredProducts: api.breakdown.sponsored_products,
      sponsoredBrands: api.breakdown.sponsored_brands,
      sponsoredVideo: api.breakdown.sponsored_video,
      cogs: api.breakdown.cogs,
      totalExpenses: api.breakdown.total_expenses,
      tacos: api.breakdown.tacos,
      roas: api.breakdown.roas,
    },
  };
}

export function adaptProfitabilitySummaries(apiList: ApiProfitabilitySummary[]): ProfitabilitySummary[] {
  return apiList.map(adaptProfitabilitySummary);
}

export function adaptProfitabilityProduct(api: ApiProfitabilityProduct): ProfitabilityProduct {
  return {
    id: api.id,
    name: api.name,
    image: api.image,
    itemId: api.item_id,
    sku: api.sku,
    price: api.price,
    cogs: api.cogs,
    units: api.units,
    refundUnits: api.refund_units,
    cancelledUnits: api.cancelled_units,
    gmv: api.gmv,
    authSales: api.auth_sales,
    refundSales: api.refund_sales,
    cancelledSales: api.cancelled_sales,
    adSpend: api.overall_ad_spend,
    commissionProduct: api.commission_on_product,
    commissionShipping: api.commission_on_shipping,
    wfsFulfillmentFee: api.wfs_fulfillment_fee,
    shippingFees: api.total_shipping_cost,
    netProfit: api.net_profit,
    additionalFee: api.additional_fee,
    profitMargin: api.profit_margin,
    totalSales: api.total_sales,
    weeklyData: api.weekly_data,
  };
}

export function adaptProfitabilityProducts(apiList: ApiProfitabilityProduct[]): ProfitabilityProduct[] {
  return apiList.map(adaptProfitabilityProduct);
}

export function adaptProfitabilityOrder(api: ApiProfitabilityOrder): ProfitabilityOrder {
  return {
    id: api.id,
    orderId: api.order_id,
    date: api.date,
    time: api.time,
    status: api.status,
    price: api.price,
    country: api.country,
    flag: api.flag,
    netProfit: api.net_profit,
    gmv: api.gmv,
    units: api.units,
    cogs: api.cogs,
    wfsFulfillmentFee: api.wfs_fulfillment_fee,
    shippingFees: api.total_shipping_cost,
    commissionProduct: api.commission_on_product,
    commissionShipping: api.commission_on_shipping,
    additionalFee: api.additional_fee,
    refundUnits: api.refund_units,
    adSpend: api.overall_ad_spend,
    authSales: api.auth_sales,
    refundSales: api.refund_sales,
    cancelledSales: api.cancelled_sales,
    cancelledUnits: api.cancelled_units,
    products: adaptProfitabilityProducts(api.products),
  };
}

export function adaptProfitabilityOrders(apiList: ApiProfitabilityOrder[]): ProfitabilityOrder[] {
  return apiList.map(adaptProfitabilityOrder);
}

export function adaptGeographicalData(api: ApiGeographicalData): GeographicalData {
  return {
    id: api.id,
    region: api.region,
    countryCode: api.country_code,
    flag: api.flag,
    stocks: api.stocks,
    orders: api.orders,
    unitsSold: api.units_sold,
    refunds: api.refunds,
    sales: api.sales,
    amazonFees: api.amazon_fees,
    sellableReturns: api.sellable_returns,
    children: api.children ? api.children.map(adaptGeographicalData) : undefined,
  };
}

export function adaptGeographicalDataList(apiList: ApiGeographicalData[]): GeographicalData[] {
  return apiList.map(adaptGeographicalData);
}

export function adaptPnLRow(api: ApiPnLRow): PnLRow {
  return {
    id: api.id,
    parameter: api.parameter,
    isParent: api.is_parent,
    isExpanded: api.is_expanded,
    indent: api.indent,
    weeklyValues: api.weekly_values,
    total: api.total,
    children: api.children ? api.children.map(adaptPnLRow) : undefined,
  };
}

export function adaptPnLRows(apiList: ApiPnLRow[]): PnLRow[] {
  return apiList.map(adaptPnLRow);
}

export function adaptTrendDataPoint(api: ApiTrendDataPoint): TrendDataPoint {
  return {
    week: api.week,
    orders: api.orders,
    units: api.units,
  };
}

export function adaptTrendDataPoints(apiList: ApiTrendDataPoint[]): TrendDataPoint[] {
  return apiList.map(adaptTrendDataPoint);
}

export function adaptScatterDataPoint(api: ApiScatterDataPoint): ScatterDataPoint {
  return {
    id: api.id,
    name: api.name,
    profitMargin: api.profit_margin,
    totalSales: api.total_sales,
    adSpend: api.overall_ad_spend,
    quadrant: api.quadrant,
  };
}

export function adaptScatterDataPoints(apiList: ApiScatterDataPoint[]): ScatterDataPoint[] {
  return apiList.map(adaptScatterDataPoint);
}
