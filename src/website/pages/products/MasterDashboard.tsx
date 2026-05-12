import { ProductTemplate } from "./ProductTemplate";
export default function MasterDashboard() {
  return (
    <ProductTemplate
      eyebrow="Master Dashboard"
      title="Build your own data sandbox."
      blurb="Compose KPIs, channels, and cohorts into the view your team needs. Drag, drop, share."
      bullets={[
        "Grid-based drag-and-drop canvas",
        "Metric, chart, table, and annotation widgets",
        "Per-team and per-account dashboards",
        "Share read-only links with stakeholders",
        "Snapshot a dashboard into a report",
      ]}
    />
  );
}
