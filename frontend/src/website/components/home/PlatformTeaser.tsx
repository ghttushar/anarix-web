import { motion } from "framer-motion";
import { BarChart3, Workflow, Store, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const capabilities = [
  { icon: BarChart3, title: "Advertising Intelligence", desc: "Bid management, campaign creation, keyword harvesting, day parting, and impact analysis across Amazon and Walmart." },
  { icon: Workflow, title: "Rules Engine", desc: "Automated triggers with guardrails, conditional logic, and inventory actions. Simulation-first execution with one-click rollback." },
  { icon: Store, title: "Retail Analytics", desc: "SKU-level P&L, share of voice, competitor pricing, marketplace fees, and profitability diagnostics in a single view." },
  { icon: BrainCircuit, title: "AI Layer (Aan)", desc: "Conversational AI that answers questions from live data. Automated reporting, agentic alerts, and LLM-ready feeds." },
];

const PlatformTeaser = () => {
  return (
    <section className="py-24 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            Powered By
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            The Anarix Insight Engine
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform unifies advertising, analytics, automation, and AI into one intelligence layer. Every signal, one source of truth.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.title}
              className="p-6 rounded-2xl border border-border bg-card"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <c.icon className="w-7 h-7 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">{c.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Link to="/website/product">
            <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200">
              Explore the Full Platform
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default PlatformTeaser;
