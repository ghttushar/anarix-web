// Seeded pseudo-random delta generator for consistent mock deltas
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Generate a consistent delta percentage for a given row ID and metric name.
 * Returns a value between -25 and +30 (biased slightly positive).
 */
export function getDelta(rowId: string, metric: string): number {
  const seed = hashString(`${rowId}-${metric}`);
  const raw = seededRandom(seed);
  // Range: -25 to +30
  return (raw * 55) - 25;
}
