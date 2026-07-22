import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { Search, Settings, FileText, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Diagnose",
    subtitle: "We find the leaks. You decide what to fix.",
    body: "Every account has its own history — and its own blind spots. We don&apos;t run a generic checklist; we dig into your numbers until we find exactly where the money&apos;s leaking, whether that&apos;s ad spend with no return, listings losing the buy box, or compliance risks nobody&apos;s flagged. No obligation, no fluff — just the truth about where you stand.",
  },
  {
    icon: Settings,
    title: "Take Over",
    subtitle: "The work that eats your nights becomes someone else&apos;s full-time job.",
    body: "Once we know what&apos;s broken, we get to work fixing it. Your dedicated team steps into the day-to-day — reallocating ad budget, cleaning up listings, managing inventory, staying ahead of compliance. The work that&apos;s been eating your nights and weekends becomes someone&apos;s full-time job instead of your second one.",
  },
  {
    icon: FileText,
    title: "Report",
    subtitle: "Real P&L clarity, not vanity metrics.",
    body: "You shouldn&apos;t have to dig through a 40-tab spreadsheet to find out if things are working. We break down exactly what changed, what it cost, and what it earned — real P&L clarity, not vanity metrics. Monthly or weekly, whichever you want. Ask us anything, anytime.",
  },
  {
    icon: TrendingUp,
    title: "Grow & Scale",
    subtitle: "Once fundamentals are solid, we push for the next level.",
    body: "Once the fundamentals are solid — costs under control, compliance clean, reporting you trust — we shift into growth mode. Based on what we&apos;ve learned about your account and where you want to go, we scale up spend, expand into new channels, and push for the next level of growth.",
  },
];

const StepCard = ({ step, i }: { step: typeof steps[0]; i: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { margin: "-20% 0px -60% 0px" });

  return (
    <motion.div
      ref={cardRef}
      className="relative"
      style={{ top: `${80 + i * 24}px` }}
    >
      <motion.div
        className="p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-700"
        animate={{
          scale: isInView ? 1 : 0.95,
          opacity: isInView ? 1 : 0.3,
          boxShadow: isInView
            ? "0 8px 30px -8px hsl(var(--primary) / 0.12), 0 4px 12px -4px hsl(var(--primary) / 0.06)"
            : "0 1px 3px -1px hsl(var(--primary) / 0.04)",
        }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <step.icon className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xs font-semibold text-primary uppercase tracking-[0.14em]">
            Step {i + 1}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-1">{step.title}</h3>
        <p className="text-sm text-primary/70 italic mb-4">{step.subtitle}</p>
        <p className="text-muted-foreground leading-relaxed">{step.body}</p>
      </motion.div>
    </motion.div>
  );
};

const ProcessSteps = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const lineHeight = useTransform(scrollYProgress, [0, 0.95], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            How It Works
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
            From chaos to control.
            <br />
            <span className="text-gradient-primary">In four steps.</span>
          </h2>
        </motion.div>

        <div className="relative">
          <motion.div
            className="absolute left-6 top-0 w-px bg-border/40"
            style={{ height: "100%" }}
          >
            <motion.div
              className="w-full bg-gradient-to-b from-primary via-primary/60 to-primary/20"
              style={{ height: lineHeight }}
            />
          </motion.div>

          <div className="space-y-0">
            {steps.map((step, i) => (
              <StepCard key={step.title} step={step} i={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
