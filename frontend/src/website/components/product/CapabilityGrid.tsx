import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Megaphone, TrendingUp, Search, Route,
  Shield, BarChart3, Eye, BrainCircuit,
  Bell, Sparkles,
} from "lucide-react";

const MiniBar = () => (
  <svg viewBox="0 0 24 16" className="w-6 h-4 opacity-40">
    <rect x="1" y="8" width="4" height="8" rx="1" fill="currentColor" />
    <rect x="7" y="4" width="4" height="12" rx="1" fill="currentColor" />
    <rect x="13" y="6" width="4" height="10" rx="1" fill="currentColor" />
    <rect x="19" y="2" width="4" height="14" rx="1" fill="currentColor" />
  </svg>
);
const MiniArrow = () => (
  <svg viewBox="0 0 24 16" className="w-6 h-4 opacity-40">
    <path d="M2 14 L10 4 L16 9 L22 2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M18 2 L22 2 L22 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const MiniWave = () => (
  <svg viewBox="0 0 24 16" className="w-6 h-4 opacity-40">
    <path d="M2 8 Q6 2, 8 8 T14 8 T20 8 T24 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="8" r="2" fill="currentColor" opacity="0.5" />
    <circle cx="16" cy="6" r="1.5" fill="currentColor" opacity="0.5" />
  </svg>
);
const MiniFlow = () => (
  <svg viewBox="0 0 24 16" className="w-6 h-4 opacity-40">
    <rect x="1" y="1" width="8" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <rect x="15" y="1" width="8" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <rect x="8" y="10" width="8" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M5 6 L5 10 L12 10" fill="none" stroke="currentColor" strokeWidth="1" />
    <path d="M19 6 L19 10 L16 10" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);
const MiniShield = () => (
  <svg viewBox="0 0 24 20" className="w-6 h-5 opacity-40">
    <path d="M12 2 L22 6 L22 12 Q22 18, 12 20 Q2 18, 2 12 L2 6 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 10 L11 12 L15 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const MiniPie = () => (
  <svg viewBox="0 0 20 20" className="w-5 h-5 opacity-40">
    <circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
    <path d="M10 2 A8 8 0 0 1 18 10 L10 10 Z" fill="currentColor" opacity="0.5" />
  </svg>
);
const MiniRadar = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 opacity-40">
    <polygon points="12,2 20,8 18,18 6,18 4,8" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <polygon points="12,6 16,10 14,15 10,15 8,10" fill="currentColor" opacity="0.2" />
  </svg>
);
const MiniBubble = () => (
  <svg viewBox="0 0 24 20" className="w-6 h-5 opacity-40">
    <rect x="2" y="1" width="20" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 13 L6 18 L12 13" fill="currentColor" opacity="0.4" />
    <circle cx="8" cy="7" r="1" fill="currentColor" />
    <circle cx="12" cy="7" r="1" fill="currentColor" />
    <circle cx="16" cy="7" r="1" fill="currentColor" />
  </svg>
);
const MiniBell = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 opacity-40">
    <path d="M12 3 Q8 3, 6 8 L6 14 L4 16 L20 16 L18 14 L18 8 Q16 3, 12 3 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="19" r="2" fill="currentColor" opacity="0.4" />
  </svg>
);

const cardGraphics = [MiniBar, MiniArrow, MiniWave, MiniFlow, MiniShield, MiniPie, MiniRadar, MiniBubble, MiniBell];

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
      gridRow = "1 / 3";
      gridCol = `${col + 1} / ${col + 2}`;
    } else if (baseRows[activeCard] === 0 && col === baseCols[activeCard] && row === 1) {
      gridRow = "2 / 3";
      gridCol = "5 / 6";
    } else if (baseRows[activeCard] === 1 && col === baseCols[activeCard] && row === 0) {
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
            const Graphic = cardGraphics[i];

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
                transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive ? "bg-primary/20" : "bg-primary/10"
                    }`}>
                      <card.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-sm font-semibold transition-colors ${
                        isActive ? "text-foreground" : "text-foreground/80"
                      }`}>{card.title}</h3>
                    </div>
                    <div className="text-primary">
                      <Graphic />
                    </div>
                  </div>
                  <p className={`text-xs leading-relaxed transition-all duration-500 ${
                    isActive ? "text-foreground/80" : "text-muted-foreground"
                  }`}>{card.desc}</p>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
