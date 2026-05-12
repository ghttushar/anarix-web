import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingDotsProps {
  className?: string;
  dotClassName?: string;
  size?: number;
}

/**
 * Three-dot thinking indicator. Used while Aan is docked in the generation card.
 * Each dot fades + rises in sequence on a 1.2s loop.
 */
export function FloatingDots({ className, dotClassName, size = 6 }: FloatingDotsProps) {
  return (
    <div
      className={cn("inline-flex items-end gap-1.5", className)}
      aria-label="Aan is thinking"
      role="status"
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={cn("rounded-full bg-muted-foreground/70", dotClassName)}
          style={{ width: size, height: size }}
          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.18,
          }}
        />
      ))}
    </div>
  );
}

export default FloatingDots;
