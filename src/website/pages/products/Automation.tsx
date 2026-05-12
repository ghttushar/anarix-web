import { ProductTemplate } from "./ProductTemplate";

export default function Automation() {
  return (
    <ProductTemplate
      eyebrow="Automation"
      title="Deploy automation without blind execution."
      blurb="Approve, schedule, and audit every action your rules take. No silent changes, no surprise spend."
      bullets={[
        "Rule builder with plain-English conditions",
        "Preview every action before it runs",
        "Schedule rules by hour, day, or marketplace event",
        "Full audit log of every triggered action",
        "Pause, rollback, or override at any time",
        "Notifications when rules fire or blocked",
      ]}
    />
  );
}
