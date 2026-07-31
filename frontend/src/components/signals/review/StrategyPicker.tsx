// Strategy picker — simplified: title + brief only. No chips, no metadata.
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Strategy } from "@/lib/decisions/strategies";

interface Props {
  strategies: Strategy[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function StrategyPicker({ strategies, selectedId, onSelect }: Props) {
  return (
    <ul className="space-y-2.5">
      {strategies.map((s) => {
        const active = s.id === selectedId;
        return (
          <li key={s.id}>
            <button
              onClick={() => onSelect(s.id)}
              className={cn(
                "w-full text-left rounded-lg border p-4 transition-all duration-150",
                active
                  ? "border-primary bg-primary/[0.06] shadow-[0_0_0_1px_hsl(var(--primary)/0.3)_inset,0_10px_28px_-14px_hsl(var(--primary)/0.5)]"
                  : "border-border/70 bg-card hover:bg-muted/30",
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "mt-1 h-4 w-4 rounded-full border flex items-center justify-center shrink-0",
                  active ? "border-primary bg-primary" : "border-border",
                )}>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[16px] font-semibold text-foreground leading-tight">{s.title}</span>
                    {s.recommended && (
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-semibold text-primary">
                        <Sparkles className="h-2.5 w-2.5" /> Recommended
                      </span>
                    )}
                  </div>
                  <div className="mt-1.5 text-[14px] leading-relaxed text-foreground/80">
                    {s.detail}
                  </div>
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
