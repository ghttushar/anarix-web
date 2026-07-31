import { motion } from "framer-motion";
import { Bot, Sparkles, Shield, TrendingUp, BarChart3, Search, Bell, FileText, Zap, MessageSquare, Eye, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";

const surfaces = [
  {
    icon: MessageSquare,
    title: "Aan Copilot",
    desc: "A right-side workspace that follows you everywhere. Ask questions, get answers, and take action without leaving the page you're on.",
    detail: "Analyzes DSP and Sponsored Products overlap, calculates ROAS improvements, and recommends audience segments with highest conversion rates.",
  },
  {
    icon: Eye,
    title: "Ask Aan",
    desc: "Highlight any number in the app. A tooltip appears — click it and Aan explains the metric, traces the source, and offers next steps.",
    detail: "When a stakeholder asks 'what is this number' and you need an answer that doesn't make you look bad.",
  },
  {
    icon: BrainCircuit,
    title: "Full-Screen Aan",
    desc: "/aan — a dedicated workspace with chat history, multi-artifact reasoning, and long context for audits, weekly reviews, and rule design.",
    detail: "When the question is bigger than a sidebar.",
  },
  {
    icon: Zap,
    title: "Floating Action Island",
    desc: "A persistent control hub at the bottom-right. System alerts, Ask Aan, quick-create rules, command palette — one reach, every action.",
    detail: "When you live in the app and need everything one motion away.",
  },
];

const capabilities = [
  { icon: Sparkles, title: "Ask Anything", desc: "Natural language queries about any metric across advertising, inventory, profitability, and operations." },
  { icon: Shield, title: "Proactive Alerts", desc: "Get notified of anomalies before they become problems. Aan monitors your accounts 24/7 and surfaces what needs attention." },
  { icon: TrendingUp, title: "Automated Reporting", desc: "Client-ready reports generated automatically. Morning briefings, weekly summaries, and custom analysis on demand." },
  { icon: BarChart3, title: "Data-Driven Insights", desc: "Combines advertising data with inventory, pricing, competition, and operational signals to optimize for real business outcomes." },
  { icon: Search, title: "Keyword Intelligence", desc: "Segment keywords into branded, generic, and competitor buckets. Surface high-intent terms your competitors are missing." },
  { icon: Bell, title: "Anomaly Detection", desc: "Continuously analyzes marketplace signals and flags anomalies in spend, ROAS, inventory, and ranking before they impact your bottom line." },
];

const chatDemo = [
  { role: "user" as const, text: "Why did Sponsored Display ROAS drop yesterday?" },
  { role: "aan" as const, text: "Loss is concentrated on retargeting placements for ASIN B07X9. Likely a competitor launch — I'm seeing a new listing with aggressive pricing in your category. Want me to draft a rule to pause retargeting on that ASIN?" },
  { role: "user" as const, text: "Yes, and also check if this is affecting other SKUs." },
  { role: "aan" as const, text: "Done. Paused B07X9 retargeting. Cross-category scan shows 3 other SKUs with similar ROAS dips in the last 48 hours. I've drafted bid adjustments for all three. Review them in Rules → Drafts." },
];

const AanPage = () => {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center pt-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              <Bot className="w-3.5 h-3.5" /> Anarix Analytical Neural
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-4">
              Because our AI{" "}
              <span className="text-gradient-primary">glows</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Aan is not a chatbot in a corner. It's an intelligence layer that meets you where the work is happening — across advertising, profitability, inventory, and operations.
            </p>
          </motion.div>
        </div>

        {/* Chat Demo */}
        <motion.div
          className="mb-20 bg-card rounded-2xl border border-border shadow-medium overflow-hidden max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <span className="text-xs text-muted-foreground ml-2">Aan AI Copilot</span>
          </div>
          <div className="p-5 space-y-4">
            {chatDemo.map((msg, i) => (
              <motion.div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }}
              >
                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Surfaces */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              Where Aan Lives
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              Four surfaces. <span className="text-gradient-primary">Same brain.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {surfaces.map((s, i) => (
              <motion.div
                key={s.title}
                className="p-6 rounded-xl border border-border/40 bg-card/20 hover:bg-card/50 hover:border-primary/20 transition-all duration-500"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <s.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground mb-1">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{s.desc}</p>
                <p className="text-xs italic text-foreground/70 border-l-2 border-primary/30 pl-3">
                  {s.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Capabilities */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              className="p-5 rounded-xl border border-border/40 bg-card/20 hover:bg-card/50 transition-all duration-500"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <cap.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground mb-1.5">{cap.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center pb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Meet Aan in action</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            See how Aan transforms your marketplace operations with intelligent, context-aware AI.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine">
                Schedule a Demo
              </Button>
            </a>
            <Link to="/product">
              <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200">
                Explore the Platform
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default AanPage;
