import * as LucideIcons from "lucide-react";
import { ArrowRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AanEvent, useAanEvents } from "./AanEventsContext";

interface Props {
  event: AanEvent;
  onOpenDetails: () => void;
  channelLabel?: string;
  channel?: "overnight" | "meeting" | "live";
}

const severityAccent: Record<string, string> = {
  critical: "border-l-destructive",
  opportunity: "border-l-success",
  fyi: "border-l-muted-foreground/40",
};
const severityDot: Record<string, string> = {
  critical: "bg-destructive",
  opportunity: "bg-success",
  fyi: "bg-muted-foreground",
};

/**
 * Overview card — hierarchy: Insight (title) → Value (highlighted band) → Action (instruction) → Footer.
 * Value is the visual anchor; buttons are secondary.
 */
export function AanEventCard({ event, onOpenDetails, channelLabel, channel }: Props) {
  const s = event.scenario;
  const { approve, reject } = useAanEvents();
  const Icon = (LucideIcons as any)[s.icon] ?? LucideIcons.Bell;
  const isFulfilled = event.lifecycle === "fulfilled";
  const isRejected = event.lifecycle === "rejected";
  const isExecuting = event.lifecycle === "executing";
  const needsApproval = ["awaiting_approval", "detected", "analyzing"].includes(event.lifecycle);
  const isMeeting = channel === "meeting";

  // Value band accent varies by state
  const valueBand = isFulfilled
    ? "border-success bg-success/[0.05]"
    : isRejected
    ? "border-muted-foreground/40 bg-muted/40"
    : "border-primary bg-primary/[0.05]";
  const valueLabelTone = isFulfilled
    ? "text-success"
    : isRejected
    ? "text-muted-foreground"
    : "text-primary";
  const valueLabel = isFulfilled ? "Result" : isRejected ? "Status" : "Value";

  return (
    <div
      className={cn(
        "rounded-lg border border-l-4 bg-card px-5 py-4 transition-colors hover:bg-muted/20",
        isMeeting ? "border-l-primary" : severityAccent[s.severity],
        isRejected && "opacity-70"
      )}
    >
      {/* Meta strip */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", isMeeting ? "bg-primary" : severityDot[s.severity])} />
        {channelLabel && (
          <span className={cn(
            "text-[9.5px] uppercase tracking-wider font-semibold",
            isMeeting ? "text-primary" : "text-muted-foreground"
          )}>
            {channelLabel}
          </span>
        )}
        <span className="text-[9px] text-muted-foreground/60">·</span>
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground truncate">
          {s.domain === "campaign" ? "Advertising" : s.domain === "retail" ? "Listing" : s.domain}
        </span>
        {event.autoApproved && (
          <span className="ml-auto text-[9.5px] uppercase tracking-wider font-semibold text-primary shrink-0">Auto</span>
        )}
        {isExecuting && (
          <span className="ml-auto text-[9.5px] uppercase tracking-wider font-semibold text-primary shrink-0 animate-pulse">Executing</span>
        )}
      </div>

      {/* Insight — title + subtitle */}
      <div className="mb-3">
        <h3 className="text-[15px] font-semibold text-foreground leading-snug">
          {s.title}
        </h3>
        <p className="mt-0.5 text-[12px] text-muted-foreground leading-snug line-clamp-2">
          {s.subtitle}
        </p>
      </div>

      {/* Value — highlighted band (the anchor) */}
      <div className={cn("rounded-md border-l-2 px-3 py-2", valueBand)}>
        <div className={cn("text-[9.5px] uppercase tracking-wider font-semibold mb-0.5", valueLabelTone)}>
          {valueLabel}
        </div>
        <div className="text-[14px] font-semibold text-foreground leading-snug">
          {isFulfilled
            ? s.fulfillmentNote
            : isRejected
            ? "Declined. Aan won't repeat this for 24h."
            : s.impact}
        </div>
      </div>

      {/* Action — instruction, only when pending */}
      {!isFulfilled && !isRejected && (
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground shrink-0">
            Action
          </span>
          <span className="text-[13px] text-foreground/80 leading-snug line-clamp-2">
            {s.recommendation}
          </span>
        </div>
      )}

      {/* Footer: Accept / Reject + View more */}
      <div className="mt-3.5 flex items-center justify-between gap-2 pt-2.5 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          {needsApproval && (
            <>
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); approve(event.eventId); }}
                className="h-7 px-3 text-[11.5px] shadow-none"
              >
                <Check className="h-3 w-3 mr-1" />
                {s.actionLabel ?? "Accept"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); reject(event.eventId); }}
                className="h-7 px-2.5 text-[11.5px] text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
        <button
          onClick={onOpenDetails}
          className="text-[11.5px] text-primary hover:underline inline-flex items-center gap-0.5 font-medium"
        >
          View more <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

export const AanInboxCard = AanEventCard;
