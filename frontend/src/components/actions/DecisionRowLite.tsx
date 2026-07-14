import { useRef, useEffect } from "react";
import { ArrowRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ImpactChip } from "./chips/ImpactChip";
import { ConfidenceChip } from "./chips/ConfidenceChip";
import { IfIgnoredChip } from "./chips/IfIgnoredChip";
import { LivingStatusChip } from "./chips/LivingStatusChip";
import { SourceGlyph } from "./SourceGlyph";
import { useActionsStore } from "@/state/actionsStore";
import { useSelection } from "@/state/selectionStore";
import { lifecycleFor } from "@/lib/decisions/lifecycle";
import type { Decision } from "@/data/mockDecisions";

interface Props {
  decision: Decision;
  selected: boolean;
  onSelect: () => void;
  onReview: () => void;
}

export function DecisionRowLite({ decision: d, selected, onSelect, onReview }: Props) {
  const { approve, reject, delegateToAan } = useActionsStore();
  let sel: ReturnType<typeof useSelection> | null = null;
  try { sel = useSelection(); } catch { sel = null; }
  const isFocused = sel?.focusedId === d.id;
  const isChecked = sel?.isSelected(d.id) ?? false;
  const rowRef = useRef<HTMLDivElement>(null);
  const lc = lifecycleFor(d);
  const isAanWorking = lc === "aan_working";
  const isTerminal = lc === "completed_today" || lc === "history";

  useEffect(() => {
    if (isFocused) rowRef.current?.scrollIntoView({ block: "nearest" });
  }, [isFocused]);

  return (
    <div
      ref={rowRef}
      onClick={onReview}
      className={cn(
        "group relative flex items-center gap-3 px-4 py-3 border-b border-border/50 last:border-b-0",
        "cursor-pointer transition-colors duration-150",
        selected ? "bg-primary/[0.06]" : "hover:bg-muted/40",
        isFocused && "ring-1 ring-primary/50 ring-inset",
        isTerminal && "opacity-70",
      )}
    >
      {/* checkbox — appears on hover / selection */}
      <div
        className={cn(
          "shrink-0 transition-opacity",
          isChecked || selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={isChecked}
          onCheckedChange={() => sel?.toggle(d.id)}
          aria-label="Select decision"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-medium text-foreground leading-snug truncate">
          {d.insight}
        </div>
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          {isAanWorking ? (
            <LivingStatusChip decision={d} />
          ) : (
            <>
              <ImpactChip decision={d} />
              <ConfidenceChip decision={d} />
              <IfIgnoredChip decision={d} />
            </>
          )}
        </div>
      </div>

      <div className="shrink-0 flex items-center gap-1 text-muted-foreground">
        <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={14} />
      </div>

      {/* hover quick actions */}
      {!isTerminal && !isAanWorking && (
        <div
          className="shrink-0 hidden group-hover:flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button size="sm" variant="ghost" className="h-7 px-2 text-[12px]"
            onClick={() => approve(d.id)}>Approve</Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-[12px] text-muted-foreground"
            onClick={() => delegateToAan(d.id)}>Delegate</Button>
        </div>
      )}

      <Button
        size="sm"
        variant={selected ? "default" : "outline"}
        className="h-7 px-2.5 text-[12px] gap-1"
        onClick={(e) => { e.stopPropagation(); onReview(); }}
      >
        Review
        <ArrowRight className="h-3 w-3" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onSelect={onReview}>Open</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => navigator.clipboard?.writeText(window.location.href + "#" + d.id)}>
            Copy link
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Watch</DropdownMenuItem>
          <DropdownMenuItem disabled>Pin</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => reject(d.id)} className="text-destructive focus:text-destructive">
            Archive
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
