import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const quotes = [
  "These people understand my chaos.",
  "One platform. Complete control.",
  "Less noise. More growth.",
];

const KaleidoscopeSection = () => {
  const { ref, isVisible } = useScrollReveal();
  const [quoteIndex, setQuoteIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden bg-background">
      {/* Geometric pattern */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute border border-primary/10 rounded-full"
            style={{
              width: `${120 + i * 100}px`,
              height: `${120 + i * 100}px`,
            }}
            animate={isVisible ? {
              rotate: [0, i % 2 === 0 ? 360 : -360],
              scale: [1, 1.02, 1],
            } : {}}
            transition={{
              rotate: { duration: 30 + i * 5, repeat: Infinity, ease: "linear" },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
        {/* Diamond shapes */}
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={`d-${i}`}
            className="absolute border border-primary/8"
            style={{
              width: `${80 + i * 70}px`,
              height: `${80 + i * 70}px`,
              transform: `rotate(45deg)`,
            }}
            animate={isVisible ? {
              rotate: [45, i % 2 === 0 ? 405 : -315],
            } : {}}
            transition={{
              duration: 25 + i * 8,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Quote */}
      <div className="relative z-10 text-center px-6">
        <AnimatePresence mode="wait">
          <motion.h2
            key={quoteIndex}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold text-foreground max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            "{quotes[quoteIndex]}"
          </motion.h2>
        </AnimatePresence>
        <motion.div
          className="mt-6 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
        >
          {quotes.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                i === quoteIndex ? "bg-primary" : "bg-border"
              }`}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default KaleidoscopeSection;
