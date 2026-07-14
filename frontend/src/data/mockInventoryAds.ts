export interface InventoryProduct {
  id: string;
  name: string;
  sku: string;
  asin: string;
  currentStock: number;
  dailySalesRate: number;
  daysOfSupply: number;
  stockStatus: "healthy" | "low" | "critical" | "overstock";
  dailyAdSpend: number;
  suggestedAdSpend: number;
  adSpendAction: "increase" | "decrease" | "maintain" | "pause";
  reason: string;
  revenue30d: number;
  roas: number;
}

export const mockInventoryProducts: InventoryProduct[] = [
  { id: "ip1", name: "Organic Whey Protein 2lb", sku: "OWP-2LB", asin: "B0PROD001", currentStock: 1240, dailySalesRate: 28, daysOfSupply: 44, stockStatus: "healthy", dailyAdSpend: 85, suggestedAdSpend: 85, adSpendAction: "maintain", reason: "Stock levels healthy. Maintain current ad spend.", revenue30d: 32760, roas: 4.6 },
  { id: "ip2", name: "Plant Protein Vanilla 1.5lb", sku: "PPV-15LB", asin: "B0PROD002", currentStock: 180, dailySalesRate: 22, daysOfSupply: 8, stockStatus: "critical", dailyAdSpend: 62, suggestedAdSpend: 15, adSpendAction: "decrease", reason: "Only 8 days of supply remaining. Reduce ad spend by 75% to extend runway until restock.", revenue30d: 19800, roas: 5.2 },
  { id: "ip3", name: "Collagen Peptides 20oz", sku: "CP-20OZ", asin: "B0PROD003", currentStock: 3200, dailySalesRate: 15, daysOfSupply: 213, stockStatus: "overstock", dailyAdSpend: 25, suggestedAdSpend: 65, adSpendAction: "increase", reason: "213 days of supply indicates overstock. Increase ad spend to accelerate sell-through.", revenue30d: 10800, roas: 3.8 },
  { id: "ip4", name: "Pre-Workout Energy 30srv", sku: "PWE-30", asin: "B0PROD004", currentStock: 420, dailySalesRate: 18, daysOfSupply: 23, stockStatus: "low", dailyAdSpend: 48, suggestedAdSpend: 30, adSpendAction: "decrease", reason: "23 days of supply is below reorder point. Reduce ad spend moderately.", revenue30d: 16200, roas: 4.1 },
  { id: "ip5", name: "BCAA Recovery Powder", sku: "BCAA-RP", asin: "B0PROD005", currentStock: 0, dailySalesRate: 12, daysOfSupply: 0, stockStatus: "critical", dailyAdSpend: 35, suggestedAdSpend: 0, adSpendAction: "pause", reason: "Out of stock. Pause all advertising immediately to avoid wasted spend.", revenue30d: 8640, roas: 0 },
  { id: "ip6", name: "Electrolyte Powder SF", sku: "EP-SF", asin: "B0PROD006", currentStock: 890, dailySalesRate: 20, daysOfSupply: 45, stockStatus: "healthy", dailyAdSpend: 55, suggestedAdSpend: 55, adSpendAction: "maintain", reason: "Healthy stock levels with good sell-through rate.", revenue30d: 18000, roas: 4.9 },
];
