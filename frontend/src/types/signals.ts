import type { DecisionSource } from "@/lib/decisions/sourceRegistry";
import type { ValueKind, Cadence } from "@/lib/decisions/valueFormat";

export type DecisionStatus =
  | "open"
  | "with_aan"
  | "in_flight"
  | "completed"
  | "rejected"
  | "snoozed"
  | "expired";

export type DecisionDomain =
  | "campaign"
  | "retail"
  | "profitability"
  | "inventory"
  | "cs"
  | "buyer";

export interface DecisionEvidence {
  kind: "delta" | "sparkline" | "table";
  delta?: { beforeLabel: string; before: number; afterLabel: string; after: number; unit?: string };
  sparkline?: { series: number[]; label: string };
  table?: { headers: string[]; rows: string[][] };
}

export interface DecisionStep {
  label: string;
  etaSec: number;
  why?: string;
}

export interface Decision {
  id: string;
  source: DecisionSource;
  sourceRef: { label: string; url?: string; ts: number };
  valueCents: number;
  valueKind: ValueKind;
  cadence?: Cadence;
  valueCaption: string;
  valueBasis: string;
  valueInputs?: string[];
  insight: string;
  insightDetail?: string;
  actionVerb: string;
  domain: DecisionDomain;
  severity: "critical" | "opportunity" | "fyi";
  status: DecisionStatus;
  createdAt: number;
  updatedAt: number;
  snoozedUntil?: number;
  startedAt?: number;
  dupeKey?: string;
  meetingRef?: { bundleId: string; title: string; excerpt: string };
  evidence?: DecisionEvidence;
  steps: DecisionStep[];
  deepLink?: { label: string; href: string };
  detailContent?: {
    title: string;
    asin: string;
    productName: string;
    sections: { heading: string; body: string }[];
  };
}

export interface DigestItem {
  id: string;
  source: DecisionSource;
  ts: number;
  what: string;
  valueCents: number;
  valueKind: ValueKind;
  domain: DecisionDomain;
}
