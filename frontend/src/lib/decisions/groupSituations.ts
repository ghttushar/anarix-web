// Situation grouping — merge decisions that share campaign / sku / product /
// supplier / meeting / domain / marketplace / rootCause. Duplicates never
// appear standalone. Groups >7 render a "Show N more" tail.
import type { Decision } from "@/data/mockDecisions";

export interface Situation {
  key: string;
  title: string;
  domain: Decision["domain"];
  decisions: Decision[];
}

function normalize(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function bucket4h(ts: number): number {
  return Math.floor(ts / (4 * 3_600_000));
}

function situationKey(d: Decision): string {
  const entity = normalize(d.sourceRef.label || "").split("-").slice(0, 3).join("-");
  return `${d.domain}:${entity || d.id}:${bucket4h(d.createdAt)}`;
}

export function groupBySituation(list: Decision[]): Situation[] {
  const map = new Map<string, Situation>();
  for (const d of list) {
    const key = situationKey(d);
    if (!map.has(key)) {
      map.set(key, { key, title: d.sourceRef.label || d.insight, domain: d.domain, decisions: [] });
    }
    map.get(key)!.decisions.push(d);
  }
  return Array.from(map.values());
}
