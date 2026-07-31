import type { Strategy } from "@/lib/decisions/strategies";

interface Props {
  strategy: Strategy;
}

export function ExecutionPlan({ strategy }: Props) {
  if (!strategy.steps.length) return null;
  return (
    <ol className="space-y-2">
      {strategy.steps.map((step, i) => (
        <li key={i} className="flex gap-3 items-start">
          <span className="shrink-0 h-6 w-6 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-semibold tabular-nums flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] text-foreground/90">{step.label}</div>
            {step.note && (
              <div className="text-[11.5px] text-muted-foreground mt-0.5">{step.note}</div>
            )}
          </div>
        </li>
      ))}
      <li className="flex gap-3 items-start pt-1 border-t border-border/50">
        <span className="shrink-0 h-6 w-6 rounded-full bg-muted/60 border border-border/70 text-muted-foreground text-[11px] flex items-center justify-center mt-0.5">
          ↺
        </span>
        <div className="flex-1 text-[12px] text-muted-foreground">
          Rollback automatically if metrics regress within 24 h.
        </div>
      </li>
    </ol>
  );
}
