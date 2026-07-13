import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCheck, ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { AttendeePill } from "./AttendeePill";
import { MeetingTaskRow } from "./MeetingTaskRow";
import { ShareMenu } from "./ShareMenu";
import { ValuePill } from "./ValuePill";
import { useActionsStore } from "@/livingos/state/actionsStore";

interface Props {
  bundleId: string | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

/**
 * Right-side sheet workspace — surfaces one meeting bundle at a time.
 * Layout matches the design reference: purple M avatar + title + timestamp,
 * attendee pills with role labels, 3-stat strip, summary + transcript,
 * then action-items list with completion-language buttons.
 */
export function MeetingWorkspace({ bundleId, onClose, onPrev, onNext, hasPrev, hasNext }: Props) {
  const { meetings, tasksForBundle, bundleValueCents, bundleOpenCount, bulkCompleteBundle } = useActionsStore();
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const bundle = bundleId ? meetings.find((m) => m.id === bundleId) : null;

  return (
    <Sheet open={!!bundleId} onOpenChange={(o) => { if (!o) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-[720px] p-0 flex flex-col">
        {!bundle ? null : (
          <>
            <SheetHeader className="px-5 pt-4 pb-4 border-b border-border/60 space-y-0">
              {/* Eyebrow row */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} title="Back to list">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-[10.5px] uppercase tracking-wider font-semibold text-primary">Meeting workspace</span>
                <div className="ml-auto flex items-center gap-1">
                  {bundleOpenCount(bundle.id) > 0 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => bulkCompleteBundle(bundle.id)}
                      className="h-7 text-[11.5px] gap-1.5 mr-1"
                    >
                      <CheckCheck className="h-3.5 w-3.5" /> Mark all completed
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onPrev} disabled={!hasPrev} title="Previous meeting">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onNext} disabled={!hasNext} title="Next meeting">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <ShareMenu itemLabel={bundle.title} />
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose} title="Close">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Title row — purple M avatar + title + timestamp */}
              <div className="mt-3 flex items-start gap-3">
                <div className="h-9 w-9 rounded-md bg-primary/10 border border-primary/25 flex items-center justify-center shrink-0">
                  <span className="text-primary font-heading font-semibold text-[15px]">M</span>
                </div>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="font-heading text-[17px] font-semibold text-foreground leading-snug">
                    {bundle.title}
                  </SheetTitle>
                  <div className="text-[12px] text-muted-foreground mt-0.5">
                    {new Date(bundle.ts).toLocaleString([], { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    {" · "}{bundle.durationMin} min
                  </div>
                </div>
              </div>

              {/* Attendees — pill + role label */}
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {bundle.attendees.map((a) => (
                  <div key={a.name} className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/30 pl-1 pr-2.5 py-0.5">
                    <AttendeePill name={a.name} role={a.role} size={20} />
                    <span className="text-[11.5px] text-foreground/80">{a.name}</span>
                    {a.role && <span className="text-[11px] text-muted-foreground">· {a.role}</span>}
                  </div>
                ))}
              </div>

              {/* Stat strip */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                <Stat label="Tasks" value={String(tasksForBundle(bundle.id).length)} />
                <Stat
                  label="Open"
                  value={String(bundleOpenCount(bundle.id))}
                  tone={bundleOpenCount(bundle.id) ? "primary" : "muted"}
                />
                <StatValue label="Committed" cents={bundleValueCents(bundle.id)} />
              </div>
            </SheetHeader>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {/* Summary */}
              <div className="px-5 py-4 border-b border-border/60">
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Summary</div>
                <p className="text-[13px] text-foreground/85 leading-relaxed">{bundle.summary}</p>

                <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen} className="mt-3">
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
                <div className="px-5 py-2.5 border-b border-border/40 flex items-center gap-2">
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">Action items</span>
                  <span className="text-[10.5px] text-muted-foreground">· use completion language, not approval</span>
                </div>
                {tasksForBundle(bundle.id).length === 0 ? (
                  <div className="px-5 py-8 text-center text-[12.5px] text-muted-foreground">No action items from this meeting.</div>
                ) : (
                  tasksForBundle(bundle.id).map((t) => <MeetingTaskRow key={t.id} task={t} />)
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

function Stat({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "primary" | "success" }) {
  return (
    <div className="rounded-md border border-border/60 bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn(
        "text-[18px] font-mono font-semibold tabular-nums mt-0.5",
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
        <div className="mt-0.5"><ValuePill cents={cents} kind="gain" size="md" /></div>
      ) : (
        <div className="text-[18px] font-mono font-semibold tabular-nums text-muted-foreground mt-0.5">—</div>
      )}
    </div>
  );
}
