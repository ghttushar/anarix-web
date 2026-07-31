// Derives the 7-part Recommendation structure (Summary / Reason / Impact /
// Tradeoff / Risk / Undoability / Confidence) from an existing Decision.
// Falls back to sensible copy when a field is missing on the mock.
import type { Decision } from "@/types/signals";
import { formatValue } from "./valueFormat";
import { confidenceFor } from "@/components/signals/chips/ConfidenceChip";

export interface RecommendationParts {
  summary: string;
  reason: string;
  impact: string;
  tradeoff: string;
  risk: string;
  undoability: string;
  confidence: string;
}

export function recommendationFor(d: Decision): RecommendationParts {
  const f = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
  const conf = confidenceFor(d);

  const summary = d.actionVerb;

  const reason =
    d.insightDetail ||
    d.valueBasis ||
    `${d.sourceRef.label} triggered this on ${new Date(d.createdAt).toLocaleDateString()}.`;

  const impact =
    d.valueKind === "info"
      ? "No direct dollar impact — informational."
      : `${f.text} — ${d.valueCaption}.`;

  const tradeoff = tradeoffFor(d);
  const risk = riskFor(d);
  const undoability = undoFor(d);

  const confidence =
    conf === "firm"
      ? "Firm — high-signal recommendation based on multiple aligned inputs."
      : conf === "soft"
      ? "Soft — directional, some inputs still stabilizing."
      : "Watching — Aan is still gathering evidence; act only if you have context.";

  return { summary, reason, impact, tradeoff, risk, undoability, confidence };
}

function tradeoffFor(d: Decision): string {
  switch (d.domain) {
    case "campaign":
      return "Shifts spend away from another lever. Reversible within a day.";
    case "retail":
      return "Portal/listing action takes 4\u20136h to propagate on Amazon or the retailer.";
    case "profitability":
      return "Margin lift comes at cost of a repricing risk on a small share of orders.";
    case "inventory":
      return "Ties up working capital that could fund campaigns instead.";
    case "cs":
      return "Refunds/comps close the loop but hit gross margin this month.";
    case "buyer":
      return "Buyer-facing move; slower to reverse once the buyer sees the reply.";
    default:
      return "No material tradeoffs.";
  }
}

function riskFor(d: Decision): string {
  if (d.severity === "critical") return "High if ignored — revenue or buyer trust decays fast.";
  if (d.severity === "opportunity") return "Moderate — window closes within days.";
  return "Low — informational; safe to snooze.";
}

function undoFor(d: Decision): string {
  if (d.severity === "fyi") return "Fully reversible.";
  if (d.domain === "cs" || d.domain === "buyer") return "Reversible until the customer/buyer sees the reply.";
  return "Reversible within the 30-second undo window; changes can be rolled back afterwards.";
}

export interface AlternativeAction {
  key: string;
  label: string;
  reason: string;
  impact: string;
  reversible: boolean;
}

export function alternativesFor(d: Decision): AlternativeAction[] {
  const out: AlternativeAction[] = [];
  if (d.status === "open") {
    out.push({
      key: "snooze",
      label: "Snooze until tomorrow",
      reason: "Buys context without dropping the item.",
      impact: "Delays value by ~1 day.",
      reversible: true,
    });
    out.push({
      key: "delegate",
      label: "Delegate to Aan",
      reason: "Aan can execute this within its policy budget.",
      impact: "Same expected impact, no attention cost.",
      reversible: true,
    });
    out.push({
      key: "reject",
      label: "Reject and stand down",
      reason: "Signals Aan to stop suggesting this class of action for 24h.",
      impact: "Forgoes the expected value.",
      reversible: true,
    });
  }
  return out;
}
