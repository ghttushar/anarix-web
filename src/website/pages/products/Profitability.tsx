import { ProductTemplate } from "./ProductTemplate";

export default function Profitability() {
  return (
    <ProductTemplate
      eyebrow="Profitability"
      title="See contribution margin at SKU level."
      blurb="Reconcile fees, ad spend, and returns into a single live P&L across Amazon, Walmart, Shopify, and TikTok."
      bullets={[
        "Unified P&L across every marketplace",
        "SKU-level contribution margin, refreshed daily",
        "COGS editor with version history",
        "Geographical breakdowns by state and zip",
        "Trend view tied directly to ad activity",
        "Drill from a metric to an order line in two clicks",
      ]}
    />
  );
}
