import { useRef, useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HappyUsersSection = () => {
  const { ref: sectionRef, isVisible } = useScrollReveal();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  const rotateX = isHovering ? (mousePos.y - 0.5) * -18 : 0;
  const rotateY = isHovering ? (mousePos.x - 0.5) * 18 : 0;

  // Conic gradient angle from card center
  const conicAngle = useMemo(() => {
    const dx = mousePos.x - 0.5;
    const dy = mousePos.y - 0.5;
    return (Math.atan2(dy, dx) * 180) / Math.PI + 180;
  }, [mousePos]);

  // Hue shift for border
  const hueShift = useMemo(() => Math.round(conicAngle), [conicAngle]);

  return (
    <section ref={sectionRef} className="py-24 sm:py-32 bg-background overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.h2
          className="font-display text-3xl sm:text-5xl lg:text-6xl font-semibold mb-16 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-gradient-primary italic">Lots of happy operators</span>{" "}
          <span className="text-foreground">plus you.</span>
        </motion.h2>

        <div className="relative inline-block">
          {/* Hover Me label */}
          <motion.div
            className="absolute -left-28 sm:-left-36 top-1/3 flex items-center gap-1.5 select-none"
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 0.6 } : {}}
            transition={{ delay: 0.6 }}
          >
            <motion.span
              className="text-muted-foreground text-xs sm:text-sm tracking-wide"
              style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Hover Me
            </motion.span>
            <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="text-muted-foreground/50">
              <path
                d="M2 20 C8 20, 16 16, 24 8 C26 6, 28 4, 30 2"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                strokeLinecap="round"
              />
              <path d="M26 1 L30 2 L28 5.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" />
            </svg>
          </motion.div>

          {/* 3D Card */}
          <div style={{ perspective: "900px" }}>
            <motion.div
              ref={cardRef}
              className="relative w-[280px] sm:w-[320px] h-[400px] sm:h-[440px] rounded-2xl overflow-hidden cursor-pointer mx-auto"
              style={{
                background: "linear-gradient(145deg, hsl(232, 40%, 12%), hsl(232, 35%, 8%))",
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
              animate={{ rotateX, rotateY }}
              transition={{ type: "spring", stiffness: 200, damping: 22 }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => { setIsHovering(false); setMousePos({ x: 0.5, y: 0.5 }); }}
            >
              {/* Card content */}
              <div className="relative z-10 flex flex-col h-full pt-8 pb-0 px-6">
                {/* Centered heading */}
                <div className="text-center">
                  <h3 className="font-display text-3xl font-semibold text-white tracking-tight">You</h3>
                  <p className="text-sm text-white/50 mt-1 italic">Marketplace Operator, DTC Brand</p>
                </div>

                {/* Large silhouette */}
                <div className="flex-1 flex items-end justify-center overflow-hidden">
                  <svg
                    viewBox="0 0 200 260"
                    className="w-[160px] sm:w-[180px] h-auto opacity-90"
                    fill="none"
                  >
                    <defs>
                      <linearGradient id="silhouetteGrad" x1="100" y1="0" x2="100" y2="260" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="hsl(245, 40%, 28%)" />
                        <stop offset="60%" stopColor="hsl(232, 38%, 16%)" />
                        <stop offset="100%" stopColor="hsl(232, 35%, 8%)" />
                      </linearGradient>
                    </defs>
                    {/* Head */}
                    <ellipse cx="100" cy="48" rx="34" ry="40" fill="url(#silhouetteGrad)" />
                    {/* Neck */}
                    <rect x="86" y="85" width="28" height="20" rx="6" fill="url(#silhouetteGrad)" />
                    {/* Shoulders + torso */}
                    <path
                      d="M100 105 C100 105, 60 108, 30 130 C16 140, 8 155, 4 175 L4 260 L196 260 L196 175 C192 155, 184 140, 170 130 C140 108, 100 105, 100 105Z"
                      fill="url(#silhouetteGrad)"
                    />
                  </svg>
                </div>

                {/* Frosted bottom bar */}
                <div
                  className="flex items-center gap-3 px-4 py-3 -mx-6 mt-auto"
                  style={{
                    background: "hsla(232, 35%, 12%, 0.6)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                  }}
                >
                  {/* Avatar circle */}
                  <div className="w-8 h-8 rounded-full shrink-0 bg-aan-gradient" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs text-white/70 font-medium leading-tight">@operator</span>
                    <span className="text-[11px] text-white/40 leading-tight">DTC Brand · Amazon + Shopify</span>
                  </div>
                  <button
                    className="ml-auto px-4 py-1.5 rounded-full text-xs font-medium text-white/90 transition-colors shrink-0"
                    style={{
                      background: "hsla(0, 0%, 100%, 0.12)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    Talk to Aan
                  </button>
                </div>
              </div>

              {/* Full-card conic gradient overlay - vivid prismatic */}
              <div
                className="absolute inset-0 z-20 pointer-events-none rounded-2xl transition-opacity duration-500"
                style={{
                  opacity: isHovering ? 1 : 0,
                  background: `conic-gradient(from ${conicAngle}deg at 50% 50%, 
                    hsla(180, 95%, 60%, 0.4),
                    hsla(280, 95%, 60%, 0.38),
                    hsla(50, 95%, 60%, 0.38),
                    hsla(120, 95%, 60%, 0.4),
                    hsla(180, 95%, 60%, 0.4)
                  )`,
                  mixBlendMode: "hard-light",
                }}
              />

              {/* Secondary linear sweep for extra depth */}
              <div
                className="absolute inset-0 z-20 pointer-events-none rounded-2xl transition-opacity duration-700"
                style={{
                  opacity: isHovering ? 0.5 : 0,
                  background: `linear-gradient(${conicAngle + 90}deg, 
                    hsla(300, 90%, 65%, 0.15),
                    transparent 40%,
                    hsla(180, 90%, 65%, 0.15) 60%,
                    transparent
                  )`,
                  mixBlendMode: "screen",
                }}
              />

              {/* Radial hot spot at cursor */}
              <div
                className="absolute inset-0 z-20 pointer-events-none rounded-2xl transition-opacity duration-300"
                style={{
                  opacity: isHovering ? 1 : 0,
                  background: `radial-gradient(circle 120px at ${mousePos.x * 100}% ${mousePos.y * 100}%, 
                    hsla(0, 0%, 100%, 0.25),
                    hsla(280, 80%, 80%, 0.1) 40%,
                    transparent 70%
                  )`,
                  mixBlendMode: "overlay",
                }}
              />

              {/* Border glow */}
              <div
                className="absolute inset-0 z-20 pointer-events-none rounded-2xl transition-opacity duration-500"
                style={{
                  opacity: isHovering ? 1 : 0,
                  boxShadow: `inset 0 0 0 1.5px hsla(${hueShift}, 70%, 65%, 0.5), 0 0 40px -8px hsla(${hueShift}, 70%, 60%, 0.35)`,
                }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HappyUsersSection;
