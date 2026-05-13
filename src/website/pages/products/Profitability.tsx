import { motion } from "framer-motion";
import { BarChart3, PieChart, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import TacosSection from "@/website/components/TacosSection";
import BigNumberStrip from "@/website/components/products/BigNumberStrip";
import SectionHeader from "@/website/components/marketing/SectionHeader";
import StatBlock from "@/website/components/marketing/StatBlock";
import SplitFeature from "@/website/components/marketing/SplitFeature";
import AppEmbedFrame from "@/website/components/marketing/AppEmbedFrame";
import EmbedKpiStrip from "@/website/components/embeds/EmbedKpiStrip";
import EmbedScatterMargin from "@/website/components/embeds/EmbedScatterMargin";

const features = [
  { icon: PieChart, title: "SKU-Level P&L", desc: "Contribution margin per SKU with FBA fees, storage, returns, refunds, and the cost lines hiding inside marketplace settlements broken out line-by-line." },
  { icon: BarChart3, title: "Cross-Channel Attribution", desc: "Unified view across Amazon, Walmart, Shopify, TikTok, Meta, and Google Ads - joined to fulfilment cost and order-level economics." },
  { icon: TrendingUp, title: "Real-Time Dashboards", desc: "Live metrics refreshed every 15 minutes. No more waiting for yesterday's data to make today's decisions." },
  { icon: Target, title: "Margin Diagnostics", desc: "Aan flags profit leaks before they compound. See exactly which SKUs are bleeding, why, and what to do about it." },
];

const moneyGoes = [
  { label: "FBA fulfilment fees", body: "Tier shifts when packaging changes. We catch reclassifications within 24 hours." },
  { label: "Long-term storage", body: "Inventory aged > 365 days bleeds margin silently. We flag and rank by recovery $." },
  { label: "Returns & refunds", body: "Reimbursements rarely match what you lost. We reconcile every settlement line." },
  { label: "Ad-allocated COGS", body: "Sponsored Display attribution overlaps with organic. We de-duplicate revenue properly." },
  { label: "FX & marketplace fees", body: "Multi-currency normalised. Marketplace commissions tracked per category change." },
  { label: "Promo & coupon stacking", body: "Lightning Deals + Subscribe & Save + clip coupon = quietly negative margin. We unstack it." },
];

const ProductProfitability = () => (
  <PageLayout>
    {/* HERO - taco animation + pun at the very top */}
    <TacosSection />

    <div className="max-w-6xl mx-auto px-6">
      <BigNumberStrip
        items={[
          { value: "30%", label: "TACoS reduction", caption: "Average across 100+ brands." },
          { value: "$1.2B", label: "GMV tracked", caption: "Settlement-level reconciliation." },
          { value: "100%", label: "SKU-level P&L", caption: "Contribution margin, line by line." },
        ]}
      />
      <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-[#f26e76] text-xs font-medium uppercase tracking-[0.14em]">
          <BarChart3 className="w-3.5 h-3.5" /> Profitability
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">Profit you can <span className="text-gradient-primary">prove</span>.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">SKU-level economics, cross-channel attribution, and TACoS that finally tell the truth.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <SectionHeader eyebrow="The hidden tax" title="Marketplace economics are quietly eating your margin." lead="Storage, returns, FBA reimbursements, long-term storage fees, and ad-allocated COGS rarely show up where you can act on them. By the time the variance hits the P&L, it's two months old." />
        <StatBlock value="14%" label="Avg margin recovered" delta="within 60 days of onboarding" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-24">
        {features.map((f, i) => (
          <motion.div key={f.title} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
            <f.icon className="w-7 h-7 text-primary text-[#f26e76] mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Where the money actually goes */}
      <div className="mb-24">
        <SectionHeader eyebrow="The leaks" title="Where the money actually goes." lead="Six categories that quietly compound. We surface each as a ranked, dollar-quantified leak inside your dashboard." className="mb-12" />
        <div className="grid md:grid-cols-2 gap-4">
          {moneyGoes.map((m) => (
            <div key={m.label} className="p-5 rounded-xl border border-border bg-card">
              <div className="text-sm font-bold text-foreground mb-1.5">{m.label}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{m.body}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-24">
        <AppEmbedFrame label="anarix.app/profitability"><EmbedKpiStrip /></AppEmbedFrame>
        <AppEmbedFrame label="anarix.app/profitability/trends"><EmbedScatterMargin /></AppEmbedFrame>
      </div>

      <div className="space-y-24 mb-24">
        <SplitFeature
          eyebrow="How it works"
          title="One source of truth for every dollar."
          body={<><p>We pull settlement data, ad spend, returns, fulfilment fees, and your COGS into a single ledger that updates every fifteen minutes. Then we attribute every cost to the SKU, campaign, and channel that generated it.</p></>}
          visual={<AppEmbedFrame label="P&L · SKU view"><EmbedKpiStrip /></AppEmbedFrame>}
          bullets={["Settlement-level reconciliation", "FBA fee variance tracking", "Multi-currency normalisation"]}
        />
        <SplitFeature
          reverse
          eyebrow="Week 1"
          title="What you'll see in your first seven days."
          body={<><p>Most teams find $8,000-$40,000 of monthly margin within the first week - usually in long-tail SKUs that should have been delisted, ads running on unprofitable variants, or storage fees that ballooned during a promo.</p></>}
          visual={<AppEmbedFrame label="Margin leaks · ranked"><EmbedScatterMargin /></AppEmbedFrame>}
          bullets={["Ranked margin leaks with $ recovery", "Aan-drafted action for each", "Exportable for finance review"]}
        />
      </div>

      {/* Methodology */}
      <div className="mb-24">
        <SectionHeader eyebrow="Methodology" title="How we calculate margin." className="mb-10" />
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-3 border-b border-border bg-muted/40 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Contribution margin · per SKU</div>
          <div className="p-6 font-mono text-sm leading-relaxed text-foreground">
            <div>Contribution = Revenue − COGS − FBA fees − storage − returns − ad spend − reimbursement adj.</div>
            <div className="mt-3 text-muted-foreground">Ad spend allocated by attributed-units, not last-click. Reimbursements lag-corrected against the source settlement.</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-20 border-y border-border mb-16">
        <StatBlock value="14%" label="Margin recovered" delta="within 60 days" />
        <StatBlock value="$40K" label="Avg waste found" delta="in week 1" />
        <StatBlock value="3 days" label="To full visibility" delta="onboarding to live P&L" />
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-6 text-center pb-8">
      <Link to="/website/demo"><Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">See It in Action</Button></Link>
    </div>
  </PageLayout>
);

export default ProductProfitability;
