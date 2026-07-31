import { motion } from "framer-motion";
import { Bell, FileText, Shield, Zap, CheckCircle, ArrowRight, AlertTriangle, TrendingUp, Clock, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageLayout from "@/website/components/PageLayout";

const signalComponents = [
  { num: "01", label: "Header", desc: "What changed. In plain language." },
  { num: "02", label: "Evidence", desc: "The observations behind the claim." },
  { num: "03", label: "Reasoning", desc: "Why this deserves attention over that." },
  { num: "04", label: "Confidence", desc: "How sure. What we don't know." },
  { num: "05", label: "Action", desc: "The next move. Ready to accept." },
];

const morningSignals = [
  {
    time: "07:12",
    category: "Inventory · US",
    title: "Stockout risk on your #1 SKU",
    desc: "Velocity stepped up for eight days. Inbound ETA is 14 days. Consider air freight on 800 units — cost $2,120 preserves ~$18k margin.",
    severity: "high",
  },
  {
    time: "07:14",
    category: "Ads · Meta",
    title: "Meta ad-set is overspending its return threshold",
    desc: "Set A-24 has slipped below 2.1 ROAS for three days. Cutting daily budget by 40% preserves reach on the two profitable creatives.",
    severity: "medium",
  },
  {
    time: "07:16",
    category: "Contracts",
    title: "Retailer contract requires a decision this week",
    desc: "Kroger MSA renewal expires Friday. Terms improved on payment cadence, worsened on returns. Recommendation: counter on returns clause.",
    severity: "low",
  },
];

const executionSteps = [
  { step: "You", time: "09:04", action: "Decision accepted", detail: "You clicked accept." },
  { step: "Agent", time: "09:04", action: "Handed to the agent", detail: "Freight partner API queued. PO drafted." },
  { step: "Agent", time: "09:11", action: "Booking confirmed", detail: "AWB 172-338… · 800u · KIX → LAX" },
  { step: "Live", time: "11:22", action: "Departed origin", detail: "In transit. ETA revised to 96h." },
  { step: "Outcome", time: "Day 4", action: "Received & put away", detail: "Inventory replenished. Signal closed." },
];

const SignalsPage = () => {
  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero */}
        <div className="text-center pt-8 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              <Bell className="w-3.5 h-3.5" /> Signals
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground leading-[1.08] mb-4">
              Good morning.{" "}
              <span className="text-gradient-primary">Three things deserve your attention.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything else has already been handled. Signals turns noise into one object — held up to the light — so you can decide and move on.
            </p>
          </motion.div>
        </div>

        {/* Problem */}
        <motion.div
          className="mb-20 p-8 rounded-2xl border border-border/40 bg-card/30 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Software got faster. <span className="text-gradient-primary">Work got louder.</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 leading-relaxed">
            Every application believes that if something matters, it should tell you. Eventually every application starts shouting. People don't become informed. They become overwhelmed.
          </p>
          <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
            {[
              "Inventory changed", "Campaign paused", "Meeting ended", "Report ready",
              "Supplier email", "Ticket assigned", "Approval needed", "Threshold met",
              "Deck updated", "Forecast changed", "Bid moved", "Alert · low stock",
              "Slack mentioned", "PO created", "Sync at 3", "SLA at risk",
              "Return spike", "Refund pending", "Cash lower", "New review",
            ].map((item) => (
              <span key={item} className="text-xs px-2.5 py-1 rounded-full bg-muted/60 text-muted-foreground border border-border/30">
                {item}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Signal Structure */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              <Target className="w-3.5 h-3.5" /> The Signal
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              A Signal is <span className="text-gradient-primary">one object</span> — held up to the light.
            </h2>
          </div>
          <div className="grid sm:grid-cols-5 gap-3">
            {signalComponents.map((comp, i) => (
              <motion.div
                key={comp.num}
                className="p-5 rounded-xl border border-border/40 bg-card/30 text-center hover:bg-card/50 hover:border-primary/20 transition-all duration-500"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <div className="text-xs font-bold text-primary/60 mb-2">{comp.num}</div>
                <div className="text-sm font-bold text-foreground mb-1">{comp.label}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{comp.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Specimen */}
        <motion.div
          className="mb-20 p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/30"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <span className="text-xs font-semibold text-primary/60 uppercase tracking-wider">Signal · Specimen</span>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="text-xs text-primary font-semibold mb-1">01 · Header</div>
              <p className="text-sm text-foreground font-medium">Best-seller stock will run out <em>in 6 days</em>.</p>
              <p className="text-xs text-muted-foreground mt-1">Product A · US · Amazon</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="text-xs text-primary font-semibold mb-1">02 · Evidence</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><span className="text-muted-foreground">Velocity</span><div className="font-bold">+42% w/w</div></div>
                <div><span className="text-muted-foreground">On-hand</span><div className="font-bold">1,240 u</div></div>
                <div><span className="text-muted-foreground">Inbound ETA</span><div className="font-bold">14 days</div></div>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="text-xs text-primary font-semibold mb-1">03 · Reasoning</div>
              <p className="text-sm text-muted-foreground leading-relaxed">Velocity has stepped up for eight consecutive days. Amazon Fresh promo likely a driver. Historical lead-time from this supplier averages 12 days.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
              <div className="text-xs text-primary font-semibold mb-1">04 · Confidence</div>
              <p className="text-sm text-foreground font-medium">78% · high</p>
            </div>
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
              <div className="text-xs text-primary font-semibold mb-1">05 · Action</div>
              <p className="text-sm text-foreground font-medium">Expedite 800u via air freight — cost $2,120.</p>
              <div className="mt-3">
                <button className="px-4 py-1.5 rounded-pill bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                  Accept
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Morning Letter */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              <FileText className="w-3.5 h-3.5" /> Morning Letter
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              A day begins with a <span className="text-gradient-primary">letter</span>, not a dashboard.
            </h2>
          </div>
          <div className="max-w-3xl mx-auto p-6 rounded-2xl border border-border/40 bg-card/30">
            <div className="mb-4">
              <p className="text-xs text-muted-foreground">Tuesday, 14 May</p>
              <p className="text-sm font-semibold text-foreground">Three things</p>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                Good morning. Yesterday closed at $184,220 in revenue on Amazon — +4.1% on plan. Three things need you today. Nothing else has moved enough to matter.
              </p>
            </div>
            <div className="space-y-3">
              {morningSignals.map((sig, i) => (
                <motion.div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-xl bg-background border border-border/30 hover:border-primary/20 transition-colors"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
                >
                  <div className="text-xs text-muted-foreground font-mono shrink-0 pt-0.5">{sig.time}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold text-primary/70 uppercase tracking-wider">{sig.category}</span>
                      <span className={`w-1.5 h-1.5 rounded-full ${sig.severity === "high" ? "bg-red-500" : sig.severity === "medium" ? "bg-amber-500" : "bg-green-500"}`} />
                    </div>
                    <h4 className="text-sm font-bold text-foreground mb-1">{sig.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{sig.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-right mt-4">
              <span className="text-xs text-muted-foreground/50 italic">— Signals</span>
            </div>
          </div>
        </motion.div>

        {/* Execution Flow */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
              <Zap className="w-3.5 h-3.5" /> Execution
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
              You decide. Then it <span className="text-gradient-primary">actually happens</span>.
            </h2>
          </div>
          <div className="max-w-2xl mx-auto space-y-0">
            {executionSteps.map((step, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-4 relative"
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  {i < executionSteps.length - 1 && (
                    <div className="w-px h-8 bg-border/40" />
                  )}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-primary/70">{step.step}</span>
                    <span className="text-xs text-muted-foreground font-mono">{step.time}</span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{step.action}</p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Closing */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
            {[
              { icon: Bell, text: "Signals notices." },
              { icon: Clock, text: "Signals remembers." },
              { icon: ArrowRight, text: "Signals brings the next move." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center pb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Stop watching dashboards.</h2>
          <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
            Start understanding your business. Join the Signals waitlist.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 btn-shine">
                Join the Waitlist
              </Button>
            </a>
            <Link to="/product">
              <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200">
                Explore the Platform
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageLayout>
  );
};

export default SignalsPage;
