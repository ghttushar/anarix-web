import { useState } from "react";
import { ArrowRight, ChevronDown, ChevronRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DecisionRowLite } from "./DecisionRowLite";
import { formatValue } from "@/lib/decisions/valueFormat";
import type { Situation } from "@/lib/decisions/groupSituations";

interface Props {
  situation: Situation;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SituationRow({ situation, selectedId, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const first = situation.decisions[0];
  const aggregate = formatValue({
    cents: situation.totalCents,
    kind: situation.primaryKind,
    cadence: first.cadence,
  });

  const decisionsLabel =
    situation.needsCount > 0
      ? `needs ${situation.needsCount} ${situation.needsCount === 1 ? "decision" : "decisions"}`
      : "watching";

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <div
        className={cn(
          "group flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors",
          "hover:bg-muted/30",
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <button
          className="shrink-0 h-6 w-6 flex items-center justify-center text-muted-foreground"
          aria-expanded={open}
          onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        >
          {open
            ? <ChevronDown className="h-3.5 w-3.5" />
            : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        <div className="shrink-0 h-6 w-6 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
          <Layers className="h-3 w-3 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-medium text-foreground truncate">
            {situation.title}
          </div>
          <div className="mt-0.5 text-[12px] text-muted-foreground">
            <span className="tabular-nums font-medium text-foreground/80">
              {situation.decisions.length}
            </span>
            {" events · "}
            {decisionsLabel}
            {situation.totalCents > 0 && (
              <>
                <span className="mx-1.5 text-border">·</span>
                <span className="text-foreground/70">{aggregate.text} aggregate</span>
              </>
            )}
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          className="h-7 px-2.5 text-[12px] gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(first.id);
          }}
        >
          Review
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {open && (
        <div className="border-t border-border/50 bg-muted/10 animate-in fade-in duration-150">
          {situation.decisions.map((d) => (
            <DecisionRowLite
              key={d.id}
              decision={d}
              selected={selectedId === d.id}
              onSelect={() => onSelect(d.id)}
              onReview={() => onSelect(d.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
