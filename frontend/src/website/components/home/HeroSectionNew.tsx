import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AanMascot } from "@/components/aan/AanMascot";
import { ArrowRight } from "lucide-react";

const brands = [
  "Mount-It!", "Drive Medical", "Karma Organics",
  "Brooklyn Apparel", "European Home Design",
];

const HeroSectionNew = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgHue = useTransform(scrollYProgress, [0, 1], [0, 5]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const [mascotSize, setMascotSize] = useState<"large" | "companion">("large");

  useEffect(() => {
    const h = bgHue.get();
    if (h !== undefined) {
      document.documentElement.style.setProperty("--hero-hue", `${h}`);
    }
    const unsub = bgHue.on("change", (v) => {
      document.documentElement.style.setProperty("--hero-hue", `${Math.round(v)}`);
    });
    return unsub;
  }, [bgHue]);

  return (
    <section ref={ref} className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ scale, opacity: scrollYProgress }}>
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 40%, hsl(240 60% 60% / 0.08), transparent)`,
            filter: "hue-rotate(var(--hero-hue, 0deg))",
          }}
        />
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 text-left">
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
              <Link to="/website/demo">
                <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine group">
                  Hand it over
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 transition-all duration-200">
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
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

          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            {mascotSize === "large" ? (
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/5 blur-3xl" />
                <button
                  onClick={() => setMascotSize("companion")}
                  className="relative cursor-pointer bg-transparent border-none"
                  title="Switch to companion size"
                >
                  <AanMascot state="idle" size={140} interactive floating layoutId="hero-mascot" />
                </button>
                <p className="text-[10px] text-muted-foreground/40 text-center mt-2">Click to see companion size</p>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setMascotSize("large")}
                  className="cursor-pointer bg-transparent border-none"
                  title="Switch to large size"
                >
                  <AanMascot state="idle" size={64} interactive floating layoutId="hero-mascot" />
                </button>
                <p className="text-[10px] text-muted-foreground/40 text-center mt-2">Click for large size</p>
              </div>
            )}
          </div>
        </div>

        <motion.div
          className="mt-16 pt-8 border-t border-border/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <p className="text-xs text-muted-foreground/50 uppercase tracking-[0.15em] mb-4">
            Trusted by 500+ brands on Amazon and Walmart
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {brands.map((b) => (
              <span key={b} className="text-sm font-semibold text-foreground/50 hover:text-foreground/80 transition-colors">
                {b}
              </span>
            ))}
            <span className="text-xs text-muted-foreground/30 ml-2">and more</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSectionNew;
