// Single critical alert shown when Aan Live/Assisted mode is OFF.
// Replaces the full mock feed on /alerts so the user only sees one signal.
import type { Decision } from "@/data/mockDecisions";

const now = Date.now();

export const CRITICAL_ONLY_ID = "critical-b0csh8tcc6";

export const CRITICAL_ONLY_DECISION: Decision = {
  id: CRITICAL_ONLY_ID,
  source: "anarix",
  sourceRef: { label: "Amazon · Inventory", ts: now - 30 * 60 * 1000 },
  valueCents: 688_500,
  valueKind: "at_risk",
  cadence: "weekly",
  valueCaption: "revenue at risk · next 7 days",
  valueBasis:
    "Advertising eligibility was lost on 07 Jun 2026. Estimated 300 units at risk over the next 7 days at current sell-through, with 2,810 units of healthy inventory on hand (~140 days of coverage). Confidence 82%.",
  valueInputs: [
    "Estimated units at risk: 300 (next 7 days)",
    "Inventory available: 2,810 units",
    "Days of coverage: 140+",
    "Confidence: 82%",
  ],
  insight:
    "ASIN B0CSH8TCC6 · Sampler – Decaf 40 Count lost advertising eligibility on 07 Jun 2026.",
  insightDetail:
    "Amazon disabled ads on this ASIN, citing a listing-content issue. Inventory is healthy (140+ days), so the fix is content — not stock.",
  actionVerb: "Analyze Listing",
  domain: "retail",
  severity: "critical",
  status: "open",
  createdAt: now - 45 * 60 * 1000,
  updatedAt: now - 30 * 60 * 1000,
  steps: [
    { label: "Review listing history & sentiment", etaSec: 45, why: "Aan diffs recent listing changes against the last eligible version." },
    { label: "Identify the failing field", etaSec: 30, why: "Locate the specific attribute Amazon flagged." },
    { label: "Draft compliant listing edit", etaSec: 60, why: "Prepare the exact change for your approval before it goes live." },
  ],
  deepLink: { label: "Open in Amazon Seller Central", href: "#" },
};
