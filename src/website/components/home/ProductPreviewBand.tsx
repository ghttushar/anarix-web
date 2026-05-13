import SectionHeader from "@/website/components/marketing/SectionHeader";
import AppEmbedFrame from "@/website/components/marketing/AppEmbedFrame";
import EmbedKpiStrip from "@/website/components/embeds/EmbedKpiStrip";
import EmbedCampaignTable from "@/website/components/embeds/EmbedCampaignTable";
import EmbedDayparting from "@/website/components/embeds/EmbedDayparting";

const items = [
  { label: "anarix.app/profitability", caption: "Real-time SKU-level economics across every channel.", embed: <EmbedKpiStrip /> },
  { label: "anarix.app/advertising", caption: "Campaign control with sparklines and inline status.", embed: <EmbedCampaignTable /> },
  { label: "anarix.app/dayparting", caption: "Hour-by-hour ROAS shaped to when shoppers convert.", embed: <EmbedDayparting /> },
];

const ProductPreviewBand = () => (
  <section className="py-24 sm:py-32 px-6 bg-muted/20">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Inside Anarix"
        title="Built like a trading desk, not a dashboard."
        lead="Every screen is data-dense, sortable, exportable, and tied to an action. No fluff. No vanity metrics."
        align="center"
        className="mb-14"
      />
      <div className="grid lg:grid-cols-3 gap-6">
        {items.map((it) => (
          <div key={it.label} className="space-y-3">
            <AppEmbedFrame label={it.label}>{it.embed}</AppEmbedFrame>
            <p className="text-sm text-muted-foreground px-1">{it.caption}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default ProductPreviewBand;
