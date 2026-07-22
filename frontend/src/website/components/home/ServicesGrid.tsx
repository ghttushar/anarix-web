import { motion } from "framer-motion";
import {
  Megaphone, TrendingUp, LayoutPanelTop, Package,
  Shield, Crosshair, FileText, Radio,
  Camera, Building2,
} from "lucide-react";

const services = [
  { icon: Megaphone, title: "Advertising management", desc: "We run your campaigns daily — bids, budgets, targeting — so every dollar chases what&apos;s actually converting." },
  { icon: TrendingUp, title: "Profit & margin tracking", desc: "We track what you really keep after fees, ad spend, and returns — not just top-line sales." },
  { icon: LayoutPanelTop, title: "Listing & catalog management", desc: "We keep your listings optimized, compliant, and free of the quiet errors that bleed sales." },
  { icon: Package, title: "Inventory & fulfillment oversight", desc: "We watch stock so you never lose the Buy Box to a stockout — or overpay to store what isn&apos;t moving." },
  { icon: Shield, title: "Account health monitoring", desc: "We catch policy risks and performance issues before they become suspensions." },
  { icon: Crosshair, title: "Competitive tracking", desc: "We watch what competitors are doing to your rankings and visibility, and move before it costs you sales." },
  { icon: FileText, title: "Reporting, done for you", desc: "You get a clear monthly readout in plain English. No dashboard required — though you can log in anytime you want one." },
  { icon: Radio, title: "Demand-Side Platform (DSP)", desc: "We run programmatic ads off-platform to bring new shoppers in, not just fight for the ones already searching." },
  { icon: Camera, title: "Product photography & video", desc: "We shoot and produce the images and video that turn browsers into buyers — no separate agency needed." },
  { icon: Building2, title: "Amazon brand support", desc: "We manage your Brand Registry, storefront, and IP protection so counterfeiters and hijackers don&apos;t get the upper hand." },
];

const puns: Record<string, string> = {
  "Advertising management": "Every dollar should chase what&apos;s converting. Not what&apos;s comfortable.",
  "Inventory & fulfillment oversight": "Stockouts cost more than storage fees. They cost you the Buy Box.",
  "Product photography & video": "Product photos that don&apos;t look like they were shot in 2008. Unless that&apos;s your aesthetic. We don&apos;t judge.",
  "Demand-Side Platform (DSP)": "Programmatic ads. You don&apos;t need to know what &ldquo;programmatic&rdquo; means. We handle that part.",
  "Reporting, done for you": "If your current report looks like a tax return, we&apos;ve already failed.",
  "Account health monitoring": "We don&apos;t just watch for violations. We watch for the ones that haven&apos;t happened yet. Yet.",
};

const ServicesGrid = () => {
  return (
    <section className="relative py-28 overflow-hidden border-t border-border/40">
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            The Full Stack
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1] mb-4">
            The full stack,{" "}
            <span className="text-gradient-primary">run for you.</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Every marketplace function, managed end-to-end. No gaps, no handoffs, no &ldquo;that&apos;s not our department.&rdquo;
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service, i) => {
            const pun = puns[service.title];
            return (
              <motion.div
                key={service.title}
                className="group p-5 rounded-xl border border-border/40 bg-card/20 hover:bg-card/50 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: (i % 6) * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="absolute -top-8 -right-8 w-16 h-16 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500 blur-xl" />
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <service.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{service.title}</h3>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{service.desc}</p>
                {pun && (
                  <p className="text-[11px] text-primary/60 italic mt-2 pt-2 border-t border-border/20 leading-relaxed">
                    {pun}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
