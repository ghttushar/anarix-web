import { ScatterDataPoint } from "@/types/profitability";

export type Tier = "loss" | "mid" | "winner";

export function tierOf(margin: number): Tier {
  if (margin < 0) return "loss";
  if (margin < 30) return "mid";
  return "winner";
}

export const tierColor: Record<Tier, string> = {
  loss: "hsl(0, 72%, 58%)",
  mid: "hsl(35, 92%, 55%)",
  winner: "hsl(142, 65%, 42%)",
};

export interface ClusterItem {
  key: string;
  cx: number; // pixel x in plot
  cy: number; // pixel y in plot
  r: number;
  count: number;
  tier: Tier;
  points: ScatterDataPoint[];
  // average data coords (for zoom-to-bbox)
  bbox: { x1: number; y1: number; x2: number; y2: number };
}

interface BuildArgs {
  points: ScatterDataPoint[];
  width: number;
  height: number;
  xDomain: [number, number];
  yDomain: [number, number];
  cellPx?: number;
}

/**
 * Grid-bucket clustering in pixel space.
 * Cell size in pixels determines clustering granularity.
 * On zoom in, the data domain shrinks → fewer points per cell → clusters split.
 */
export function buildClusters({
  points,
  width,
  height,
  xDomain,
  yDomain,
  cellPx = 36,
}: BuildArgs): ClusterItem[] {
  if (width <= 0 || height <= 0) return [];
  const [x0, x1] = xDomain;
  const [y0, y1] = yDomain;
  const xSpan = x1 - x0 || 1;
  const ySpan = y1 - y0 || 1;

  const toPx = (p: ScatterDataPoint) => ({
    px: ((p.profitMargin - x0) / xSpan) * width,
    py: height - ((p.adSpend - y0) / ySpan) * height,
  });

  const buckets = new Map<string, ScatterDataPoint[]>();
  for (const p of points) {
    const { px, py } = toPx(p);
    if (px < -cellPx || px > width + cellPx || py < -cellPx || py > height + cellPx) continue;
    const gx = Math.floor(px / cellPx);
    const gy = Math.floor(py / cellPx);
    const key = `${gx}:${gy}`;
    const arr = buckets.get(key);
    if (arr) arr.push(p);
    else buckets.set(key, [p]);
  }

  const clusters: ClusterItem[] = [];
  for (const [key, pts] of buckets) {
    let sx = 0, sy = 0;
    let bx1 = Infinity, by1 = Infinity, bx2 = -Infinity, by2 = -Infinity;
    const tierCounts: Record<Tier, number> = { loss: 0, mid: 0, winner: 0 };
    for (const p of pts) {
      const { px, py } = toPx(p);
      sx += px;
      sy += py;
      tierCounts[tierOf(p.profitMargin)]++;
      if (p.profitMargin < bx1) bx1 = p.profitMargin;
      if (p.profitMargin > bx2) bx2 = p.profitMargin;
      if (p.adSpend < by1) by1 = p.adSpend;
      if (p.adSpend > by2) by2 = p.adSpend;
    }
    const dominant: Tier =
      tierCounts.winner >= tierCounts.mid && tierCounts.winner >= tierCounts.loss
        ? "winner"
        : tierCounts.mid >= tierCounts.loss
          ? "mid"
          : "loss";
    const n = pts.length;
    const r = n === 1 ? 6 : Math.min(26, 10 + Math.log2(n) * 5);
    clusters.push({
      key,
      cx: sx / n,
      cy: sy / n,
      r,
      count: n,
      tier: dominant,
      points: pts,
      bbox: { x1: bx1, y1: by1, x2: bx2, y2: by2 },
    });
  }
  return clusters;
}
