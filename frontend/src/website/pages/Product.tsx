import { motion } from "framer-motion";
import { BarChart3, Workflow, Store, BrainCircuit, Sparkles, Activity, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";

const capabilities = [
  {
    icon: BarChart3,
    title: "Advertising Intelligence",
    desc: "Bid intelligence and automation across campaign creation, bidder agents, day parting, keyword harvesting, and inventory-based optimization. Real-time adjustments based on marketplace signals including inventory levels, product ranking, customer demand, and competitor activity.",
    features: [
      "Campaign creation and management across Amazon and Walmart",
      "AI-powered bidder agents with real-time adjustments",
      "Day parting by hour and day of week",
      "Search term harvesting and negative keyword management",
      "Impact analysis with projected vs actual lift",
      "Budget pacing and anomaly detection",
    ],
  },
  {
    icon: Workflow,
    title: "Rules Engine",
    desc: "Automated triggers with guardrails, conditional logic, and inventory actions. Draft, simulate, approve, and execute with full audit trail and one-click rollback.",
    features: [
      "Visual rule builder with simulation-first execution",
      "Daily blast radius limits and stockout guards",
      "Conditional logic: IF ACoS > 45% FOR 14 days AND spend > $200 THEN pause",
      "Inventory-aware actions that prevent overselling",
      "One-click rollback on every automated action",
      "24/7 guardrailed execution with transparent logging",
    ],
  },
  {
    icon: Store,
    title: "Retail Analytics",
    desc: "SKU-level profitability, real-time marketplace fees, P&L visibility, share of voice, competitor pricing, and operational signals in one unified dashboard.",
    features: [
      "SKU-level P&L with true unit economics",
      "Cross-channel attribution (Amazon, Walmart, Shopify, TikTok)",
      "Real-time marketplace fee tracking and diagnostics",
      "Share of voice and competitive intelligence",
      "Product ranking and listing health monitoring",
      "Margin diagnostics: TACoS, COGS, storage, returns, FX",
    ],
  },
  {
    icon: BrainCircuit,
    title: "AI Layer (Aan)",
    desc: "Conversational AI that reads from live account data. Automated client-ready reporting, real-time advertising intelligence, proactive inventory monitoring, and agentic alerts.",
    features: [
      "Natural language queries about your marketplace business",
      "Automated reporting with client-ready formats",
      "Proactive inventory and supply monitoring",
      "Anomaly detection and agentic alerts",
      "LLM-ready data feeds for custom AI integrations",
      "Morning briefings and meeting action summaries",
    ],
  },
];

const realtimeActions = [
  "Adjust campaign budgets based on real-time ROAS signals",
  "Pause products with low inventory to prevent stockouts",
  "Increase bids where demand is strongest",
  "Flag products for replenishment before inventory becomes critical",
  "Alert teams to competitor activity affecting share of voice",
  "Automatically harvest high-intent keywords to drive incremental revenue",
];

const results = [
  { value: "18%", label: "Average margin increase" },
  { value: "40%", label: "TACoS improvement in 120 days" },
  { value: "$600M+", label: "Optimized marketplace GMV" },
];

const Product = () => {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          className="text-center mb-10 pt-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            <Sparkles className="w-3.5 h-3.5" /> The Anarix Insight Engine
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">
            Every signal, <span className="text-gradient-primary">one platform.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Anarix is a unified intelligence platform for marketplace sellers, bringing advertising, inventory, pricing, profitability, and competitive intelligence into a single AI-powered engine.
          </p>
        </motion.div>

        {/* Overview */}
        <motion.div
          className="mb-24 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Rather than treating advertising, inventory, pricing, profitability, and competitive intelligence as separate functions, the Anarix Insight Engine connects them into one intelligent platform that helps brands make faster, more profitable decisions.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Powered by the Anarix MCP connective AI layer, every signal across your marketplaces is unified to provide a holistic view of business performance. The result is a platform that takes action, not just reports metrics.
          </p>
        </motion.div>

        {/* Results Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 p-8 rounded-2xl border border-border bg-card">
          {results.map((r, i) => (
            <motion.div
              key={r.label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{r.value}</div>
              <div className="text-sm text-muted-foreground">{r.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Capabilities */}
        <div className="space-y-24 mb-24">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              className="grid lg:grid-cols-2 gap-12 items-start"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">{c.title}</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">{c.desc}</p>
                <ul className="space-y-2">
                  {c.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="text-xs font-semibold text-primary uppercase tracking-[0.12em] mb-4">Real-time capabilities</div>
                <ul className="space-y-3">
                  {realtimeActions.map((a) => (
                    <li key={a} className="flex items-start gap-3 text-sm text-foreground">
                      <Activity className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Why Anarix */}
        <motion.div
          className="mb-24 p-8 sm:p-12 rounded-2xl border border-border bg-card"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
                <TrendingUp className="w-3.5 h-3.5" /> Beyond Advertising
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Optimizing for profitability, not just ROAS.
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Advertising platforms focus primarily on metrics like ROAS. Anarix combines advertising data with inventory, pricing, competition, and operational signals to optimize for real business outcomes. Every decision is evaluated against its overall impact on margins and long-term growth.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "SKU-level P&L", desc: "True unit economics per product" },
                { label: "TACoS optimization", desc: "Total ad cost efficiency" },
                { label: "Competitor SOV", desc: "Share of voice tracking" },
                { label: "Inventory health", desc: "Stockout and overstock alerts" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-xl border border-border bg-background">
                  <div className="text-sm font-semibold text-foreground mb-1">{item.label}</div>
                  <div className="text-xs text-muted-foreground">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Aan Section */}
        <motion.div
          className="mb-24 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            <BrainCircuit className="w-3.5 h-3.5" /> Anarix Analytical Neural
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Meet Aan. Your AI copilot.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Ask natural language questions about your marketplace business and receive immediate, data-driven responses. Aan reads from live account data across advertising, inventory, profitability, and operations.
          </p>
          <div className="grid md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto">
            {[
              { icon: Sparkles, title: "Ask Anything", desc: "Analyze DSP and Sponsored Products overlap, calculate ROAS improvements, recommend audience segments with highest conversion rates." },
              { icon: Shield, title: "Proactive Alerts", desc: "Get notified of anomalies before they become problems. Aan monitors your accounts 24/7 and surfaces what needs attention." },
              { icon: TrendingUp, title: "Automated Reporting", desc: "Client-ready reports generated automatically. Morning briefings, weekly summaries, and custom analysis on demand." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-2xl border border-border bg-card">
                <item.icon className="w-6 h-6 text-primary mb-3" />
                <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center pb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to see it in action?</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Get a personalized walkthrough of the Anarix Insight Engine with your marketplace data.
          </p>
          <Link to="/website/demo">
            <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine">
              Schedule a Demo
            </Button>
          </Link>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default Product;
