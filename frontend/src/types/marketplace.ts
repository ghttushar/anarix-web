export interface CompetitorProduct {
  id: string;
  asin: string;
  title: string;
  ourPrice: number;
  competitorPrice: number;
  priceDiff: number;
  ourBuyBox: boolean;
  competitorName: string;
  imageUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
  description: string;
  marketplace: string;
}
