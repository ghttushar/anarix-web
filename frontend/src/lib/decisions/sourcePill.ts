// Human-readable source pill labels. Prefers the agent name from sourceRef.label
// when the source is anarix/aan, so cards say "Campaign Agent", "Buy Box Agent",
// "Inventory Agent" — instead of always saying "Anarix".
import { Calendar, MessageSquare, Users, Mail, Sparkles, Bot, Activity } from "lucide-react";
import { AnarixMark } from "@/components/branding/AnarixMark";
import type { Decision } from "@/data/mockDecisions";
import type { DecisionSource } from "@/lib/decisions/sourceRegistry";

export interface SourcePill {
  label: string;
  tone: "amazon" | "walmart" | "agent" | "meeting" | "slack" | "teams" | "email" | "forecast" | "aan";
  Icon: React.ComponentType<{ size?: string | number; className?: string }>;
}

function guessAgent(label: string): string | null {
  const l = label.toLowerCase();
  if (l.includes("campaign") || l.includes("budget") || l.includes("bid")) return "Campaign Agent";
  if (l.includes("buy box") || l.includes("buybox")) return "Buy Box Agent";
  if (l.includes("inventory") || l.includes("stock") || l.includes("days-of-cover") || l.includes("supplier")) return "Inventory Agent";
  if (l.includes("cs") || l.includes("refund") || l.includes("support")) return "Support Agent";
  if (l.includes("pricing") || l.includes("price") || l.includes("margin")) return "Pricing Agent";
  if (l.includes("forecast")) return "Forecast";
  if (l.includes("listing") || l.includes("catalog") || l.includes("portal")) return "Listings Agent";
  return null;
}

export function sourcePillFor(d: Decision): SourcePill {
  const s: DecisionSource = d.source;

  if (s === "meeting") return { label: "Meeting", tone: "meeting", Icon: Calendar };
  if (s === "slack") return { label: "Slack", tone: "slack", Icon: MessageSquare };
  if (s === "teams") return { label: "Teams", tone: "teams", Icon: Users };
  if (s === "email") return { label: "Email", tone: "email", Icon: Mail };
  if (s === "aan") return { label: "Aan", tone: "aan", Icon: Sparkles };

  // anarix — prefer specific agent name; fallback to platform.
  const agent = guessAgent(d.sourceRef.label || d.insight);
  if (agent === "Forecast") return { label: "Forecast", tone: "forecast", Icon: Activity };
  if (agent) return { label: agent, tone: "agent", Icon: Bot };

  // Marketplace fallback.
  const l = (d.sourceRef.label + " " + d.insight).toLowerCase();
  if (l.includes("walmart")) return { label: "Walmart", tone: "walmart", Icon: AnarixMark };
  if (l.includes("amazon") || l.includes("sku") || l.includes("asin") || l.includes("buy box"))
    return { label: "Amazon", tone: "amazon", Icon: AnarixMark };

  return { label: "Anarix", tone: "agent", Icon: AnarixMark };
}

export const PILL_TONE_CLASS: Record<SourcePill["tone"], string> = {
  amazon: "bg-[#FF9900]/10 text-[#B36A00] border-[#FF9900]/30",
  walmart: "bg-[#0071CE]/10 text-[#0071CE] border-[#0071CE]/25",
  agent: "bg-primary/8 text-primary border-primary/20",
  meeting: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/25",
  slack: "bg-[#611F69]/10 text-[#611F69] dark:text-violet-300 border-[#611F69]/25",
  teams: "bg-[#5059C9]/10 text-[#5059C9] border-[#5059C9]/25",
  email: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25",
  forecast: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  aan: "bg-primary/12 text-primary border-primary/25",
};
