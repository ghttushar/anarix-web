import { motion } from "framer-motion";
import { Link, ArrowRight, Plug, Brain, Users } from "lucide-react";

const steps = [
  {
    icon: Plug,
    title: "Connect your marketplaces",
    body: "Link Amazon, Walmart, Shopify — once. Aan ingests every transaction, ad click, inventory event, and policy change continuously.",
    stat: "47 data sources",
  },
  {
    icon: Brain,
    title: "Aan finds what's leaking",
    body: "AI scans across profitability, advertising, catalog, and compliance. Surfaces what matters with severity, evidence, and a recommended action.",
    stat: "Signals in <8 seconds",
  },
  {
    icon: Users,
    title: "We act. You approve. You grow.",
    body: "Your strategist drafts rules, adjusts bids, reallocates budget. You review and approve — or let Aan execute within guardrails you set.",
    stat: "14% margin recovered",
  },
];

const HowItWorksSection = () => (
  <section className="py-24 lg:py-32 px-6 lg:px-8">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-mono font-semibold text-primary/60 tracking-wider">
          FIG 01
        </span>
        <span className="w-8 h-px bg-border" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.14em]">
          How It Works
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]">
          From chaos to clarity in <span className="text-gradient-primary">three steps</span>.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          No lengthy onboarding. No data migration. No training videos.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="relative flex flex-col items-center text-center p-8 rounded-3xl border border-border bg-card hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-medium transition-all duration-300"
          >
            <div className="w-14 h-14 mb-6 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <step.icon className="w-7 h-7 text-primary" />
            </div>
            <span className="text-xs font-mono font-semibold text-primary/50 tracking-wider mb-3">
              STEP {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-xl font-bold text-foreground mb-3">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.body}</p>
            <span className="text-xs px-3 py-1 rounded-pill bg-primary/8 text-primary/70 border border-primary/10">
              {step.stat}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center mt-12"
      >
        <Link
          to="/website/platform"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
        >
          See how the platform works <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection;
