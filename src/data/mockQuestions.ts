// Aan Questions — things Aan would rather ask than guess.
// Answering feeds the policy engine so Aan stops asking that class of question.

import type { DecisionSource } from "@/lib/decisions/sourceRegistry";
import type { DecisionDomain } from "@/data/mockDecisions";

export type QuestionStatus = "open" | "answered" | "skipped" | "expired";

export interface QuestionChoice {
  id: string;
  label: string;
  hint?: string;
}

export interface AanQuestion {
  id: string;
  source: DecisionSource;
  domain: DecisionDomain;
  createdAt: number;
  expiresAt: number;         // 72h default
  prompt: string;            // the question itself
  context: string;           // one-sentence background
  choices: QuestionChoice[]; // 2-4 options; last can be a "let me think" style
  status: QuestionStatus;
  chosenId?: string;
  /** Human-readable class Aan will remember once answered ("bid-modifier-caps"). */
  policyClass: string;
}

const HOUR = 60 * 60 * 1000;
const now = Date.now();

export const MOCK_QUESTIONS: AanQuestion[] = [
  {
    id: "q-backinstock-traffic",
    source: "anarix",
    domain: "campaign",
    createdAt: now - 40 * 60 * 1000,
    expiresAt: now + 72 * HOUR,
    prompt: "Should I treat the SKU-B12 back-in-stock traffic spike as organic or paid?",
    context: "Traffic jumped 4.2× in the first hour after restock; source attribution is ambiguous.",
    choices: [
      { id: "organic", label: "Treat as organic",  hint: "no bid adjustments" },
      { id: "paid",    label: "Treat as paid",     hint: "boost bids +15% for 48h" },
      { id: "split",   label: "Split 50/50",       hint: "half bid boost, half organic" },
    ],
    status: "open",
    policyClass: "restock-attribution",
  },
  {
    id: "q-refund-limit",
    source: "aan",
    domain: "cs",
    createdAt: now - 2 * HOUR,
    expiresAt: now + 70 * HOUR,
    prompt: "How much can I auto-refund per Slack escalation before pinging you?",
    context: "You've approved every #cs-urgent refund under $500 for the last 6 weeks (23 approvals).",
    choices: [
      { id: "500",  label: "Up to $500 / claim",  hint: "matches your current pattern" },
      { id: "250",  label: "Up to $250 / claim",  hint: "more conservative" },
      { id: "0",    label: "Always ask me",       hint: "no auto-refund" },
    ],
    status: "open",
    policyClass: "cs-refund-auto",
  },
  {
    id: "q-bid-modifier-cap",
    source: "aan",
    domain: "campaign",
    createdAt: now - 5 * HOUR,
    expiresAt: now + 60 * HOUR,
    prompt: "Cap how aggressive I can get with placement bid modifiers on evergreen campaigns?",
    context: "I want to push top-of-search +85% on 3 hero SKUs; that's above my current +50% ceiling.",
    choices: [
      { id: "keep50",  label: "Keep +50% ceiling",   hint: "safer, slower" },
      { id: "lift85",  label: "Lift to +85%",        hint: "on hero SKUs only" },
      { id: "unlimit", label: "No cap on hero SKUs", hint: "trust my judgement" },
    ],
    status: "open",
    policyClass: "placement-modifier-ceiling",
  },
  {
    id: "q-question-answered",
    source: "aan",
    domain: "buyer",
    createdAt: now - 30 * HOUR,
    expiresAt: now + 42 * HOUR,
    prompt: "Should buyer-email drafts wait for your review, or send after 30-min silence?",
    context: "You've edited < 5% of buyer drafts in the last month.",
    choices: [
      { id: "always", label: "Always wait for me", hint: "no auto-send" },
      { id: "silent", label: "Send after 30-min silence" },
    ],
    status: "answered",
    chosenId: "silent",
    policyClass: "buyer-email-autosend",
  },
];
