export interface CatalogProduct {
  asin: string;
  itemName: string;
  sellerSku: string;
  upcCode: string;
  imageUrl: string;
  listPrice: number;
  advertised: boolean;
  adSpend: number;
  adSales: number;
  roas: number;
  acos: number;
  tacos: number | null;
  totalSales: number;
  totalUnits: number;
  impressions: number;
  clicks: number;
  ctr: number;
  totalOnHandQuantity: number;
  totalInBoundQuantity: number;
  totalReservedQuantity: number;
  fulfilledBy: string;
}

export interface AggregatedCatalogData {
  totalProducts: number;
  impressions: number;
  clicks: number;
  adSpend: number;
  adSales: number;
  adUnits: number;
  adOrders: number;
  campaigns: number;
  listPrice: number;
  totalSales: number;
  totalUnits: number;
  ctr: number;
  cpc: number;
  cvr: number;
  roas: number;
  acos: number;
  tacos: number | null;
  totalOnHandQuantity: number;
  totalInBoundQuantity: number;
  totalReservedQuantity: number;
  totalResearchingQuantity: number;
  totalUnfulfillableQuantity: number;
  totalFutureSupplyBuyableQuantity: number;
  totalQuantity: number;
}

export interface CatalogApiResponse<T> {
  success: boolean;
  error: boolean;
  message: string;
  data: T;
  description?: string;
}

export interface CatalogPaginatedData<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
