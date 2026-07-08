import { CheckCircle2, XCircle, Clock, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountdownRing } from "./CountdownRing";
import { useUndoFor } from "./useUndoFor";
import type { Decision } from "@/data/mockDecisions";

const KIND: Record<
  Exclude<Decision["status"], "open" | "expired">,
  { label: (d: Decision) => string; Icon: typeof CheckCircle2; tone: string }
> = {
  in_flight: {
    label: (d) => `${d.actionVerb || "Approved"} — executing`,
    Icon: CheckCircle2,
    tone: "text-success",
  },
  with_aan: {
    label: () => "Handed to Aan",
    Icon: CheckCircle2,
    tone: "text-primary",
  },
  completed: {
    label: () => "Completed",
    Icon: CheckCircle2,
    tone: "text-success",
  },
  rejected: {
    label: () => "Rejected",
    Icon: XCircle,
    tone: "text-muted-foreground",
  },
  snoozed: {
    label: () => "Snoozed",
    Icon: Clock,
    tone: "text-muted-foreground",
  },
};

interface Props {
  decision: Decision;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Inline confirmation strip — icon + status text + live 30s countdown + undo.
 * Rendered wherever an action row used to be once the decision leaves `open`.
 */
export function SettledStrip({ decision: d, size = "md", className }: Props) {
  const undo = useUndoFor(d.id);
  const meta = KIND[d.status as keyof typeof KIND];
  if (!meta) return null;
  const { Icon, tone } = meta;
  const compact = size === "sm";

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 rounded-md",
        compact ? "px-2 py-1.5" : "px-3 py-2",
        className,
      )}
    >
      <Icon className={cn("shrink-0", tone, compact ? "h-3.5 w-3.5" : "h-4 w-4")} />
      <div className={cn("flex-1 min-w-0 leading-tight", compact ? "text-[12px]" : "text-[13px]")}>
        <span className="font-medium text-foreground">{meta.label(d)}</span>
        {undo.active && (
          <span className="text-muted-foreground"> · undo available for {undo.secondsLeft}s</span>
        )}
      </div>
      {undo.active && (
        <>
          <CountdownRing pct={undo.pct} secs={undo.secondsLeft} size={compact ? 22 : 26} />
          <button
            onClick={(e) => { e.stopPropagation(); undo.undo(); }}
            className={cn(
              "inline-flex items-center gap-1 rounded-md border border-border bg-background text-foreground",
              "font-medium hover:bg-muted transition-colors",
              compact ? "h-7 px-2 text-[11.5px]" : "h-8 px-2.5 text-[12.5px]",
            )}
          >
            <Undo2 className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} /> Undo
          </button>
        </>
      )}
    </div>
  );
}

/** Tailwind classes for the ambient row/card tint per status. */
export function settledTintClasses(status: Decision["status"]): string {
  switch (status) {
    case "in_flight":
    case "with_aan":
    case "completed":
      return "bg-gradient-to-r from-success/[0.07] via-success/[0.03] to-transparent";
    case "rejected":
      return "bg-gradient-to-r from-destructive/[0.06] via-destructive/[0.02] to-transparent";
    case "snoozed":
    case "expired":
      return "bg-gradient-to-r from-muted/60 to-transparent";
    default:
      return "";
  }
}
