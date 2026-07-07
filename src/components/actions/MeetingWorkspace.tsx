import { useState } from "react";
import { ChevronDown, ChevronRight, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AttendeePill } from "./AttendeePill";
import { MeetingTaskRow } from "./MeetingBundleRow";
import { useActionsStore } from "@/state/actionsStore";
import { formatValue } from "@/lib/decisions/valueFormat";

export function MeetingWorkspace({ bundleId }: { bundleId: string }) {
  const { meetings, tasksForBundle, bundleValueCents, bundleOpenCount, bulkCompleteBundle } = useActionsStore();
  const bundle = meetings.find((m) => m.id === bundleId);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  if (!bundle) return null;

  const tasks = tasksForBundle(bundleId);
  const openCount = bundleOpenCount(bundleId);
  const totalValue = bundleValueCents(bundleId);
  const totalFmt = totalValue > 0 ? formatValue({ cents: totalValue, kind: "gain" }).text.replace("+ ", "") : "—";

  return (
    <div className="rounded-lg border border-primary/20 bg-card overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/60 bg-primary/[0.03]">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-primary mb-0.5">Meeting workspace</div>
            <h3 className="font-heading text-[15px] font-semibold text-foreground">{bundle.title}</h3>
            <div className="text-[11.5px] text-muted-foreground mt-0.5">
              {new Date(bundle.ts).toLocaleString([], { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
              {" · "}{bundle.durationMin} min
            </div>
          </div>
          {openCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => bulkCompleteBundle(bundleId)}
              className="h-8 text-[11.5px] gap-1.5 shrink-0"
              title="Mark all open tasks completed"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all completed
            </Button>
          )}
        </div>

        {/* Attendees */}
        <div className="mt-3 flex items-center gap-1.5 flex-wrap">
          {bundle.attendees.map((a) => (
            <div key={a.name} className="flex items-center gap-1.5 rounded-full bg-card border border-border/60 pl-0.5 pr-2 py-0.5">
              <AttendeePill name={a.name} role={a.role} size={18} />
              <span className="text-[11px] text-foreground/80">{a.name}</span>
              {a.role && <span className="text-[10px] text-muted-foreground">· {a.role}</span>}
            </div>
          ))}
        </div>

        {/* Numeric strip */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]">
          <Stat label="Tasks"       value={String(tasks.length)} />
          <Stat label="Open"        value={String(openCount)} tone={openCount ? "primary" : "muted"} />
          <Stat label="Committed"   value={totalFmt} tone="success" />
        </div>
      </div>

      {/* Summary + transcript */}
      <div className="px-4 py-3 border-b border-border/60">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Summary</div>
        <p className="text-[12.5px] text-foreground/85 leading-snug">{bundle.summary}</p>

        <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen} className="mt-2.5">
          <CollapsibleTrigger className="flex items-center gap-1.5 text-[11.5px] text-primary hover:underline">
            {transcriptOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Transcript excerpt
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1.5 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-[11.5px] text-muted-foreground italic whitespace-pre-line">
            {bundle.transcriptExcerpt}
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Tasks */}
      <div>
        <div className="px-4 py-2 border-b border-border/40 flex items-center gap-2">
          <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">Action items</span>
          <span className="text-[10.5px] text-muted-foreground">· use completion language, not approval</span>
        </div>
        {tasks.length === 0 ? (
          <div className="px-4 py-6 text-center text-[12px] text-muted-foreground">No action items from this meeting.</div>
        ) : (
          tasks.map((t) => <MeetingTaskRow key={t.id} task={t} />)
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "muted" }: { label: string; value: string; tone?: "muted" | "primary" | "success" }) {
  return (
    <div className="rounded-md border border-border/60 bg-card px-2.5 py-1.5">
      <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn(
        "text-[13px] font-mono font-semibold tabular-nums",
        tone === "primary" && "text-primary",
        tone === "success" && "text-success",
      )}>
        {value}
      </div>
    </div>
  );
}
