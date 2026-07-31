// Typed decision relationships. Derived at query time from existing Decision
// fields — no schema change to mock data.
import type { Decision } from "@/types/signals";

export type RelationshipType =
  | "blocks"
  | "depends_on"
  | "duplicates"
  | "merged_into"
  | "caused_by"
  | "related";

export interface Relationship {
  type: RelationshipType;
  otherId: string;
}

export const RELATIONSHIP_LABEL: Record<RelationshipType, string> = {
  blocks: "Blocks",
  depends_on: "Depends on",
  duplicates: "Duplicate of",
  merged_into: "Merged into",
  caused_by: "Caused by",
  related: "Related",
};

/** For a given decision, walk the corpus and return every peer relationship. */
export function relationshipsFor(subject: Decision, all: Decision[]): Relationship[] {
  const out: Relationship[] = [];
  for (const d of all) {
    if (d.id === subject.id) continue;

    // Duplicate — shared dupeKey.
    if (subject.dupeKey && d.dupeKey === subject.dupeKey) {
      out.push({ type: "duplicates", otherId: d.id });
      continue;
    }

    // Merged from same meeting bundle.
    if (subject.meetingRef && d.meetingRef?.bundleId === subject.meetingRef.bundleId) {
      out.push({ type: "merged_into", otherId: d.id });
      continue;
    }

    // Causal: an already-completed same-domain decision that landed in the last
    // 24h before this one opened.
    const sameDomain = d.domain === subject.domain;
    if (
      sameDomain &&
      (d.status === "completed" || d.status === "in_flight") &&
      Math.abs(d.updatedAt - subject.createdAt) < 24 * 3_600_000
    ) {
      out.push({ type: "caused_by", otherId: d.id });
      continue;
    }

    // Blocks / depends on: same domain, both open, higher-magnitude one blocks lower.
    if (sameDomain && d.status === "open" && subject.status === "open") {
      const mine = Math.abs(subject.valueCents);
      const other = Math.abs(d.valueCents);
      if (other > mine * 1.5) out.push({ type: "depends_on", otherId: d.id });
      else if (mine > other * 1.5) out.push({ type: "blocks", otherId: d.id });
      else out.push({ type: "related", otherId: d.id });
      continue;
    }

    // Generic related — same domain, both active.
    if (sameDomain) out.push({ type: "related", otherId: d.id });
  }

  // Cap to keep the review pane readable.
  return out.slice(0, 6);
}
