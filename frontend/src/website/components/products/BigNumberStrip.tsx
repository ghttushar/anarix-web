import { motion } from "framer-motion";

export interface BigNumberItem {
  value: string;
  label: string;
  caption?: string;
}

interface Props {
  items: BigNumberItem[];
  className?: string;
}

/**
 * Oversized number cards for product page heroes.
 * Three large stats; sits immediately under the hero animation/pun.
 * Token-only; no gradients; respects Section 9 motion limits.
 */
const BigNumberStrip = ({ items, className }: Props) => (
  <section className={`mb-24 ${className ?? ""}`}>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      {items.map((it, i) => (
        <motion.div
          key={it.label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ delay: i * 0.06, duration: 0.22, ease: [0.2, 0, 0, 1] }}
          className="group p-6 sm:p-8 rounded-2xl border border-border bg-card hover:-translate-y-0.5 hover:border-primary/30 transition-all duration-200"
        >
          <div className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tabular-nums leading-none tracking-tight">
            {it.value}
          </div>
          <div className="mt-5 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-semibold">
            {it.label}
          </div>
          {it.caption && (
            <div className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {it.caption}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  </section>
);

export default BigNumberStrip;
