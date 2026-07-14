import { motion } from "framer-motion";

const kpis = [
  { label: "Revenue", value: "$2.4M", delta: "+18.2%", positive: true },
  { label: "ROAS", value: "4.2x", delta: "+0.4x", positive: true },
  { label: "TACoS", value: "12.8%", delta: "−2.1%", positive: true },
  { label: "Orders", value: "18,420", delta: "+9.7%", positive: true },
];

const EmbedKpiStrip = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
    {kpis.map((k, i) => (
      <motion.div
        key={k.label}
        className="bg-card p-5"
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: i * 0.06, duration: 0.4 }}
      >
        <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{k.label}</div>
        <div className="text-2xl font-bold text-foreground mt-2 tabular-nums">{k.value}</div>
        <div className={`text-xs mt-1 font-medium ${k.positive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>{k.delta}</div>
      </motion.div>
    ))}
  </div>
);

export default EmbedKpiStrip;
