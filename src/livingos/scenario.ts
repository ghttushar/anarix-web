// The single shared morning scenario, rendered six ways.
// If you change these values, all six directions change in lockstep.

export const scenario = {
  when: {
    weekday: "Tuesday",
    date: "14 October 2026",
    week: "Week 41",
    time: "08:14",
    edition: "No. 428",
  },
  standing: {
    // The one-sentence Standing, used by editorial/paper/room directions.
    sentence:
      "Advertising is holding, but Q4 spend authority runs out Thursday.",
    // The status-code Standing, used by command surface.
    codes: [
      { key: "AD", value: "HOLD", tone: "hold" as const },
      { key: "INV", value: "FIRM", tone: "firm" as const },
      { key: "CASH", value: "FIRM", tone: "firm" as const },
      { key: "AUTH", value: "Q4-03D", tone: "hazard" as const },
      { key: "AGENTS", value: "1", tone: "firm" as const },
    ],
  },
  figures: [
    { label: "Spend, MTD", value: "$847,210", delta: "+2.1%", frame: "vs. plan" },
    { label: "ROAS, 7d", value: "4.62", delta: "−0.08", frame: "vs. 14d" },
    { label: "Authority remaining", value: "3 days", delta: "$186k", frame: "unspent" },
  ],
  domains: [
    { key: "advertising", label: "Advertising", weight: 0.82, tone: "hold" as const, note: "Holding. Authority runs out Thursday." },
    { key: "inventory",   label: "Inventory",   weight: 0.34, tone: "firm" as const, note: "Firm. 41 days cover across top ASINs." },
    { key: "cash",        label: "Cash",        weight: 0.28, tone: "firm" as const, note: "Firm. $2.1M operating headroom." },
    { key: "aan",         label: "Aan",         weight: 0.50, tone: "soft" as const, note: "Thinking about Thursday." },
  ],
  proposal: {
    title: "Shift 12% of Sponsored Products budget into Sponsored Brands",
    body:
      "For the last three days of the Q4 authority window. Recovers ~$22k of unspent authority and lifts branded impression share by an estimated 6–9 points at unchanged ACoS.",
    aanNote: "Worth doing before Thursday.",
    signature: "— A",
    est: { spendMoved: "$102,400", recovered: "$22,300", risk: "Soft" },
  },
  agent: {
    label: "Bid-cap rebalance",
    scope: "US · Sponsored Products",
    etaMinutes: 6,
    started: "08:07",
  },
  lede:
    "Advertising is holding, but the Q4 spend authority runs out Thursday, and roughly $186,000 of it will lapse if nothing changes. Inventory and cash are firm — this is a timing problem, not a health problem. Aan has drafted a single move worth doing before the window closes; the rest of the desk is quiet.",
} as const;

export type Scenario = typeof scenario;

export const directions = [
  {
    slug: "quiet-architecture",
    name: "Quiet Architecture",
    philosophy: "A well-run desk at a serious institution.",
    verdict: "Timeless",
    checksum: 8,
    mood: "/src/assets/livingos/moods/1-quiet-architecture.jpg",
  },
  {
    slug: "gravity-field",
    name: "Gravity Field",
    philosophy: "You don't navigate. You fall toward what matters.",
    verdict: "Novel",
    checksum: 7,
    mood: "/src/assets/livingos/moods/2-gravity-field.jpg",
  },
  {
    slug: "living-canvas",
    name: "Living Canvas",
    philosophy: "The surface breathes. Aan is weather.",
    verdict: "Ambient",
    checksum: 8,
    mood: "/src/assets/livingos/moods/3-living-canvas.jpg",
  },
  {
    slug: "command-surface",
    name: "Command Surface",
    philosophy: "For people supervising money in real time.",
    verdict: "Trustworthy",
    checksum: 5,
    mood: "/src/assets/livingos/moods/4-command-surface.jpg",
  },
  {
    slug: "ambient-room",
    name: "Ambient Room",
    philosophy: "The OS is the room you are in.",
    verdict: "Emotional",
    checksum: 10,
    mood: "/src/assets/livingos/moods/5-ambient-room.jpg",
  },
  {
    slug: "editorial-intelligence",
    name: "Editorial Intelligence",
    philosophy: "A publication written for one person this morning.",
    verdict: "Authored",
    checksum: 8,
    mood: "/src/assets/livingos/moods/6-editorial-intelligence.jpg",
  },
] as const;

export type DirectionSlug = (typeof directions)[number]["slug"];
