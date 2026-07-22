import { motion } from "framer-motion";
import { Monitor, Sparkles } from "lucide-react";
import EmbedKpiStrip from "@/website/components/embeds/EmbedKpiStrip";
import EmbedCampaignTable from "@/website/components/embeds/EmbedCampaignTable";
import EmbedScatterMargin from "@/website/components/embeds/EmbedScatterMargin";
import EmbedDayparting from "@/website/components/embeds/EmbedDayparting";
import EmbedRuleCard from "@/website/components/embeds/EmbedRuleCard";
import EmbedInsightCard from "@/website/components/embeds/EmbedInsightCard";

const DashboardPreview = () => (
  <section className="py-24">
    <div className="max-w-7xl mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          <Monitor className="w-3.5 h-3.5" /> Live Dashboard
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
          What it looks like{" "}
          <span className="text-gradient-primary">when it works.</span>
        </h2>
        <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
          Real data, real decisions. The Anarix dashboard gives you full visibility without the noise.
        </p>
      </motion.div>

      <motion.div
        className="rounded-2xl border border-border/40 overflow-hidden bg-card/20 backdrop-blur-sm"
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between bg-card/40">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>
            <span className="text-xs text-muted-foreground ml-3 font-mono">Anarix Dashboard — live</span>
          </div>
          <span className="text-[10px] text-muted-foreground/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Connected
          </span>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <EmbedKpiStrip />
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 rounded-xl border border-border/40 overflow-hidden">
              <EmbedCampaignTable />
            </div>
            <div className="lg:col-span-2 rounded-xl border border-border/40 overflow-hidden">
              <EmbedScatterMargin />
            </div>
          </div>
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="lg:col-span-3 rounded-xl border border-border/40 overflow-hidden">
              <EmbedDayparting />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <EmbedInsightCard
                severity="high"
                title="Campaign ROAS dropped 22% on SKU #B-4201"
                body="Search Term Impression Share declined 14pp in the last 7 days. Competitor increased bids on 12 overlapping keywords."
                source="Aan · 3m ago"
              />
              <EmbedRuleCard />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default DashboardPreview;
