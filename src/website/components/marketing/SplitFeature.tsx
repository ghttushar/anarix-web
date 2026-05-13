import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SplitFeatureProps {
  eyebrow?: string;
  title: string;
  body: ReactNode;
  visual: ReactNode;
  reverse?: boolean;
  bullets?: string[];
}

const SplitFeature = ({ eyebrow, title, body, visual, reverse, bullets }: SplitFeatureProps) => (
  <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
    >
      {eyebrow && (
        <div className="inline-flex items-center px-3 py-1 mb-4 rounded-pill bg-primary/10 text-primary text-xs font-medium uppercase tracking-[0.14em]">
          {eyebrow}
        </div>
      )}
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">{title}</h3>
      <div className="text-base text-muted-foreground leading-relaxed space-y-4">{body}</div>
      {bullets && (
        <ul className="mt-6 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay: 0.05 }}
    >
      {visual}
    </motion.div>
  </div>
);

export default SplitFeature;
