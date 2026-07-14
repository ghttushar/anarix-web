export interface CompetitorProduct {
  id: string;
  competitorName: string;
  asin: string;
  productName: string;
  currentPrice: number;
  priceHistory: { date: string; price: number }[];
  yourPrice: number;
  yourSalesImpact: number; // percentage change in your sales
  yourCvrImpact: number; // percentage change in your CVR
  lastUpdated: string;
}

export const mockCompetitorProducts: CompetitorProduct[] = [
  { id: "cp1", competitorName: "NutraFit Pro", asin: "B0COMP001", productName: "Organic Whey Protein 2lb", currentPrice: 34.99, priceHistory: [{ date: "2026-02-01", price: 39.99 }, { date: "2026-02-08", price: 37.99 }, { date: "2026-02-15", price: 34.99 }, { date: "2026-02-22", price: 34.99 }, { date: "2026-03-01", price: 34.99 }], yourPrice: 38.99, yourSalesImpact: -12.4, yourCvrImpact: -8.2, lastUpdated: "2026-03-05" },
  { id: "cp2", competitorName: "VitaBlend", asin: "B0COMP002", productName: "Plant Protein Vanilla 1.5lb", currentPrice: 28.99, priceHistory: [{ date: "2026-02-01", price: 29.99 }, { date: "2026-02-08", price: 29.99 }, { date: "2026-02-15", price: 28.99 }, { date: "2026-02-22", price: 27.99 }, { date: "2026-03-01", price: 28.99 }], yourPrice: 31.99, yourSalesImpact: -5.1, yourCvrImpact: -3.8, lastUpdated: "2026-03-05" },
  { id: "cp3", competitorName: "GreenPure", asin: "B0COMP003", productName: "Collagen Peptides 20oz", currentPrice: 24.99, priceHistory: [{ date: "2026-02-01", price: 22.99 }, { date: "2026-02-08", price: 23.99 }, { date: "2026-02-15", price: 24.99 }, { date: "2026-02-22", price: 24.99 }, { date: "2026-03-01", price: 24.99 }], yourPrice: 23.99, yourSalesImpact: 4.2, yourCvrImpact: 2.1, lastUpdated: "2026-03-05" },
  { id: "cp4", competitorName: "PowerMax", asin: "B0COMP004", productName: "Pre-Workout Energy 30srv", currentPrice: 32.99, priceHistory: [{ date: "2026-02-01", price: 34.99 }, { date: "2026-02-08", price: 34.99 }, { date: "2026-02-15", price: 32.99 }, { date: "2026-02-22", price: 31.99 }, { date: "2026-03-01", price: 32.99 }], yourPrice: 29.99, yourSalesImpact: 8.6, yourCvrImpact: 5.3, lastUpdated: "2026-03-05" },
  { id: "cp5", competitorName: "NutraFit Pro", asin: "B0COMP005", productName: "BCAA Recovery Powder", currentPrice: 19.99, priceHistory: [{ date: "2026-02-01", price: 21.99 }, { date: "2026-02-08", price: 20.99 }, { date: "2026-02-15", price: 19.99 }, { date: "2026-02-22", price: 19.99 }, { date: "2026-03-01", price: 19.99 }], yourPrice: 21.99, yourSalesImpact: -6.8, yourCvrImpact: -4.5, lastUpdated: "2026-03-05" },
];


// ──────────── Synthetic expansion (Phase 3.3) ────────────
// Procedurally clones existing rows to reach 45 total records
// for realistic pagination demos. Generated at module load.
(() => {
  const base = mockCompetitorProducts.slice();
  const baseLen = base.length;
  if (baseLen === 0) return;
  let nextId = baseLen + 1;
  while (mockCompetitorProducts.length < 45) {
    const src = base[(mockCompetitorProducts.length - baseLen) % baseLen];
    const variance = 0.7 + ((mockCompetitorProducts.length * 37) % 60) / 100;
    const clone: any = { ...src };
    clone.id = "cp-" + nextId;
    if ((clone as any)["productName"]) (clone as any)["productName"] = (clone as any)["productName"] + " #" + nextId;
    for (const k of Object.keys(clone)) {
      const v = (clone as any)[k];
      if (typeof v === "number" && k !== "id" && !k.toLowerCase().includes("date")) {
        (clone as any)[k] = Math.round(v * variance * 100) / 100;
      }
    }
    mockCompetitorProducts.push(clone);
    nextId++;
  }
})();
