import { motion } from "framer-motion";
import { Brain, Network, Zap, Shield, Eye, Users } from "lucide-react";
import SectionHeader from "@/website/components/marketing/SectionHeader";

const PlatformSection = () => (
  <section className="py-24 lg:py-32 px-6 lg:px-8 bg-muted/20">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-xs font-mono font-semibold text-primary/60 tracking-wider">FIG 03</span>
        <span className="w-8 h-px bg-border" />
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-[0.14em]">The Platform</span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16"
      >
        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1]">
          The tech that makes the team <span className="text-gradient-primary">10x more effective</span>.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Aan AI reads every data source. Signals surface what matters. You approve. Done.
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-8 mb-16">
        {[
          {
            icon: Brain,
            title: "Aan AI",
            tagline: "Your second analyst. No second guessing.",
            desc: "Aan reads your data, diagnoses issues, drafts rules, and explains every decision — so you can move fast without flying blind.",
            caps: ["Reads 47 data sources", "Drafts in <8s", "100% auditable"],
          },
          {
            icon: Network,
            title: "Signals",
            tagline: "From scattered tools to one source of truth.",
            desc: "Notifications describe events. Signals describe meaning. Every Signal answers four questions — before you have to ask.",
            caps: ["Morning Letter", "Evidence-backed", "Silence is a feature"],
          },
        ].map((item, i) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="group relative p-8 rounded-3xl border border-border bg-card hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-medium transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="w-12 h-12 mb-5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-xl mb-2">{item.title}</h3>
              <p className="text-sm text-primary/80 italic mb-3">{item.tagline}</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">{item.desc}</p>
              <div className="flex flex-wrap gap-2">
                {item.caps.map((cap) => (
                  <span key={cap} className="text-xs px-3 py-1 rounded-pill bg-primary/8 text-primary/70 border border-primary/10">
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border border-border bg-card p-8 overflow-hidden"
      >
        <div className="text-center mb-8">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Every source. Every signal. Every decision.
          </h3>
          <p className="text-sm text-muted-foreground">
            One connected memory of your business.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="flex flex-col items-start gap-4 mb-8">
            {["Amazon", "Walmart", "Shopify", "TikTok", "Meta Ads", "Email"].map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <motion.div
                  className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold text-primary"
                  animate={{ boxShadow: ["0 0 0px hsl(var(--primary) / 0)", "0 0 20px hsl(var(--primary) / 0.3)", "0 0 8px hsl(var(--primary) / 0.15)"] }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 1.2 }}
                >
                  {src.charAt(0)}
                </motion.div>
                <span className="text-sm font-medium text-foreground">{src}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="relative flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-24 h-24 rounded-full border border-primary/20"
                animate={{ scale: [1, 1.05, 1], borderColor: ["hsl(var(--primary) / 0.2)", "hsl(var(--primary) / 0.4)", "hsl(var(--primary) / 0.2)"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="w-32 h-32 rounded-full border border-primary/10"
                animate={{ scale: [1, 1.03, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
            <motion.div
              className="relative z-10 w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-xs font-bold text-primary"
              animate={{ boxShadow: ["0 0 0px hsl(var(--primary) / 0)", "0 0 30px hsl(var(--primary) / 0.4)", "0 0 12px hsl(var(--primary) / 0.2)"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            >
              ANARIX
            </motion.div>
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-between px-4 pointer-events-none">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary"
                  animate={{ x: [-100, 100], opacity: [0, 1, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1, delay: i * 0.2, ease: "easeInOut" }}
                />
              ))}
            </div>
          </motion.div>

          <div className="flex flex-col items-end gap-4 mt-8">
            {["Signals", "Actions", "Reports", "Outcomes"].map((out, i) => (
              <motion.div
                key={out}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.06, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <span className="text-sm font-medium text-foreground">{out}</span>
                <motion.div
                  className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold text-primary"
                  animate={{ boxShadow: ["0 0 0px hsl(var(--primary) / 0)", "0 0 16px hsl(var(--primary) / 0.3)", "0 0 6px hsl(var(--primary) / 0.15)"] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeOut" }}
                >
                  {out.charAt(0)}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-muted-foreground italic">
            "Stop watching dashboards. <span className="text-foreground font-medium">Start understanding your business.</span>"
          </p>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
      >
        {[
          { icon: Zap, title: "Insights", desc: "Severity-coded, sourced, one click from data. Aan watches everything so you don't have to." },
          { icon: Shield, title: "Rules", desc: "Drafted in plain language with guardrails. Simulated before you approve. Nothing executes silently." },
          { icon: Eye, title: "Signals", desc: "What happened, why it matters, what to do next, what if you ignore it. Every time." },
          { icon: Users, title: "Agents", desc: "Persistent workflows for budget pacing, anomaly detection, bid management. Always reversible." },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="w-10 h-10 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <h4 className="font-bold text-foreground mb-2">{item.title}</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default PlatformSection;
