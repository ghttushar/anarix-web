export interface Invoice {
  id: string;
  number: string;
  date: string; // ISO
  plan: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "refunded";
}

export const mockInvoices: Invoice[] = [
  { id: "inv_001", number: "ANX-2026-0008", date: "2026-05-01", plan: "Profitability Pro (Yearly)", amount: 639, status: "paid" },
  { id: "inv_002", number: "ANX-2026-0007", date: "2026-04-01", plan: "Profitability Pro (Yearly)", amount: 639, status: "paid" },
  { id: "inv_003", number: "ANX-2026-0006", date: "2026-03-01", plan: "Profitability Pro (Yearly)", amount: 639, status: "paid" },
  { id: "inv_004", number: "ANX-2026-0005", date: "2026-02-01", plan: "Profitability Growth (Monthly)", amount: 299, status: "refunded" },
  { id: "inv_005", number: "ANX-2026-0004", date: "2026-01-01", plan: "Profitability Growth (Monthly)", amount: 299, status: "paid" },
  { id: "inv_006", number: "ANX-2025-0003", date: "2025-12-01", plan: "Profitability Growth (Monthly)", amount: 299, status: "paid" },
  { id: "inv_007", number: "ANX-2025-0002", date: "2025-11-01", plan: "Profitability Growth (Monthly)", amount: 299, status: "failed" },
  { id: "inv_008", number: "ANX-2025-0001", date: "2025-10-01", plan: "Profitability Growth (Monthly)", amount: 299, status: "paid" },
];
