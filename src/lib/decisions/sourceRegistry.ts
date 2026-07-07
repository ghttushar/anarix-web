// Source registry. Every Decision has exactly one source — Anarix's own
// monitors, Aan's inference, or an external channel Aan is listening to.
// Icons intentionally simple lucide monoline so the row scans clean.

import {
  Activity,     // anarix — the platform's own monitors
  Sparkles,     // aan — Aan-originated inference (only source we allow the sparkle glyph for)
  Video,        // meeting
  Hash,         // slack (channel #)
  Users,        // teams
  Mail,         // email
  LucideIcon,
} from "lucide-react";

export type DecisionSource = "anarix" | "aan" | "meeting" | "slack" | "teams" | "email";

export interface SourceMeta {
  key: DecisionSource;
  label: string;
  icon: LucideIcon;
  /** Tailwind text color token used for the icon in default state. */
  colorClass: string;
  /** Explanation of what this source means. */
  description: string;
}

export const SOURCE_REGISTRY: Record<DecisionSource, SourceMeta> = {
  anarix: {
    key: "anarix",
    label: "Anarix",
    icon: Activity,
    colorClass: "text-foreground/80",
    description: "Anarix platform monitor",
  },
  aan: {
    key: "aan",
    label: "Aan",
    icon: Sparkles,
    colorClass: "text-primary",
    description: "Aan's own inference",
  },
  meeting: {
    key: "meeting",
    label: "Meeting",
    icon: Video,
    colorClass: "text-[hsl(268_65%_58%)]",
    description: "Captured from a meeting",
  },
  slack: {
    key: "slack",
    label: "Slack",
    icon: Hash,
    colorClass: "text-[hsl(150_55%_42%)]",
    description: "Slack channel or DM",
  },
  teams: {
    key: "teams",
    label: "Teams",
    icon: Users,
    colorClass: "text-[hsl(232_60%_58%)]",
    description: "Microsoft Teams",
  },
  email: {
    key: "email",
    label: "Email",
    icon: Mail,
    colorClass: "text-[hsl(28_80%_52%)]",
    description: "Inbox thread",
  },
};

export function getSourceMeta(source: DecisionSource): SourceMeta {
  return SOURCE_REGISTRY[source];
}
