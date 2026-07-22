import { motion } from "framer-motion";

const results = [
  { value: "18%", label: "Average margin increase", caption: "Across managed brands" },
  { value: "40%", label: "TACoS improvement", caption: "Within 120 days" },
  { value: "$600M+", label: "GMV optimized", caption: "Across 60+ brands" },
];

const ResultsStrip = () => {
  return (
    <section className="py-16 border-y border-border">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {results.map((r, i) => (
            <motion.div
              key={r.label}
              className="text-center"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="text-4xl sm:text-5xl font-bold text-foreground mb-1">{r.value}</div>
              <div className="text-sm font-semibold text-primary mb-0.5">{r.label}</div>
              <div className="text-sm text-muted-foreground">{r.caption}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResultsStrip;
