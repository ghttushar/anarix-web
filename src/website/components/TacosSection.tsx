import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const AnimatedTaco = ({ progress }: { progress: number }) => {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const arcReduction = circumference * (progress * 0.3);
  const dashArray = circumference - arcReduction;
  const sliceAngle = progress * 108; // 30% of 360

  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 mx-auto">
      {/* Circular progress arc */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 120 120">
        {/* Background circle */}
        <circle cx="60" cy="60" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
        {/* Animated arc */}
        <circle
          cx="60" cy="60" r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray={`${dashArray} ${circumference}`}
          style={{ transition: "stroke-dasharray 0.05s linear" }}
        />
      </svg>

      {/* Percentage label */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 text-sm font-bold text-primary tabular-nums">
        {Math.round(progress * 30)}%
      </div>

      {/* SVG Taco illustration with pie-slice mask */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 120 120">
        <defs>
          {/* Mask that removes a pie slice */}
          <mask id="taco-mask">
            <rect width="120" height="120" fill="white" />
            {/* Pie slice removal from center */}
            <path
              d={`M60,60 L60,${60 - radius} A${radius},${radius} 0 0,1 ${
                60 + radius * Math.sin((sliceAngle * Math.PI) / 180)
              },${60 - radius * Math.cos((sliceAngle * Math.PI) / 180)} Z`}
              fill="black"
            />
          </mask>
        </defs>

        <g mask="url(#taco-mask)">
          {/* Taco shell - outer */}
          <path
            d="M30,72 Q60,28 90,72"
            fill="none"
            stroke="hsl(42 70% 55%)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Shell fill */}
          <path
            d="M32,72 Q60,30 88,72 Z"
            fill="hsl(42 65% 75%)"
            opacity="0.5"
          />
          {/* Inner shell texture line */}
          <path
            d="M36,68 Q60,36 84,68"
            fill="none"
            stroke="hsl(42 60% 60%)"
            strokeWidth="1.5"
            opacity="0.6"
          />
          {/* Lettuce */}
          <path
            d="M34,68 Q42,54 48,62 Q54,50 60,60 Q66,48 72,58 Q78,46 86,68"
            fill="hsl(120 40% 55%)"
            opacity="0.8"
          />
          {/* Tomato bits */}
          <circle cx="48" cy="62" r="3.5" fill="hsl(0 65% 55%)" opacity="0.8" />
          <circle cx="65" cy="58" r="3" fill="hsl(0 65% 55%)" opacity="0.7" />
          <circle cx="56" cy="56" r="2.5" fill="hsl(0 60% 60%)" opacity="0.6" />
          {/* Cheese */}
          <path
            d="M40,70 L38,78 M50,66 L48,76 M62,64 L60,76 M72,66 L72,78 M80,70 L82,78"
            stroke="hsl(45 80% 60%)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.7"
          />
          {/* Base line */}
          <path
            d="M28,73 Q60,73 92,73"
            fill="none"
            stroke="hsl(42 70% 50%)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );
};

const TacosSection = () => {
  const { ref, isVisible } = useScrollReveal(0.3);
  const [progress, setProgress] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(t);
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible]);

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.p
          className="text-muted-foreground text-sm uppercase tracking-widest mb-8"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Our Take on TACoS
        </motion.p>

        <motion.h2
          className="text-3xl sm:text-5xl font-bold text-foreground mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          One for you. One for us.
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isVisible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatedTaco progress={progress} />
        </motion.div>

        <motion.p
          className="text-xl sm:text-2xl font-semibold text-foreground mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          But we'll reduce yours by{" "}
          <span className="text-gradient-primary">{Math.round(progress * 30)}%</span>.
        </motion.p>

        <motion.p
          className="text-muted-foreground mt-4 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          TACoS (Total Advertising Cost of Sales) is the metric that matters.
          We obsess over it so you don't have to.
        </motion.p>
      </div>
    </section>
  );
};

export default TacosSection;
