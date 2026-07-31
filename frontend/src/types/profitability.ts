export interface ProfitabilitySummary {
  period: "today" | "yesterday" | "this_month" | "last_month";
  dateLabel: string;
  dateRange?: string;
  gmv: number;
  authSales: number;
  orders: number;
  units: number;
  returns: number;
  cancelled: number;
  adCost: number;
  estPayout: number;
  netProfit: number;
  breakdown: {
    organic: number;
    sponsoredProducts: number;
    sponsoredBrands: number;
    sponsoredVideo: number;
    cogs: number;
    totalExpenses: number;
    tacos: number;
    roas: number;
  };
}

export interface ProfitabilityProduct {
  id: string;
  name: string;
  image: string;
  itemId: string;
  sku: string;
  price: number;
  cogs: number;
  units: number;
  refundUnits: number;
  cancelledUnits: number;
  gmv: number;
  authSales: number;
  refundSales: number;
  cancelledSales: number;
  adSpend: number;
  commissionProduct: number;
  commissionShipping: number;
  wfsFulfillmentFee: number;
  shippingFees: number;
  netProfit: number;
  additionalFee: number;
  profitMargin?: number;
  totalSales?: number;
  weeklyData?: Record<string, number>;
}

export interface ProfitabilityOrder {
  id: string;
  orderId: string;
  date: string;
  time: string;
  status: "delivered" | "shipped" | "processing" | "cancelled" | "returned";
  price: number;
  country: string;
  flag: string;
  netProfit: number;
  gmv: number;
  units: number;
  cogs: number;
  wfsFulfillmentFee: number;
  shippingFees: number;
  commissionProduct: number;
  commissionShipping: number;
  additionalFee: number;
  refundUnits: number;
  adSpend: number;
  authSales: number;
  refundSales: number;
  cancelledSales: number;
  cancelledUnits: number;
  products: ProfitabilityProduct[];
}

export interface GeographicalData {
  id: string;
  region: string;
  countryCode: string;
  flag: string;
  stocks: number;
  orders: number;
  unitsSold: number;
  refunds: number;
  sales: number;
  amazonFees: number;
  sellableReturns: number;
  children?: GeographicalData[];
}

export interface PnLRow {
  id: string;
  parameter: string;
  isParent: boolean;
  isExpanded?: boolean;
  indent: number;
  weeklyValues: Record<string, number | null>;
  total: number | null;
  children?: PnLRow[];
}

export interface TrendDataPoint {
  week: string;
  orders: number;
  units: number;
  totalSales: number;
  totalReturnAmount: number;
  totalReturnedUnits: number;
  cancelledOrdersCount: number;
  totalReturns: number;
  totalReturnCommissionAmount: number;
  totalReturnReferralAmount: number;
  totalCogs: number;
  totalAdSpend: number;
  spAdSpend: number;
  sbAdSpend: number;
  sdAdSpend: number;
  totalAdSales: number;
  organicAdSales: number;
  spAdSales: number;
  sbAdSales: number;
  sdAdSales: number;
  totalAdUnits: number;
  organicAdUnits: number;
  spAdUnits: number;
  sbAdUnits: number;
  sdAdUnits: number;
  tacos: number;
  roas: number;
  acos: number;
  fbaFulfillmentFees: number;
  referralFees: number;
  netProfit: number;
  estimatedPayout: number;
  margin: number;
  roi: number;
  refundPercentage: number;
  settlementDetails?: SettlementDetails;
}

export interface ScatterDataPoint {
  id: string;
  name: string;
  profitMargin: number;
  totalSales: number;
  adSpend: number;
  quadrant: "winners" | "grow" | "optimize" | "review";
}

export interface PnLLineItem {
  label: string;
  amazon: number;
  walmart: number;
  combined: number;
  isHeader?: boolean;
  isTotal?: boolean;
  indent?: number;
}

export interface PnLProductItem {
  asin: string;
  productName: string;
  imageUrl: string;
  sku: string;
  price: number;
}

export interface GraphRequestBody {
  frequency?: string;
  filters: any[];
  searchText: string;
  range: string;
  sortCriteria: any[];
  asinSkuGroupBy?: boolean;
  asinSkuMapping?: Array<{ asin: string; sku: string }>;
  executionMode?: string;
  version?: string;
}

/* ── Raw API response types ── */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  description?: string;
}

export interface ApiPaginatedData<T> {
  pagination: { page: number; pageSize: number; totalItems: number };
  data: T[];
}

export interface ProfitabilityRequestBody {
  frequency?: string;
  filters: any[];
  page: number;
  pageSize: number;
  searchText: string;
  searchColumns: string[];
  range: string;
  sortCriteria: any[];
  isDownload?: boolean;
  downloadWithFilter?: boolean;
  executionMode: string;
  version: string;
}

export interface LoginResponseData {
  authToken: string;
  user: any;
  requiresAccountSelection: boolean;
}

export interface AccountMappingItem {
  _id: string;
  userId: string;
  accountId: {
    _id: string;
    brandName: string;
    marketplace: string;
    accountType: string;
    countryCode: string;
    email?: string;
  };
  roles: string[];
  permissions: string[];
}

export interface AccountSettingsEntry {
  marketplace: string;
  accountType: string;
  advertising: {
    amazonProfileId: string;
    countryCode: string;
  };
  catalog: {
    partnerDisplayName: string;
  };
}

export interface PerformanceDataItem {
  totalSales: number;
  totalOrders: number;
  totalUnits: number;
  totalReturns: number;
  cancelledOrdersCount: number;
  totalAdSpend: number;
  tacos: number;
  roas: number;
  netProfit: number;
  estimatedPayout: number;
  cogs: number;
  organicSales: number;
  spAdSales: number;
  sbAdSales: number;
  sdAdSales: number;
  otherSales: number;
  [key: string]: any;
}

export interface SettlementDetails {
  refundFees?: {
    totalRefundCommission: number;
    totalRefundReferralFee: number;
    fbaCustomerReturnPerUnitFee: number;
  };
  amazonFees?: {
    fbaFulfillmentFees: number;
    referralFees: number;
    promotion: number;
  };
  totalFbaFulfillmentFees?: number;
  totalReferralFees?: number;
  fbaCustomerReturnPerUnitFee?: number;
  promotion?: number;
  valueOfReturnedItems?: number;
}

export interface GraphDataPoint {
  label: string;
  asin?: string;
  sku?: string;
  totalSales: number;
  totalReturnAmount: number;
  totalUnits: number;
  totalReturnedUnits: number;
  totalOrders: number;
  cancelledOrdersCount: number;
  totalReturns: number;
  totalReturnCommissionAmount: number;
  totalReturnReferralAmount: number;
  totalCogs: number;
  totalAdSpend: number;
  spAdSpend: number;
  sbAdSpend: number;
  sdAdSpend: number;
  totalAdSales: number;
  organicAdSales: number;
  spAdSales: number;
  sbAdSales: number;
  sdAdSales: number;
  totalAdUnits: number;
  organicAdUnits: number;
  spAdUnits: number;
  sbAdUnits: number;
  sdAdUnits: number;
  tacos: number;
  roas: number;
  acos: number;
  fbaFulfillmentFees: number;
  referralFees: number;
  netProfit: number;
  estimatedPayout: number;
  margin: number;
  roi: number;
  refundPercentage: number;
  settlementDetails?: SettlementDetails;
  [key: string]: any;
}

export interface ChildProductItem {
  asin: string;
  sku: string;
  itemName: string;
  imageUrl: string;
  price: number;
  totalOrders: number;
  totalSales: number;
  totalUnitsSold: number;
  overallAdSpend: number;
  netProfit: number;
  cogs: number;
  [key: string]: any;
}

export interface ProductDataItem {
  asin: string;
  itemName: string;
  imageUrl: string;
  totalOrders: number;
  totalSales: number;
  totalUnitsSold: number;
  overallAdSpend: number;
  overallSpAdSpend: number;
  overallSbAdSpend: number;
  overallSdAdSpend: number;
  overallAdSales: number;
  overallOrganicSales: number;
  overallSpAdSales: number;
  overallSbAdSales: number;
  overallSdAdSales: number;
  overallAdUnits: number;
  overallOrganicUnits: number;
  overallSpAdUnits: number;
  overallSbAdUnits: number;
  overallSdAdUnits: number;
  tacos: number;
  roas: number;
  acos: number;
  netProfit: number;
  cogs: number;
  fbafullfillment: number;
  referralFees: number;
  totalReturns: number;
  totalReturnSales: number;
  totalRefundCommission: number;
  totalRefundReferralFees: number;
  fbaFees: number;
  fbaReturnFees: number;
  valueOfReturnedItems: number;
  promotion: number;
  childItemsCount: number;
  settlementAmount: number;
  refundPercentage: number;
  margin: number;
  estimatedPayout: number;
  roi: number;
  totalRefundFees: number;
  totalAmazonFees: number;
  childItems: ChildProductItem[];
  settlementDetails?: {
    refundFees: {
      totalRefundCommission: number;
      totalRefundReferralFee: number;
      fbaCustomerReturnPerUnitFee: number;
    };
    amazonFees: {
      fbaFulfillmentFees: number;
      referralFees: number;
      promotion: number;
    };
  };
  [key: string]: any;
}

export interface OrderItemData {
  asin: string;
  sku: string;
  itemName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  totalPrincipalAmount: number;
  totalOrdersReferralFee: number;
  totalOrdersFbaFulfillmentFees: number;
  countryCode: string;
  settlementDetails?: {
    refundFees: {
      totalRefundCommission: number;
      totalRefundReferralFee: number;
      fbaCustomerReturnPerUnitFee: number;
    };
    amazonFees: {
      fbaFulfillmentFees: number;
      referralFees: number;
      promotion: number;
    };
  };
  [key: string]: any;
}

export interface AggregatedProductData {
  totalSales: number;
  totalUnitsSold: number;
  totalOrders: number;
  totalReturns: number;
  totalNetProfit: number;
  totalCogs: number;
  totalAdSpend: number;
  totalAmazonFees: number;
  totalRefundFees: number;
  estimatedPayout: number;
  margin: number;
  roi: number;
  [key: string]: any;
}

export interface OrderDataItem {
  orderId: string;
  orderStatus: string;
  countryCode: string;
  orderDate: string;
  sellingPartnerId: string;
  totalOrderUnits: number;
  totalPrincipalAmount: number;
  totalOrdersReferralFee: number;
  totalOrdersFbaFulfillmentFees: number;
  totalReturnUnits: number;
  totalReturnPrincipalAmount: number;
  totalRefundReferralFee: number;
  totalRefundCommissionFees: number;
  totalRefundFbaCustomerReturnFees: number;
  totalCogs: number;
  valueOfReturnedItems: number;
  bothOrderAndReturn: number;
  promotion: number;
  netProfit: number;
  amazonFeeNetProfit: number;
  refundFeeNetProfit: number;
  totalAmazonFees: number;
  totalRefundFees: number;
  roi: number;
  margin: number;
  estimatedPayout: number;
  items: OrderItemData[];
  settlementDetails?: {
    refundFees: {
      totalRefundCommission: number;
      totalRefundReferralFee: number;
      fbaCustomerReturnPerUnitFee: number;
    };
    amazonFees: {
      fbaFulfillmentFees: number;
      referralFees: number;
      promotion: number;
    };
  };
  [key: string]: any;
}

export interface AggregatedOrderData {
  totalOrderUnits: number;
  totalPrincipalAmount: number;
  totalOrdersReferralFee: number;
  totalOrdersFbaFulfillmentFees: number;
  totalReturnUnits: number;
  totalReturnPrincipalAmount: number;
  totalRefundReferralFee: number;
  totalRefundCommissionFees: number;
  totalRefundFbaCustomerReturnFees: number;
  totalCogs: number;
  valueOfReturnedItems: number;
  totalAmazonFees: number;
  totalRefundFees: number;
  netProfit: number;
  roi: number;
  margin: number;
  estimatedPayout: number;
  [key: string]: any;
}
