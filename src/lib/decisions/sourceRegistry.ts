// Source registry. Every Decision has exactly one source — Anarix's own
// monitors, Aan's inference, or an external channel Aan is listening to.
//
// v3: glyphs are colorless (all render as `text-muted-foreground`).
// Anarix and Aan use real brand marks; external channels use generic
// monoline lucide glyphs (Calendar/MessageSquare/Users/Mail).

import { Calendar, MessageSquare, Users, Mail, type LucideIcon } from "lucide-react";
import { AnarixMark } from "@/components/branding/AnarixMark";
import { AanMark } from "@/components/branding/AanMark";
import type { ComponentType } from "react";

export type DecisionSource = "anarix" | "aan" | "meeting" | "slack" | "teams" | "email";

export type SourceIcon = LucideIcon | ComponentType<{ size?: number; className?: string }>;

export interface SourceMeta {
  key: DecisionSource;
  label: string;
  icon: SourceIcon;
  /** Kept for future theming, but v3 always uses muted-foreground at rest. */
  colorClass: string;
  /** Explanation of what this source means. */
  description: string;
}

const NEUTRAL = "text-muted-foreground";

export const SOURCE_REGISTRY: Record<DecisionSource, SourceMeta> = {
  anarix: {
    key: "anarix",
    label: "Anarix",
    icon: AnarixMark,
    colorClass: NEUTRAL,
    description: "Anarix platform monitor",
  },
  aan: {
    key: "aan",
    label: "Aan",
    icon: AanMark,
    colorClass: NEUTRAL,
    description: "My own inference",
  },
  meeting: {
    key: "meeting",
    label: "Meeting",
    icon: Calendar,
    colorClass: NEUTRAL,
    description: "Captured from a meeting",
  },
  slack: {
    key: "slack",
    label: "Slack",
    icon: MessageSquare,
    colorClass: NEUTRAL,
    description: "Slack channel or DM",
  },
  teams: {
    key: "teams",
    label: "Teams",
    icon: Users,
    colorClass: NEUTRAL,
    description: "Microsoft Teams",
  },
  email: {
    key: "email",
    label: "Email",
    icon: Mail,
    colorClass: NEUTRAL,
    description: "Inbox thread",
  },
};

export function getSourceMeta(source: DecisionSource): SourceMeta {
  return SOURCE_REGISTRY[source];
}
