import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AanMascotState = "idle" | "listening" | "thinking" | "anchor";
export type AanMascotShape = "diamond" | "circle" | "bar" | "cube";

interface AanMascotProps {
  state?: AanMascotState;
  /** Optional explicit shape override (used by showcase / design system). */
  shape?: AanMascotShape;
  size?: number;
  interactive?: boolean;
  className?: string;
}

type ShapeStyle = {
  background: string;
  glow: string;
  shadow: string;
  sparkLeft: number;
  sparkTop: number;
};

const shapeStyles: Record<AanMascotShape, ShapeStyle> = {
  diamond: {
    background:
      "radial-gradient(circle at 50% 38%, #f88a93 0%, #f57780 42%, #f46d76 78%, #f2626d 100%)",
    glow: "rgba(244, 109, 118, 0.34)",
    shadow: "0 30px 76px -28px rgba(244, 109, 118, 0.48)",
    sparkLeft: 91,
    sparkTop: 50,
  },
  circle: {
    background:
      "radial-gradient(circle at 50% 38%, #f9939b 0%, #f67d86 42%, #f46d76 78%, #f2606c 100%)",
    glow: "rgba(244, 109, 118, 0.3)",
    shadow: "0 28px 70px -28px rgba(244, 109, 118, 0.44)",
    sparkLeft: 87,
    sparkTop: 13,
  },
  bar: {
    background:
      "linear-gradient(180deg, #f88790 0%, #f5737c 48%, #f46d76 78%, #f15f6b 100%)",
    glow: "rgba(244, 109, 118, 0.28)",
    shadow: "0 24px 64px -24px rgba(244, 109, 118, 0.42)",
    sparkLeft: 93,
    sparkTop: 14,
  },
  cube: {
    background:
      "radial-gradient(circle at 50% 34%, #f88d96 0%, #f67680 44%, #f46d76 78%, #f05e6a 100%)",
    glow: "rgba(244, 109, 118, 0.3)",
    shadow: "0 28px 68px -26px rgba(244, 109, 118, 0.44)",
    sparkLeft: 86,
    sparkTop: 13,
  },
};

const stateToShape: Record<AanMascotState, AanMascotShape> = {
  idle: "diamond",
  listening: "circle",
  thinking: "cube",
  anchor: "diamond",
};

/**
 * AanMascot — official Anarix brand-manual mascot.
 * Coral diamond/circle/bar/cube morph with eye tracking, soft coral aura, and a sparkle.
 * Ported 1:1 from the Anarix brand manual (no blue circle/ring).
 */
export function AanMascot({
  state = "idle",
  shape: shapeOverride,
  size = 64,
  interactive = true,
  className,
}: AanMascotProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });

  const shape: AanMascotShape = shapeOverride ?? stateToShape[state];
  const isStatic = state === "anchor" || reduceMotion;
  const trackCursor = interactive && !isStatic;

  useEffect(() => {
    if (!trackCursor) {
      setEyeOffset({ x: 0, y: 0 });
      return;
    }
    const handler = (event: MouseEvent) => {
      const node = ref.current;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const cy = bounds.top + bounds.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const distance = Math.min(1, Math.hypot(dx, dy) / 420);
      const angle = Math.atan2(dy, dx);
      const travel = Math.max(1.5, size * 0.02);
      setEyeOffset({
        x: Math.cos(angle) * distance * travel,
        y: Math.sin(angle) * distance * travel,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [size, trackCursor]);

  const radius =
    shape === "circle" ? "50%" : shape === "bar" ? "999px" : shape === "cube" ? "18%" : "16%";
  const aspect =
    shape === "bar"
      ? { width: size * 1.8, height: size * 0.56 }
      : { width: size, height: size };
  const rotate = shape === "diamond" ? 45 : 0;
  const style = shapeStyles[shape];
  const eyeSize = Math.max(4, size * 0.055);
  const eyeGap = size * 0.145;
  const sparkSize = Math.max(4, size * 0.048);

  return (
    <motion.div
      ref={ref}
      className={cn("relative inline-flex items-center justify-center select-none", className)}
      animate={isStatic ? { y: 0 } : { y: shape === "bar" ? 0 : [0, -3, 0] }}
      transition={{ duration: 4.6, repeat: Infinity, ease: "easeInOut" }}
      style={{ width: aspect.width, height: aspect.height }}
    >
      {/* Aura */}
      <motion.div
        aria-hidden
        animate={{
          width: aspect.width * 1.1,
          height: aspect.height * 1.1,
          borderRadius: radius,
          rotate,
          scale: isStatic ? 1 : [1, 1.02, 1],
        }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          background: style.glow,
          filter: "blur(22px)",
          opacity: 0.95,
          pointerEvents: "none",
        }}
      />

      {/* Body */}
      <motion.div
        animate={{
          width: aspect.width,
          height: aspect.height,
          borderRadius: radius,
          rotate,
        }}
        transition={{ type: "spring", stiffness: 120, damping: 16 }}
        style={{
          background: style.background,
          position: "relative",
          boxShadow: style.shadow,
          overflow: "hidden",
        }}
      >
        {/* Eyes (counter-rotated so they read upright on the diamond) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            transform: `rotate(${-rotate}deg)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: eyeGap,
          }}
        >
          {[0, 1].map((index) => (
            <motion.div
              key={index}
              animate={{ x: eyeOffset.x, y: eyeOffset.y }}
              transition={{ type: "spring", stiffness: 170, damping: 18 }}
              style={{
                width: eyeSize,
                height: eyeSize,
                borderRadius: "999px",
                background: "#11141f",
                boxShadow: "0 0 0 1px rgba(0,0,0,0.04)",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Sparkle */}
      <motion.span
        aria-hidden
        animate={isStatic ? { opacity: 1, scale: 1 } : { opacity: [0.9, 1, 0.9], scale: [1, 0.95, 1] }}
        transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          left: `${style.sparkLeft}%`,
          top: `${style.sparkTop}%`,
          width: sparkSize,
          height: sparkSize,
          borderRadius: "999px",
          background: "rgba(255,255,255,0.98)",
          boxShadow: `0 0 ${Math.max(10, size * 0.16)}px rgba(255,255,255,0.34)`,
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

export default AanMascot;
