import { motion } from "framer-motion";
import { Users, Handshake, Eye, LineChart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeader from "@/website/components/marketing/SectionHeader";
import SplitFeature from "@/website/components/marketing/SplitFeature";
import BigNumberStrip from "@/website/components/products/BigNumberStrip";
import EmbedInsightCard from "@/website/components/embeds/EmbedInsightCard";

const features = [
  { icon: Users, title: "Dedicated Team", desc: "Senior account managers and strategists assigned to your brand. Not a call centre, not a junior shuffle. The same humans week after week." },
  { icon: Handshake, title: "Hybrid Model", desc: "Our experts use the Anarix platform alongside your team. Same dashboards, same insights, same audit trail." },
  { icon: Eye, title: "Complete Visibility", desc: "Every action logged, every decision documented, every rule traceable. You see exactly what we did, when, and why." },
  { icon: LineChart, title: "Performance Guarantees", desc: "We tie our compensation to your outcomes. Aligned incentives, not hourly billing." },
];

const week = [
  { day: "Mon", title: "Aan-generated audit", body: "Strategist annotates the week's anomalies. You receive a 5-minute read by 9am." },
  { day: "Tue", title: "Action queue published", body: "Drafted rules and bid changes are queued for your review with projected impact." },
  { day: "Wed", title: "Working session", body: "30 minutes on the top three opportunities. Decisions, not status updates." },
  { day: "Thu", title: "Execution + monitoring", body: "Approved actions execute. Real-time anomaly alerts on shared Slack channel." },
  { day: "Fri", title: "Results review", body: "Projected vs actual lift. Documented learnings carried into next week." },
];

const wontDo = [
  "SEO services or organic content writing",
  "Email marketing or lifecycle CRM",
  "Influencer or affiliate program management",
  "Anything we can't measure with marketplace data",
];

const ManagedServicesSection = () => (
  <section className="py-24 lg:py-32 px-6 lg:px-8 bg-muted/20">
    <div className="max-w-7xl mx-auto">
      <SectionHeader
        eyebrow="Managed Services"
        title={<>Senior strategists. <span className="text-gradient-primary italic">Zero mess.</span></>}
        lead="Most agencies sell hours. We sell outcomes. Our dedicated team uses the Anarix platform alongside your team — same dashboards, same insights, same audit trail."
        align="center"
        className="mb-16"
      />

      <BigNumberStrip
        items={[
          { value: "120+", label: "Brands operated", caption: "Across 4 marketplaces." },
          { value: "7d", label: "Onboarding", caption: "From contract to live decisions." },
          { value: "1", label: "Dedicated pod", caption: "Same humans, every week." },
        ]}
        className="mb-16"
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="grid md:grid-cols-2 gap-6 mb-24"
      >
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.4 }}
            className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300"
          >
            <div className="w-12 h-12 mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
              <f.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid lg:grid-cols-2 gap-12 items-center mb-24"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeader
          eyebrow="The agency problem"
          title="Most agencies sell hours. We sell outcomes."
          lead="The traditional agency model rewards activity, not results. Anarix Managed Services flips that: our compensation is tied to the metrics that matter to your business, and every action we take is visible to you in real time."
        />
        <div className="p-8 rounded-2xl border border-border bg-card">
          <div className="text-4xl sm:text-5xl font-bold text-foreground mb-2">$50M+</div>
          <div className="text-lg text-muted-foreground">Managed annually for 60+ brands</div>
        </div>
      </motion.div>

      <motion.div
        className="space-y-24 mb-24"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <SplitFeature
          eyebrow="What it looks like"
          title="A weekly cadence built around decisions, not status."
          body={
            <div className="space-y-4">
              <p>Monday: Aan-generated audit with our strategist's commentary. Wednesday: working session on the week's top three opportunities. Friday: results review with projected vs actual impact. No 90-minute "alignment" calls.</p>
            </div>
          }
          visual={
            <div className="space-y-3">
              <EmbedInsightCard severity="high" title="Sponsored Brands ROAS dropped 22% in 7 days" body="Strategist note: tied to a Q4 competitor launch. Drafted a defensive bid + creative refresh." />
              <EmbedInsightCard severity="medium" title="Two SKUs ready to graduate from manual to auto" body="Aan flagged consistent ROAS > 5x for 21 days. We'll move them this Friday." />
              <EmbedInsightCard severity="low" title="Q1 budget pacing on track" body="92% of plan, 8% headroom for a Black Friday push. No action needed." />
            </div>
          }
        />
      </motion.div>

      <motion.div
        className="mb-24"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeader eyebrow="Cadence" title="A week with us." className="mb-12" />
        <div className="rounded-2xl border border-border bg-card divide-y divide-border">
          {week.map((w) => (
            <div key={w.day} className="grid grid-cols-[80px,180px,1fr] gap-6 px-6 py-4 items-start">
              <div className="text-sm font-bold text-primary uppercase tracking-[0.14em]">{w.day}</div>
              <div className="text-sm font-semibold text-foreground">{w.title}</div>
              <div className="text-sm text-muted-foreground leading-relaxed">{w.body}</div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="mb-24"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <SectionHeader eyebrow="Honesty" title="What we don't do." lead="If it's not in the marketplace, it's not in our scope. We'd rather say no than half-deliver." className="mb-10" />
        <ul className="grid md:grid-cols-2 gap-3">
          {wontDo.map((w) => (
            <li key={w} className="p-4 rounded-xl border border-border bg-card text-sm text-foreground flex items-start gap-3">
              <span className="mt-1 text-muted-foreground">×</span>{w}
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-3 gap-12 py-20 border-y border-border mb-16"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-foreground">60+</div>
          <div className="text-sm text-muted-foreground mt-1">Brands managed</div>
          <div className="text-xs text-muted-foreground">across 4 marketplaces</div>
        </div>
        <div className="text-center border-x border-y-0 border-border sm:border-x sm:border-y-0 py-8 sm:py-0">
          <div className="text-3xl sm:text-4xl font-bold text-foreground">48 hrs</div>
          <div className="text-sm text-muted-foreground mt-1">Avg onboarding</div>
          <div className="text-xs text-muted-foreground">from contract to live</div>
        </div>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl font-bold text-foreground">92%</div>
          <div className="text-sm text-muted-foreground mt-1">Client retention</div>
          <div className="text-xs text-muted-foreground">trailing 12 months</div>
        </div>
      </motion.div>

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Link to="/website/demo">
          <Button size="lg" className="rounded-pill px-8 h-12 bg-primary text-primary-foreground btn-shine">
            Talk to Our Team
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default ManagedServicesSection;
