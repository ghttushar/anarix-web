import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

interface StatBlockProps {
  value: string; // e.g. "$200M+", "4.2x", "12.8%"
  label: string;
  delta?: string;
  align?: "left" | "center";
}

const parseNumber = (v: string) => {
  const m = v.match(/-?\d+(\.\d+)?/);
  return m ? parseFloat(m[0]) : null;
};

const StatBlock = ({ value, label, delta, align = "left" }: StatBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const target = parseNumber(value);
  const mv = useMotionValue(0);
  const decimals = value.includes(".") ? 1 : 0;
  const display = useTransform(mv, (v) => {
    if (target === null) return value;
    return value.replace(/-?\d+(\.\d+)?/, v.toFixed(decimals));
  });

  useEffect(() => {
    if (inView && target !== null) {
      const controls = animate(mv, target, { duration: 1.1, ease: [0.2, 0, 0, 1] });
      return controls.stop;
    }
  }, [inView, target, mv]);

  return (
    <div ref={ref} className={align === "center" ? "text-center" : "text-left"}>
      <motion.div
        className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-none"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
      >
        {target !== null ? <motion.span>{display}</motion.span> : value}
      </motion.div>
      <div className="mt-3 text-sm text-muted-foreground uppercase tracking-[0.14em]">{label}</div>
      {delta && <div className="mt-1 text-xs text-primary text-[#f26e76] font-medium">{delta}</div>}
    </div>
  );
};

export default StatBlock;
