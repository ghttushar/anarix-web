import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Users, Globe, Award } from "lucide-react";

const stats = [
  { icon: Users, value: "40+", label: "Team Members" },
  { icon: Globe, value: "8", label: "Countries" },
  { icon: Award, value: "15+", label: "Years Combined Experience" },
];

const HallOfFame = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className="py-20 bg-background">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
            Powered by <span className="text-gradient-primary">Experts</span>
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Engineers, strategists, designers, and account managers - building the future of e-commerce advertising.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center p-8 rounded-2xl border border-border bg-card hover:border-primary/30 hover:shadow-medium transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
            >
              <stat.icon className="w-8 h-8 text-primary text-[#f26e76] mx-auto mb-3" />
              <div className="text-3xl sm:text-4xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HallOfFame;
