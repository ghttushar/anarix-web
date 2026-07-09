import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AttendeePill } from "./AttendeePill";
import { ValueBlock } from "./ValueBlock";
import { ActionChoiceRow } from "./ActionChoiceRow";
import { SettledStrip } from "./SettledStrip";
import { useActionsStore } from "@/state/actionsStore";
import type { Decision } from "@/data/mockDecisions";

interface Props {
  bundleId: string;
  onDiscuss?: (taskId?: string) => void;
}

/**
 * Compact meeting workspace rendered inline. Categorized into:
 *   Header → Attendees (initials only) → Summary/Transcript → Action items.
 * Each action item carries its OWN action cluster; there is no clubbed CTA.
 */
export function InlineMeetingWorkspace({ bundleId, onDiscuss }: Props) {
  const {
    meetings, tasksForBundle, markTaskCompleted, markTaskNotCompleted,
  } = useActionsStore();
  const bundle = meetings.find((m) => m.id === bundleId);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  if (!bundle) return null;

  const tasks = tasksForBundle(bundle.id);

  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      {/* Header — tighter */}
      <div className="px-3.5 pt-3 pb-2.5 border-b border-border/60">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-primary mb-1.5">
          Meeting workspace
        </div>
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
            <span className="text-primary font-heading font-semibold text-[14px]">M</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-heading text-[14px] font-semibold text-foreground leading-snug truncate">
              {bundle.title}
            </div>
            <div className="text-[11.5px] text-muted-foreground">
              {new Date(bundle.ts).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              {" · "}{bundle.durationMin} min
            </div>
          </div>
          {/* Attendees — initials only */}
          <div className="flex items-center -space-x-1.5 shrink-0">
            {bundle.attendees.map((a) => (
              <AttendeePill key={a.name} name={a.name} role={a.role} size={22} />
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="px-3.5 py-2.5 border-b border-border/60">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
          Summary
        </div>
        <p className="text-[12.5px] text-foreground/85 leading-relaxed">{bundle.summary}</p>
        <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen} className="mt-2">
          <CollapsibleTrigger className="flex items-center gap-1.5 text-[11.5px] text-primary hover:underline">
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
        <div className="px-3.5 py-2 border-b border-border/40 flex items-center justify-between">
          <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">
            Action items
          </span>
          <span className="text-[11px] text-muted-foreground">{tasks.length} total</span>
        </div>
        {tasks.length === 0 ? (
          <div className="px-4 py-5 text-center text-[12.5px] text-muted-foreground">
            No action items from this meeting.
          </div>
        ) : (
          tasks.map((t) => {
            const isOpen = t.status === "open";
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 px-3.5 py-2.5 border-b border-border/40 last:border-b-0"
              >
                <div className="shrink-0 w-[76px]">
                  <ValueBlock cents={t.valueCents} kind={t.valueKind} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-[13px] leading-snug",
                    !isOpen && t.status === "completed" ? "line-through text-muted-foreground" : "text-foreground",
                  )}>
                    {t.insight}
                  </div>
                  {t.owner && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <AttendeePill name={t.owner} size={16} />
                    </div>
                  )}
                </div>
                <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                  {isOpen ? (
                    <ActionChoiceRow
                      decision={{
                        ...(t as unknown as Decision),
                        actionVerb: t.actionVerb || "Mark completed",
                      } as Decision}
                      handlers={{
                        approve: () => markTaskCompleted(t.id),
                        reject: () => markTaskNotCompleted(t.id),
                        custom: () => onDiscuss?.(t.id),
                      }}
                      layout="horizontal"
                      compact
                    />
                  ) : (
                    <SettledStrip decision={t as unknown as Decision} size="sm" />
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
