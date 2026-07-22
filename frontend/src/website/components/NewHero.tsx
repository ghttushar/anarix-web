import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NewHero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <motion.div
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-pill bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          Expert-managed marketplace growth
        </motion.div>

        <motion.h1
          className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-semibold tracking-tight text-foreground leading-[1.05] mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          Your marketplace growth,
          <br />
          <span className="text-gradient-primary">managed by experts.</span>
        </motion.h1>

        <motion.p
          className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10 leading-relaxed"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          Anarix combines expert marketplace strategists with the Anarix Insight Engine to manage your advertising, profitability, and operations across Amazon and Walmart. Results are transparent, incentives are aligned, and every decision is data-driven.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/website/demo">
            <Button size="lg" className="rounded-pill px-8 h-12 text-base bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-strong active:translate-y-0 active:scale-[0.97] will-change-transform btn-shine">
              Talk to Our Team
            </Button>
          </Link>
          <Link to="/website/product">
            <Button size="lg" variant="outline" className="rounded-pill px-8 h-12 text-base border-border hover:border-primary/40 hover:shadow-medium transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.97] will-change-transform">
              Explore the Platform
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NewHero;
