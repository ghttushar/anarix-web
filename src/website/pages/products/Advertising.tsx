import { ProductTemplate } from "./ProductTemplate";

export default function Advertising() {
  return (
    <ProductTemplate
      eyebrow="Advertising Intelligence"
      title="Control every campaign with precision."
      blurb="Bids, budgets, and pacing surfaced in one operational view — the way operators actually work."
      bullets={[
        "Campaign / Ad Group / Product Ad hierarchy",
        "Inline edit on every metric",
        "Budget Pacing with daily anomaly alerts",
        "Search Term Harvesting with one-click promotion",
        "Creative Analyzer for image and copy performance",
        "Marketplace-aware validation (Amazon + Walmart)",
      ]}
    />
  );
}
