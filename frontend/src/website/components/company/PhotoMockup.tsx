import { cn } from "@/lib/utils";

interface Props {
  name: string;
  dept: string;
  className?: string;
}

const DEPT_PALETTE: Record<string, { bg1: string; bg2: string; skin: string; hair: string; shirt: string }> = {
  Leadership:           { bg1: "#1a1d35", bg2: "#0e1020", skin: "#d8a47f", hair: "#1a0f08", shirt: "#2a2d4f" },
  "Account Management": { bg1: "#1f2540", bg2: "#0f1428", skin: "#d49b7a", hair: "#2a1a10", shirt: "#3e4a8a" },
  Service:              { bg1: "#15302a", bg2: "#0a1c18", skin: "#dba78a", hair: "#170d08", shirt: "#1f5a4a" },
  Tech:                 { bg1: "#1f2148", bg2: "#0d0f28", skin: "#d4a487", hair: "#181020", shirt: "#3a3f7a" },
  Design:               { bg1: "#3a2418", bg2: "#1a0e08", skin: "#e0a888", hair: "#1a0c06", shirt: "#7a4a2a" },
  Marketing:            { bg1: "#3a1a2a", bg2: "#1a0a18", skin: "#dca088", hair: "#1f0c12", shirt: "#8a3a5a" },
};

/**
 * "Photo-style" placeholder portrait. More realistic than the caricature:
 * subtle skin shading, environmental gradient background, soft rim light.
 * Used as the hover state. Swap with real <img> by replacing this component
 * or providing /team/{slug}.jpg upstream.
 */
export function PhotoMockup({ name, dept, className }: Props) {
  const p = DEPT_PALETTE[dept] ?? DEPT_PALETTE.Tech;
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const tilt = ((hash % 7) - 3) * 0.5; // -1.5 .. 1.5 deg
  const beard = hash % 4 === 0;
  const glasses = hash % 3 === 1;
  const id = `pm-${name.replace(/\s/g, "")}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-full h-full", className)}
      role="img"
      aria-label={`${name} portrait`}
      style={{ transform: `rotate(${tilt}deg)` }}
    >
      <defs>
        <radialGradient id={`${id}-bg`} cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor={p.bg1} />
          <stop offset="100%" stopColor={p.bg2} />
        </radialGradient>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.skin} stopOpacity="1" />
          <stop offset="100%" stopColor={p.skin} stopOpacity="0.78" />
        </linearGradient>
        <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.shirt} />
          <stop offset="100%" stopColor={p.bg2} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="14" fill={`url(#${id}-bg)`} />
      {/* shoulders / shirt */}
      <path d="M 6 100 Q 50 62 94 100 Z" fill={`url(#${id}-shirt)`} />
      {/* neck */}
      <path d="M 44 60 L 56 60 L 56 74 Q 50 78 44 74 Z" fill={`url(#${id}-skin)`} />
      {/* head */}
      <ellipse cx="50" cy="46" rx="19" ry="23" fill={`url(#${id}-skin)`} />
      {/* hair top */}
      <path d="M 30 40 Q 32 22 50 20 Q 70 22 70 40 Q 64 30 50 30 Q 36 30 30 40 Z" fill={p.hair} />
      {/* hair side wisps */}
      <path d="M 30 40 Q 28 50 32 56 Q 30 48 32 42 Z" fill={p.hair} opacity="0.85" />
      <path d="M 70 40 Q 72 50 68 56 Q 70 48 68 42 Z" fill={p.hair} opacity="0.85" />
      {/* cheek shading */}
      <ellipse cx="38" cy="54" rx="4" ry="3" fill="#000" opacity="0.06" />
      <ellipse cx="62" cy="54" rx="4" ry="3" fill="#000" opacity="0.06" />
      {/* eyebrows */}
      <path d="M 38 46 Q 42 44 46 46" stroke={p.hair} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M 54 46 Q 58 44 62 46" stroke={p.hair} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {/* eyes */}
      <ellipse cx="42" cy="50" rx="1.8" ry="2.2" fill={p.hair} />
      <ellipse cx="58" cy="50" rx="1.8" ry="2.2" fill={p.hair} />
      <circle cx="42.4" cy="49.4" r="0.6" fill="#fff" />
      <circle cx="58.4" cy="49.4" r="0.6" fill="#fff" />
      {/* nose hint */}
      <path d="M 50 52 Q 48 56 50 58 Q 52 56 50 52" fill="#000" opacity="0.08" />
      {/* mouth */}
      <path d="M 44 60 Q 50 63 56 60" stroke="#5a2a20" strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {beard && (
        <path d="M 38 58 Q 50 70 62 58 Q 60 66 50 68 Q 40 66 38 58 Z" fill={p.hair} opacity="0.85" />
      )}
      {glasses && (
        <g stroke={p.hair} strokeWidth="1.2" fill="none" opacity="0.9">
          <circle cx="42" cy="50" r="5" />
          <circle cx="58" cy="50" r="5" />
          <line x1="47" y1="50" x2="53" y2="50" />
        </g>
      )}
      {/* rim light */}
      <ellipse cx="32" cy="38" rx="3" ry="6" fill="#fff" opacity="0.08" />
    </svg>
  );
}
