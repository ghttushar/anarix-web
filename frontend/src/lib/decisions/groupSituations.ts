// Situation grouping — merge decisions that share dupeKey, campaign, sku,
// product, supplier, meeting, domain, marketplace, or rootCause. Duplicates
// never appear standalone. Groups with 2+ children become a collapsible
// SituationRow. Groups >7 render a "Show N more" tail.
import type { Decision } from "@/types/signals";
import { valueMagnitude } from "@/lib/decisions/valueFormat";

export interface Situation {
  key: string;
  title: string;
  subtitle: string;
  domain: Decision["domain"];
  decisions: Decision[];
  /** Sum of |valueCents| across children — used for aggregate Impact chip. */
  totalCents: number;
  /** Predominant valueKind — determined by max magnitude child. */
  primaryKind: Decision["valueKind"];
  /** Number of children in the "needs_me" or "needs_review" lifecycle. */
  needsCount: number;
  /** True when the situation contains 2+ decisions that share a strong key. */
  merged: boolean;
  /** Reason we merged (used in copy on the situation row). */
  mergeReason: "duplicate" | "same_entity" | "same_meeting" | "same_domain";
}

function normalize(label: string): string {
  return (label || "")
    .toLowerCase()
    .replace(/^\W+|\W+$/g, "")
    .replace(/[^a-z0-9]+/g, "-");
}

/** Extract the strongest situation-defining token from a sourceRef label. */
function entityToken(label: string): string {
  const l = (label || "").toLowerCase();
  // e.g. "Campaign agent · Winter Push" -> "winter-push"
  //      "Buy Box agent · SKU-A01"      -> "sku-a01"
  //      "#cs-urgent · @maria"          -> "cs-urgent"
  const after = l.split(/[·|]/).pop() || l;
  return normalize(after).split("-").slice(0, 3).join("-");
}

function bucket4h(ts: number): number {
  return Math.floor(ts / (4 * 3_600_000));
}

/** Determine which key (if any) merges this decision with siblings. */
function situationKey(d: Decision): { key: string; reason: Situation["mergeReason"] } {
  if (d.dupeKey) return { key: `dupe:${d.dupeKey}`, reason: "duplicate" };
  if (d.meetingRef?.bundleId) return { key: `mtg:${d.meetingRef.bundleId}`, reason: "same_meeting" };
  const ent = entityToken(d.sourceRef.label);
  if (ent) return { key: `ent:${d.domain}:${ent}:${bucket4h(d.createdAt)}`, reason: "same_entity" };
  return { key: `dom:${d.domain}:${bucket4h(d.createdAt)}:${d.id}`, reason: "same_domain" };
}

function humanizeTitle(d: Decision): string {
  // Prefer entity/meeting title over the raw sourceRef.
  if (d.meetingRef?.title) return d.meetingRef.title;
  const parts = (d.sourceRef.label || "").split(/[·|]/).map((s) => s.trim());
  return parts[parts.length - 1] || d.sourceRef.label || d.insight;
}

function isNeeds(d: Decision): boolean {
  if (d.status !== "open") return false;
  return d.severity === "critical" || d.severity === "opportunity";
}

export function groupBySituation(list: Decision[]): Situation[] {
  const map = new Map<string, Situation>();

  for (const d of list) {
    const { key, reason } = situationKey(d);
    if (!map.has(key)) {
      map.set(key, {
        key,
        title: humanizeTitle(d),
        subtitle: d.sourceRef.label,
        domain: d.domain,
        decisions: [],
        totalCents: 0,
        primaryKind: d.valueKind,
        needsCount: 0,
        merged: false,
        mergeReason: reason,
      });
    }
    const s = map.get(key)!;
    s.decisions.push(d);
    s.totalCents += valueMagnitude(d.valueKind, d.valueCents);
    if (isNeeds(d)) s.needsCount += 1;
    // Take the kind from the largest-magnitude child.
    const cur = valueMagnitude(s.primaryKind, s.totalCents); // approx
    const mag = valueMagnitude(d.valueKind, d.valueCents);
    if (mag > cur / (s.decisions.length || 1)) s.primaryKind = d.valueKind;
  }

  for (const s of map.values()) {
    s.merged = s.decisions.length >= 2 && s.mergeReason !== "same_domain";
  }

  return Array.from(map.values());
}

/** Convenience — total situations that "need me". */
export function needsSituationCount(sits: Situation[]): number {
  return sits.filter((s) => s.needsCount > 0).length;
}
