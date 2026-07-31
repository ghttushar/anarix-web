// Mock source connection status. In prod this comes from each integration's
// last-sync heartbeat. Any source `stale`/`offline` greys out its glyph and
// surfaces in the SourceStatusStrip at the top of the Decide surface.

import type { DecisionSource } from "./sourceRegistry";

export type SourceStatus = "fresh" | "stale" | "offline";

export interface SourceHealth {
  status: SourceStatus;
  lastSyncedMinAgo?: number;
  note?: string;
}

const MOCK: Record<DecisionSource, SourceHealth> = {
  anarix: { status: "fresh", lastSyncedMinAgo: 1 },
  aan:    { status: "fresh", lastSyncedMinAgo: 0 },
  slack:  { status: "stale", lastSyncedMinAgo: 12, note: "Slack last synced 12m ago — new items held, not lost." },
  teams:  { status: "fresh", lastSyncedMinAgo: 3 },
  email:  { status: "fresh", lastSyncedMinAgo: 4 },
  meeting:{ status: "fresh", lastSyncedMinAgo: 2 },
};

export function getSourceHealth(source: DecisionSource): SourceHealth {
  return MOCK[source];
}

export function anyDegraded(): { source: DecisionSource; health: SourceHealth }[] {
  return (Object.keys(MOCK) as DecisionSource[])
    .filter((s) => MOCK[s].status !== "fresh")
    .map((s) => ({ source: s, health: MOCK[s] }));
}
