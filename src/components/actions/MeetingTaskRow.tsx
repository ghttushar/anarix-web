import { useState } from "react";
import { X, User, Clock, ChevronDown, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ValuePill } from "./ValuePill";
import { ShareMenu } from "./ShareMenu";
import { useActionsStore } from "@/state/actionsStore";
import type { MeetingTask, MeetingTaskStatus } from "@/data/mockMeetings";

const STATUS_META: Record<MeetingTaskStatus, { label: string; className: string; dot: string }> = {
  open:          { label: "Open",          className: "text-muted-foreground",  dot: "bg-muted-foreground/50" },
  completed:     { label: "Done",          className: "text-success",           dot: "bg-success" },
  not_completed: { label: "Rejected",      className: "text-destructive",       dot: "bg-destructive" },
  with_aan:      { label: "You handed to me", className: "text-primary",        dot: "bg-primary" },
};

/**
 * Meeting task row — mirrors DecisionRow's grammar. Primary CTA is the
 * task's action verb (Send forecast, Approve refund, Draft memo, ...);
 * secondary is "You take care of it"; tertiary is Reject.
 */
export function MeetingTaskRow({ task }: { task: MeetingTask }) {
  const [open, setOpen] = useState(false);
  const { markTaskCompleted, markTaskNotCompleted, delegateTaskToAan } = useActionsStore();
  const meta = STATUS_META[task.status];
  const isActionable = task.status === "open";

  return (
    <div className={cn("border-b border-border/50 transition-colors", !open && "hover:bg-muted/25")}>
      <div className="flex items-start gap-3 px-4 py-3">
        <span className={cn("mt-2 h-1.5 w-1.5 rounded-full shrink-0", meta.dot)} />

        <div className="flex-1 min-w-0">
          {/* Line 1 — value + caption */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <ValuePill cents={task.valueCents} kind={task.valueKind} cadence={task.cadence} size="md" />
            <span className="text-[12px] text-muted-foreground">{task.valueCaption}</span>
          </div>
          {/* Line 2 — insight */}
          <div className={cn("mt-1.5 text-[13.5px] text-foreground leading-snug", task.status === "completed" && "line-through text-muted-foreground")}>
            {task.insight}
          </div>
          {/* Line 3 — meta */}
          <div className="mt-1.5 text-[11px] text-muted-foreground flex items-center gap-1.5 flex-wrap uppercase tracking-wide">
            {task.owner && (
              <span className="inline-flex items-center gap-1"><User className="h-2.5 w-2.5" /> {task.owner}</span>
            )}
            {task.owner && !isActionable && <span className="opacity-50">·</span>}
            {!isActionable && (
              <span className={meta.className}>{meta.label}</span>
            )}
          </div>
        </div>

        {/* Action cluster */}
        <div className="flex items-center gap-1.5 shrink-0 pt-1.5">
          {isActionable && (
            <>
              <Button
                size="sm"
                onClick={() => markTaskCompleted(task.id)}
                className="h-8 px-3 text-[12.5px] gap-1 font-medium"
                title={`Record: ${task.actionVerb}`}
              >
                {task.actionVerb}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => delegateTaskToAan(task.id)}
                className="h-8 px-2.5 text-[12px]"
                title="Hand this to me"
              >
                You take care of it
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => markTaskNotCompleted(task.id)}
                className="h-8 px-2.5 text-[12px] text-muted-foreground hover:text-destructive"
                title="Reject"
              >
                <X className="h-3.5 w-3.5 mr-1" /> Reject
              </Button>
            </>
          )}
          <ShareMenu itemLabel={task.insight} />
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
        <div className="px-4 pb-4 pt-1 bg-muted/20 border-t border-border/40 space-y-3">
          <div className="pl-6">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Why this number</div>
            <div className="text-[12.5px] text-foreground/85 leading-relaxed">{task.valueBasis}</div>
          </div>
          {task.insightDetail && (
            <div className="pl-6">
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Insight</div>
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
