export interface PnLLineItem {
  label: string;
  amazon: number;
  walmart: number;
  combined: number;
  isHeader?: boolean;
  isTotal?: boolean;
  indent?: number;
}

export const mockUnifiedPnL: PnLLineItem[] = [
  { label: "Gross Revenue", amazon: 245000, walmart: 128000, combined: 373000, isHeader: true },
  { label: "Product Sales", amazon: 232000, walmart: 118000, combined: 350000, indent: 1 },
  { label: "Shipping Revenue", amazon: 8500, walmart: 6200, combined: 14700, indent: 1 },
  { label: "Other Revenue", amazon: 4500, walmart: 3800, combined: 8300, indent: 1 },

  { label: "Cost of Goods Sold", amazon: -86800, walmart: -45200, combined: -132000, isHeader: true },
  { label: "Product COGS", amazon: -78200, walmart: -39800, combined: -118000, indent: 1 },
  { label: "Inbound Shipping", amazon: -5400, walmart: -3200, combined: -8600, indent: 1 },
  { label: "Packaging", amazon: -3200, walmart: -2200, combined: -5400, indent: 1 },

  { label: "Gross Profit", amazon: 158200, walmart: 82800, combined: 241000, isTotal: true },

  { label: "Marketplace Fees", amazon: -41650, walmart: -19200, combined: -60850, isHeader: true },
  { label: "Referral Fees", amazon: -34300, walmart: -15360, combined: -49660, indent: 1 },
  { label: "FBA / WFS Fees", amazon: -7350, walmart: -3840, combined: -11190, indent: 1 },

  { label: "Advertising Spend", amazon: -28400, walmart: -12800, combined: -41200, isHeader: true },
  { label: "Sponsored Products", amazon: -18200, walmart: -8400, combined: -26600, indent: 1 },
  { label: "Sponsored Brands", amazon: -6800, walmart: -2800, combined: -9600, indent: 1 },
  { label: "Sponsored Display", amazon: -3400, walmart: -1600, combined: -5000, indent: 1 },

  { label: "Other Costs", amazon: -4200, walmart: -2100, combined: -6300, isHeader: true },
  { label: "Returns & Refunds", amazon: -3200, walmart: -1500, combined: -4700, indent: 1 },
  { label: "Promotions & Coupons", amazon: -1000, walmart: -600, combined: -1600, indent: 1 },

  { label: "Net Profit", amazon: 83950, walmart: 48700, combined: 132650, isTotal: true },
  { label: "Net Margin", amazon: 34.27, walmart: 38.05, combined: 35.56, isTotal: true },
];
