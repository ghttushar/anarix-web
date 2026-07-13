// Living OS — the single authored scenario. Tuesday morning, 08:14.
// Every rendering across Phase 1 & Phase 2 reads from this file.

export type DomainState =
  | "holding"
  | "watching"
  | "firm"
  | "soft"
  | "silent"
  | "recovering";

export interface Domain {
  id: string;
  name: string;
  state: DomainState;
  /** Deliberate loose composition — percentages of the workspace, stable across sessions. */
  x: number;
  y: number;
  /** Relative visual weight — 1.0 baseline, larger = more mass. */
  weight: number;
  /** True when this Domain is producing the next proposal. */
  leaning: boolean;
  /** Short authored narrative Aan wrote about this Domain this morning. */
  narrative: string;
  /** One-line relationships shown to the side when expanded. */
  relationships: string[];
}

export interface Proposal {
  domainId: string;
  sentence: string;
  why: string;
  evidence: string[];
  expectedImpact: string;
  confidence: number; // 0-1
  alternatives: number;
}

export interface RunningAgent {
  id: string;
  label: string;
  remainingMinutes: number;
  domainId: string;
}

export interface Scenario {
  day: string;
  time: string;
  standing: string;
  greeting: string;
  domains: Domain[];
  proposal: Proposal;
  agent: RunningAgent;
}

export const scenario: Scenario = {
  day: "Tuesday",
  time: "08:14",
  standing: "You're standing well. Advertising is watching. Inventory recovered overnight.",
  greeting:
    "Good morning. You're standing well — nothing requires judgment for another two hours. Advertising is leaning toward one.",
  domains: [
    {
      id: "advertising",
      name: "Advertising",
      state: "watching",
      x: 34,
      y: 42,
      weight: 1.35,
      leaning: true,
      narrative:
        "Sponsored Products is holding at 3.1× ROAS, but Q4 spend authority runs out Thursday. Aan is watching the last-72-hour pacing and has drafted one move — a 12% shift from SP into SB to protect brand share through the window's close.",
      relationships: [
        "3 running campaigns · 1 delegated",
        "watched by Marketing",
        "linked to Cash · Inventory",
      ],
    },
    {
      id: "inventory",
      name: "Inventory",
      state: "recovering",
      x: 62,
      y: 30,
      weight: 1.05,
      leaning: false,
      narrative:
        "The West-coast fulfillment gap from last week has closed. Stock levels on the top 8 SKUs are back inside their guardrails. Aan is no longer proposing intervention here.",
      relationships: ["8 SKUs · firm", "linked to Advertising · Cash"],
    },
    {
      id: "cash",
      name: "Cash",
      state: "firm",
      x: 78,
      y: 55,
      weight: 1.0,
      leaning: false,
      narrative:
        "$412k runway with 47 days of cover on current burn. Two receivables clear Friday. Nothing to attend to.",
      relationships: ["47 days cover · firm", "linked to Advertising"],
    },
    {
      id: "customers",
      name: "Customers",
      state: "holding",
      x: 50,
      y: 68,
      weight: 0.95,
      leaning: false,
      narrative:
        "NPS steady at 62. Two enterprise conversations are in-flight — one closing this week, one on hold. No immediate signal.",
      relationships: ["2 open · 1 closing", "watched by Sales"],
    },
    {
      id: "operations",
      name: "Operations",
      state: "silent",
      x: 22,
      y: 66,
      weight: 0.9,
      leaning: false,
      narrative:
        "All pipelines green. Last incident was 11 days ago. Aan has nothing to say here today.",
      relationships: ["green · 11d since incident"],
    },
    {
      id: "people",
      name: "People",
      state: "holding",
      x: 15,
      y: 30,
      weight: 0.9,
      leaning: false,
      narrative:
        "One hire closing Thursday. One 1:1 flagged for follow-up from last week's meeting notes. No urgency.",
      relationships: ["1 hire closing · 1 follow-up"],
    },
  ],
  proposal: {
    domainId: "advertising",
    sentence:
      "Shift 12% of Sponsored Products budget into Sponsored Brands for the last three days of the Q4 window.",
    why: "SP is efficient but saturated at current spend. SB share-of-voice on branded terms has drifted 4 points below its trailing average, and Q4 competitor pressure typically peaks in the final 72 hours. Reallocation protects brand defensive share without adding net spend.",
    evidence: ["SP ROAS 3.1×", "SB SoV −4pts", "Q4 window · 03d left"],
    expectedImpact:
      "Standing holds. Brand SoV recovers to trailing average by Thursday close.",
    confidence: 0.78,
    alternatives: 2,
  },
  agent: {
    id: "bid-cap-rebalance",
    label: "rebalancing US-Sponsored bid caps",
    remainingMinutes: 6,
    domainId: "advertising",
  },
};
