import { useState } from "react";
import { CheckCircle2, ChevronDown, Clock, PenLine, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ValuePill } from "./ValuePill";
import { useActionsStore } from "@/state/actionsStore";
import type { MeetingTask, MeetingTaskStatus } from "@/data/mockMeetings";

const STATUS_META: Record<MeetingTaskStatus, { label: string; className: string; dot: string }> = {
  open:          { label: "Open",             className: "text-muted-foreground", dot: "bg-muted-foreground/40" },
  completed:     { label: "Completed",        className: "text-success",          dot: "bg-success" },
  not_completed: { label: "Dismissed",        className: "text-muted-foreground", dot: "bg-muted-foreground/40" },
  with_aan:      { label: "Custom action set", className: "text-primary",         dot: "bg-primary" },
};

interface Props {
  task: MeetingTask;
  onWriteCustom?: (task: MeetingTask) => void;
}

/**
 * Meeting task row — mirrors the reference layout:
 *   • dot + value chip + task text + owner
 *   • Mark completed (primary) · Write custom action (outline) · × dismiss · ▾ expand
 * Completed rows are strikethrough with a green "COMPLETED" pill and no actions.
 */
export function MeetingTaskRow({ task, onWriteCustom }: Props) {
  const [open, setOpen] = useState(false);
  const { markTaskCompleted, markTaskNotCompleted, delegateTaskToAan } = useActionsStore();
  const meta = STATUS_META[task.status];
  const isActionable = task.status === "open";
  const isCompleted = task.status === "completed";

  return (
    <div className={cn("border-b border-border/50 last:border-b-0 transition-colors", !open && !isCompleted && "hover:bg-muted/25")}>
      <div className="flex items-center gap-3 px-4 py-2.5">
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", meta.dot)} />

        {/* Value chip */}
        <div className="shrink-0">
          <ValuePill cents={task.valueCents} kind={task.valueKind} cadence={task.cadence} size="sm" />
        </div>

        {/* Insight + owner (inline like reference) */}
        <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
          <span className={cn(
            "text-[13px] leading-snug",
            isCompleted ? "line-through text-muted-foreground" : "text-foreground",
          )}>
            {task.insight}
          </span>
          {task.owner && (
            <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
              <User className="h-3 w-3" /> {task.owner}
            </span>
          )}
        </div>

        {/* Action cluster — aligned right */}
        <div className="flex items-center gap-1 shrink-0">
          {isActionable ? (
            <>
              <Button
                size="sm"
                onClick={() => markTaskCompleted(task.id)}
                className="h-8 px-2.5 text-[12px] gap-1.5 font-medium"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Mark completed
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => (onWriteCustom ? onWriteCustom(task) : delegateTaskToAan(task.id))}
                className="h-8 px-2.5 text-[12px] gap-1.5"
                title="Write a custom instruction for how to handle this"
              >
                <PenLine className="h-3.5 w-3.5" /> Write custom action
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => markTaskNotCompleted(task.id)}
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <span className={cn(
              "text-[10.5px] uppercase tracking-wider font-semibold px-2 py-1 rounded",
              isCompleted ? "text-success bg-success/10" : meta.className,
            )}>
              {meta.label}
            </span>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="h-8 w-8 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
            title={open ? "Collapse" : "Expand"}
          >
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </button>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-3 pt-1 bg-muted/20 border-t border-border/40 space-y-2.5">
          <div className="pl-6">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Why this number</div>
            <div className="text-[12.5px] text-foreground/85 leading-relaxed">{task.valueBasis}</div>
          </div>
          {task.insightDetail && (
            <div className="pl-6">
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Context</div>
              <div className="text-[12.5px] text-foreground/85 leading-relaxed">{task.insightDetail}</div>
            </div>
          )}
          {task.transcriptExcerpt && (
            <div className="pl-6">
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">From the meeting</div>
              <div className="text-[12.5px] italic text-muted-foreground border-l-2 border-primary/40 pl-2.5">
                {task.transcriptExcerpt}
              </div>
            </div>
          )}
          <div className="pl-6 flex items-center gap-2 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
            <Clock className="h-3 w-3" />
            <span>Updated {new Date(task.updatedAt).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
          </div>
        </div>
      )}
    </div>
  );
}
