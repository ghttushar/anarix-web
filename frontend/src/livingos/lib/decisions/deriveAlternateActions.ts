// Small helper that synthesizes 2–3 alternate verbs for a Decision's split-button
// dropdown. Purely presentational — no data-model change required.

import type { Decision } from "@/livingos/data/mockDecisions";

export interface AltAction {
  id: string;
  label: string;
  hint?: string;
}

export function deriveAlternateActions(d: Decision): AltAction[] {
  const verb = (d.actionVerb || "Approve").trim();
  const lower = verb.toLowerCase();

  // Domain-flavored alternates keyed off the verb's meaning.
  if (/reallocate|shift|rebalance/.test(lower)) {
    return [
      { id: "20", label: `${verb} 20%`, hint: "Cautious shift — half of the recommended budget." },
      { id: "50", label: `${verb} 50%`, hint: "Recommended shift." },
      { id: "full", label: `${verb} full amount`, hint: "Move the entire proposed budget." },
    ];
  }
  if (/relist|reorder|resend|refresh/.test(lower)) {
    return [
      { id: "now", label: `${verb} now`, hint: "Kick off immediately." },
      { id: "eod", label: `${verb} by end of day`, hint: "Batch with today's other changes." },
      { id: "next", label: `${verb} next business day`, hint: "Queue for tomorrow's start of day." },
    ];
  }
  if (/approve|match|lift|raise|bump|extend|smooth|accept/.test(lower)) {
    return [
      { id: "as_is", label: `${verb} as proposed`, hint: "Apply exactly what I recommended." },
      { id: "half", label: `${verb} at 50%`, hint: "Apply half of the recommended change." },
      { id: "cap", label: `${verb} with $500 cap`, hint: "Hard-cap the change at $500." },
    ];
  }
  if (/pause|suppress|reject|reduce|cut/.test(lower)) {
    return [
      { id: "24h", label: `${verb} for 24h`, hint: "Short-window trial." },
      { id: "7d", label: `${verb} for 7 days`, hint: "One-week trial." },
      { id: "perm", label: `${verb} indefinitely`, hint: "Apply until I revisit." },
    ];
  }
  if (/add|draft|send|attach|circulate|claim|trigger|rewrite|rename|enroll|push|lock|flag|notify|reweight/.test(lower)) {
    return [
      { id: "now", label: `${verb} now`, hint: "Do it immediately." },
      { id: "review", label: `${verb} — I review first`, hint: "Prepare it and hold for my approval." },
    ];
  }
  // Fallback — always at least one alternate.
  return [
    { id: "review", label: `${verb} — I review first`, hint: "Prepare and hold for my approval." },
  ];
}
