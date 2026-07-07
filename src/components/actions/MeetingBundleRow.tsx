import { useState, useMemo } from "react";
import { CheckCircle2, XCircle, Clock, User, ArrowRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AttendeePill } from "./AttendeePill";
import { ValuePill } from "./ValuePill";
import { formatValue } from "@/lib/decisions/valueFormat";
import { useActionsStore } from "@/state/actionsStore";
import type { MeetingTask, MeetingTaskStatus } from "@/data/mockMeetings";

const STATUS_META: Record<MeetingTaskStatus, { label: string; className: string; dot: string }> = {
  open:          { label: "Open",          className: "text-muted-foreground",              dot: "bg-muted-foreground/50" },
  completed:     { label: "Completed",     className: "text-success",                       dot: "bg-success" },
  not_completed: { label: "Not completed", className: "text-destructive",                   dot: "bg-destructive" },
  with_aan:      { label: "With Aan",      className: "text-primary",                       dot: "bg-primary" },
};

export function MeetingTaskRow({ task }: { task: MeetingTask }) {
  const [open, setOpen] = useState(false);
  const { markTaskCompleted, markTaskNotCompleted, delegateTaskToAan } = useActionsStore();
  const meta = STATUS_META[task.status];
  const isActionable = task.status === "open";

  return (
    <div className={cn("border-b border-border/50 transition-colors", !open && "hover:bg-muted/30")}>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", meta.dot)} />
        <ValuePill cents={task.valueCents} kind={task.valueKind} cadence={task.cadence} />
        <div className="flex-1 min-w-0 flex items-baseline gap-2">
          <span className={cn("text-[13px] truncate", task.status === "completed" && "line-through text-muted-foreground")} title={task.insight}>
            {task.insight}
          </span>
          {task.owner && (
            <span className="text-[10.5px] text-muted-foreground shrink-0 inline-flex items-center gap-1">
              <User className="h-3 w-3" /> {task.owner}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {!isActionable && (
            <span className={cn("text-[10.5px] uppercase tracking-wider font-semibold", meta.className)}>
              {meta.label}
            </span>
          )}
          {isActionable && (
            <>
              <Button
                size="sm"
                onClick={() => markTaskCompleted(task.id)}
                className="h-7 px-2.5 text-[11.5px] gap-1"
                title="Mark completed"
              >
                <CheckCircle2 className="h-3 w-3" /> Mark completed
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => delegateTaskToAan(task.id)}
                className="h-7 px-2.5 text-[11.5px]"
                title="You take care of it — hand this to Aan"
              >
                You take care of it
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => markTaskNotCompleted(task.id)}
                className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                title="Not completed"
              >
                <XCircle className="h-3.5 w-3.5" />
              </Button>
            </>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="h-7 w-7 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
            title={open ? "Collapse" : "Expand"}
          >
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-3 pb-4 pt-1 pl-9 bg-muted/20 border-t border-border/40 space-y-2.5">
          <section>
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">Why this number</div>
            <div className="text-[12px] text-foreground/85">{task.valueBasis}</div>
          </section>
          {task.transcriptExcerpt && (
            <section>
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">From the meeting</div>
              <div className="text-[12px] italic text-muted-foreground border-l-2 border-primary/40 pl-2.5">
                {task.transcriptExcerpt}
              </div>
            </section>
          )}
          <div className="flex items-center gap-2 text-[10.5px] text-muted-foreground pt-1 border-t border-border/40">
            <Clock className="h-3 w-3" />
            <span>Updated {new Date(task.updatedAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
            <span className="ml-auto">Action verb · <span className="font-medium text-foreground/80">{task.actionVerb}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Bundle overview row ---

interface BundleProps {
  bundleId: string;
  onOpen: (bundleId: string) => void;
  expanded?: boolean;
}

export function MeetingBundleRow({ bundleId, onOpen, expanded }: BundleProps) {
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

  const totalFmt = totalValue > 0 ? formatValue({ cents: totalValue, kind: "gain" }).text.replace("+ ", "") : null;
  const progressPct = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <button
      type="button"
      onClick={() => onOpen(bundleId)}
      className={cn(
        "w-full text-left border-b border-border/50 transition-colors px-3 py-3 flex items-start gap-3",
        expanded ? "bg-primary/[0.04]" : "hover:bg-muted/30",
      )}
    >
      <span className="mt-1 h-7 w-7 rounded-md bg-[hsl(268_65%_58%)]/10 border border-[hsl(268_65%_58%)]/25 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-[hsl(268_65%_58%)]">M</span>
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-[13.5px] font-medium text-foreground truncate">{bundle.title}</span>
          <span className="text-[11px] text-muted-foreground shrink-0">{timeLabel}</span>
        </div>
        <div className="mt-1.5 flex items-center gap-3 flex-wrap">
          <div className="flex -space-x-1.5">
            {bundle.attendees.slice(0, 5).map((a) => (
              <AttendeePill key={a.name} name={a.name} role={a.role} size={20} />
            ))}
            {bundle.attendees.length > 5 && (
              <span className="h-5 w-5 rounded-full bg-muted border border-card text-[9px] font-semibold flex items-center justify-center text-muted-foreground">
                +{bundle.attendees.length - 5}
              </span>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">{bundle.attendees.length} attendees</span>
          <span className="text-[11px] text-muted-foreground">
            <span className="text-foreground/80 font-medium">{tasks.length}</span> tasks
            {openCount > 0 && <> · <span className="text-primary font-medium">{openCount} open</span></>}
          </span>
          {totalFmt && (
            <span className="text-[11px] text-muted-foreground">
              <span className="text-foreground/80 font-medium">{totalFmt}</span> committed
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <div className="w-24 h-1 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-success transition-[width]" style={{ width: `${progressPct}%` }} />
            </div>
            <span className="text-[10.5px] text-muted-foreground font-mono tabular-nums w-8 text-right">{progressPct}%</span>
            <ArrowRight className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", expanded && "rotate-90")} />
          </div>
        </div>
      </div>
    </button>
  );
}
