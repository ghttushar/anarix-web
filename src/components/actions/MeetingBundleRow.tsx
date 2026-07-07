import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttendeePill } from "./AttendeePill";
import { ValuePill } from "./ValuePill";
import { SourceGlyph } from "./SourceGlyph";
import { useActionsStore } from "@/state/actionsStore";

interface Props {
  bundleId: string;
  onOpen: (bundleId: string) => void;
  expanded?: boolean;
}

/**
 * Compact bundle overview row. Consistent with DecisionRow density —
 * source glyph + attendee cluster + tasks/open/committed strip.
 */
export function MeetingBundleRow({ bundleId, onOpen, expanded }: Props) {
  const { meetings, tasksForBundle, bundleValueCents, bundleOpenCount } = useActionsStore();
  const bundle = meetings.find((m) => m.id === bundleId);
  const tasks = tasksForBundle(bundleId);
  const openCount = bundleOpenCount(bundleId);
  const completedCount = useMemo(() => tasks.filter((t) => t.status === "completed").length, [tasks]);
  const totalValue = bundleValueCents(bundleId);
  if (!bundle) return null;

  const dt = new Date(bundle.ts);
  const isToday = dt.toDateString() === new Date().toDateString();
  const timeLabel = `${isToday ? "Today" : dt.toLocaleDateString([], { month: "short", day: "numeric" })} · ${dt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })} · ${bundle.durationMin}m`;

  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(bundleId)}
      className={cn(
        "w-full text-left border-b border-border/60 transition-colors px-4 py-3.5 flex items-start gap-3",
        expanded ? "bg-primary/[0.05]" : "hover:bg-muted/25",
      )}
    >
      <SourceGlyph source="meeting" size={14} />

      <div className="flex-1 min-w-0">
        {/* Line 1 — title + committed value + time */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="text-[14px] font-medium text-foreground">{bundle.title}</span>
          {totalValue > 0 && <ValuePill cents={totalValue} kind="gain" size="sm" />}
          <span className="text-[11.5px] text-muted-foreground">{timeLabel}</span>
        </div>

        {/* Line 2 — attendees (initials only) */}
        <div className="mt-2 flex items-center gap-2.5 flex-wrap">
          <div className="flex -space-x-1.5">
            {bundle.attendees.slice(0, 6).map((a) => (
              <AttendeePill key={a.name} name={a.name} role={a.role} size={22} />
            ))}
            {bundle.attendees.length > 6 && (
              <span className="h-[22px] w-[22px] rounded-full bg-muted border border-card text-[10px] font-semibold flex items-center justify-center text-muted-foreground">
                +{bundle.attendees.length - 6}
              </span>
            )}
          </div>
          <span className="text-[11.5px] text-muted-foreground">
            <span className="text-foreground/80 font-medium">{tasks.length}</span> task{tasks.length === 1 ? "" : "s"}
            {openCount > 0 && <> · <span className="text-primary font-medium">{openCount} open</span></>}
            {completedCount > 0 && <> · <span className="text-success font-medium">{completedCount} done</span></>}
          </span>
        </div>
      </div>

      {/* Trailing: progress + open */}
      <div className="shrink-0 pt-2 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-24 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-success transition-[width]" style={{ width: `${progressPct}%` }} />
          </div>
          <span className="text-[11px] text-muted-foreground font-mono tabular-nums w-8 text-right">{progressPct}%</span>
        </div>
        <span className="text-[12px] text-primary font-medium inline-flex items-center gap-1">
          Open <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </button>
  );
}
