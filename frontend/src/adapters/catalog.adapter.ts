import { CatalogProduct } from "@/types/catalog";

// ============================================================
// API response interfaces
// ============================================================

export interface ApiCatalogProduct {
  id: string;
  item_name: string;
  image: string;
  item_id: string;
  seller_sku: string;
  tags: string[];
  status: "published" | "unpublished" | "draft";
  review_count: number;
  rating: number;
  total_on_hand_quantity: number;
  inventory_value_cogs: number;
  inventory_value_retail: number;
  price: number;
  cogs: number;
  total_sales: number;
  gmv: number;
  total_units: number;
  refund_sales: number;
  cancelled_sales: number;
  advertised: boolean;
  ad_spend: number;
  created_at: string;
  updated_at: string;
  category?: string;
  subcategory?: string;
  brand?: string;
}

export interface ApiCatalogProductListResponse {
  products: ApiCatalogProduct[];
  total: number;
  page: number;
  page_size: number;
}

// ============================================================
// Adapter functions
// ============================================================

export function adaptCatalogProduct(api: ApiCatalogProduct): CatalogProduct {
  return {
    id: api.id,
    name: api.item_name,
    image: api.image,
    itemId: api.item_id,
    sku: api.seller_sku,
    tags: api.tags,
    status: api.status,
    reviewCount: api.review_count,
    rating: api.rating,
    inventoryCount: api.total_on_hand_quantity,
    inventoryValueCogs: api.inventory_value_cogs,
    inventoryValueRetail: api.inventory_value_retail,
    price: api.price,
    cogs: api.cogs,
    totalSales: api.total_sales,
    gmv: api.gmv,
    totalUnits: api.total_units,
    refundSales: api.refund_sales,
    cancelledSales: api.cancelled_sales,
    advertised: api.advertised,
    adSpend: api.ad_spend,
  };
}

export function adaptCatalogProducts(apiList: ApiCatalogProduct[]): CatalogProduct[] {
  return apiList.map(adaptCatalogProduct);
}

// ============================================================
// Reverse adapters (UI → API request)
// ============================================================

export function toApiCatalogProduct(product: Partial<CatalogProduct>): Partial<ApiCatalogProduct> {
  return {
    item_name: product.name,
    item_id: product.itemId,
    seller_sku: product.sku,
    price: product.price,
    cogs: product.cogs,
    status: product.status,
    tags: product.tags,
    advertised: product.advertised,
  };
}
