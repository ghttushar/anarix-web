import { cn } from "@/lib/utils";
import { formatValue, type ValueKind, type Cadence } from "@/livingos/lib/decisions/valueFormat";

interface Props {
  cents: number;
  kind: ValueKind;
  cadence?: Cadence;
  /** `sm` for row context, `md` for expanded/hero context. */
  size?: "sm" | "md";
  className?: string;
}

const KIND_STYLE: Record<ValueKind, string> = {
  gain:    "bg-success/10  text-success  border-success/25",
  cost:    "bg-slate-500/10 text-slate-600 dark:text-slate-300 border-slate-500/25",
  at_risk: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  info:    "bg-muted text-muted-foreground border-border",
};

export function ValuePill({ cents, kind, cadence, size = "sm", className }: Props) {
  const v = formatValue({ cents, kind, cadence });
  return (
    <span
      aria-label={v.ariaLabel}
      className={cn(
        "inline-flex items-center rounded-md border font-mono font-semibold tabular-nums whitespace-nowrap",
        size === "sm" ? "text-[12px] px-1.5 py-0.5" : "text-[15px] px-2.5 py-1",
        KIND_STYLE[kind],
        className
      )}
    >
      {v.text}
    </span>
  );
}
