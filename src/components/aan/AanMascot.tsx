import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type AanMascotState = "idle" | "listening" | "thinking" | "working" | "speaking" | "anchor";
export type AanMascotShape = "diamond" | "circle" | "bar" | "cube";

interface AanMascotProps {
  state?: AanMascotState;
  /** Deprecated. Shape is now derived from state per the brand manual. Retained for back-compat. */
  shape?: AanMascotShape;
  size?: number;
  interactive?: boolean;
  floating?: boolean;
  progress?: number;
  layoutId?: string;
  className?: string;
}

const CORAL = {
  base: "#f46d76",
  light: "#f88a93",
  deep: "#f05e6a",
};

// Brand manual: state IS shape.
// idle/anchor → diamond, listening → circle, thinking → cube, working → bar, speaking → diamond
function deriveShape(state: AanMascotState, override?: AanMascotShape): AanMascotShape {
  if (override) return override;
  if (state === "listening") return "circle";
  if (state === "thinking") return "cube";
  if (state === "working") return "bar";
  return "diamond"; // idle, anchor, speaking
}

export function AanMascot({
  state = "idle",
  shape: shapeOverride,
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
  const [eyeGaze, setEyeGaze] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [petTilt, setPetTilt] = useState(0);
  const [blinkKey, setBlinkKey] = useState(0);

  const shape = deriveShape(state, shapeOverride);
  const tier: "micro" | "compact" | "full" = size < 24 ? "micro" : size <= 40 ? "compact" : "full";
  const isStatic = state === "anchor" || reduceMotion;
  const trackCursor = interactive && !isStatic && tier === "full" && shape !== "bar";
  const showEyes =
    tier === "full" &&
    !reduceMotion &&
    shape !== "bar" &&
    (state === "idle" || state === "listening" || state === "speaking");

  // Cursor tracking — body lean + eye gaze
  useEffect(() => {
    if (!trackCursor) {
      setBodyLean({ x: 0, y: 0, tilt: 0 });
      setEyeGaze({ x: 0, y: 0 });
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
      const eyeRange = size * 0.06;
      const eyeDist = Math.min(1, Math.hypot(dx, dy) / 260);
      setEyeGaze({
        x: Math.cos(angle) * eyeDist * eyeRange,
        y: Math.sin(angle) * eyeDist * eyeRange,
      });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [size, trackCursor]);

  // Hover-petting tilt
  useEffect(() => {
    if (!hovered || !trackCursor) {
      setPetTilt(0);
      return;
    }
    const handler = (event: MouseEvent) => {
      const node = ref.current;
      if (!node) return;
      const bounds = node.getBoundingClientRect();
      const cx = bounds.left + bounds.width / 2;
      const rel = (event.clientX - cx) / (bounds.width / 2);
      setPetTilt(Math.max(-1, Math.min(1, rel)) * 10);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, [hovered, trackCursor]);

  // Blink — random interval, idle only
  useEffect(() => {
    if (!showEyes || state !== "idle") return;
    let cancelled = false;
    const schedule = () => {
      const delay = 4000 + Math.random() * 4000;
      const t = setTimeout(() => {
        if (cancelled) return;
        setBlinkKey((k) => k + 1);
        schedule();
      }, delay);
      return t;
    };
    const t = schedule();
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [showEyes, state]);

  // ---------- MICRO TIER (<24px) ----------
  if (tier === "micro") {
    const microRadius =
      shape === "circle" ? "50%" : shape === "bar" ? "999px" : "30%";
    const microW = shape === "bar" ? size * 1.6 : size;
    const microH = shape === "bar" ? size * 0.5 : size;
    return (
      <motion.span
        layoutId={layoutId}
        className={cn("inline-block shrink-0", className)}
        animate={{ width: microW, height: microH, borderRadius: microRadius }}
        transition={{ type: "spring", stiffness: 200, damping: 24 }}
        style={{
          background: `linear-gradient(140deg, ${CORAL.light} 0%, ${CORAL.base} 60%, ${CORAL.deep} 100%)`,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
        }}
      />
    );
  }

  // ---------- Shape-driven geometry ----------
  const baseRotate = shape === "diamond" ? 45 : 0;
  const hoverBoost = hovered && tier === "full" && shape === "diamond" ? 1 : 0;
  const radius =
    shape === "circle"
      ? "50%"
      : shape === "bar"
        ? "999px"
        : shape === "cube"
          ? "16%"
          : hoverBoost
            ? "30%"
            : "18%";

  // Body dimensions per shape
  const bodyW =
    shape === "bar" ? size * 1.8 : shape === "cube" ? size * 0.92 : size;
  const bodyH =
    shape === "bar" ? size * 0.34 : shape === "cube" ? size * 0.92 : size;

  // Stretch on hover (diamond only)
  const stretchX = hoverBoost ? 1.06 : 1;
  const stretchY = hoverBoost ? 0.95 : 1;

  const floatDur = state === "listening" ? 3.2 : state === "thinking" || state === "working" ? 2.6 : 4.4;
  const floatRange = tier === "full" && shape !== "bar" ? (state === "thinking" ? 3 : 2.5) : 0;
  const auraScale =
    shape === "bar"
      ? [1, 1.02, 1]
      : state === "thinking" || state === "working"
        ? [1, 1.06, 1]
        : state === "listening"
          ? [1, 1.04, 1]
          : [1, 1.02, 1];
  const auraOpacity =
    shape === "bar" ? 0.55 : state === "thinking" || state === "working" ? 1.05 : state === "listening" ? 1.0 : 0.85;
  const internalSpin = state === "thinking" && !isStatic && tier === "full";

  // Container must accommodate the widest body shape (bar) to avoid clipping
  const slotW = Math.max(size, bodyW);
  const slotH = Math.max(size, bodyH);
  const containerW = slotW + (floating && tier === "full" ? 8 : 0);
  const containerH = slotH + (floating && tier === "full" ? 14 : 0);

  // Eyes
  const eyeSize = Math.max(3, size * 0.085);
  const eyeOffsetX = shape === "circle" ? size * 0.13 : size * 0.11;
  const eyeY = shape === "diamond" ? size * 0.04 : 0;
  const eyeTravel = size * 0.035;

  // Bar progress fill (working state)
  const barProgress = Math.max(0, Math.min(100, progress));

  return (
    <motion.span
      layout
      layoutId={layoutId}
      className={cn("relative inline-flex items-end justify-center select-none", className)}
      animate={{ width: containerW, height: containerH }}
      transition={{ type: "spring", stiffness: 180, damping: 22 }}
      style={{ width: containerW, height: containerH }}
    >
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
            width: bodyW * 0.7,
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
        onMouseEnter={() => trackCursor && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={
          isStatic || tier === "compact"
            ? { y: 0 }
            : { y: [0, -floatRange, 0, -floatRange * 0.6, 0] }
        }
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: slotW, height: slotH }}
      >
        <motion.div
          animate={{ x: bodyLean.x, y: bodyLean.y, rotate: bodyLean.tilt + petTilt }}
          transition={{ type: "spring", stiffness: 110, damping: 16 }}
          style={{ position: "relative", width: slotW, height: slotH }}
        >
          {/* Aura */}
          {tier === "full" && (
            <motion.div
              aria-hidden
              animate={{
                width: bodyW * 1.1,
                height: bodyH * 1.1,
                borderRadius: radius,
                rotate: baseRotate,
                scale: isStatic ? 1 : auraScale,
              }}
              transition={{
                width: { type: "spring", stiffness: 160, damping: 22 },
                height: { type: "spring", stiffness: 160, damping: 22 },
                borderRadius: { type: "spring", stiffness: 160, damping: 22 },
                rotate: { type: "spring", stiffness: 140, damping: 20 },
                scale: { duration: 3.2, repeat: Infinity, ease: "easeInOut" },
              }}
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

          {/* Body — morphs between diamond / circle / cube / bar */}
          <motion.div
            animate={{
              width: bodyW,
              height: bodyH,
              borderRadius: radius,
              rotate: internalSpin ? [baseRotate, baseRotate + 360] : baseRotate,
              scaleX: stretchX,
              scaleY: stretchY,
            }}
            transition={
              internalSpin
                ? {
                    rotate: { duration: 5, repeat: Infinity, ease: "linear" },
                    width: { type: "spring", stiffness: 140, damping: 20 },
                    height: { type: "spring", stiffness: 140, damping: 20 },
                    borderRadius: { type: "spring", stiffness: 140, damping: 20 },
                    default: { type: "spring", stiffness: 140, damping: 20 },
                  }
                : { type: "spring", stiffness: 140, damping: 20 }
            }
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              translateX: "-50%",
              translateY: "-50%",
              background:
                shape === "bar"
                  ? `linear-gradient(180deg, rgba(244,109,118,0.18) 0%, rgba(244,109,118,0.28) 100%)`
                  : `radial-gradient(circle at 50% 38%, ${CORAL.light} 0%, #f57780 42%, ${CORAL.base} 78%, ${CORAL.deep} 100%)`,
              boxShadow:
                tier === "full"
                  ? "0 26px 64px -28px rgba(244,109,118,0.5), inset 0 1px 0 rgba(255,255,255,0.2)"
                  : "inset 0 1px 0 rgba(255,255,255,0.22)",
              overflow: "hidden",
            }}
          >
            {/* Sheen */}
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
            {/* Inner periwinkle ring */}
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

            {/* Bar progress fill (working state) */}
            {shape === "bar" && tier === "full" && (
              <motion.div
                aria-hidden
                animate={{ width: `${barProgress}%` }}
                transition={{ type: "spring", stiffness: 60, damping: 20 }}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: "100%",
                  borderRadius: 999,
                  background: `linear-gradient(90deg, ${CORAL.deep} 0%, ${CORAL.base} 60%, ${CORAL.light} 100%)`,
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,0.45), 0 0 12px -2px rgba(244,109,118,0.55)",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Liquid swirl — thinking state */}
            {state === "thinking" && tier === "full" && !isStatic && (
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

          {/* Eyes — overlay, always upright */}
          {showEyes && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: size,
                  height: size,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {[-1, 1].map((dir) => {
                  const gx = Math.max(-eyeTravel, Math.min(eyeTravel, eyeGaze.x));
                  const gy = Math.max(-eyeTravel, Math.min(eyeTravel, eyeGaze.y));
                  return (
                    <motion.div
                      key={`eye-${dir}`}
                      animate={{ x: gx, y: gy }}
                      transition={{ type: "spring", stiffness: 120, damping: 18 }}
                      style={{
                        position: "absolute",
                        left: `calc(50% + ${dir * eyeOffsetX}px)`,
                        top: `calc(50% + ${eyeY}px)`,
                        width: eyeSize,
                        height: eyeSize,
                        marginLeft: -eyeSize / 2,
                        marginTop: -eyeSize / 2,
                      }}
                    >
                      <motion.div
                        key={`blink-${dir}-${blinkKey}`}
                        animate={{ scaleY: [1, 0.05, 1] }}
                        transition={{ duration: 0.16, times: [0, 0.5, 1], ease: "easeOut" }}
                        style={{
                          width: eyeSize,
                          height: eyeSize,
                          borderRadius: "50%",
                          background: "#1a0608",
                        }}
                      />
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

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
                width: bodyW,
                height: bodyH,
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
