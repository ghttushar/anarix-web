import { ProductTemplate } from "./ProductTemplate";
export default function EnterpriseReporting() {
  return (
    <ProductTemplate
      eyebrow="Enterprise Reporting"
      title="Audit-ready, stakeholder-grade reporting."
      blurb="Versioned reports, scheduled deliveries, and a Client Portal for white-labeled handoffs."
      bullets={[
        "Document-grade report templates",
        "Versioning and revert on every report",
        "Scheduled email and Slack delivery",
        "White-labeled Client Portal for agencies",
        "Export as PDF or CSV",
      ]}
    />
  );
}
