import { cn } from "@/lib/utils";

interface Props {
  name: string;
  dept: string;
  className?: string;
}

const DEPT_TINTS: Record<string, { bg1: string; bg2: string; skin: string; hair: string; accent: string; shirt: string }> = {
  Leadership:           { bg1: "hsl(var(--primary) / 0.22)", bg2: "hsl(var(--primary) / 0.08)", skin: "#f1c8a6", hair: "#2d2018", accent: "hsl(var(--primary))", shirt: "#2a2d4f" },
  "Account Management": { bg1: "hsl(220 80% 92%)", bg2: "hsl(220 70% 96%)", skin: "#e8b896", hair: "#3a2820", accent: "#4a62d9", shirt: "#4a62d9" },
  Service:              { bg1: "hsl(160 55% 90%)", bg2: "hsl(160 40% 95%)", skin: "#eec3a0", hair: "#1f1814", accent: "#3aa385", shirt: "#3aa385" },
  Tech:                 { bg1: "hsl(250 65% 92%)", bg2: "hsl(250 50% 96%)", skin: "#e9bd99", hair: "#252028", accent: "#6e82f5", shirt: "#6e82f5" },
  Design:               { bg1: "hsl(20 75% 92%)", bg2: "hsl(20 60% 96%)", skin: "#f0c4a3", hair: "#2a1d18", accent: "#e08a4a", shirt: "#e08a4a" },
  Marketing:            { bg1: "hsl(340 65% 93%)", bg2: "hsl(340 50% 96%)", skin: "#eebe9e", hair: "#33201f", accent: "#c44a7a", shirt: "#c44a7a" },
};

/**
 * Stylized caricature - default state for team cards.
 * Deterministic per-name variation: hair shape, glasses, smile, beard.
 * Cards display this first; on hover the parent swaps to <PhotoMockup />.
 */
export function CaricatureMockup({ name, dept, className }: Props) {
  const t = DEPT_TINTS[dept] ?? DEPT_TINTS.Tech;
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hair = hash % 4;
  const glasses = hash % 3 === 0;
  const smile = (hash >> 2) % 3;
  const beard = hash % 5 === 0;
  const id = `cm-${name.replace(/\s/g, "")}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-full h-full", className)}
      role="img"
      aria-label={`${name} caricature`}
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.bg1} />
          <stop offset="100%" stopColor={t.bg2} />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="14" fill={`url(#${id}-bg)`} />
      {/* shoulders */}
      <path d="M 8 92 Q 50 60 92 92 L 92 100 L 8 100 Z" fill={t.shirt} opacity="0.92" />
      {/* collar accent */}
      <path d="M 42 70 L 50 78 L 58 70 L 56 82 L 44 82 Z" fill="#fff" opacity="0.18" />
      {/* neck */}
      <rect x="44" y="60" width="12" height="12" fill={t.skin} />
      {/* face */}
      <ellipse cx="50" cy="48" rx="20" ry="22" fill={t.skin} />
      {/* face shading */}
      <ellipse cx="50" cy="60" rx="14" ry="6" fill="#000" opacity="0.04" />
      {/* hair */}
      {hair === 0 && <path d="M 30 38 Q 50 18 70 38 L 70 46 Q 50 32 30 46 Z" fill={t.hair} />}
      {hair === 1 && <path d="M 28 40 Q 40 20 62 24 Q 72 30 70 44 Q 60 30 30 44 Z" fill={t.hair} />}
      {hair === 2 && <path d="M 32 36 Q 50 28 68 36 L 68 42 Q 50 38 32 42 Z" fill={t.hair} />}
      {hair === 3 && <path d="M 28 38 Q 30 20 50 18 Q 72 22 72 42 L 70 60 Q 65 42 50 40 Q 35 42 30 60 Z" fill={t.hair} />}
      {/* eyes */}
      {glasses ? (
        <g stroke={t.hair} strokeWidth="1.4" fill="none">
          <circle cx="42" cy="50" r="4.5" fill="#ffffff" />
          <circle cx="58" cy="50" r="4.5" fill="#ffffff" />
          <line x1="46.5" y1="50" x2="53.5" y2="50" />
          <circle cx="42" cy="50" r="1.4" fill={t.hair} stroke="none" />
          <circle cx="58" cy="50" r="1.4" fill={t.hair} stroke="none" />
        </g>
      ) : (
        <g fill={t.hair}>
          <circle cx="42" cy="50" r="1.6" />
          <circle cx="58" cy="50" r="1.6" />
        </g>
      )}
      {/* smile */}
      {smile === 0 && <line x1="44" y1="58" x2="56" y2="58" stroke={t.hair} strokeWidth="1.4" strokeLinecap="round" />}
      {smile === 1 && <path d="M 44 57 Q 50 61 56 57" stroke={t.hair} strokeWidth="1.4" fill="none" strokeLinecap="round" />}
      {smile === 2 && <path d="M 42 56 Q 50 64 58 56" stroke={t.hair} strokeWidth="1.6" fill="none" strokeLinecap="round" />}
      {beard && <path d="M 40 58 Q 50 70 60 58 Q 58 64 50 66 Q 42 64 40 58 Z" fill={t.hair} opacity="0.7" />}
      {/* cheek blush */}
      <ellipse cx="38" cy="55" rx="2.5" ry="1.5" fill={t.accent} opacity="0.18" />
      <ellipse cx="62" cy="55" rx="2.5" ry="1.5" fill={t.accent} opacity="0.18" />
    </svg>
  );
}
