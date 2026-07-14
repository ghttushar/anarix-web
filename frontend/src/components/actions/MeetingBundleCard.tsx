import { useMemo } from "react";
import { ArrowRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { AttendeePill } from "./AttendeePill";
import { ShareMenu } from "./ShareMenu";
import { useActionsStore } from "@/state/actionsStore";
import { formatValue } from "@/lib/decisions/valueFormat";

interface Props {
  bundleId: string;
  onOpen: (bundleId: string) => void;
}

export function MeetingBundleCard({ bundleId, onOpen }: Props) {
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
  const valueFmt = totalValue > 0 ? formatValue({ cents: totalValue, kind: "gain" }).text : null;

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />

      <div className="pl-5 pr-5 py-4">
        {/* Top row */}
        <div className="flex items-center gap-2 text-[11.5px]">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="uppercase tracking-wider font-semibold text-foreground">MEETING</span>
          <span className="text-muted-foreground">·</span>
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span className="uppercase tracking-wider font-semibold text-muted-foreground">{timeLabel}</span>
          <div className="ml-auto">
            <ShareMenu itemLabel={bundle.title} />
          </div>
        </div>

        {/* Main body */}
        <div className="mt-3 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-[15.5px] font-semibold text-foreground leading-snug">{bundle.title}</h3>
            {bundle.summary && (
              <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">{bundle.summary}</p>
            )}

            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <div className="flex -space-x-1.5">
                {bundle.attendees.slice(0, 6).map((a) => (
                  <AttendeePill key={a.name} name={a.name} role={a.role} size={24} />
                ))}
                {bundle.attendees.length > 6 && (
                  <span className="h-6 w-6 rounded-full bg-muted border border-card text-[10px] font-semibold flex items-center justify-center text-muted-foreground">
                    +{bundle.attendees.length - 6}
                  </span>
                )}
              </div>
              <span className="text-[12px] text-muted-foreground">
                <span className="text-foreground/80 font-medium">{tasks.length}</span> task{tasks.length === 1 ? "" : "s"}
                {openCount > 0 && <> · <span className="text-primary font-medium">{openCount} open</span></>}
                {completedCount > 0 && <> · <span className="text-success font-medium">{completedCount} done</span></>}
              </span>
            </div>
          </div>

          {valueFmt && (
            <div className="shrink-0 w-[190px] rounded-md border border-border bg-muted/25 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Value</div>
              <div className="text-[15px] font-semibold mt-0.5 text-success leading-tight">{valueFmt}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">across {tasks.length} action{tasks.length === 1 ? "" : "s"}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden max-w-[240px]">
              <div className="h-full bg-success transition-[width]" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[11px] text-muted-foreground font-mono tabular-nums w-9 text-right">{progressPct}%</span>
          </div>
          <button
            type="button"
            onClick={() => onOpen(bundleId)}
            className={cn("text-[12.5px] text-primary font-medium inline-flex items-center gap-1 hover:underline")}
          >
            Open workspace <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
