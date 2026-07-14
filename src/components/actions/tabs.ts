// Register tabs — collapsed to Needs Me / Watching / Everything.
// Old keys are mapped internally so nothing else in the store breaks.
import type { Decision } from "@/data/mockDecisions";
import { lifecycleFor } from "@/lib/decisions/lifecycle";

export type AlertTabKey = "needs_me" | "watching" | "everything";

export const ALERT_TABS: { key: AlertTabKey; label: string }[] = [
  { key: "needs_me", label: "Needs Me" },
  { key: "watching", label: "Watching" },
  { key: "everything", label: "Everything" },
];

export function filterByTab(all: Decision[], tab: AlertTabKey): Decision[] {
  if (tab === "everything") return all;
  return all.filter((d) => {
    const lc = lifecycleFor(d);
    if (tab === "needs_me") return lc === "needs_me" || lc === "needs_review";
    if (tab === "watching") return lc === "watching" || lc === "aan_working";
    return true;
  });
}

export function computeTabCounts(all: Decision[]): Record<AlertTabKey, number> {
  return {
    needs_me: filterByTab(all, "needs_me").length,
    watching: filterByTab(all, "watching").length,
    everything: all.length,
  };
}
