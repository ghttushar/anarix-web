import tacoSvgRaw from "@/assets/illustrations/taco.svg?raw";

// Extract the inner contents of the OBJECTS group so we can wrap them
// with our own mask + crumb overlays.
const innerMatch = tacoSvgRaw.match(/<g id="OBJECTS">([\s\S]*?)<\/g>\s*<g id="TEXTS">/);
const tacoInner = innerMatch ? innerMatch[1] : "";

interface Props {
  progress: number; // 0 -> 1
}

/**
 * Layered editorial taco illustration imported from a hand-drawn SVG.
 * Animates a 30% bite removal from the upper-right via an SVG mask,
 * then drops crumbs and reveals a "30% bite" medallion + ingredient
 * orbit lines.
 */
const TacoIllustration = ({ progress }: Props) => {
  // Bite mask geometry in source 500x500 viewBox, anchored upper-right of shell
  const biteRx = 130 * progress;
  const biteRy = 110 * progress;
  const biteCx = 360;
  const biteCy = 250;
  const crumbT = Math.max(0, (progress - 0.55) / 0.45);

  // Orbit line dash reveal (the dashed lines around the taco)
  const orbitOffset = 200 * (1 - Math.min(1, Math.max(0, (progress - 0.6) / 0.4)));

  return (
    <div className="relative w-full max-w-[640px] mx-auto aspect-square">
      <svg
        viewBox="0 0 500 500"
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="A taco with a 30% bite removed"
      >
        <defs>
          <mask id="taco-bite-mask-real">
            <rect width="500" height="500" fill="white" />
            <ellipse
              cx={biteCx}
              cy={biteCy}
              rx={biteRx}
              ry={biteRy}
              fill="black"
              transform={`rotate(-22 ${biteCx} ${biteCy})`}
            />
          </mask>

          <filter id="taco-shadow-tight" x="-20%" y="-400%" width="140%" height="900%">
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id="taco-shadow-mid" x="-20%" y="-400%" width="140%" height="900%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id="taco-shadow-wide" x="-20%" y="-400%" width="140%" height="900%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        {/* Layered editorial ground shadow — token-driven, no warm halo */}
        <g>
          <ellipse cx="250" cy="430" rx="220" ry="22" fill="hsl(var(--foreground))" fillOpacity="0.06" filter="url(#taco-shadow-wide)" />
          <ellipse cx="250" cy="430" rx="170" ry="14" fill="hsl(var(--foreground))" fillOpacity="0.14" filter="url(#taco-shadow-mid)" />
          <ellipse cx="250" cy="432" rx="120" ry="6" fill="hsl(var(--foreground))" fillOpacity="0.28" filter="url(#taco-shadow-tight)" />
        </g>

        {/* The hand-drawn taco itself, masked for the bite */}
        <g
          mask="url(#taco-bite-mask-real)"
          dangerouslySetInnerHTML={{ __html: tacoInner }}
        />

        {/* Bite-edge inner rim — implies shell cross-section */}
        {progress > 0.05 && (
          <>
            <ellipse
              cx={biteCx}
              cy={biteCy}
              rx={biteRx}
              ry={biteRy}
              transform={`rotate(-22 ${biteCx} ${biteCy})`}
              fill="none"
              stroke="#381F0E"
              strokeOpacity="0.55"
              strokeWidth="2"
            />
            <ellipse
              cx={biteCx}
              cy={biteCy}
              rx={Math.max(0, biteRx - 6)}
              ry={Math.max(0, biteRy - 6)}
              transform={`rotate(-22 ${biteCx} ${biteCy})`}
              fill="none"
              stroke="#381F0E"
              strokeOpacity="0.18"
              strokeWidth="1"
              strokeDasharray="3 5"
            />
          </>
        )}

        {/* Crumbs falling away from the bite */}
        <g>
          {[
            { x: 330, y: 200, dy: 60, delay: 0, r: 4, fill: "#FFC629" },
            { x: 380, y: 220, dy: 80, delay: 0.1, r: 3, fill: "#F2721B" },
            { x: 300, y: 240, dy: 90, delay: 0.2, r: 4.5, fill: "#7AA833" },
            { x: 410, y: 260, dy: 70, delay: 0.3, r: 3.5, fill: "#FFC629" },
            { x: 280, y: 220, dy: 100, delay: 0.4, r: 3, fill: "#D34636" },
            { x: 360, y: 280, dy: 50, delay: 0.5, r: 2.8, fill: "#F2721B" },
          ].map((c, i) => {
            const t = Math.max(0, Math.min(1, crumbT - c.delay));
            const ease = 1 - Math.pow(1 - t, 2);
            return (
              <circle
                key={i}
                cx={c.x + ease * 16}
                cy={c.y + c.dy * ease}
                r={c.r}
                fill={c.fill}
                stroke="#381F0E"
                strokeWidth="1"
                opacity={t > 0 ? 1 - t * 0.85 : 0}
              />
            );
          })}
        </g>

        {/* Animate the orbit lines (dashed strokes already in the SVG live in another <g>; we re-emphasise with a single subtle ring reveal) */}
        <g
          stroke="#381F0E"
          strokeOpacity="0.18"
          strokeWidth="1"
          fill="none"
          strokeDasharray="200"
          strokeDashoffset={orbitOffset}
          style={{ transition: "stroke-dashoffset 200ms linear" }}
        >
          <path d="M60 360 Q 250 460 440 360" />
        </g>

        {/* Hairline leader from medallion to bite edge */}
        {progress > 0.6 && (
          <line
            x1="455"
            y1="120"
            x2="410"
            y2="200"
            stroke="hsl(var(--foreground))"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
        )}
      </svg>

      {/* 30% medallion */}
      <div
        className="absolute"
        style={{
          top: "8%",
          right: "4%",
          opacity: Math.max(0, (progress - 0.35) / 0.65),
          transform: `translateY(${(1 - Math.min(1, progress)) * 10}px)`,
          transition: "opacity 200ms linear",
        }}
      >
        <div className="flex items-center justify-center w-[96px] h-[96px] rounded-full border border-foreground/30 bg-background/90 shadow-sm">
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

export default TacoIllustration;
