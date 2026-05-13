import { motion } from "framer-motion";

/**
 * Site-wide decorative backdrop. CSS/SVG only, no backdrop-filter, no
 * infinite pulse, parallax ≤ 8px. Honors Section 9 motion limits.
 *
 * Layers (bottom → top):
 *   1. Soft periwinkle bloom (top-left, slow drift, ≤6px)
 *   2. Hairline grid (very low opacity, analytical texture)
 *   3. Floating thin "data shards" (sparkline fragments + chevrons)
 *   4. Constellation dots in the lower band
 *
 * Mounted once in WebsiteLayout, fixed behind content with pointer-events-none.
 */
export default function AmbientBackdropV2() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* 1. Bloom */}
      <motion.div
        className="absolute -top-32 -left-32 w-[640px] h-[640px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.16), transparent 65%)" }}
        animate={{ x: [0, 6, 0], y: [0, -4, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--accent) / 0.5), transparent 65%)" }}
        animate={{ x: [0, -5, 0], y: [0, 5, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 2. Hairline grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05] text-foreground" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="ambient-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="currentColor" strokeWidth="0.6" />
          </pattern>
          <pattern id="ambient-dots" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ambient-grid)" />
      </svg>

      {/* 3. Data shards - sparkline fragments parked in negative space */}
      <svg className="absolute top-[12%] right-[8%] w-44 h-12 text-primary/30" viewBox="0 0 200 50" fill="none">
        <polyline points="0,40 30,32 60,36 90,18 120,24 150,10 200,16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="150" cy="10" r="2.5" fill="currentColor" />
      </svg>
      <svg className="absolute top-[44%] left-[4%] w-36 h-10 text-foreground/20" viewBox="0 0 200 50" fill="none">
        <polyline points="0,30 30,18 60,22 90,8 120,14 150,6 200,12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg className="absolute bottom-[18%] right-[14%] w-28 h-28 text-primary/15" viewBox="0 0 100 100" fill="none">
        <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="0.8" />
      </svg>

      {/* Floating thin chevrons */}
      <svg className="absolute top-[28%] left-[18%] w-6 h-6 text-primary/25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M 4 12 L 12 4 L 20 12" />
        <path d="M 4 18 L 12 10 L 20 18" />
      </svg>
      <svg className="absolute bottom-[30%] left-[10%] w-5 h-5 text-foreground/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <line x1="4" y1="12" x2="20" y2="12" />
      </svg>

      {/* 4. Constellation in lower band */}
      <svg className="absolute bottom-0 left-0 right-0 h-64 w-full opacity-[0.06] text-foreground" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="url(#ambient-dots)" />
      </svg>
    </div>
  );
}
