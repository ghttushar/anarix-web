// Meeting-aware review view. When a meeting is selected in the queue, the
// right pane shows every alert generated from that meeting, not one alert.
import { useMemo } from "react";
import { Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatValue } from "@/lib/decisions/valueFormat";
import type { Decision } from "@/types/signals";
import { SourcePill } from "../chips/SourcePill";

interface Props {
  bundleId: string;
  bundleTitle: string;
  all: Decision[];
  onOpen: (id: string) => void;
}

export function MeetingReviewView({ bundleId, bundleTitle, all, onOpen }: Props) {
  const alerts = useMemo(
    () => all.filter((d) => d.meetingRef?.bundleId === bundleId),
    [all, bundleId],
  );
  const totalCents = alerts.reduce(
    (n, d) => n + (d.valueKind === "info" ? 0 : Math.abs(d.valueCents)),
    0,
  );
  const totalStr = formatValue({ cents: totalCents, kind: "gain" });

  return (
    <div className="space-y-4">
      <section className="rounded-xl border border-border/70 bg-gradient-to-br from-card via-card to-violet-500/[0.04] p-5">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-muted-foreground">
          <Calendar className="h-3 w-3" /> Meeting
        </div>
        <h2 className="mt-1 font-heading text-[24px] font-semibold text-foreground leading-tight">
          {bundleTitle}
        </h2>
        <div className="mt-3 flex items-center gap-4 text-[12.5px] text-muted-foreground">
          <span><span className="text-foreground/85 tabular-nums font-medium">{alerts.length}</span> alerts generated</span>
          {totalCents > 0 && (
            <span><span className="text-success tabular-nums font-medium">{totalStr.text}</span> aggregate impact</span>
          )}
        </div>
      </section>

      <section>
        <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">
          Alerts from this meeting
        </div>
        <ul className="divide-y divide-border/50 rounded-lg border border-border/60 bg-card overflow-hidden">
          {alerts.map((d) => {
            const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
            return (
              <li
                key={d.id}
                onClick={() => onOpen(d.id)}
                className={cn(
                  "grid grid-cols-[110px_1fr_auto] items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors",
                )}
              >
                <div className={cn(
                  "font-heading text-[16px] font-semibold tabular-nums",
                  d.valueKind === "gain" ? "text-success" :
                  d.valueKind === "cost" ? "text-destructive" :
                  d.valueKind === "at_risk" ? "text-warning" : "text-foreground/80",
                )}>
                  {val.text}
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] text-foreground/90 line-clamp-2">{d.insight}</div>
                  <div className="mt-1"><SourcePill decision={d} /></div>
                </div>
                <div className="text-[11px] text-muted-foreground">{d.actionVerb} →</div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
