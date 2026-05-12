import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const ease = [0.2, 0, 0, 1] as const;

export function Hero() {
  return (
    <section className="relative px-6 pt-20 pb-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease }}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary"
        >
          <Sparkles className="h-3.5 w-3.5" />
          The Anarix Insight Engine
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          className="mt-7 max-w-4xl font-[Satoshi] text-[56px] leading-[1.05] font-semibold tracking-tight text-foreground md:text-[72px]"
        >
          Save 20+ hours a week on marketplace{" "}
          <span className="relative inline-block whitespace-nowrap font-serif italic font-normal text-primary">
            profitability
            <svg
              aria-hidden
              viewBox="0 0 320 16"
              className="absolute -bottom-2 left-0 h-3 w-full text-primary/70"
              preserveAspectRatio="none"
            >
              <motion.path
                d="M2 10 C 60 2, 120 14, 180 6 S 300 12, 318 4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9, ease, delay: 0.6 }}
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.18 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          Anarix is the AI operating layer between your ads, your catalog, and your unified P&amp;L
          — across Amazon, Walmart, Shopify, and TikTok.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.28 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            to="/website/demo"
            className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]"
          >
            Schedule a Demo
          </Link>
          <Link
            to="/website/products/profitability"
            className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground transition-all duration-200 hover:bg-secondary/10 active:scale-[0.98]"
          >
            Explore Products
          </Link>
        </motion.div>

        <div className="mt-16 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4">
          {[
            { v: "$200M+", l: "Ad Spend Managed" },
            { v: "$1.2B+", l: "GMV Driven" },
            { v: "3.2x", l: "Avg. ROAS Lift" },
            { v: "30%", l: "TACoS Reduced" },
          ].map((s, i) => (
            <motion.div
              key={s.l}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.06 }}
              className="text-center"
            >
              <div className="font-[Satoshi] text-3xl font-bold text-foreground tabular-nums md:text-4xl">{s.v}</div>
              <div className="mt-1.5 text-sm text-muted-foreground">{s.l}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
