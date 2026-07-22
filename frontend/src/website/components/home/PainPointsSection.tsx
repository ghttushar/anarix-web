import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const pains = [
  "Your ad spend is climbing, but your profit isn't.",
  "You don't know if you're one policy violation away from a suspension.",
  "Your \"agency\" sends a monthly report nobody has time to read.",
  "You're the one still checking Seller Central at 11pm.",
  "You built a brand. Not a second job managing Amazon ads.",
];

const PainPointsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section ref={ref} className="relative py-28 overflow-hidden">
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 30% 50%, hsl(var(--primary) / 0.04), transparent)",
          opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]),
        }}
      />

      <div className="relative max-w-3xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            Sound familiar?
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground tracking-tight leading-[1.1]">
            If this sounds like your Tuesday,{" "}
            <span className="text-gradient-primary">you&apos;re not alone.</span>
          </h2>
        </motion.div>

        <div className="space-y-4">
          {pains.map((pain, i) => (
            <motion.div
              key={pain}
              className="group flex items-start gap-4 p-4 sm:p-5 rounded-2xl hover:bg-card/50 transition-colors duration-500"
              initial={{ opacity: 0, x: -16, scale: 0.97 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mt-1 w-2 h-2 rounded-full bg-primary/30 shrink-0 group-hover:bg-primary/60 transition-colors" />
              <p className="text-base sm:text-lg text-muted-foreground group-hover:text-foreground transition-colors duration-500">
                {pain}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-12 p-6 rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm sm:text-base text-foreground leading-relaxed">
            We built Anarix because brand owners kept telling us the same thing — not &ldquo;I need better software,&rdquo; but{" "}
            <span className="text-primary font-semibold">&ldquo;I need someone to just handle this.&rdquo;</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PainPointsSection;
