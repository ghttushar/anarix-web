import { cn } from "@/lib/utils";

type Variant = "grid" | "orbits" | "noise" | "topography";

interface Props {
  variant?: Variant;
  className?: string;
}

/**
 * Static, token-driven decorative backdrop. No animation loops — respects
 * Section 9 motion limits. Use behind hero/feature sections.
 */
export default function AmbientBackdrop({ variant = "grid", className }: Props) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden -z-10",
        className
      )}
    >
      {variant === "grid" && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.06] text-foreground" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="ab-grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ab-grid)" />
        </svg>
      )}

      {variant === "orbits" && (
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full text-primary">
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.18">
            <ellipse cx="400" cy="300" rx="360" ry="120" />
            <ellipse cx="400" cy="300" rx="280" ry="200" transform="rotate(20 400 300)" />
            <ellipse cx="400" cy="300" rx="220" ry="260" transform="rotate(-15 400 300)" />
          </g>
          <g fill="currentColor" opacity="0.4">
            <circle cx="120" cy="180" r="2.5" />
            <circle cx="660" cy="430" r="2" />
            <circle cx="540" cy="120" r="2.5" />
          </g>
        </svg>
      )}

      {variant === "noise" && (
        <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
          <filter id="ab-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#ab-noise)" />
        </svg>
      )}

      {variant === "topography" && (
        <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full text-foreground">
          <g fill="none" stroke="currentColor" strokeWidth="1" opacity="0.07">
            {Array.from({ length: 12 }).map((_, i) => (
              <path
                key={i}
                d={`M0 ${100 + i * 60} Q300 ${60 + i * 60} 600 ${120 + i * 60} T1200 ${100 + i * 60}`}
              />
            ))}
          </g>
        </svg>
      )}

      {/* Soft radial vignette to keep content readable */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_hsl(var(--background))_85%)]" />
    </div>
  );
}
