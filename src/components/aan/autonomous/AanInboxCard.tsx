import * as LucideIcons from "lucide-react";
import { Check, ChevronRight, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AanEvent, useAanEvents } from "./AanEventsContext";

interface Props {
  event: AanEvent;
  onOpenDetails: () => void;
}

const severityRing: Record<string, string> = {
  critical: "border-destructive/40",
  opportunity: "border-success/40",
  fyi: "border-border",
};
const severityDot: Record<string, string> = {
  critical: "bg-destructive",
  opportunity: "bg-success",
  fyi: "bg-muted-foreground",
};

export function AanInboxCard({ event, onOpenDetails }: Props) {
  const { approve, reject } = useAanEvents();
  const s = event.scenario;
  const Icon = (LucideIcons as any)[s.icon] ?? LucideIcons.Bell;

  const isPending = event.lifecycle === "awaiting_approval" || event.lifecycle === "detected" || event.lifecycle === "analyzing";
  const isExecuting = event.lifecycle === "executing";
  const isFulfilled = event.lifecycle === "fulfilled";
  const isRejected = event.lifecycle === "rejected";

  const progress = event.executionProgress ?? 0;
  const totalSteps = s.steps.length;

  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-3 transition-all",
        severityRing[s.severity],
        (isPending || isExecuting) && "shadow-sm",
        isFulfilled && "opacity-90",
        isRejected && "opacity-60"
      )}
    >
      <div className="flex items-start gap-2.5">
        <div className={cn("mt-0.5 h-7 w-7 rounded-md flex items-center justify-center shrink-0", "bg-muted")}>
          <Icon className="h-3.5 w-3.5 text-foreground/80" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", severityDot[s.severity])} />
            <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">{s.severity}</span>
            <span className="text-[9px] text-muted-foreground/60">·</span>
            <span className="text-[9px] text-muted-foreground truncate">{s.marketplace}</span>
            {event.autoApproved && (
              <span className="ml-auto text-[9px] uppercase tracking-wider font-semibold text-primary shrink-0">Auto</span>
            )}
          </div>
          <div className="font-medium text-[12.5px] text-foreground leading-snug line-clamp-2">{s.title}</div>
          <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{s.subtitle}</div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
              {s.impact}
            </span>
            <span className="text-[10px] text-muted-foreground">Confidence {s.confidence}%</span>
          </div>

          {/* Lifecycle state */}
          {isExecuting && (
            <div className="mt-3 space-y-1.5">
              {s.steps.map((step, i) => {
                const done = i < progress;
                const active = i === progress;
                return (
                  <div key={i} className="flex items-center gap-2 text-[11px]">
                    <div className="w-3.5 flex justify-center shrink-0">
                      {done ? (
                        <Check className="h-3 w-3 text-success" />
                      ) : active ? (
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-muted" />
                      )}
                    </div>
                    <span className={cn("truncate", done ? "text-muted-foreground line-through" : active ? "text-foreground font-medium" : "text-muted-foreground")}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {isFulfilled && (
            <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-success">
              <Check className="h-3 w-3 mt-0.5 shrink-0" />
              <span className="text-foreground/80">{s.fulfillmentNote}</span>
            </div>
          )}

          {isRejected && (
            <div className="mt-2 text-[11px] text-muted-foreground italic">Rejected. Won't repeat for 24h.</div>
          )}

          {/* Actions */}
          <div className="mt-3 flex items-center gap-1.5">
            {isPending && (
              <>
                <Button
                  size="sm"
                  onClick={() => approve(event.eventId)}
                  className="h-7 text-[11px] px-2.5 bg-primary hover:bg-primary/90"
                >
                  {s.actionLabel}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => reject(event.eventId)} className="h-7 text-[11px] px-2 text-muted-foreground">
                  <X className="h-3 w-3 mr-1" />
                  Reject
                </Button>
                <button onClick={onOpenDetails} className="ml-auto text-[10px] text-primary hover:underline flex items-center gap-0.5">
                  View details <ChevronRight className="h-2.5 w-2.5" />
                </button>
              </>
            )}
            {(isFulfilled || isRejected || isExecuting) && (
              <button onClick={onOpenDetails} className="ml-auto text-[10px] text-primary hover:underline flex items-center gap-0.5">
                View details <ChevronRight className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
