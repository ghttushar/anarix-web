import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Megaphone, TrendingUp, Search, Route,
  Shield, BarChart3, Eye, BrainCircuit,
  Bell, Sparkles,
} from "lucide-react";

const cards = [
  { icon: Megaphone, title: "Campaign Management", desc: "Create, manage, and optimize campaigns across Amazon and Walmart. Unified interface for SP, SB, SD, and DSP with bulk operations and templates.", features: ["Multi-marketplace campaign creation", "Bulk operations and saved templates", "Budget pacing with real-time alerts", "Cross-platform performance comparison"] },
  { icon: TrendingUp, title: "Bid Intelligence & Automation", desc: "AI-powered bidder agents that adjust bids in real time based on inventory levels, product ranking, customer demand, and competitor activity.", features: ["Real-time bid adjustments by signal", "Portfolio-level budget allocation", "Day parting by hour and day of week", "Automated bidder agents with guardrails"] },
  { icon: Search, title: "Keyword Harvesting & Targeting", desc: "Automatically discover, harvest, and manage keywords across your campaigns. Surface high-intent terms your competitors are missing.", features: ["Search term harvesting from search queries", "Negative keyword management at scale", "Competitor keyword gap analysis", "Auto-pause underperformers with one click"] },
  { icon: Route, title: "Visual Rule Builder", desc: "Draft, simulate, approve, and execute automated rules with a visual builder. IF/THEN logic with full audit trail and projected impact before execution.", features: ["Visual drag-and-drop rule builder", "Simulation mode with projected impact", "IF/THEN/ELSE conditional logic", "Audit trail with change history"] },
  { icon: Shield, title: "Guardrails & Safety Controls", desc: "Every automated action is protected by blast radius limits, stockout guards, and one-click rollback. 24/7 guardrailed execution with transparent logging.", features: ["Daily blast radius limits", "Stockout-aware inventory guards", "One-click rollback on all actions", "24/7 transparent execution logging"] },
  { icon: BarChart3, title: "SKU-Level P&L", desc: "True unit economics per product. Track revenue, COGS, FBA fees, ad spend, returns, and FX adjustments down to the individual SKU.", features: ["Per-SKU profitability dashboard", "COGS upload and automated tracking", "Cross-channel attribution (Amazon, Walmart, Shopify)", "Margin diagnostics: TACoS, storage, returns"] },
  { icon: Eye, title: "Share of Voice & Competitive Intel", desc: "Monitor your brand visibility against competitors. Track share of voice, pricing position, listing quality, and marketplace trends in real time.", features: ["Brand and category SOV tracking", "Competitor pricing and promotion monitoring", "Listing quality and rank tracking", "Marketplace trend alerts"] },
  { icon: BrainCircuit, title: "Conversational AI (Aan)", desc: "Ask Aan natural language questions about your business. Get instant answers from live account data across advertising, inventory, profitability, and operations.", features: ["Natural language queries about any metric", "Automated morning briefings and summaries", "Proactive anomaly detection with context", "LLM-ready data feeds for custom AI"] },
  { icon: Bell, title: "Automated Agents & Alerts", desc: "Autonomous agents that monitor your accounts 24/7. Surface what needs attention before it becomes a problem. Client-ready reports on demand.", features: ["24/7 agentic account monitoring", "Severity-coded alerts with root cause", "Auto-generated client-ready reports", "Slack and WhatsApp integration"] },
];

const baseRows = [0, 0, 0, 0, 0, 1, 1, 1, 1];
const baseCols = [0, 1, 2, 3, 4, 0, 1, 2, 3];

const nodeCenters = [
  { cx: "10%", cy: "15%" }, { cx: "30%", cy: "15%" }, { cx: "50%", cy: "15%" }, { cx: "70%", cy: "15%" }, { cx: "90%", cy: "15%" },
  { cx: "10%", cy: "75%" }, { cx: "30%", cy: "75%" }, { cx: "50%", cy: "75%" }, { cx: "70%", cy: "75%" },
];

const connectionPaths = [
  "M10,15 L30,15", "M30,15 L50,15", "M50,15 L70,15", "M70,15 L90,15",
  "M10,15 L10,75", "M30,15 L30,75", "M50,15 L50,75", "M70,15 L70,75",
  "M10,75 L30,75", "M30,75 L50,75", "M50,75 L70,75",
  "M10,15 L30,75", "M30,15 L10,75",
  "M50,15 L30,75", "M70,15 L50,75", "M90,15 L70,75",
];

const CapabilityGrid = () => {
  const [activeCard, setActiveCard] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const getCardPosition = (i: number) => {
    const row = baseRows[i];
    const col = baseCols[i];
    let gridRow: string;
    let gridCol: string;

    if (i === activeCard) {
      // Active card spans both rows in its column
      gridRow = "1 / 3";
      gridCol = `${col + 1} / ${col + 2}`;
    } else if (baseRows[activeCard] === 0 && col === baseCols[activeCard] && row === 1) {
      // Card is in the same column as active (row 1 active), this is the displaced bottom card
      gridRow = "2 / 3";
      gridCol = "5 / 6";
    } else if (baseRows[activeCard] === 1 && col === baseCols[activeCard] && row === 0) {
      // Card is in the same column as active (row 2 active), this is the displaced top card
      gridRow = "2 / 3";
      gridCol = "5 / 6";
    } else {
      gridRow = `${row + 1} / ${row + 2}`;
      gridCol = `${col + 1} / ${col + 2}`;
    }

    return { gridRow, gridCol };
  };

  return (
    <section ref={sectionRef} className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            <Sparkles className="w-3.5 h-3.5" /> Capabilities
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
            Every capability.{" "}
            <span className="text-gradient-primary">One engine.</span>
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Click any card to explore. The platform adapts to show you what matters.
          </p>
        </motion.div>

        <div className="relative">
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {connectionPaths.map((d, i) => (
              <motion.path
                key={d}
                d={d}
                stroke="hsl(var(--primary) / 0.08)"
                strokeWidth="0.15"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ delay: 0.3 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
            ))}
            {nodeCenters.map((n, i) => (
              <motion.circle
                key={n.cx}
                cx={n.cx}
                cy={n.cy}
                r="0.8"
                fill="hsl(var(--primary) / 0.12)"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
                transition={{ delay: 0.5 + i * 0.05, duration: 0.4 }}
              />
            ))}
          </svg>

          <div
            className="grid gap-3 relative z-10"
            style={{
              gridTemplateColumns: "repeat(5, 1fr)",
              gridTemplateRows: "repeat(2, auto)",
            }}
          >
          {cards.map((card, i) => {
            const pos = getCardPosition(i);
            const isActive = i === activeCard;

            return (
              <motion.button
                key={card.title}
                layout
                onClick={() => setActiveCard(i)}
                className={`text-left rounded-xl border transition-colors duration-300 overflow-hidden ${
                  isActive
                    ? "border-primary/40 bg-card shadow-medium z-10"
                    : "border-border/40 bg-card/30 hover:bg-card/60 hover:border-border/70"
                }`}
                style={{
                  gridRow: pos.gridRow,
                  gridColumn: pos.gridCol,
                }}
                initial={false}
                animate={{ opacity: 1 }}
                transition={{ layout: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-primary/20" : "bg-primary/10"
                    }`}>
                      <card.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold transition-colors ${
                        isActive ? "text-foreground" : "text-foreground/80"
                      }`}>{card.title}</h3>
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed transition-all duration-300 ${
                    isActive ? "text-foreground/80" : "text-muted-foreground"
                  }`}>{card.desc}</p>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <ul className="mt-4 pt-4 border-t border-border/40 space-y-1.5">
                          {card.features.map((f) => (
                            <li key={f} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-primary/50 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            );
          })}

          {/* Empty placeholder */}
          <div
            className="rounded-xl border border-dashed border-border/20 bg-transparent"
            style={{ gridRow: "2 / 3", gridColumn: "5 / 6" }}
          />
        </div>
      </div>

        <motion.p
          className="text-center text-xs text-muted-foreground/40 mt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Click any card to expand its details
        </motion.p>
      </div>
    </section>
  );
};

export default CapabilityGrid;
