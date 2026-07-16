// Meeting card — one card per meeting bundle for the "From Meetings" tab.
// Clicking opens the meeting review view (list of all signals from the meeting).
import { Calendar, ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatValue } from "@/lib/decisions/valueFormat";
import type { Decision } from "@/data/mockDecisions";

interface Props {
  bundleId: string;
  title: string;
  signals: Decision[];
  selected: boolean;
  onSelect: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const hr = diff / 3_600_000;
  if (hr < 1) return `${Math.max(1, Math.round(diff / 60_000))}m ago`;
  if (hr < 24) return `${Math.round(hr)}h ago`;
  return `${Math.round(hr / 24)}d ago`;
}

export function MeetingCard({ bundleId, title, signals, selected, onSelect }: Props) {
  const total = signals.reduce(
    (n, d) => n + (d.valueKind === "info" ? 0 : Math.abs(d.valueCents)),
    0,
  );
  const totalStr = total > 0 ? formatValue({ cents: total, kind: "gain" }).text : null;
  const earliest = Math.min(...signals.map((d) => d.sourceRef.ts));

  return (
    <div
      onClick={onSelect}
      className={cn(
        "group relative flex items-start gap-4 px-4 py-4 cursor-pointer transition-all duration-200",
        "border-b border-border/40 last:border-b-0",
        selected
          ? "bg-primary/[0.05] shadow-[0_0_0_1px_hsl(var(--primary)/0.25)_inset]"
          : "hover:bg-muted/30",
      )}
    >
      {selected && (
        <span className="pointer-events-none absolute inset-y-2 left-0 w-[3px] rounded-r-full bg-primary" />
      )}

      <span className="shrink-0 mt-0.5 h-9 w-9 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
        <Calendar className="h-4 w-4 text-primary" />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading text-[15px] font-semibold text-foreground leading-snug truncate">
            {title}
          </h3>
          <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
            {timeAgo(earliest)}
          </span>
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[12px] text-muted-foreground flex-wrap">
          <span className="inline-flex items-center gap-1">
            <span className="tabular-nums font-medium text-foreground/80">{signals.length}</span>
            signal{signals.length === 1 ? "" : "s"}
          </span>
          {totalStr && (
            <span className="inline-flex items-center gap-1">
              <span className="tabular-nums font-medium text-success">{totalStr}</span>
              aggregate impact
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3" />
            {new Set(signals.map((d) => d.meetingRef?.title || "")).size > 0 ? "Bundle" : "Solo"}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex items-start">
        <Button
          size="sm"
          variant={selected ? "default" : "outline"}
          className="h-7 px-2.5 text-[12px] gap-1"
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          Open
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
