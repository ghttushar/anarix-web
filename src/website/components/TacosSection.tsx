import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * Editorial 3/4-view taco illustration with a soft, dimensional quality
 * inspired by sculpted 3D references but executed as refined layered SVG.
 * A bite is removed from the upper-right (~30% of the silhouette) via an
 * animated mask. Sits in a side-by-side layout with a typographic poster.
 */
const BittenTaco = ({ progress }: { progress: number }) => {
  const biteRx = 96 * progress;
  const biteRy = 86 * progress;
  const crumbT = Math.max(0, (progress - 0.55) / 0.45);

  return (
    <div className="relative w-full max-w-[640px] mx-auto aspect-[420/320]">
      <svg
        viewBox="0 0 420 320"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Taco with a 30% bite removed"
      >
        <defs>
          {/* Bite mask: white reveals, black hides */}
          <mask id="taco-bite-mask">
            <rect width="420" height="320" fill="white" />
            <ellipse
              cx="318"
              cy="92"
              rx={biteRx}
              ry={biteRy}
              fill="black"
              transform="rotate(-16 318 92)"
            />
          </mask>

          {/* Ambient floor glow */}
          <radialGradient id="taco-ambient" cx="50%" cy="60%" r="55%">
            <stop offset="0%" stopColor="hsl(36 70% 70%)" stopOpacity="0.14" />
            <stop offset="70%" stopColor="hsl(36 70% 70%)" stopOpacity="0" />
          </radialGradient>

          {/* Soft contact shadow */}
          <radialGradient id="taco-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(var(--foreground))" stopOpacity="0.22" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" stopOpacity="0" />
          </radialGradient>

          {/* Shell volumetric gradient */}
          <linearGradient id="shell-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(38 72% 78%)" />
            <stop offset="55%" stopColor="hsl(34 62% 62%)" />
            <stop offset="100%" stopColor="hsl(30 50% 48%)" />
          </linearGradient>

          {/* Inner shell shadow */}
          <linearGradient id="shell-inner-shadow" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(28 45% 36%)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(28 45% 36%)" stopOpacity="0" />
          </linearGradient>

          {/* Highlight sheen */}
          <linearGradient id="shell-sheen" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(48 100% 96%)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(48 100% 96%)" stopOpacity="0" />
          </linearGradient>

          {/* Lettuce volumetric */}
          <linearGradient id="lettuce-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(135 38% 58%)" />
            <stop offset="100%" stopColor="hsl(140 32% 42%)" />
          </linearGradient>
          <linearGradient id="lettuce-back" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(140 30% 38%)" />
            <stop offset="100%" stopColor="hsl(142 28% 30%)" />
          </linearGradient>

          {/* Tomato volumetric */}
          <linearGradient id="tomato-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(8 70% 60%)" />
            <stop offset="100%" stopColor="hsl(6 58% 44%)" />
          </linearGradient>
        </defs>

        {/* Ambient floor glow */}
        <ellipse cx="210" cy="220" rx="200" ry="80" fill="url(#taco-ambient)" />

        {/* Soft contact shadow */}
        <ellipse cx="210" cy="270" rx="170" ry="14" fill="url(#taco-shadow)" />

        <g mask="url(#taco-bite-mask)">
          {/* Back rim — darker ochre peeking above filling */}
          <path
            d="M52 244 Q 210 12 368 244 Z"
            fill="hsl(28 50% 44%)"
          />

          {/* Inner shell shadow band (gives the back wall depth) */}
          <path
            d="M70 236 Q 210 40 350 236 Z"
            fill="url(#shell-inner-shadow)"
          />

          {/* Filling group */}
          <g>
            {/* Cream backdrop */}
            <path
              d="M82 232 Q 210 80 338 232 Z"
              fill="hsl(40 36% 93%)"
            />

            {/* Lettuce — back layer for depth */}
            <path
              d="M84 226
                 Q 110 184 138 208
                 Q 162 174 190 202
                 Q 218 168 246 202
                 Q 274 174 302 208
                 Q 328 184 336 226 Z"
              fill="url(#lettuce-back)"
              opacity="0.95"
            />
            {/* Lettuce — front ribbon */}
            <path
              d="M88 222
                 Q 116 178 144 204
                 Q 168 168 196 198
                 Q 224 164 252 198
                 Q 280 170 308 204
                 Q 326 184 332 222 Z"
              fill="url(#lettuce-grad)"
            />

            {/* Cheese strands — shadow then highlight */}
            <g strokeLinecap="round" fill="none">
              <g stroke="hsl(34 50% 38%)" strokeWidth="3" opacity="0.35">
                <line x1="106" y1="212" x2="100" y2="240" />
                <line x1="138" y1="206" x2="136" y2="242" />
                <line x1="172" y1="202" x2="174" y2="242" />
                <line x1="210" y1="198" x2="210" y2="244" />
                <line x1="248" y1="202" x2="250" y2="242" />
                <line x1="284" y1="206" x2="286" y2="242" />
                <line x1="316" y1="212" x2="320" y2="240" />
              </g>
              <g stroke="hsl(42 78% 62%)" strokeWidth="2.5" opacity="0.92">
                <line x1="104" y1="210" x2="98" y2="238" />
                <line x1="136" y1="204" x2="134" y2="240" />
                <line x1="170" y1="200" x2="172" y2="240" />
                <line x1="208" y1="196" x2="208" y2="242" />
                <line x1="246" y1="200" x2="248" y2="240" />
                <line x1="282" y1="204" x2="284" y2="240" />
                <line x1="314" y1="210" x2="318" y2="238" />
              </g>
            </g>

            {/* Tomato dice with highlight */}
            <g>
              {[
                { x: 124, y: 206, r: 8, rot: 8 },
                { x: 178, y: 200, r: 9, rot: -6 },
                { x: 230, y: 204, r: 9, rot: 12 },
                { x: 280, y: 208, r: 8, rot: -10 },
              ].map((t, i) => (
                <g key={i} transform={`rotate(${t.rot} ${t.x + t.r / 2} ${t.y + t.r / 2})`}>
                  <rect
                    x={t.x}
                    y={t.y}
                    width={t.r + 2}
                    height={t.r + 2}
                    rx="2"
                    fill="url(#tomato-grad)"
                  />
                  <rect
                    x={t.x + 1.5}
                    y={t.y + 1}
                    width={2.5}
                    height={1.5}
                    rx="0.8"
                    fill="hsl(20 100% 88%)"
                    opacity="0.7"
                  />
                </g>
              ))}
            </g>
          </g>

          {/* Front shell (defines silhouette + volume) */}
          <path
            d="M52 244
               Q 210 12 368 244
               L 352 248
               Q 210 38 68 248 Z"
            fill="url(#shell-grad)"
          />

          {/* Highlight sheen along upper outer edge */}
          <path
            d="M62 240 Q 210 30 358 240 L 348 244 Q 210 56 72 244 Z"
            fill="url(#shell-sheen)"
          />

          {/* Shell texture lines — subtle corn-tortilla grain */}
          <g stroke="hsl(28 42% 38%)" strokeWidth="1.2" fill="none" opacity="0.32" strokeLinecap="round">
            <path d="M82 232 Q 210 50 338 232" />
            <path d="M96 220 Q 210 70 324 220" />
            <path d="M114 206 Q 210 92 306 206" />
          </g>

          {/* Speckle grain */}
          <g fill="hsl(28 42% 32%)" opacity="0.35">
            <circle cx="120" cy="200" r="0.9" />
            <circle cx="158" cy="160" r="0.8" />
            <circle cx="196" cy="120" r="0.9" />
            <circle cx="240" cy="118" r="0.8" />
            <circle cx="282" cy="158" r="0.9" />
            <circle cx="318" cy="208" r="0.8" />
            <circle cx="98" cy="222" r="0.7" />
            <circle cx="340" cy="222" r="0.7" />
          </g>

          {/* Outer ink outline */}
          <path
            d="M52 244 Q 210 12 368 244"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2.2"
            strokeOpacity="0.78"
            strokeLinecap="round"
          />
          <path
            d="M52 244 L 368 244"
            fill="none"
            stroke="hsl(var(--foreground))"
            strokeWidth="2"
            strokeOpacity="0.55"
            strokeLinecap="round"
          />
        </g>

        {/* Bite-edge inner rim — suggests shell cross-section thickness */}
        {progress > 0.05 && (
          <>
            <ellipse
              cx="318"
              cy="92"
              rx={biteRx}
              ry={biteRy}
              transform="rotate(-16 318 92)"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeOpacity="0.22"
              strokeWidth="1.5"
            />
            <ellipse
              cx="318"
              cy="92"
              rx={Math.max(0, biteRx - 4)}
              ry={Math.max(0, biteRy - 4)}
              transform="rotate(-16 318 92)"
              fill="none"
              stroke="hsl(var(--foreground))"
              strokeOpacity="0.08"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          </>
        )}

        {/* Crumbs — five varied specks */}
        <g fill="hsl(30 50% 48%)">
          {[
            { x: 296, y: 130, dy: 32, delay: 0, r: 2.4 },
            { x: 320, y: 142, dy: 44, delay: 0.12, r: 2.0 },
            { x: 274, y: 152, dy: 50, delay: 0.24, r: 2.6 },
            { x: 340, y: 164, dy: 38, delay: 0.34, r: 1.8 },
            { x: 256, y: 138, dy: 56, delay: 0.42, r: 1.6 },
          ].map((c, i) => {
            const t = Math.max(0, Math.min(1, crumbT - c.delay));
            const ease = 1 - Math.pow(1 - t, 2);
            return (
              <circle
                key={i}
                cx={c.x}
                cy={c.y + c.dy * ease}
                r={c.r}
                opacity={t > 0 ? 1 - t : 0}
              />
            );
          })}
        </g>

        {/* Hairline leader from medallion to bite edge */}
        {progress > 0.5 && (
          <line
            x1="384"
            y1="58"
            x2="346"
            y2="78"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        )}
      </svg>

      {/* 30% medallion — anchored above the bite */}
      <div
        className="absolute"
        style={{
          top: "4%",
          right: "2%",
          opacity: Math.max(0, (progress - 0.35) / 0.65),
          transform: `translateY(${(1 - Math.min(1, progress)) * 8}px)`,
        }}
      >
        <div className="flex items-center justify-center w-[88px] h-[88px] rounded-full border border-foreground/30 bg-background/80">
          <div className="flex flex-col items-center leading-none">
            <div className="flex items-baseline">
              <span className="text-3xl font-bold text-foreground tabular-nums">
                {Math.round(progress * 30)}
              </span>
              <span className="text-base font-semibold text-muted-foreground ml-0.5">%</span>
            </div>
            <div className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground mt-1.5">
              bite
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TacosSection = () => {
  const { ref, isVisible } = useScrollReveal(0.3);
  const [progress, setProgress] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1400;
    const start = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 4);

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      setProgress(easeOut(t));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isVisible]);

  const stats = [
    { value: "30%", label: "avg TACoS reduction" },
    { value: "90 days", label: "typical timeline" },
    { value: "100+", label: "brands operated" },
  ];

  return (
    <section ref={ref} className="py-24 sm:py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Illustration — left 60% */}
          <motion.div
            className="lg:col-span-7 order-1"
            initial={{ opacity: 0, y: 12 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
          >
            <BittenTaco progress={progress} />
          </motion.div>

          {/* Editorial poster — right 40% */}
          <div className="lg:col-span-5 order-2">
            <motion.p
              className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-6"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
            >
              TACoS · Total Advertising Cost of Sales
            </motion.p>

            <motion.h2
              className="text-4xl sm:text-5xl xl:text-6xl font-bold text-foreground leading-[1.05] tracking-tight"
              initial={{ opacity: 0, y: 12 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6, ease: [0.2, 0, 0, 1] }}
            >
              We take a{" "}
              <span className="text-gradient-primary tabular-nums">
                {Math.round(progress * 30)}%
              </span>{" "}
              bite out of yours.
            </motion.h2>

            <motion.p
              className="text-base sm:text-lg text-muted-foreground mt-6 leading-relaxed max-w-md"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              One bite for us. The rest stays on your plate. TACoS is the
              ad-spend ratio your CFO actually cares about — and we're built
              to shrink it.
            </motion.p>

            <motion.div
              className="mt-10 flex items-stretch gap-6"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.85, duration: 0.6 }}
            >
              {stats.map((s, i) => (
                <div key={s.label} className="flex items-stretch gap-6">
                  {i > 0 && <div className="w-px bg-border" />}
                  <div className="flex flex-col">
                    <span className="text-xl sm:text-2xl font-semibold text-foreground tabular-nums leading-none">
                      {s.value}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mt-2">
                      {s.label}
                    </span>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TacosSection;
