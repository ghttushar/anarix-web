export interface CatalogProduct {
  id: string;
  name: string;
  image: string;
  itemId: string;
  sku: string;
  tags: string[];
  status: "published" | "unpublished" | "draft";
  reviewCount: number;
  rating: number;
  inventoryCount: number;
  inventoryValueCogs: number;
  inventoryValueRetail: number;
  price: number;
  cogs: number;
  totalSales: number;
  gmv: number;
  totalUnits: number;
  refundSales: number;
  cancelledSales: number;
  advertised: boolean;
  adSpend: number;
}

export interface ColumnGroup {
  id: string;
  label: string;
  columns: string[];
  isExpanded: boolean;
}
