import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AttendeePill } from "./AttendeePill";
import { ValueBlock } from "./ValueBlock";
import { ActionChoiceRow } from "./ActionChoiceRow";

import { useActionsStore } from "@/livingos/state/actionsStore";
import type { Decision } from "@/livingos/data/mockDecisions";

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


      {/* Summary */}
      <div className="px-4 py-3 border-b border-border/60">
        <div className="text-[11.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
          Summary
        </div>
        <p className="text-[14px] text-foreground/90 leading-relaxed">{bundle.summary}</p>
        <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen} className="mt-2.5">
          <CollapsibleTrigger className="flex items-center gap-1.5 text-[12.5px] text-primary hover:underline">
            {transcriptOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Transcript excerpt
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 rounded-md border border-border/60 bg-muted/30 px-3 py-2.5 text-[13px] text-muted-foreground italic whitespace-pre-line">
            {bundle.transcriptExcerpt}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Action items */}
      <div>
        <div className="px-4 py-2 border-b border-border/40 flex items-center justify-between">
          <span className="text-[11.5px] uppercase tracking-wider font-semibold text-muted-foreground">
            Action items
          </span>
          <span className="text-[12px] text-muted-foreground">{tasks.length} total</span>
        </div>
        {tasks.length === 0 ? (
          <div className="px-4 py-5 text-center text-[13px] text-muted-foreground">
            No action items from this meeting.
          </div>
        ) : (
          tasks.map((t) => {
            const isOpen = t.status === "open";
            return (
              <div
                key={t.id}
                className="flex items-center gap-3 px-4 py-3 border-b border-border/40 last:border-b-0"
              >
                <div className="shrink-0 w-[80px]">
                  <ValueBlock cents={t.valueCents} kind={t.valueKind} size="sm" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "text-[14px] leading-snug",
                    !isOpen && t.status === "completed" ? "line-through text-muted-foreground" : "text-foreground",
                  )}>
                    {t.insight}
                  </div>
                  {t.owner && (
                    <div className="mt-1 flex items-center gap-1.5">
                      <AttendeePill name={t.owner} size={18} />
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
                      undoTargetId={t.id}
                    />

                  ) : (
                    <span className={cn(
                      "text-[10.5px] uppercase tracking-wider font-semibold px-2 py-1 rounded",
                      t.status === "completed" && "text-success bg-success/10",
                      t.status === "with_aan" && "text-primary bg-primary/10",
                      t.status === "not_completed" && "text-muted-foreground bg-muted",
                    )}>
                      {t.status === "completed" ? "Completed" : t.status === "with_aan" ? "Custom action set" : "Dismissed"}
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
