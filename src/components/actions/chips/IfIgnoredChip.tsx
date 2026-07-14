import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Decision } from "@/data/mockDecisions";

/** "If ignored" — coarse projection: ~70% of value over 3 days for cost/gain items. */
function ifIgnoredCents(d: Decision): number {
  if (d.valueKind === "info") return 0;
  return Math.round(Math.abs(d.valueCents) * 0.7);
}

function fmt(cents: number): string {
  const dollars = Math.round(cents / 100);
  if (dollars < 1000) return `$${dollars}`;
  if (dollars < 100_000) return `$${(dollars / 1000).toFixed(1)}k`;
  return `$${(dollars / 1_000_000).toFixed(1)}M`;
}

export function IfIgnoredChip({ decision }: { decision: Decision }) {
  const c = ifIgnoredCents(decision);
  if (!c) return null;
  return (
    <span className={cn(
      "inline-flex items-center gap-1 h-6 px-2 rounded-full border text-[11.5px]",
      "text-warning bg-warning/5 border-warning/25",
    )} title="Projected loss over 3 days if ignored">
      <AlertTriangle className="h-3 w-3" />
      Lose ~{fmt(c)} / 3d
    </span>
  );
}
