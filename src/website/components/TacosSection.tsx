import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import TacoIllustration from "./products/TacoIllustration";

const TacosSection = () => {
  const { ref, isVisible } = useScrollReveal(0.3);
  const [progress, setProgress] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1400;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(easeOut(t));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible]);

  const stats = [
    { value: "30%", label: "avg TACoS reduction" },
    { value: "90 days", label: "typical timeline" },
    { value: "100+", label: "brands operated" },
  ];

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Illustration - left 60% */}
          <motion.div
            className="lg:col-span-7 order-1"
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          >
            <TacoIllustration progress={progress} />
          </motion.div>

          {/* Editorial poster - right 40% */}
          <div className="lg:col-span-5 order-2">
            <motion.p
              className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              TACoS · Total Advertising Cost of Sales
            </motion.p>

            <motion.h2
              className="text-4xl sm:text-5xl xl:text-6xl font-bold text-foreground leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.2, 0, 0, 1] }}
            >
              We take a{" "}
              <span className="text-gradient-primary tabular-nums">
                {Math.round(progress * 30)}%
              </span>{" "}
              bite out of yours.
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg text-muted-foreground mt-6 leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              One bite for us. The rest stays on your plate. TACoS is the
              ad-spend ratio your CFO actually cares about - and we're built
              to shrink it.
            </motion.p>

            <motion.div
              className="mt-10 flex items-stretch gap-6"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.85, duration: 0.6 }}
            >
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-stretch gap-6">
                  {i > 0 && <div className="w-px bg-border" />}
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-semibold text-foreground tabular-nums leading-none">
                      {s.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mt-2">
                      {s.label}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TacosSection;
