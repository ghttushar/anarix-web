import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCheck, CheckCircle2, PenLine, User, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AttendeePill } from "./AttendeePill";
import { ValueBlock } from "./ValueBlock";
import { AanMark } from "@/components/branding/AanMark";
import { useActionsStore } from "@/state/actionsStore";
import { valueMagnitude } from "@/lib/decisions/valueFormat";

interface Props {
  bundleId: string;
  /** Called when the user wants to discuss a task (or the meeting) with Aan. */
  onDiscuss?: (taskId?: string) => void;
}

/**
 * Meeting workspace rendered inline inside a Stack row or Grid card.
 * Layout parity with the earlier right-side sheet version, but embedded.
 */
export function InlineMeetingWorkspace({ bundleId, onDiscuss }: Props) {
  const {
    meetings, tasksForBundle, bundleValueCents, bundleOpenCount,
    bulkCompleteBundle, markTaskCompleted, markTaskNotCompleted,
  } = useActionsStore();
  const bundle = meetings.find((m) => m.id === bundleId);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  if (!bundle) return null;

  const tasks = tasksForBundle(bundle.id);
  const openCount = bundleOpenCount(bundle.id);
  const committedCents = bundleValueCents(bundle.id);

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-3 pb-3 border-b border-border/60">
        <div className="flex items-start gap-2">
          <div className="text-[10.5px] uppercase tracking-wider font-semibold text-primary">Meeting workspace</div>
          {openCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => bulkCompleteBundle(bundle.id)}
              className="ml-auto h-7 text-[11.5px] gap-1.5"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all completed
            </Button>
          )}
        </div>

        <div className="mt-2 flex items-start gap-3">
          <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
            <span className="text-primary font-heading font-semibold text-[15px]">M</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-[15px] font-semibold text-foreground leading-snug">
              {bundle.title}
            </div>
            <div className="text-[11.5px] text-muted-foreground mt-0.5">
              {new Date(bundle.ts).toLocaleString([], { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              {" · "}{bundle.durationMin} min
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {bundle.attendees.map((a) => (
            <div key={a.name} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 pl-1 pr-2.5 py-0.5">
              <AttendeePill name={a.name} role={a.role} size={18} />
              <span className="text-[11.5px] text-foreground/80">{a.name}</span>
              {a.role && <span className="text-[11px] text-muted-foreground">· {a.role}</span>}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <Stat label="Tasks" value={String(tasks.length)} />
          <Stat label="Open" value={String(openCount)} tone={openCount ? "primary" : "muted"} />
          <StatValue label="Committed" cents={committedCents} />
        </div>
      </div>

      {/* Summary */}
      <div className="px-4 py-3 border-b border-border/60">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Summary</div>
        <p className="text-[12.5px] text-foreground/85 leading-relaxed">{bundle.summary}</p>
        <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen} className="mt-2">
          <CollapsibleTrigger className="flex items-center gap-1.5 text-[12px] text-primary hover:underline">
            {transcriptOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Transcript excerpt
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1.5 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-[12px] text-muted-foreground italic whitespace-pre-line">
            {bundle.transcriptExcerpt}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Action items */}
      <div>
        <div className="px-4 py-2 border-b border-border/40">
          <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">Action items</span>
        </div>
        {tasks.length === 0 ? (
          <div className="px-4 py-6 text-center text-[12.5px] text-muted-foreground">No action items from this meeting.</div>
        ) : (
          tasks.map((t) => {
            const isOpen = t.status === "open";
            const isCompleted = t.status === "completed";
            return (
              <div key={t.id} className="flex items-center gap-2.5 px-4 py-2 border-b border-border/40 last:border-b-0">
                <div className="shrink-0 w-[80px]">
                  <ValueBlock cents={t.valueCents} kind={t.valueKind} size="sm" />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "text-[13px] leading-snug",
                    isCompleted ? "line-through text-muted-foreground" : "text-foreground",
                  )}>
                    {t.insight}
                  </span>
                  {t.owner && (
                    <span className="inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                      <User className="h-3 w-3" /> {t.owner}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {isOpen ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => markTaskCompleted(t.id)}
                        className="h-8 px-2.5 text-[12px] gap-1.5 font-medium"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark completed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDiscuss?.(t.id)}
                        className="h-8 px-2.5 text-[12px] gap-1.5 border-primary/30 text-primary hover:bg-primary/10"
                        title="Write a custom instruction or discuss with Aan"
                      >
                        <AanMark size={12} className="text-primary" />
                        <PenLine className="h-3.5 w-3.5" /> Write custom action / Discuss with Aan
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markTaskNotCompleted(t.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        title="Dismiss"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <span className={cn(
                      "text-[10.5px] uppercase tracking-wider font-semibold px-2 py-1 rounded",
                      isCompleted ? "text-success bg-success/10" : "text-muted-foreground bg-muted",
                    )}>
                      {isCompleted ? "Completed" : t.status === "with_aan" ? "Custom action set" : "Dismissed"}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "primary" | "success" }) {
  return (
    <div className="rounded-md border border-border/60 bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn(
        "text-[16px] font-mono font-semibold tabular-nums mt-0.5",
        tone === "primary" && "text-primary",
        tone === "success" && "text-success",
      )}>
        {value}
      </div>
    </div>
  );
}

function StatValue({ label, cents }: { label: string; cents: number }) {
  return (
    <div className="rounded-md border border-border/60 bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      {cents > 0 ? (
        <div className="mt-0.5 text-[16px] font-mono font-semibold tabular-nums text-success">
          ${Math.round(cents / 100 / 1000)}k
        </div>
      ) : (
        <div className="text-[16px] font-mono font-semibold tabular-nums text-muted-foreground mt-0.5">-</div>
      )}
    </div>
  );
}

// referenced but unused import guard
void valueMagnitude;
