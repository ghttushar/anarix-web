import { motion } from "framer-motion";
import { BarChart3, Megaphone, Bot, ShieldCheck, ArrowRight, CheckCircle2, TrendingUp, Users, Zap, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PageLayout from "@/website/components/PageLayout";
import SectionHeader from "@/website/components/marketing/SectionHeader";
import SplitFeature from "@/website/components/marketing/SplitFeature";

const products = [
  {
    icon: BarChart3,
    title: "Profitability",
    tagline: "See every dollar. Know every margin.",
    description: "Unified P&L across Amazon and Walmart. COGS tracking, geographical breakdowns, SKU-level trends, and period-over-period comparisons — so you know exactly where the money is going and where it's leaking.",
    features: ["Unified P&L (Amazon + Walmart)", "COGS upload & tracking", "Geographical profit analysis", "SKU-level trend detection"],
    href: "/website/products/profitability",
  },
  {
    icon: Megaphone,
    title: "Advertising",
    tagline: "Run less. Win more.",
    description: "Campaign management, budget pacing, search harvesting, and creative analysis — all in one place. Rules engine lets you automate bid adjustments with guardrails you control.",
    features: ["Multi-marketplace campaign mgmt", "Budget pacing & alerts", "Search harvesting & targeting", "Creative Analyzer"],
    href: "/website/products/advertising",
  },
  {
    icon: Bot,
    title: "Aan AI & Automation",
    tagline: "Your second analyst. No second guessing.",
    description: "Aan reads 47 data sources, surfaces signals with context, drafts rules, and explains every decision. Agents handle budget pacing, anomaly detection, and bid management — always reversible.",
    features: ["47 data sources monitored", "Severity-coded signals", "Plain-language rule builder", "Persistent AI agents"],
    href: "/website/aan-ai",
  },
  {
    icon: ShieldCheck,
    title: "Reputation & Compliance",
    tagline: "Stay safe. Stay selling.",
    description: "Real-time monitoring of reviews, ratings, and policy changes. Get alerted before a violation hits — not after. Track sentiment shifts and competitor activity across marketplaces.",
    features: ["Policy violation alerts", "Review & rating monitoring", "Sentiment tracking", "Competitor activity insights"],
    href: "/website/products/profitability",
  },
];

const PlatformHero = () => (
  <section className="relative py-28 lg:py-36 px-6 lg:px-8 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
    <div className="max-w-7xl mx-auto text-center">
      <motion.div
        className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-pill bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Sparkles className="w-4 h-4" />
        The Anarix Platform
      </motion.div>

      <motion.h1
        className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-[1.05] mb-6"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        Every marketplace metric.
        <br />
        <span className="text-gradient-primary">One source of truth.</span>
      </motion.h1>

      <motion.p
        className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        Four integrated products. One unified platform. Aan AI connecting every data point — so you can stop toggling between Seller Central, ads manager, and spreadsheets.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.6 }}
      >
        <Link to="/website/demo">
          <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground btn-shine">
            See it in action →
          </Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border">
            Start free trial →
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

const StatsBar = () => (
  <motion.div
    className="max-w-7xl mx-auto px-6 lg:px-8 mb-16"
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    <div className="rounded-3xl border border-border bg-card p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {[
          { value: "$2.4B+", label: "GMV managed" },
          { value: "47", label: "Data sources connected" },
          { value: "120+", label: "Brands operated" },
          { value: "14%", label: "Avg margin recovered" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
            className="text-center"
          >
            <div className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    className="group relative p-8 rounded-3xl border border-border bg-card hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-medium transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    <div className="relative z-10">
      <div className="w-12 h-12 mb-5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
        <product.icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-1">{product.title}</h3>
      <p className="text-sm text-primary/80 italic mb-4">{product.tagline}</p>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">{product.description}</p>
      <ul className="space-y-2 mb-6">
        {product.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to={product.href}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80 transition-colors group/link"
      >
        Learn more <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
      </Link>
    </div>
  </motion.div>
);

const ProductsGrid = () => (
  <section className="py-24 lg:py-32 px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Products"
        title={<>Four products. <span className="text-gradient-primary">One intelligence layer.</span></>}
        lead="Each product is purpose-built for a specific marketplace discipline. Together, they share data, signals, and Aan's intelligence — so nothing operates in isolation."
        className="mb-16"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {products.map((product, i) => (
          <ProductCard key={product.title} product={product} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const ThreeSixtySection = () => (
  <section className="py-24 lg:py-32 px-6 lg:px-8 bg-muted/20">
    <div className="max-w-7xl mx-auto">
      <SplitFeature
        eyebrow="360 Growth"
        title={<>The platform + the team. <span className="text-gradient-primary">Together.</span></>}
        body={
          <div className="space-y-4">
            <p>Most platforms give you software and a support ticket. Most agencies give you a black box and a monthly PDF.</p>
            <p>Anarix 360 Growth gives you both — the full platform <em>and</em> a dedicated team of senior strategists using it alongside you. Same dashboards. Same insights. Same audit trail.</p>
            <p>Every action is logged, every decision documented, every outcome measured. You keep full visibility. We take the execution.</p>
          </div>
        }
        bullets={[
          "Dedicated strategist + Aan AI working as one unit",
          "Weekly cadence: Audit → Action → Review in 30 minutes",
          "Performance-based compensation — aligned to your outcomes",
        ]}
        visual={
          <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center text-center">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Zap className="w-8 h-8 text-primary" />
              </div>
              <div className="text-2xl text-muted-foreground font-display">+</div>
              <div className="w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center">
                <Users className="w-8 h-8 text-foreground" />
              </div>
            </div>
            <div className="text-xl font-bold text-foreground mb-2">Platform + Team</div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Technology amplifies expertise. Expertise guides technology. Together, they deliver outcomes neither can achieve alone.
            </p>
          </div>
        }
      />
    </div>
  </section>
);

const ConnectSection = () => (
  <section className="py-24 lg:py-32 px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="How It Connects"
        title={<>Your data. Your marketplaces. <span className="text-gradient-primary">One brain.</span></>}
        lead="Connect once. Aan ingests every data source continuously — Amazon, Walmart, Shopify, TikTok Shop, Meta Ads, and more. Every product, every campaign, every dollar tracked."
        align="center"
        className="mb-16"
      />

      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="rounded-3xl border border-border bg-card p-8 overflow-hidden">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Connect", desc: "Link your marketplaces. One integration per channel." },
              { step: "02", title: "Analyze", desc: "Aan reads everything. Finds leaks, waste, and risk." },
              { step: "03", title: "Act", desc: "Drafted rules, signals, and agent actions. You approve. Done." },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.4 }}
                className="text-center p-6"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-sm font-bold text-primary">
                  {item.step}
                </div>
                <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-border">
            {["Amazon", "Walmart", "Shopify", "TikTok Shop", "Meta Ads"].map((platform) => (
              <span key={platform} className="text-xs px-3 py-1 rounded-pill bg-primary/8 text-primary/70 border border-primary/10">
                {platform}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const CTASection = () => (
  <section className="py-24 px-6 bg-muted/20">
    <div className="max-w-3xl mx-auto text-center">
      <SectionHeader
        eyebrow="Ready?"
        title={<>See the platform that <span className="text-gradient-primary">connects everything.</span></>}
        lead="Schedule a 30-minute walkthrough. We'll show you how your data flows through every product — and what it means for your margins."
        align="center"
        className="mb-10"
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Link to="/website/demo">
          <Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">
            Schedule a demo →
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

const Platform = () => (
  <PageLayout>
    <PlatformHero />
    <StatsBar />
    <ProductsGrid />
    <ThreeSixtySection />
    <ConnectSection />
    <CTASection />
  </PageLayout>
);

export default Platform;
