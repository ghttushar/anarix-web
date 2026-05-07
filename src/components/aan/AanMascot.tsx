import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AanMascotState = "idle" | "listening" | "thinking" | "anchor";

interface AanMascotProps {
  state?: AanMascotState;
  size?: number;
  interactive?: boolean;
  className?: string;
}

/**
 * AanMascot — coral diamond mascot built from the Anarix logo symbol.
 *
 * States:
 *  - idle: gentle bob, eyes follow cursor (when interactive)
 *  - listening: scaled up with soft coral glow, eyes wider
 *  - thinking: morphs / rotates / scale-pulses in a continuous loop
 *  - anchor: static, no motion
 *
 * Pure SVG + Framer Motion. Respects prefers-reduced-motion.
 */
export function AanMascot({
  state = "idle",
  size = 64,
  interactive = true,
  className,
}: AanMascotProps) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Eye tracking
  const eyeX = useMotionValue(0);
  const eyeY = useMotionValue(0);
  const sx = useSpring(eyeX, { stiffness: 180, damping: 18, mass: 0.4 });
  const sy = useSpring(eyeY, { stiffness: 180, damping: 18, mass: 0.4 });

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!interactive || state === "anchor" || reduceMotion) return;
    const handle = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      const max = 1.6; // px max eye offset (subtle)
      const k = Math.min(1, 220 / Math.max(dist, 60));
      eyeX.set((dx / Math.max(dist, 1)) * max * k);
      eyeY.set((dy / Math.max(dist, 1)) * max * k);
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, [interactive, state, reduceMotion, eyeX, eyeY]);

  // Body animation per state
  const bodyAnim: any = (() => {
    if (reduceMotion || state === "anchor") return {};
    if (state === "idle") {
      return { y: [0, -3, 0], transition: { duration: 2.4, ease: "easeInOut", repeat: Infinity } };
    }
    if (state === "listening") {
      return { scale: [1, 1.06, 1], transition: { duration: 1.6, ease: "easeInOut", repeat: Infinity } };
    }
    if (state === "thinking") {
      return {
        rotate: [0, 45, 0, -45, 0],
        scale: [1, 0.94, 1.02, 0.94, 1],
        transition: { duration: 1.8, ease: "easeInOut", repeat: Infinity },
      };
    }
    return {};
  })();

  // Listening glow
  const glow = state === "listening"
    ? "drop-shadow(0 0 10px rgba(242,110,119,0.55)) drop-shadow(0 0 20px rgba(242,110,119,0.25))"
    : state === "thinking"
    ? "drop-shadow(0 0 6px rgba(74,98,217,0.35))"
    : "drop-shadow(0 1px 2px rgba(0,0,0,0.12))";

  // Color: coral default; tint blue mid-thinking via SVG fill animation
  const fill = state === "thinking" ? "#4A62D9" : "#F26E77";

  // Eye dimensions scale with size
  const eyeR = Math.max(1.5, size * 0.04);
  const eyeOffsetX = size * 0.08;
  const eyeOffsetY = state === "listening" ? -size * 0.02 : size * 0.01;

  return (
    <div
      ref={wrapRef}
      className={cn("inline-flex items-center justify-center select-none", className)}
      style={{ width: size, height: size }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <motion.svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        animate={bodyAnim}
        style={{ filter: glow, overflow: "visible" }}
      >
        {/* Diamond body — derived from logo symbol proportions */}
        <motion.polygon
          points="50,8 84,50 50,92 16,50"
          animate={{ fill }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Eyes (group translates with cursor) */}
        <motion.g style={{ x: sx, y: sy }}>
          <motion.circle
            cx={50 - eyeOffsetX}
            cy={50 + eyeOffsetY}
            r={eyeR}
            fill="#1D252D"
            animate={{ scaleY: state === "listening" ? 1 : isHovering ? 0.85 : 1 }}
            style={{ transformOrigin: `${50 - eyeOffsetX}px ${50 + eyeOffsetY}px` }}
          />
          <motion.circle
            cx={50 + eyeOffsetX}
            cy={50 + eyeOffsetY}
            r={eyeR}
            fill="#1D252D"
            animate={{ scaleY: state === "listening" ? 1 : isHovering ? 0.85 : 1 }}
            style={{ transformOrigin: `${50 + eyeOffsetX}px ${50 + eyeOffsetY}px` }}
          />
        </motion.g>
      </motion.svg>
    </div>
  );
}

export default AanMascot;
