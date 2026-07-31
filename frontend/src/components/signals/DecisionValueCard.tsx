// New card design: value is the visual headline. Caption — title — source pill.
// One CTA (Review →) preserved for now. No "Firm", no "Lose …" chip.
import { ArrowRight, MoreHorizontal, Layers, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Decision } from "@/types/signals";
import { formatValue } from "@/lib/decisions/valueFormat";
import { livingStatusPhrase } from "@/lib/decisions/lifecycle";
import { useLivingTick } from "@/hooks/useLivingClock";
import { SourcePill } from "./chips/SourcePill";
import { useActionsStore } from "@/state/signalsStore";

interface Props {
  decision: Decision;
  selected: boolean;
  onSelect: () => void;
  /** When the card is part of a situation group. */
  grouped?: boolean;
  /** Meeting cards behave differently — clicking selects the meeting group. */
  onSelectMeeting?: (bundleId: string) => void;
}

export function DecisionValueCard({ decision: d, selected, onSelect, grouped, onSelectMeeting }: Props) {
  const { approve, reject } = useActionsStore();
  const tick = useLivingTick();
  const f = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
  const isAanWorking = d.status === "in_flight" || d.status === "with_aan";
  const isDone = d.status === "completed" || d.status === "rejected" || isAanWorking;
  const primaryClick = () => {
    if (d.meetingRef && onSelectMeeting) return onSelectMeeting(d.meetingRef.bundleId);
    onSelect();
  };

  const valueTone = "text-foreground";

  return (
    <div
      onClick={primaryClick}
      className={cn(
        "group relative flex items-start gap-4 px-4 py-4 cursor-pointer transition-all duration-200",
        "border-b border-border/40 last:border-b-0",
        selected
          ? "bg-primary/[0.05] shadow-[0_0_0_1px_hsl(var(--primary)/0.25)_inset,0_8px_28px_-12px_hsl(var(--primary)/0.35)]"
          : "hover:bg-muted/30",
        isDone && "opacity-75",
      )}
    >
      {selected && (
        <span className="pointer-events-none absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-primary shadow-[0_0_18px_hsl(var(--primary)/0.6)]" />
      )}

      {grouped && (
        <span className="shrink-0 mt-1 h-5 w-5 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
          <Layers className="h-2.5 w-2.5 text-primary" />
        </span>
      )}

      <div className="flex-1 min-w-0">
        {/* Value headline */}
        <div className={cn("font-heading text-[22px] leading-none font-semibold tabular-nums tracking-tight", valueTone)}>
          {f.text}
        </div>
        <div className="mt-1 text-[11.5px] text-muted-foreground">
          {d.valueCaption}
        </div>

        {/* Title */}
        <div className="mt-2 text-[13.5px] leading-snug text-foreground/90 line-clamp-2 pr-2">
          {d.insight}
        </div>

        {/* Living status OR source pill + severity badge */}
        <div className="mt-2.5 flex items-center gap-1.5 flex-wrap">
          {isAanWorking ? (
            <span className="inline-flex items-center gap-1.5 h-6 px-2 rounded-full border border-primary/25 bg-primary/5 text-[11.5px] text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              {livingStatusPhrase(d.domain, tick)}
            </span>
          ) : (
            <SourcePill decision={d} />
          )}
          {d.severity === "critical" && (
            <span className="inline-flex items-center gap-1 h-6 px-2 rounded-full border border-destructive/30 bg-destructive/10 text-[11px] font-semibold text-destructive uppercase tracking-wider">
              <AlertTriangle className="h-3 w-3" /> Critical
            </span>
          )}
        </div>
      </div>

      {/* Right rail: CTA + overflow */}
      <div className="shrink-0 flex items-start gap-1">
        <Button
          size="sm"
          variant={selected ? "default" : "outline"}
          className="h-7 px-2.5 text-[12px] gap-1"
          onClick={(e) => { e.stopPropagation(); primaryClick(); }}
        >
          Review
          <ArrowRight className="h-3 w-3" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={primaryClick}>Open</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => navigator.clipboard?.writeText(window.location.href + "#" + d.id)}>
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Pin</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => approve(d.id)}>Execute now</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => reject(d.id)} className="text-destructive focus:text-destructive">
              Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
