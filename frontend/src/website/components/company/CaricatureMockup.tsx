import { cn } from "@/lib/utils";

interface Props {
  name: string;
  dept: string;
  className?: string;
}

/**
 * Ghibli-inspired stylized 3D caricature.
 * Painterly hair, large eyes with double highlights, soft cheek shading,
 * warm rim light. Deterministic per name (hair / eyes / mouth / accessories).
 * Pure SVG, no images.
 */

const DEPT: Record<string, { sky1: string; sky2: string; skin: string; skinShade: string; hair: string; hairHi: string; shirt: string; shirtHi: string; accent: string }> = {
  Leadership:           { sky1: "#fde2c7", sky2: "#f5b591", skin: "#f6c9a7", skinShade: "#d99878", hair: "#2a1a14", hairHi: "#5a3826", shirt: "#2d3361", shirtHi: "#4a55a8", accent: "#ff8a65" },
  "Account Management": { sky1: "#cfe0ff", sky2: "#9bb8f5", skin: "#f0bf9c", skinShade: "#cf9070", hair: "#2c1d14", hairHi: "#5a3a26", shirt: "#3b4ca8", shirtHi: "#6a7de0", accent: "#5e7cff" },
  Service:              { sky1: "#caf0e2", sky2: "#7fc9ad", skin: "#f3c6a4", skinShade: "#d39879", hair: "#1a120c", hairHi: "#3e2a1c", shirt: "#1f6a55", shirtHi: "#3aa385", accent: "#5dd1ad" },
  Tech:                 { sky1: "#dbd6ff", sky2: "#a8a2f5", skin: "#eec0a0", skinShade: "#c9906f", hair: "#211a2a", hairHi: "#4a3d5c", shirt: "#3a3f8a", shirtHi: "#6e82f5", accent: "#a78bfa" },
  Design:               { sky1: "#ffd9b8", sky2: "#f5a86b", skin: "#f4c8a3", skinShade: "#d49072", hair: "#1f140e", hairHi: "#4a2e1c", shirt: "#a85420", shirtHi: "#e08a4a", accent: "#ff9d57" },
  Marketing:            { sky1: "#ffd1de", sky2: "#f08aa8", skin: "#f3c5a4", skinShade: "#d39072", hair: "#26121a", hairHi: "#542030", shirt: "#a83a6a", shirtHi: "#e85a8e", accent: "#ff7aa8" },
};

export function CaricatureMockup({ name, dept, className }: Props) {
  const t = DEPT[dept] ?? DEPT.Tech;
  const hash = [...name].reduce((a, c) => a + c.charCodeAt(0) * (c.charCodeAt(0) % 7), 0);
  const hair = hash % 6;            // 6 hair variants
  const glasses = hash % 4 === 0;
  const beard = hash % 5 === 0 && hair !== 4;
  const earring = hash % 7 === 1;
  const mouth = (hash >> 3) % 3;
  const lookX = ((hash % 5) - 2) * 0.4; // -0.8 .. 0.8 px pupil offset
  const id = `g-${name.replace(/\s/g, "")}`;

  // Painterly speckle: 18 deterministic dots
  const dots = Array.from({ length: 18 }, (_, i) => {
    const h = hash + i * 31;
    return {
      x: (h * 13) % 100,
      y: (h * 17) % 100,
      r: 0.4 + ((h * 7) % 10) / 20,
    };
  });

  return (
    <svg
      viewBox="0 0 100 110"
      className={cn("w-full h-full", className)}
      role="img"
      aria-label={`${name} caricature`}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`${id}-sky`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor={t.sky1} />
          <stop offset="100%" stopColor={t.sky2} />
        </radialGradient>
        <linearGradient id={`${id}-skin`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.skin} />
          <stop offset="100%" stopColor={t.skinShade} />
        </linearGradient>
        <linearGradient id={`${id}-hair`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={t.hairHi} />
          <stop offset="60%" stopColor={t.hair} />
        </linearGradient>
        <linearGradient id={`${id}-shirt`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={t.shirtHi} />
          <stop offset="100%" stopColor={t.shirt} />
        </linearGradient>
        <radialGradient id={`${id}-iris`} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#5a3a28" />
          <stop offset="80%" stopColor="#1a0e08" />
        </radialGradient>
        <radialGradient id={`${id}-blush`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={t.accent} stopOpacity="0.55" />
          <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky background */}
      <rect width="100" height="110" rx="14" fill={`url(#${id}-sky)`} />
      {/* Painterly speckle */}
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity="0.18" />
      ))}
      {/* Soft horizon glow */}
      <ellipse cx="50" cy="78" rx="55" ry="22" fill="#fff" opacity="0.18" />

      {/* Shoulders / shirt */}
      <path d="M 4 110 Q 50 64 96 110 Z" fill={`url(#${id}-shirt)`} />
      {/* shirt highlight */}
      <path d="M 18 100 Q 50 72 82 100" fill="none" stroke="#fff" strokeWidth="0.6" opacity="0.18" />
      {/* collar */}
      <path d="M 42 74 L 50 82 L 58 74 L 56 88 L 44 88 Z" fill={t.sky1} opacity="0.55" />

      {/* Neck */}
      <path d="M 44 62 L 56 62 L 56 76 Q 50 80 44 76 Z" fill={`url(#${id}-skin)`} />
      {/* neck shadow */}
      <path d="M 44 64 Q 50 70 56 64 L 56 68 Q 50 72 44 68 Z" fill={t.skinShade} opacity="0.4" />

      {/* Head - rounder Ghibli proportions */}
      <ellipse cx="50" cy="46" rx="22" ry="24" fill={`url(#${id}-skin)`} />
      {/* face form-shadow on right */}
      <path d="M 50 24 Q 72 30 72 50 Q 70 66 50 70 L 50 24 Z" fill={t.skinShade} opacity="0.22" />
      {/* rim light upper-left */}
      <path d="M 30 32 Q 38 22 50 22 Q 40 26 32 38 Z" fill="#fff" opacity="0.22" />

      {/* HAIR - 6 painterly variants */}
      {hair === 0 && (
        // bowl / bangs
        <g>
          <path d="M 28 42 Q 28 18 50 16 Q 72 18 72 42 Q 70 32 50 30 Q 30 32 28 42 Z" fill={`url(#${id}-hair)`} />
          <path d="M 30 38 Q 40 30 50 30 Q 60 30 70 38" fill="none" stroke={t.hairHi} strokeWidth="1" opacity="0.7" />
        </g>
      )}
      {hair === 1 && (
        // side-swept
        <g>
          <path d="M 26 44 Q 24 18 52 16 Q 74 22 72 44 Q 64 28 46 30 Q 32 32 26 44 Z" fill={`url(#${id}-hair)`} />
          <path d="M 32 28 Q 50 22 66 32" fill="none" stroke={t.hairHi} strokeWidth="0.8" opacity="0.6" />
        </g>
      )}
      {hair === 2 && (
        // short cropped
        <g>
          <path d="M 30 40 Q 32 24 50 22 Q 68 24 70 40 Q 62 32 50 32 Q 38 32 30 40 Z" fill={`url(#${id}-hair)`} />
        </g>
      )}
      {hair === 3 && (
        // long flowing
        <g>
          <path d="M 26 40 Q 24 18 50 16 Q 76 18 74 40 L 74 70 Q 68 50 56 46 L 56 30 Q 50 28 44 30 L 44 46 Q 32 50 26 70 Z" fill={`url(#${id}-hair)`} />
          <path d="M 30 30 Q 50 22 70 30" fill="none" stroke={t.hairHi} strokeWidth="0.8" opacity="0.6" />
        </g>
      )}
      {hair === 4 && (
        // top-knot
        <g>
          <path d="M 32 38 Q 34 24 50 22 Q 66 24 68 38 Q 60 32 50 32 Q 40 32 32 38 Z" fill={`url(#${id}-hair)`} />
          <ellipse cx="50" cy="20" rx="8" ry="7" fill={`url(#${id}-hair)`} />
          <path d="M 44 18 Q 50 14 56 18" fill="none" stroke={t.hairHi} strokeWidth="0.8" opacity="0.6" />
        </g>
      )}
      {hair === 5 && (
        // curly fluff
        <g fill={`url(#${id}-hair)`}>
          <ellipse cx="34" cy="34" rx="7" ry="6" />
          <ellipse cx="44" cy="26" rx="8" ry="7" />
          <ellipse cx="56" cy="26" rx="8" ry="7" />
          <ellipse cx="66" cy="34" rx="7" ry="6" />
          <ellipse cx="50" cy="22" rx="8" ry="6" />
        </g>
      )}

      {/* Eyebrows - soft painterly */}
      <path d={`M 36 44 Q 41 ${42 - lookX * 0.5} 46 44`} stroke={t.hair} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d={`M 54 44 Q 59 ${42 + lookX * 0.5} 64 44`} stroke={t.hair} strokeWidth="1.4" fill="none" strokeLinecap="round" />

      {/* EYES - large round Ghibli eyes */}
      <g>
        {/* eye whites */}
        <ellipse cx="41" cy="50" rx="3.6" ry="4.2" fill="#fff" />
        <ellipse cx="59" cy="50" rx="3.6" ry="4.2" fill="#fff" />
        {/* iris */}
        <ellipse cx={41 + lookX} cy={50.5} rx="2.6" ry="3.2" fill={`url(#${id}-iris)`} />
        <ellipse cx={59 + lookX} cy={50.5} rx="2.6" ry="3.2" fill={`url(#${id}-iris)`} />
        {/* primary highlight */}
        <circle cx={40.4 + lookX} cy={49.2} r="0.9" fill="#fff" />
        <circle cx={58.4 + lookX} cy={49.2} r="0.9" fill="#fff" />
        {/* secondary highlight */}
        <circle cx={42 + lookX} cy={51.4} r="0.4" fill="#fff" opacity="0.85" />
        <circle cx={60 + lookX} cy={51.4} r="0.4" fill="#fff" opacity="0.85" />
        {/* upper eyelash arc */}
        <path d="M 37 47.5 Q 41 45.8 45 47.5" stroke={t.hair} strokeWidth="1.1" fill="none" strokeLinecap="round" />
        <path d="M 55 47.5 Q 59 45.8 63 47.5" stroke={t.hair} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      </g>

      {/* Nose - soft highlight + shadow, no line */}
      <path d="M 49.5 53 Q 48.5 57 49.5 59" stroke="#fff" strokeWidth="0.7" opacity="0.55" fill="none" strokeLinecap="round" />
      <path d="M 50.5 56 Q 51.6 58 50.4 59.4" stroke={t.skinShade} strokeWidth="0.7" opacity="0.55" fill="none" strokeLinecap="round" />

      {/* Cheek blush */}
      <ellipse cx="38" cy="56" rx="3.5" ry="2" fill={`url(#${id}-blush)`} />
      <ellipse cx="62" cy="56" rx="3.5" ry="2" fill={`url(#${id}-blush)`} />

      {/* Mouth - painterly */}
      {mouth === 0 && (
        // soft smile
        <g>
          <path d="M 45 62 Q 50 65 55 62" stroke={t.hair} strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M 46 62.4 Q 50 64.4 54 62.4" fill={t.accent} opacity="0.35" />
        </g>
      )}
      {mouth === 1 && (
        // open laugh
        <g>
          <path d="M 44 61 Q 50 67 56 61 Q 54 64 50 64 Q 46 64 44 61 Z" fill="#3a1a1a" />
          <path d="M 46 63 Q 50 65 54 63" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.7" />
        </g>
      )}
      {mouth === 2 && (
        // neutral lip-press
        <g>
          <path d="M 44 62 Q 50 63 56 62" stroke={t.hair} strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <path d="M 47 62.5 Q 50 63.2 53 62.5" stroke={t.accent} strokeWidth="0.8" fill="none" opacity="0.6" strokeLinecap="round" />
        </g>
      )}

      {beard && (
        <g>
          <path d="M 36 58 Q 50 74 64 58 Q 60 68 50 70 Q 40 68 36 58 Z" fill={`url(#${id}-hair)`} opacity="0.92" />
          <path d="M 40 60 Q 50 68 60 60" stroke={t.hairHi} strokeWidth="0.6" fill="none" opacity="0.6" />
        </g>
      )}

      {glasses && (
        <g stroke={t.hair} strokeWidth="1.2" fill="none">
          <rect x="35.5" y="46.5" width="11" height="8" rx="3.5" fill="#fff" fillOpacity="0.08" />
          <rect x="53.5" y="46.5" width="11" height="8" rx="3.5" fill="#fff" fillOpacity="0.08" />
          <line x1="46.5" y1="50.5" x2="53.5" y2="50.5" />
          {/* lens highlight */}
          <path d="M 37 48 L 40 48" stroke="#fff" strokeWidth="0.8" opacity="0.7" />
          <path d="M 55 48 L 58 48" stroke="#fff" strokeWidth="0.8" opacity="0.7" />
        </g>
      )}

      {earring && (
        <circle cx="29" cy="56" r="1.2" fill={t.accent} />
      )}
    </svg>
  );
}
