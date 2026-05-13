import { motion } from "framer-motion";
import { Bot, FileText, Shield, Zap, Palette, Users, Eye, History, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import { AanMascot } from "@/components/aan/AanMascot";
import SectionHeader from "@/website/components/marketing/SectionHeader";
import WorkflowDiagram from "@/website/components/marketing/WorkflowDiagram";
import SplitFeature from "@/website/components/marketing/SplitFeature";
import EmbedInsightCard from "@/website/components/embeds/EmbedInsightCard";
import EmbedRuleCard from "@/website/components/embeds/EmbedRuleCard";

const capabilities = [
  { icon: FileText, title: "Reports", desc: "Auto-generated weekly and monthly reviews. Channel, SKU, campaign, and search-term breakdowns — written in plain English with sources cited." },
  { icon: Shield, title: "Audits", desc: "Continuous scans for wasted spend, missing negatives, broken bid groups, search-term cannibalisation, and inventory-aware budget waste." },
  { icon: Zap, title: "Rules", desc: "Aan drafts rules with guardrails, simulates the impact on historical data, and waits for your approval before anything goes live." },
  { icon: Palette, title: "Creative", desc: "Ad copy variants, A/B test specs, and image suggestions grounded in what's already converting in your category." },
  { icon: Users, title: "Agents", desc: "Persistent workflows for budget pacing, anomaly detection, and bid management. Always reversible. Always logged." },
];

const aanNodes = [
  { label: "Ask", sub: "Plain English question" },
  { label: "Read", sub: "47 data sources" },
  { label: "Diagnose", sub: "Root-cause traced" },
  { label: "Draft", sub: "Action with reasoning" },
  { label: "Approve", sub: "You stay in control" },
];

const safetyPillars = [
  { icon: Eye, title: "Preview-first", desc: "Every draft shows projected impact on spend, ROAS, and orders before you approve." },
  { icon: History, title: "Versioned & reversible", desc: "Each edit creates a new version scoped to its chat. Roll back any action in one click." },
  { icon: Lock, title: "Full audit log", desc: "Who approved what, when, and why. Exportable for compliance and client reporting." },
];

const AanAI = () => {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-6">
        {/* Hero */}
        <div className="relative text-center mb-12">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.18) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.75, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div className="relative z-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-center mb-6">
              <AanMascot state="idle" size={180} />
            </div>
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              <Bot className="w-3.5 h-3.5" /> Meet Aan
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-[1.05]">
              Anarix Analytical <span className="text-gradient-primary">Neural</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your second analyst. Aan reads your data, diagnoses issues, drafts rules, and explains every decision — so you can move fast without flying blind.
            </p>
            <p className="font-aan text-2xl sm:text-3xl text-primary/80 mt-5 italic">
              Because our AI glows.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              {["Reads 47 data sources", "Drafts in <8s", "100% auditable"].map((c) => (
                <span key={c} className="text-xs px-3 py-1.5 rounded-pill bg-card border border-border text-muted-foreground">{c}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Capabilities */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="What else do you need?" title="Okayyy… here are the other boring things Aan also does." lead="Aan isn't a chatbot bolted onto a dashboard. It's a working layer of intelligence with explicit responsibilities." align="center" className="mb-14" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                className="p-5 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <div className="w-10 h-10 mb-3 rounded-xl bg-primary/10 flex items-center justify-center">
                  <cap.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground text-sm mb-2">{cap.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="How Aan thinks" title="From question to approved action." lead="A predictable five-step path. No black boxes, no surprise execution." align="center" className="mb-16" />
          <WorkflowDiagram nodes={aanNodes} />
        </div>
      </section>

      {/* Aan in workflow split features */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto space-y-24">
          <SplitFeature
            eyebrow="Insights"
            title="Surface the issues that move money."
            body={<p>Aan watches every metric you care about and surfaces the ones that matter. Severity-coded, sourced, and one click away from the underlying data — so you spend your time deciding, not searching.</p>}
            visual={
              <div className="space-y-3">
                <EmbedInsightCard severity="high" title="Sponsored Display ROAS dropped 38% in 24h" body="Most of the loss is concentrated on retargeting placements for ASIN B07X9. Likely a competitor launch — see the competitive activity tab." />
                <EmbedInsightCard severity="medium" title="3 search terms burning $180/day with zero orders" body="Aan drafted a negative-keyword rule. Preview shows projected $5,400/mo savings with no impact on hero ASIN reach." />
              </div>
            }
          />
          <SplitFeature
            reverse
            eyebrow="Rules"
            title="Drafts you can read, simulate, and approve."
            body={<p>Aan writes rules in plain language and shows the underlying logic. Every rule comes with guardrails — daily caps, blast-radius limits, and rollback windows. Nothing executes until you approve.</p>}
            visual={<EmbedRuleCard />}
          />
        </div>
      </section>

      {/* Safety */}
      <section className="py-24 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Safety" title="Aan suggests. You approve. Always." lead="Aan is an intelligence layer — not an autonomous agent. The user is the decision-maker, always." align="center" className="mb-14" />
          <div className="grid md:grid-cols-3 gap-6">
            {safetyPillars.map((p, i) => (
              <motion.div
                key={p.title}
                className="p-6 rounded-2xl border border-border bg-card"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="w-10 h-10 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                  <p.icon className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-2">{p.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 text-center pt-16 pb-4">
        <p className="text-sm text-muted-foreground">
          Want to try Aan now? Tap <span className="text-primary font-semibold">Ask Aan</span> in the floating action island — bottom-right of your screen.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 text-center pb-16">
        <Link to="/website/demo">
          <Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">
            Schedule a Demo
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default AanAI;
