import { cn } from "@/lib/utils";
import type { Decision } from "@/data/mockDecisions";
import { formatValue } from "@/lib/decisions/valueFormat";

export function ImpactChip({ decision }: { decision: Decision }) {
  const f = formatValue({ cents: decision.valueCents, kind: decision.valueKind, cadence: decision.cadence });
  const tone =
    decision.valueKind === "gain" ? "text-success bg-success/10 border-success/25" :
    decision.valueKind === "cost" ? "text-destructive bg-destructive/10 border-destructive/25" :
    decision.valueKind === "at_risk" ? "text-warning bg-warning/10 border-warning/25" :
    "text-muted-foreground bg-muted border-border";
  return (
    <span className={cn("inline-flex items-center h-6 px-2 rounded-full border text-[11.5px] font-medium", tone)}
      aria-label={f.ariaLabel}>
      {f.text}
    </span>
  );
}
