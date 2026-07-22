import { motion } from "framer-motion";
import { Users, Handshake, Eye, LineChart } from "lucide-react";

const features = [
  { icon: Users, title: "Dedicated Team", desc: "Senior account managers and strategists assigned to your brand. The same humans week after week." },
  { icon: Handshake, title: "Hybrid Model", desc: "Our strategists use the Anarix Insight Engine alongside your team. Same dashboards, same data, same audit trail." },
  { icon: Eye, title: "Complete Visibility", desc: "Every action logged, every decision documented. You see exactly what we did, when, and why." },
  { icon: LineChart, title: "Performance-Based", desc: "We tie our compensation to your outcomes. Aligned incentives, not hourly billing." },
];

const ServiceModelSection = () => {
  return (
    <section className="py-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
            The Service Model
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            We manage your marketplace operations.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Most agencies sell hours. We sell outcomes. Every action is visible, every decision is justified, and every result is measured against your bottom line.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-6 rounded-2xl border border-border bg-card"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <f.icon className="w-7 h-7 text-primary mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceModelSection;
