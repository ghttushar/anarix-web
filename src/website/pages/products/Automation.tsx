import { motion } from "framer-motion";
import { Zap, Settings, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";
import SectionHeader from "@/website/components/marketing/SectionHeader";
import StatBlock from "@/website/components/marketing/StatBlock";
import SplitFeature from "@/website/components/marketing/SplitFeature";
import AppEmbedFrame from "@/website/components/marketing/AppEmbedFrame";
import EmbedRuleCard from "@/website/components/embeds/EmbedRuleCard";
import WorkflowDiagram from "@/website/components/marketing/WorkflowDiagram";

const features = [
  { icon: Zap, title: "Smart Bid Management", desc: "AI-optimised bids that adapt to market conditions, competition, and inventory state — not yesterday's spreadsheet." },
  { icon: Settings, title: "Visual Rule Builder", desc: "Compose IF/THEN logic without code. Conditions, guardrails, escalation paths, and rollback windows in plain English." },
  { icon: ShieldCheck, title: "Audit-Safe Previews", desc: "Every rule is simulated against historical data before it goes live. Nothing executes without your approval." },
  { icon: Clock, title: "Dayparting & Scheduling", desc: "Adjust spend by hour, day, day-of-week, or custom triggers. Pause during stockouts, accelerate during launches." },
];

const automationNodes = [
  { label: "Draft", sub: "Aan or you" },
  { label: "Simulate", sub: "Historical preview" },
  { label: "Approve", sub: "One click" },
  { label: "Execute", sub: "Logged & reversible" },
];

const ProductAutomation = () => (
  <PageLayout>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div className="text-center mb-20" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          <Zap className="w-3.5 h-3.5" /> Automation
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-4">Rules that <span className="text-gradient-primary">run</span>.</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Guardrails that protect. Automate with confidence and full audit trails.</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
        <SectionHeader eyebrow="Automation, with a brake pedal" title="The reason most teams don't automate is fear." lead="Fear of waking up to a six-figure mistake. Anarix solves that with simulation-first execution: every rule is dry-run against historical data, projected impact is shown, and nothing executes until you approve." />
        <StatBlock value="0" label="Silent executions" delta="every action approved & logged" />
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
          eyebrow="Rule builder"
          title="Logic you can read out loud."
          body={<><p>Every rule is composed of a condition, an action, and a guardrail. No DSL, no code, no surprise interpretation. You can read a rule to your CFO and they'll understand it.</p><p>Aan can draft rules for you based on patterns it sees in your data — but the wording is yours to edit, and approval is yours to give.</p></>}
          visual={<AppEmbedFrame label="anarix.app/automation"><EmbedRuleCard /></AppEmbedFrame>}
          bullets={["Plain-English conditions", "Per-rule daily caps and blast-radius limits", "Roll back any approved action in one click"]}
        />
      </div>

      <div className="mb-24">
        <SectionHeader eyebrow="The flow" title="Approve, don't trust." lead="Every automation follows the same four steps." align="center" className="mb-16" />
        <WorkflowDiagram nodes={automationNodes} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-20 border-y border-border mb-16">
        <StatBlock value="240+" label="Rule templates" delta="across both marketplaces" />
        <StatBlock value="100%" label="Reversible" delta="every action" />
        <StatBlock value="6 hrs/wk" label="Ops time saved" delta="per managed account" />
      </div>

      <div className="text-center pb-8"><Link to="/website/demo"><Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">Schedule a Demo</Button></Link></div>
    </div>
  </PageLayout>
);

export default ProductAutomation;
