import { ProductTemplate } from "./ProductTemplate";
export default function RuleAutomation() {
  return (
    <ProductTemplate
      eyebrow="Rule Automation"
      title="Deploy automation without blind execution."
      blurb="Approve, schedule, and audit every action your rules take. Aan drafts the rule, you stay in control."
      bullets={[
        "Draft-first: Aan proposes, you approve",
        "Preview expected impact before applying",
        "Full audit trail on every rule firing",
        "Pause, edit, or revert any rule with one click",
        "Library of templates for common patterns",
        "Per-marketplace and per-account scoping",
      ]}
    />
  );
}
