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
 * Overview card — Insight → Value → Action → Verification.
 * Inline Accept/Reject shown for events needing approval.
 * Meeting-sourced events use primary blue on left edge to differentiate visually.
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

  return (
    <div
      className={cn(
        "rounded-lg border border-l-4 bg-card px-5 py-4 transition-colors hover:bg-muted/20",
        isMeeting ? "border-l-primary" : severityAccent[s.severity],
        isRejected && "opacity-60"
      )}
    >
      {/* Meta strip */}
      <div className="flex items-center gap-1.5 mb-2.5">
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

      {/* Insight */}
      <Zone label="Insight">
        <span className="font-medium text-foreground">{s.title}.</span>{" "}
        <span className="text-foreground/70">{s.subtitle}.</span>
      </Zone>

      {/* Value */}
      <Zone label="Value">
        <span className="text-foreground/80">{s.impact}</span>
      </Zone>

      {/* Action or Verification */}
      {isFulfilled ? (
        <Zone label="Verification" tone="success">
          <span className="text-foreground/80 inline-flex items-start gap-1.5">
            <Check className="h-3 w-3 text-success mt-0.5 shrink-0" />
            <span>{s.fulfillmentNote}</span>
          </span>
        </Zone>
      ) : isRejected ? (
        <Zone label="Verification" tone="muted">
          <span className="text-muted-foreground italic">Declined. Aan won't repeat this for 24h.</span>
        </Zone>
      ) : (
        <Zone label="Action">
          <span className="text-foreground/80">{s.recommendation}</span>
        </Zone>
      )}

      {/* Footer: Accept / Reject + View more */}
      <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          {needsApproval && (
            <>
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); approve(event.eventId); }}
                className="h-7 px-3 text-[11.5px]"
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

function Zone({
  label,
  tone,
  children,
}: {
  label: string;
  tone?: "success" | "muted";
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[86px_1fr] gap-3 items-baseline py-1">
      <span
        className={cn(
          "text-[9.5px] uppercase tracking-wider font-semibold",
          tone === "success" ? "text-success" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <div className="text-[13px] leading-snug line-clamp-2">{children}</div>
    </div>
  );
}
