import { ImpactComparison } from "@/types/advertising";

export type ImpactMetricKey = keyof ImpactComparison["baseline"];

export interface DateRange {
  from: Date;
  to: Date;
}

export interface ImpactSeriesPoint {
  date: string; // ISO yyyy-mm-dd
  label: string; // e.g. "Jan 5"
  period: "previous" | "impact" | "gap";
  // Per-metric values keyed as `${metric}` — only one period will be populated
  [metricKey: string]: any;
  // Per-point contributor breakdown for tooltip
  contributors?: Array<{ id: string; name: string; value: number; metric: ImpactMetricKey }>;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

export function diffDays(a: Date, b: Date): number {
  return Math.round((stripTime(b).getTime() - stripTime(a).getTime()) / MS_PER_DAY);
}

export function stripTime(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function addDays(d: Date, n: number): Date {
  const r = stripTime(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function rangeLength(r: DateRange): number {
  return diffDays(r.from, r.to) + 1;
}

export function eachDay(from: Date, to: Date): Date[] {
  const out: Date[] = [];
  const n = diffDays(from, to);
  for (let i = 0; i <= n; i++) out.push(addDays(from, i));
  return out;
}

export function formatISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function formatShort(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// Deterministic pseudo-random in [0.7, 1.3]
function jitter(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return 0.7 + ((h % 1000) / 1000) * 0.6;
}

/**
 * Build a unified daily series spanning [previous.from, impact.to].
 * Each day has values for the selected metrics, split by period.
 */
export function buildImpactSeries(
  items: ImpactComparison[],
  previous: DateRange,
  impact: DateRange,
  metrics: ImpactMetricKey[],
): ImpactSeriesPoint[] {
  if (!items.length || !metrics.length) return [];

  const prevDays = eachDay(previous.from, previous.to);
  const impactDays = eachDay(impact.from, impact.to);

  // Bridge gap (exclusive of period endpoints)
  const gapStart = addDays(previous.to, 1);
  const gapEnd = addDays(impact.from, -1);
  const gapDays = diffDays(gapStart, gapEnd) >= 0 ? eachDay(gapStart, gapEnd) : [];

  const buildDayPoint = (
    day: Date,
    period: "previous" | "impact" | "gap",
    source: "baseline" | "impact" | null,
    dayCount: number,
  ): ImpactSeriesPoint => {
    const point: ImpactSeriesPoint = {
      date: formatISO(day),
      label: formatShort(day),
      period,
    };

    if (source && dayCount > 0) {
      const contributors: ImpactSeriesPoint["contributors"] = [];
      for (const metric of metrics) {
        let total = 0;
        const perItem: Array<{ id: string; name: string; value: number }> = [];
        for (const item of items) {
          const aggregate = item[source][metric];
          // Ratio metrics (ctr, roas, acos) shouldn't be divided across days
          const isRatio = metric === "ctr" || metric === "roas" || metric === "acos";
          const base = isRatio ? aggregate : aggregate / dayCount;
          const j = jitter(`${item.id}-${formatISO(day)}-${metric}`);
          const value = base * j;
          total += value;
          perItem.push({ id: item.id, name: item.name, value });
        }
        const avg = metric === "ctr" || metric === "roas" || metric === "acos"
          ? total / items.length
          : total;
        const key = `${metric}_${period}`;
        point[key] = avg;
        perItem.sort((a, b) => b.value - a.value);
        for (const c of perItem.slice(0, 5)) {
          contributors.push({ id: c.id, name: c.name, value: c.value, metric });
        }
      }
      point.contributors = contributors;
    }

    return point;
  };

  const out: ImpactSeriesPoint[] = [];
  for (const day of prevDays) out.push(buildDayPoint(day, "previous", "baseline", prevDays.length));
  for (const day of gapDays) out.push(buildDayPoint(day, "gap", null, 0));
  for (const day of impactDays) out.push(buildDayPoint(day, "impact", "impact", impactDays.length));

  // Bridge boundary so Previous and Impact lines visually connect without a missing-day gap.
  // Only bridge when the two periods are adjacent (no gap days between them).
  if (gapDays.length === 0 && prevDays.length > 0 && impactDays.length > 0) {
    const lastPrevIdx = prevDays.length - 1;
    const firstImpactIdx = prevDays.length; // immediately after last previous
    const lastPrev = out[lastPrevIdx];
    const firstImpact = out[firstImpactIdx];
    for (const metric of metrics) {
      const prevKey = `${metric}_previous`;
      const impKey = `${metric}_impact`;
      // Cross-populate so each line has an endpoint on the boundary day.
      if (lastPrev[impKey] == null && firstImpact[impKey] != null) {
        lastPrev[impKey] = firstImpact[impKey];
      }
      if (firstImpact[prevKey] == null && lastPrev[prevKey] != null) {
        firstImpact[prevKey] = lastPrev[prevKey];
      }
    }
  }

  return out;
}

/**
 * Pair-shift: when one period range changes, recompute its sibling.
 * - "impact" change → previous becomes the N days ending the day before impact.from
 * - "previous" change → impact becomes the N days starting the day after previous.to
 */
export function pairShift(
  changed: "impact" | "previous",
  newRange: DateRange,
): { previous: DateRange; impact: DateRange } {
  const len = rangeLength(newRange);
  if (changed === "impact") {
    const prevTo = addDays(newRange.from, -1);
    const prevFrom = addDays(prevTo, -(len - 1));
    return { impact: newRange, previous: { from: prevFrom, to: prevTo } };
  }
  const impFrom = addDays(newRange.to, 1);
  const impTo = addDays(impFrom, len - 1);
  return { previous: newRange, impact: { from: impFrom, to: impTo } };
}
