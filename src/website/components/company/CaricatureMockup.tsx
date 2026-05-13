import { cn } from "@/lib/utils";

interface Props {
  name: string;
  dept: string;
  className?: string;
}

const DEPT_TINTS: Record<string, { bg: string; skin: string; hair: string; accent: string }> = {
  Leadership:        { bg: "hsl(var(--primary) / 0.15)", skin: "#f1c8a6", hair: "#2d2018", accent: "hsl(var(--primary))" },
  "Account Management": { bg: "hsl(220 70% 92%)", skin: "#e8b896", hair: "#3a2820", accent: "#4a62d9" },
  Service:           { bg: "hsl(160 50% 90%)", skin: "#eec3a0", hair: "#1f1814", accent: "#3aa385" },
  Tech:              { bg: "hsl(250 60% 92%)", skin: "#e9bd99", hair: "#252028", accent: "#6e82f5" },
  Design:            { bg: "hsl(20 70% 92%)", skin: "#f0c4a3", hair: "#2a1d18", accent: "#e08a4a" },
  Marketing:         { bg: "hsl(340 60% 93%)", skin: "#eebe9e", hair: "#33201f", accent: "#c44a7a" },
};

/**
 * Placeholder caricature — stylized head silhouette, deterministic per name
 * via a tiny hash so each member looks slightly different. Swap the SVG with
 * real artwork later by replacing this component only.
 */
export function CaricatureMockup({ name, dept, className }: Props) {
  const tint = DEPT_TINTS[dept] ?? DEPT_TINTS.Tech;
  // Deterministic variation: different hair shape, glasses, smile per name.
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const hair = hash % 4; // 0 short, 1 swoop, 2 buzz, 3 long
  const glasses = hash % 3 === 0;
  const smile = (hash >> 2) % 3; // 0 neutral, 1 smile, 2 wide

  return (
    <svg
      viewBox="0 0 100 100"
      className={cn("w-full h-full", className)}
      role="img"
      aria-label={`${name} caricature`}
    >
      <rect width="100" height="100" rx="14" fill={tint.bg} />
      {/* shoulders */}
      <path d="M 10 92 Q 50 65 90 92 L 90 100 L 10 100 Z" fill={tint.accent} opacity="0.85" />
      {/* neck */}
      <rect x="44" y="60" width="12" height="12" fill={tint.skin} />
      {/* face */}
      <ellipse cx="50" cy="48" rx="20" ry="22" fill={tint.skin} />
      {/* hair variants */}
      {hair === 0 && <path d="M 30 38 Q 50 18 70 38 L 70 46 Q 50 32 30 46 Z" fill={tint.hair} />}
      {hair === 1 && <path d="M 28 40 Q 40 20 62 24 Q 72 30 70 44 Q 60 30 30 44 Z" fill={tint.hair} />}
      {hair === 2 && <path d="M 32 36 Q 50 28 68 36 L 68 42 Q 50 38 32 42 Z" fill={tint.hair} />}
      {hair === 3 && <path d="M 28 38 Q 30 20 50 18 Q 72 22 72 42 L 70 60 Q 65 42 50 40 Q 35 42 30 60 Z" fill={tint.hair} />}
      {/* eyes */}
      {glasses ? (
        <g stroke={tint.hair} strokeWidth="1.4" fill="none">
          <circle cx="42" cy="50" r="4.5" fill="#ffffff" />
          <circle cx="58" cy="50" r="4.5" fill="#ffffff" />
          <line x1="46.5" y1="50" x2="53.5" y2="50" />
          <circle cx="42" cy="50" r="1.4" fill={tint.hair} stroke="none" />
          <circle cx="58" cy="50" r="1.4" fill={tint.hair} stroke="none" />
        </g>
      ) : (
        <g fill={tint.hair}>
          <circle cx="42" cy="50" r="1.6" />
          <circle cx="58" cy="50" r="1.6" />
        </g>
      )}
      {/* smile */}
      {smile === 0 && <line x1="44" y1="58" x2="56" y2="58" stroke={tint.hair} strokeWidth="1.4" strokeLinecap="round" />}
      {smile === 1 && <path d="M 44 57 Q 50 61 56 57" stroke={tint.hair} strokeWidth="1.4" fill="none" strokeLinecap="round" />}
      {smile === 2 && <path d="M 42 56 Q 50 64 58 56" stroke={tint.hair} strokeWidth="1.6" fill="none" strokeLinecap="round" />}
    </svg>
  );
}
