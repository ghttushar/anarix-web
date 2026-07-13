// Unified tab model — shared by Stack and Grid views.
import type { Decision } from "@/livingos/data/mockDecisions";

export type AlertTabKey =
  | "all"
  | "needs_approval"
  | "morning_brief"
  | "from_meetings"
  | "fyi"
  | "done";

export const ALERT_TABS: { key: AlertTabKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "needs_approval", label: "Needs approval" },
  { key: "morning_brief", label: "Morning brief" },
  { key: "from_meetings", label: "From meetings" },
  { key: "fyi", label: "FYI" },
  { key: "done", label: "Done" },
];

const ACTIONABLE_STATUSES = new Set<Decision["status"]>([
  "open", "with_aan", "in_flight",
]);
const DONE_STATUSES = new Set<Decision["status"]>([
  "completed", "rejected", "expired",
]);

function isMorning(ts: number): boolean {
  const now = new Date();
  const d = new Date(ts);
  // Created before 8am today OR overnight (22:00 → 08:00)
  const hour = d.getHours();
  const isToday = d.toDateString() === now.toDateString();
  const isYesterday = (() => {
    const y = new Date(now); y.setDate(now.getDate() - 1);
    return d.toDateString() === y.toDateString();
  })();
  const overnight = hour >= 22 || hour < 8;
  return (isToday && hour < 8) || (isYesterday && hour >= 22) || overnight;
}

export function filterByTab(all: Decision[], tab: AlertTabKey): Decision[] {
  switch (tab) {
    case "all":
      return all.filter((d) => d.status !== "snoozed");
    case "needs_approval":
      return all.filter((d) => d.status === "open" && d.severity !== "fyi");
    case "morning_brief":
      return all.filter((d) => d.status === "open" && isMorning(d.createdAt));
    case "from_meetings":
      return all.filter((d) => d.source === "meeting" || d.meetingRef !== undefined);
    case "fyi":
      return all.filter((d) => d.severity === "fyi" && !DONE_STATUSES.has(d.status));
    case "done":
      return all.filter((d) => DONE_STATUSES.has(d.status));
  }
}

export function computeTabCounts(all: Decision[]): Record<AlertTabKey, number> {
  return {
    all: filterByTab(all, "all").length,
    needs_approval: filterByTab(all, "needs_approval").length,
    morning_brief: filterByTab(all, "morning_brief").length,
    from_meetings: filterByTab(all, "from_meetings").length,
    fyi: filterByTab(all, "fyi").length,
    done: filterByTab(all, "done").length,
  };
}

export { ACTIONABLE_STATUSES, DONE_STATUSES };
