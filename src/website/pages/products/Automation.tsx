import { motion } from "framer-motion";
import { Zap, Settings, ShieldCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";

const features = [
  { icon: Zap, title: "Smart Bid Management", desc: "AI-optimized bids that adapt in real-time to market conditions and competition." },
  { icon: Settings, title: "Rule Builder", desc: "Create complex automation rules with visual logic. If/then conditions, guardrails, and escalation paths." },
  { icon: ShieldCheck, title: "Audit-Safe Previews", desc: "Preview every change before it goes live. Full audit trail for compliance-conscious teams." },
  { icon: Clock, title: "Dayparting & Scheduling", desc: "Automatically adjust spend by time of day, day of week, or custom schedules." },
];

const ProductAutomation = () => (
  <PageLayout>
    <div className="max-w-6xl mx-auto px-6">
      <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-sm font-medium"><Zap className="w-4 h-4" /> Automation</div>
        <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Rules That <span className="text-gradient-primary">Run</span></h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">Guardrails that protect. Automate with confidence and full audit trails.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {features.map((f, i) => (
          <motion.div key={f.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-soft transition-all duration-300" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }} whileHover={{ y: -2 }}>
            <f.icon className="w-8 h-8 text-primary mb-4" /><h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3><p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center"><Link to="/website/demo"><Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">Schedule a Demo</Button></Link></div>
    </div>
  </PageLayout>
);

export default ProductAutomation;
