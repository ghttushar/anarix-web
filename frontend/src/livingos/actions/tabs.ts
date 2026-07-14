// Living OS — registers are operational states, not source categories.
// (The PDF is explicit: an "Operational Inbox", not another alerts list.)
import type { Decision } from "@/livingos/data/mockDecisions";

export type AlertTabKey =
  | "all"
  | "judgment"
  | "ai_at_work"
  | "watching"
  | "notice"
  | "settled";

export const ALERT_TABS: { key: AlertTabKey; label: string }[] = [
  { key: "all", label: "Everything" },
  { key: "judgment", label: "Judgment" },
  { key: "ai_at_work", label: "Aan at work" },
  { key: "watching", label: "Watching" },
  { key: "notice", label: "For your notice" },
  { key: "settled", label: "Settled" },
];

const ACTIONABLE_STATUSES = new Set<Decision["status"]>([
  "open", "with_aan", "in_flight",
]);
const DONE_STATUSES = new Set<Decision["status"]>([
  "completed", "rejected", "expired",
]);
const AI_STATUSES = new Set<Decision["status"]>([
  "with_aan", "in_flight",
]);

export function filterByTab(all: Decision[], tab: AlertTabKey): Decision[] {
  switch (tab) {
    case "all":
      return all.filter((d) => d.status !== "snoozed");
    case "judgment":
      return all.filter((d) => d.status === "open" && d.severity !== "fyi" && !d.meetingRef);
    case "ai_at_work":
      return all.filter((d) => AI_STATUSES.has(d.status));
    case "watching":
      return all.filter((d) => d.source === "meeting" || d.meetingRef !== undefined);
    case "notice":
      return all.filter((d) => d.severity === "fyi" && !DONE_STATUSES.has(d.status));
    case "settled": {
      const dayAgo = Date.now() - 24 * 3600 * 1000;
      return all.filter((d) => DONE_STATUSES.has(d.status) && d.updatedAt >= dayAgo);
    }
  }
}

export function computeTabCounts(all: Decision[]): Record<AlertTabKey, number> {
  return {
    all: filterByTab(all, "all").length,
    judgment: filterByTab(all, "judgment").length,
    ai_at_work: filterByTab(all, "ai_at_work").length,
    watching: filterByTab(all, "watching").length,
    notice: filterByTab(all, "notice").length,
    settled: filterByTab(all, "settled").length,
  };
}

export function isKnownTab(k: string | null): k is AlertTabKey {
  return !!k && ALERT_TABS.some((t) => t.key === k);
}

export { ACTIONABLE_STATUSES, DONE_STATUSES, AI_STATUSES };
