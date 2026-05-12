import { ProductTemplate } from "./ProductTemplate";
export default function CampaignManager() {
  return (
    <ProductTemplate
      eyebrow="Campaign Manager"
      title="Advanced table-first control."
      blurb="Every keyword, ad group, and placement across marketplaces — in one dense, sortable, editable table."
      bullets={[
        "High-density tables with sticky columns",
        "Multi-rule filter builder",
        "Searchable column visibility",
        "Inline edit with marketplace validation",
        "Bulk actions on selected rows",
        "Saved views per analyst",
      ]}
    />
  );
}
