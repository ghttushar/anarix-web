import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import TacosSection from "@/website/components/TacosSection";
import SectionHeader from "@/website/components/marketing/SectionHeader";
import StatBlock from "@/website/components/marketing/StatBlock";
import SplitFeature from "@/website/components/marketing/SplitFeature";
import AppEmbedFrame from "@/website/components/marketing/AppEmbedFrame";
import EmbedKpiStrip from "@/website/components/embeds/EmbedKpiStrip";
import EmbedScatterMargin from "@/website/components/embeds/EmbedScatterMargin";

const features = [
  { icon: PieChart, title: "SKU-Level P&L", desc: "Contribution margin per SKU with FBA fees, storage, returns, refunds, and the cost lines hiding inside marketplace settlements broken out line-by-line." },
  { icon: BarChart3, title: "Cross-Channel Attribution", desc: "Unified view across Amazon, Walmart, Shopify, TikTok, Meta, and Google Ads — joined to fulfilment cost and order-level economics." },
  { icon: TrendingUp, title: "Real-Time Dashboards", desc: "Live metrics refreshed every 15 minutes. No more waiting for yesterday's data to make today's decisions." },
  { icon: Target, title: "Margin Diagnostics", desc: "Aan flags profit leaks before they compound. See exactly which SKUs are bleeding, why, and what to do about it — in one screen." },
];

const ProductProfitability = () => (
  <PageLayout>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          <BarChart3 className="w-3.5 h-3.5" /> Profitability
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">Profit you can <span className="text-gradient-primary">prove</span>.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">SKU-level economics, cross-channel attribution, and TACoS that finally tell the truth.</p>
      </motion.div>

      {/* Problem stat */}
      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <SectionHeader eyebrow="The hidden tax" title="Marketplace economics are quietly eating your margin." lead="Storage, returns, FBA reimbursements, long-term storage fees, and ad-allocated COGS rarely show up where you can act on them. By the time the variance hits the P&L, it's two months old." />
        <StatBlock value="14%" label="Avg margin recovered" delta="within 60 days of onboarding" />
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-24">
        {features.map((f, i) => (
          <motion.div key={f.title} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
            <f.icon className="w-7 h-7 text-primary mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* App embeds */}
      <div className="grid lg:grid-cols-2 gap-6 mb-24">
        <AppEmbedFrame label="anarix.app/profitability"><EmbedKpiStrip /></AppEmbedFrame>
        <AppEmbedFrame label="anarix.app/profitability/trends"><EmbedScatterMargin /></AppEmbedFrame>
      </div>

      {/* Splits */}
      <div className="space-y-24 mb-24">
        <SplitFeature
          eyebrow="How it works"
          title="One source of truth for every dollar."
          body={<><p>We pull settlement data, ad spend, returns, fulfilment fees, and your COGS into a single ledger that updates every fifteen minutes. Then we attribute every cost to the SKU, campaign, and channel that generated it.</p><p>The result: a P&L you can actually read, by SKU, by week, by marketplace — without exporting anything to Excel.</p></>}
          visual={<AppEmbedFrame label="P&L · SKU view"><EmbedKpiStrip /></AppEmbedFrame>}
          bullets={["Settlement-level reconciliation", "FBA fee variance tracking", "Multi-currency normalisation"]}
        />
        <SplitFeature
          reverse
          eyebrow="Week 1"
          title="What you'll see in your first seven days."
          body={<><p>Most teams find $8,000–$40,000 of monthly margin within the first week — usually in long-tail SKUs that should have been delisted, ads running on unprofitable variants, or storage fees that ballooned during a promo.</p><p>You'll have a ranked list of margin leaks, an estimated recovery for each, and a one-click path to act.</p></>}
          visual={<AppEmbedFrame label="Margin leaks · ranked"><EmbedScatterMargin /></AppEmbedFrame>}
          bullets={["Ranked margin leaks with $ recovery", "Aan-drafted action for each", "Exportable for finance review"]}
        />
      </div>

      {/* Outcome stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-20 border-y border-border mb-24">
        <StatBlock value="14%" label="Margin recovered" delta="within 60 days" />
        <StatBlock value="$40K" label="Avg waste found" delta="in week 1" />
        <StatBlock value="3 days" label="To full visibility" delta="onboarding to live P&L" />
      </div>
    </div>

    <TacosSection />
    <div className="max-w-6xl mx-auto px-6 text-center pb-8">
      <Link to="/website/demo"><Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">See It in Action</Button></Link>
    </div>
  </PageLayout>
);

export default ProductProfitability;
