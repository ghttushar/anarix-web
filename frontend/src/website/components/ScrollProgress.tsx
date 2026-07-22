import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const sections = [
  { label: "Hero", shape: "◆" },
  { label: "Pain", shape: "●" },
  { label: "Proof", shape: "●" },
  { label: "Process", shape: "▣" },
  { label: "Philosophy", shape: "▣" },
  { label: "Services", shape: "▬" },
  { label: "CTA", shape: "◆" },
];

const ScrollProgress = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={ref}
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:block pointer-events-none"
      style={{ opacity }}
    >
      <div className="relative h-64 w-px bg-border/20">
        <motion.div
          className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary/50 to-primary/20"
          style={{ height: lineHeight }}
        />
        {sections.map((s, i) => {
          const top = `${(i / (sections.length - 1)) * 100}%`;
          return (
            <div
              key={s.label}
              className="absolute -left-1.5 flex items-center gap-2"
              style={{ top, transform: "translateY(-50%)" }}
            >
              <motion.span
                className="text-[8px] text-primary/40"
                style={{
                  opacity: useTransform(
                    scrollYProgress,
                    [Math.max(0, i / sections.length - 0.05), i / sections.length, Math.min(1, i / sections.length + 0.05)],
                    [0.3, 1, 0.3]
                  ),
                }}
              >
                {s.shape}
              </motion.span>
            </div>
          );
        })}
      </div>
      <motion.div
        className="absolute -left-4 flex items-center gap-2"
        style={{
          top: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
          transform: "translateY(-50%)",
        }}
      >
        <div className="w-2 h-2 rounded-full bg-primary shadow-lg shadow-primary/40" />
      </motion.div>
    </motion.div>
  );
};

export default ScrollProgress;
