import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const StatementSection = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-16 px-6 bg-gradient-to-r from-primary/5 via-accent/30 to-primary/5">
      <motion.div
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold text-foreground leading-[1.15] tracking-tight">
          We've reconciled{" "}
          <span className="text-gradient-primary italic">$200M+</span> in marketplace ad spend
          <br className="hidden sm:block" />
          so your team doesn't have to.
        </p>
      </motion.div>
    </section>
  );
};

export default StatementSection;
