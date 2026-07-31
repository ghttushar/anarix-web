import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import type { AlternativeAction } from "@/lib/decisions/recommendationStructure";

interface Props {
  alternatives: AlternativeAction[];
  onPick?: (key: string) => void;
}

export function AlternativeBlock({ alternatives, onPick }: Props) {
  if (alternatives.length === 0) return null;
  return (
    <ul className="divide-y divide-border/60 rounded-md border border-border bg-card overflow-hidden">
      {alternatives.map((a) => (
        <li
          key={a.key}
          className={cn(
            "flex items-start gap-3 px-3 py-2.5",
            onPick && "cursor-pointer hover:bg-muted/40",
          )}
          onClick={() => onPick?.(a.key)}
        >
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-medium text-foreground">{a.label}</div>
            <div className="text-[12px] text-muted-foreground mt-0.5">{a.reason}</div>
            <div className="text-[11.5px] text-muted-foreground mt-1">{a.impact}</div>
          </div>
          {a.reversible && (
            <span className="shrink-0 inline-flex items-center gap-1 h-5 px-1.5 rounded-full border border-border/70 text-[10.5px] text-muted-foreground">
              <RotateCcw className="h-2.5 w-2.5" /> Reversible
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
