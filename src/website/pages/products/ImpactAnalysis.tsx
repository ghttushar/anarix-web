import { ProductTemplate } from "./ProductTemplate";
export default function ImpactAnalysis() {
  return (
    <ProductTemplate
      eyebrow="Impact Analysis"
      title="See what actually moved performance."
      blurb="Attribute lift to bid changes, budget shifts, and creative swaps with a clean Base → Impact comparison."
      bullets={[
        "Base vs. Impact side-by-side",
        "Pill-style deltas for every metric",
        "Tied to the rule or manual change that caused it",
        "Filter by campaign, brand, marketplace",
        "Export-ready summaries",
      ]}
    />
  );
}
