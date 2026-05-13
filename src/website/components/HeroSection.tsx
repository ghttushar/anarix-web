import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const rotatingWords = ["profitability", "advertising", "catalog", "reporting"];

/* Sparkle SVG */
const Sparkle = ({ className, delay = 0 }: { className?: string; delay?: number }) => (
  <motion.svg
    viewBox="0 0 24 24"
    fill="none"
    className={className}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0.4, 1], scale: [0.6, 1, 0.85, 1], rotate: [0, 15, -5, 0] }}
    transition={{ delay, duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
  >
    <path d="M12 2L13.5 9.5L20 12L13.5 14.5L12 22L10.5 14.5L4 12L10.5 9.5L12 2Z" fill="hsl(var(--primary))" />
  </motion.svg>
);

const HeroSection = () => {
  const [wordIndex, setWordIndex] = useState(0);
  const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>();
  const hasMouseMoved = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  /* Lerped cursor glow */
  useEffect(() => {
    const lerp = () => {
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * 0.08;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * 0.08;
      setGlowPos({ x: currentPos.current.x, y: currentPos.current.y });
      rafRef.current = requestAnimationFrame(lerp);
    };
    rafRef.current = requestAnimationFrame(lerp);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    targetPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    hasMouseMoved.current = true;
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Dot grid background */}
      <div className="absolute inset-0 bg-dot-grid opacity-70" />

      {/* Gradient wash top-left */}
      <div className="absolute inset-0 bg-gradient-to-br from-periwinkle-light/60 via-transparent to-transparent" />

      {/* Lerped cursor glow spotlight */}
      <div
        className="absolute pointer-events-none transition-none"
        style={{
          left: glowPos.x - 250,
          top: glowPos.y - 250,
          width: 500,
          height: 500,
          background: `radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)`,
          opacity: hasMouseMoved.current ? 1 : 0,
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-pill bg-accent border border-border text-sm font-medium text-accent-foreground"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Sparkle className="w-4 h-4" delay={0.3} />
          The Anarix Insight Engine
        </motion.div>

        {/* Main headline - Attendflow-style serif with italic accent */}
        <motion.h1
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-semibold tracking-tight text-foreground leading-[1.05] mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Save 20+ hours a week
          <br />
          on marketplace{" "}
          <span className="relative inline-block italic font-normal">
            <AnimatePresence mode="wait">
              <motion.span
                key={rotatingWords[wordIndex]}
                className="inline-block text-gradient-primary"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                {rotatingWords[wordIndex]}
              </motion.span>
            </AnimatePresence>

            {/* Underline scribble */}
            <motion.svg
              className="absolute -bottom-2 left-0 w-full h-3 pointer-events-none"
              viewBox="0 0 200 12"
              preserveAspectRatio="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <motion.path
                d="M2 8 C 50 2, 100 10, 198 4"
                fill="none"
                stroke="hsl(var(--primary) / 0.55)"
                strokeWidth="2.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.svg>

            <Sparkle className="absolute -top-4 -right-6 w-5 h-5" delay={1.8} />
            <Sparkle className="absolute -bottom-4 -left-5 w-4 h-4" delay={2.4} />
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="max-w-2xl mx-auto text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Anarix is the AI operating layer between your ads, your catalog, and
          your unified P&amp;L - across Amazon, Walmart, Shopify, and TikTok.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/website/demo">
            <Button
              size="lg"
              className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine"
            >
              Schedule a Demo
            </Button>
          </Link>
          <Link to="/website/products/profitability">
            <Button
              size="lg"
              variant="outline"
              className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 hover:shadow-medium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] will-change-transform"
            >
              Explore Products
            </Button>
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default HeroSection;

