import { useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import HeroDataViz from "./HeroDataViz";

const stats = [
  { value: "$600M+", label: "GMV optimized", numeric: 600, prefix: "$", suffix: "M+" },
  { value: "500+", label: "Brands managed", numeric: 500, prefix: "", suffix: "+" },
  { value: "40%", label: "Avg TACoS improvement", numeric: 40, prefix: "", suffix: "%" },
];

const CountUp = ({ target, prefix, suffix }: { target: number; prefix: string; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => `${prefix}${Math.round(v)}${suffix}`);

  useEffect(() => {
    if (isInView) {
      animate(count, target, { duration: 2, ease: [0.22, 1, 0.36, 1] });
    }
  }, [isInView, count, target]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const HeroSectionNew = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
      <HeroDataViz />

      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="max-w-4xl">
          <motion.div
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-pill bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            Expert-managed marketplace growth
          </motion.div>

          <motion.h1
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-foreground leading-[1.08] mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            Two plus marketplaces. A dozen dashboards.
            <br />
            <span className="text-gradient-primary">And you, checking Seller Central at 11pm.</span>
          </motion.h1>

          <motion.p
            className="max-w-xl text-base sm:text-lg text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            You didn&apos;t build this brand to babysit ad campaigns and chase stockouts. Anarix runs your Amazon, Walmart and Shopify accounts end-to-end — ads, listings, inventory, compliance — as one team. You keep full visibility.{" "}
            <span className="text-foreground font-semibold">We take the 11pm shift.</span>
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-start gap-4 mb-10"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <a href="https://calendly.com/sunil-anarix/30min" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine group">
                Hand it over
                <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </a>
          </motion.div>

          <motion.p
            className="text-xs text-muted-foreground/60 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Start with a free audit. We&apos;ll show you what your account is losing before you pay a thing.
          </motion.p>
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                <CountUp target={stat.numeric} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mt-10 pt-8 border-t border-border/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.15em]">
            Trusted by 500+ brands on Amazon and Walmart
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionNew;
