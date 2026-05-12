import { ProductTemplate } from "./ProductTemplate";

export default function ManagedServices() {
  return (
    <ProductTemplate
      eyebrow="Managed Services"
      title="A senior operator team, embedded with yours."
      blurb="For brands that want the platform plus the people. Strategy, daily ops, and reporting handled — you keep full visibility."
      bullets={[
        "Dedicated account strategist",
        "Daily campaign and bid management",
        "Weekly performance reviews and forecasts",
        "Quarterly business reviews with leadership",
        "Catalog hygiene, listing optimization, creative testing",
        "Direct Slack channel with your operator team",
      ]}
    />
  );
}
