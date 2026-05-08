import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AanMascotState = "idle" | "listening" | "thinking" | "working" | "speaking" | "anchor";
// Legacy shape prop kept for backwards compatibility; ignored. Diamond is the only shape.
export type AanMascotShape = "diamond" | "circle" | "bar" | "cube";

interface AanMascotProps {
  state?: AanMascotState;
  /** Legacy / ignored. Aan is always a diamond. */
  shape?: AanMascotShape;
  size?: number;
  interactive?: boolean;
  /** Soft ground shadow ellipse beneath. Only honored at large sizes. */
  floating?: boolean;
  /** 0–100, used by `working` state to draw a rim arc. */
  progress?: number;
  /** When true, this instance participates in the travelling-presence layout animation. */
  layoutId?: string;
  className?: string;
}

const CORAL = {
  base: "#f46d76",
  light: "#f88a93",
  deep: "#f05e6a",
};

/**
 * Aan — the coral diamond. One shape, three rendering tiers based on size:
 *   • <24px  → flat soft-diamond (rounded square), no motion, no aura. Confident brand mark.
 *   • 24–40px → diamond with subtle breathe only.
 *   • >40px  → full state behavior: morph, swirl, rim arc, ground shadow.
 */
export function AanMascot({
  state = "idle",
  size = 64,
  interactive = true,
  floating = false,
  progress = 0,
  layoutId,
  className,
}: AanMascotProps) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [bodyLean, setBodyLean] = useState({ x: 0, y: 0, tilt: 0 });

  const tier: "micro" | "compact" | "full" = size < 24 ? "micro" : size <= 40 ? "compact" : "full";
  const isStatic = state === "anchor" || reduceMotion;
  const trackCursor = interactive && !isStatic && tier === "full";

  useEffect(() => {
    if (!trackCursor) {
      setBodyLean({ x: 0, y: 0, tilt: 0 });
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
      const bodyTravel = Math.max(2, size * 0.04);
      setBodyLean({
        x: Math.cos(angle) * distance * bodyTravel,
        y: Math.sin(angle) * distance * bodyTravel,
        tilt: Math.cos(angle) * distance * 4,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [size, trackCursor]);

  // ---------- MICRO TIER (<24px): flat soft-diamond mark ----------
  if (tier === "micro") {
    return (
      <motion.span
        layoutId={layoutId}
        className={cn("inline-block shrink-0", className)}
        style={{
          width: size,
          height: size,
          borderRadius: "30%",
          background: `linear-gradient(140deg, ${CORAL.light} 0%, ${CORAL.base} 60%, ${CORAL.deep} 100%)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      />
    );
  }

  // ---------- COMPACT & FULL TIERS ----------
  const baseRotate = 45; // diamond
  // listening: corners soften and stretch slightly; thinking/working: tighten back; idle: standard.
  const radius =
    state === "listening" ? "26%" : state === "thinking" || state === "working" ? "14%" : "18%";
  const stretchX = state === "listening" ? 1.04 : 1;
  const stretchY = state === "listening" ? 0.97 : 1;

  const floatDur = state === "listening" ? 3.2 : state === "thinking" || state === "working" ? 2.6 : 4.4;
  const floatRange = tier === "full" ? (state === "thinking" || state === "working" ? 3 : 2.5) : 0;
  const auraScale =
    state === "thinking" || state === "working"
      ? [1, 1.06, 1]
      : state === "listening"
        ? [1, 1.04, 1]
        : [1, 1.02, 1];
  const auraOpacity =
    state === "thinking" || state === "working" ? 1.05 : state === "listening" ? 1.0 : 0.85;
  const internalSpin = (state === "thinking" || state === "working") && !isStatic && tier === "full";

  const containerW = size + (floating && tier === "full" ? 8 : 0);
  const containerH = size + (floating && tier === "full" ? 14 : 0);

  // Rim arc geometry (working state)
  const arcSize = size * 1.18;
  const arcR = arcSize / 2 - 2;
  const arcCircum = 2 * Math.PI * arcR;
  const arcOffset = arcCircum * (1 - Math.min(100, Math.max(0, progress)) / 100);

  return (
    <motion.span
      layoutId={layoutId}
      className={cn("relative inline-flex items-end justify-center select-none", className)}
      style={{ width: containerW, height: containerH }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
    >
      {/* Ground shadow ellipse (full tier + floating only) */}
      {floating && tier === "full" && (
        <motion.span
          aria-hidden
          animate={
            isStatic
              ? { scaleX: 1, opacity: 0.3 }
              : { scaleX: [1, 0.88, 1], opacity: [0.3, 0.22, 0.3] }
          }
          transition={{ duration: floatDur, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute",
            bottom: 2,
            left: "50%",
            transform: "translateX(-50%)",
            width: size * 0.7,
            height: Math.max(3, size * 0.07),
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(17,20,31,0.26) 0%, rgba(17,20,31,0) 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      <motion.div
        ref={ref}
        className="relative inline-flex items-center justify-center"
        animate={
          isStatic || tier === "compact"
            ? { y: 0 }
            : { y: [0, -floatRange, 0, -floatRange * 0.6, 0] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: size, height: size }}
      >
        {/* Rim progress arc (working state, full tier) */}
        {state === "working" && tier === "full" && (
          <svg
            aria-hidden
            width={arcSize}
            height={arcSize}
            viewBox={`0 0 ${arcSize} ${arcSize}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%) rotate(-90deg)",
              pointerEvents: "none",
            }}
          >
            <circle
              cx={arcSize / 2}
              cy={arcSize / 2}
              r={arcR}
              fill="none"
              stroke="rgba(244, 109, 118, 0.18)"
              strokeWidth={1.5}
            />
            <motion.circle
              cx={arcSize / 2}
              cy={arcSize / 2}
              r={arcR}
              fill="none"
              stroke={CORAL.base}
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeDasharray={arcCircum}
              animate={{ strokeDashoffset: arcOffset }}
              transition={{ type: "spring", stiffness: 60, damping: 20 }}
            />
          </svg>
        )}

        {/* Body lean (cursor reactive) */}
        <motion.div
          animate={{ x: bodyLean.x, y: bodyLean.y, rotate: bodyLean.tilt }}
          transition={{ type: "spring", stiffness: 110, damping: 16 }}
          style={{ position: "relative", width: size, height: size }}
        >
          {/* Aura */}
          {tier === "full" && (
            <motion.div
              aria-hidden
              animate={{
                width: size * 1.1,
                height: size * 1.1,
                borderRadius: radius,
                rotate: baseRotate,
                scale: isStatic ? 1 : auraScale,
              }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                translateX: "-50%",
                translateY: "-50%",
                background: "rgba(244, 109, 118, 0.32)",
                filter: "blur(20px)",
                opacity: auraOpacity,
                pointerEvents: "none",
              }}
            />
          )}

          {/* Body */}
          <motion.div
            animate={{
              width: size,
              height: size,
              borderRadius: radius,
              rotate: internalSpin ? [baseRotate, baseRotate + 360] : baseRotate,
              scaleX: stretchX,
              scaleY: stretchY,
            }}
            transition={
              internalSpin
                ? {
                    rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                    default: { type: "spring", stiffness: 140, damping: 18 },
                  }
                : { type: "spring", stiffness: 140, damping: 18 }
            }
            style={{
              background: `radial-gradient(circle at 50% 38%, ${CORAL.light} 0%, #f57780 42%, ${CORAL.base} 78%, ${CORAL.deep} 100%)`,
              position: "relative",
              boxShadow:
                tier === "full"
                  ? "0 26px 64px -28px rgba(244,109,118,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "inset 0 1px 0 rgba(255,255,255,0.22)",
              overflow: "hidden",
            }}
          >
            {/* Inner highlight (top-left soft white) */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(circle at 28% 22%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%)",
                pointerEvents: "none",
              }}
            />

            {/* Periwinkle rim-light (subtle palette tie-in) */}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: radius,
                boxShadow: "inset 0 0 0 1px rgba(167, 174, 242, 0.18)",
                pointerEvents: "none",
              }}
            />

            {/* Liquid swirl for thinking/working (full tier only) */}
            {(state === "thinking" || state === "working") && tier === "full" && !isStatic && (
              <motion.div
                aria-hidden
                animate={{ rotate: [-baseRotate, -baseRotate - 360] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", inset: 0 }}
              >
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <motion.path
                    fill="rgba(255,255,255,0.12)"
                    animate={{
                      d: [
                        "M30,50 Q50,20 70,50 Q50,80 30,50 Z",
                        "M28,52 Q52,28 72,48 Q48,78 28,52 Z",
                        "M32,48 Q48,22 68,52 Q52,82 32,48 Z",
                        "M30,50 Q50,20 70,50 Q50,80 30,50 Z",
                      ],
                    }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                </svg>
              </motion.div>
            )}
          </motion.div>

          {/* Speaking ripple */}
          {state === "speaking" && tier === "full" && !isStatic && (
            <motion.span
              aria-hidden
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 1.45, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: size,
                height: size,
                borderRadius: radius,
                border: `1px solid ${CORAL.base}`,
                transform: `translate(-50%, -50%) rotate(${baseRotate}deg)`,
                pointerEvents: "none",
              }}
            />
          )}
        </motion.div>
      </motion.div>
    </motion.span>
  );
}

export default AanMascot;
