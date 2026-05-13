import { motion } from "framer-motion";
import { Megaphone, Target, Sparkles, Clock, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import SectionHeader from "@/website/components/marketing/SectionHeader";
import StatBlock from "@/website/components/marketing/StatBlock";
import SplitFeature from "@/website/components/marketing/SplitFeature";
import AppEmbedFrame from "@/website/components/marketing/AppEmbedFrame";
import EmbedCampaignTable from "@/website/components/embeds/EmbedCampaignTable";
import EmbedDayparting from "@/website/components/embeds/EmbedDayparting";
import AdHeroAnimation from "@/website/components/products/heroes/AdHeroAnimation";
import BigNumberStrip from "@/website/components/products/BigNumberStrip";

const features = [
  { icon: Sparkles, title: "AI + Rule-Based Bidder", desc: "A bidder that thinks. Combines machine learning with rules you trust to keep CPC efficient and ROAS climbing — without surrendering control." },
  { icon: Target, title: "Smart Keyword Automation", desc: "Discover, harvest, graduate, and negate keywords automatically. Aan reads search query reports daily so you don't have to." },
  { icon: Clock, title: "Dayparting (AMS)", desc: "Spend when shoppers convert. Hour-of-day budget shaping for every campaign — backed by 90 days of conversion velocity per ASIN." },
  { icon: BarChart3, title: "Impact Analysis", desc: "Counterfactual reporting on every change. See projected lift before you commit, then measure actual lift against your baseline." },
];

const automated = [
  "Bid adjustments inside guardrails", "Keyword harvest + negation", "Hourly budget shaping", "Anomaly detection + alerts", "Search-term reports", "Performance aggregation",
];
const youDecide = [
  "Strategic budget allocation", "New campaign launches", "Creative direction", "Brand safety rules", "Promotional pushes", "Anything irreversible",
];
const glossary = [
  { term: "ROAS", def: "Return on Ad Spend. Revenue ÷ ad cost. Higher is better, but doesn't account for COGS." },
  { term: "ACoS", def: "Advertising Cost of Sales. Ad spend ÷ ad-attributed revenue. Lower is better." },
  { term: "TACoS", def: "Total ACoS. Ad spend ÷ total revenue (organic + paid). The CFO's favourite." },
  { term: "CPC", def: "Cost Per Click. What you pay each time someone clicks your ad." },
  { term: "RPC", def: "Revenue Per Click. Revenue ÷ clicks. Tells you whether traffic is worth the price." },
];

const ProductAdvertising = () => (
  <PageLayout>
    <section className="px-6">
      <div className="max-w-6xl mx-auto">
        {/* HERO with pun + animation */}
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            <Megaphone className="w-3.5 h-3.5" /> Advertising
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            We don't chase impressions. <span className="text-gradient-primary">We hunt margin.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Campaign management for Amazon, Walmart, and beyond — engineered for ROAS, not vanity metrics.
          </p>
        </motion.div>

        <div className="mb-16">
          <AdHeroAnimation />
        </div>

        <BigNumberStrip
          items={[
            { value: "4.2x", label: "Median ROAS", caption: "Across 100+ managed accounts." },
            { value: "−38%", label: "Wasted spend", caption: "Cut in the first 30 days." },
            { value: "<8s", label: "Time to draft a rule", caption: "Aan reads, diagnoses, drafts." },
          ]}
        />

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <SectionHeader eyebrow="The problem" title="Most ad tools optimise for the wrong thing." lead="Bid platforms chase impressions. Agencies chase ACoS. Aan chases contribution margin — the only number your CFO actually cares about." />
          <StatBlock value="38%" label="Avg ROAS lift" delta="within 90 days" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-24">
          {features.map((f, i) => (
            <motion.div key={f.title} className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300" initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.4 }}>
              <f.icon className="w-7 h-7 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="space-y-24 mb-24">
          <SplitFeature
            eyebrow="Campaign manager"
            title="A trading desk for your ad spend."
            body={<><p>Every campaign, every match type, every placement — sortable, filterable, editable inline. Sparkline trends sit next to status badges so you can spot drift in two seconds, not two minutes.</p><p>Bulk actions are previewed before they execute. Nothing changes silently.</p></>}
            visual={<AppEmbedFrame label="anarix.app/advertising"><EmbedCampaignTable /></AppEmbedFrame>}
            bullets={["Inline edit with validation", "Bulk pause / resume / negate with preview", "Audit trail per change"]}
          />
          <SplitFeature
            reverse
            eyebrow="Dayparting"
            title="Spend when shoppers actually convert."
            body={<><p>We learn the hourly conversion velocity for every ASIN over the trailing 90 days, then shape budget to match. Late-night impressions on a B2B product? Not on Aan's watch.</p><p>You see the heatmap, you approve the schedule, Aan handles the hourly bid adjustments.</p></>}
            visual={<AppEmbedFrame label="anarix.app/dayparting"><EmbedDayparting /></AppEmbedFrame>}
            bullets={["7×24 conversion-velocity heatmap", "Hourly budget shaping", "Per-campaign and per-ASIN schedules"]}
          />
        </div>

        {/* What we automate / What you decide */}
        <div className="mb-24">
          <SectionHeader eyebrow="The split" title="What we automate, what you decide." className="mb-12" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="text-xs uppercase tracking-[0.14em] text-primary font-semibold mb-4">Automated</div>
              <ul className="space-y-2.5">
                {automated.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-border bg-card">
              <div className="text-xs uppercase tracking-[0.14em] text-muted-foreground font-semibold mb-4">You decide</div>
              <ul className="space-y-2.5">
                {youDecide.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-sm text-foreground">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0" />{a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Glossary */}
        <div className="mb-24">
          <SectionHeader eyebrow="Glossary" title="A glossary for the CFO." lead="Five acronyms your ad team uses every day. Here's what they actually mean." className="mb-12" />
          <div className="rounded-2xl border border-border bg-card divide-y divide-border">
            {glossary.map((g) => (
              <div key={g.term} className="grid grid-cols-[100px,1fr] gap-6 px-6 py-4">
                <div className="text-sm font-bold text-foreground tabular-nums">{g.term}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{g.def}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-20 border-y border-border mb-16">
          <StatBlock value="38%" label="ROAS lift" delta="median, 90 days" />
          <StatBlock value="22%" label="Wasted spend cut" delta="month 1" />
          <StatBlock value="4 hrs/wk" label="Saved per account" delta="vs manual ops" />
        </div>

        <div className="text-center pb-8">
          <Link to="/website/demo">
            <Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">
              See Advertising in Action
            </Button>
          </Link>
        </div>
      </div>
    </section>
  </PageLayout>
);

export default ProductAdvertising;
