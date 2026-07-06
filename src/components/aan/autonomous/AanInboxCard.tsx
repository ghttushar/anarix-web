import * as LucideIcons from "lucide-react";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { AanEvent } from "./AanEventsContext";

interface Props {
  event: AanEvent;
  onOpenDetails: () => void;
  channelLabel?: string;
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
 * Overview card — signal only. Four zones: Insight → Value → Action → Verification.
 * No approve/reject controls; those live in the detail panel opened via "View more".
 */
export function AanEventCard({ event, onOpenDetails, channelLabel }: Props) {
  const s = event.scenario;
  const Icon = (LucideIcons as any)[s.icon] ?? LucideIcons.Bell;
  const isFulfilled = event.lifecycle === "fulfilled";
  const isRejected = event.lifecycle === "rejected";
  const isExecuting = event.lifecycle === "executing";

  return (
    <div
      className={cn(
        "rounded-lg border border-l-4 bg-card px-4 py-3 transition-colors hover:bg-muted/20",
        severityAccent[s.severity],
        isRejected && "opacity-60"
      )}
    >
      {/* Meta strip */}
      <div className="flex items-center gap-1.5 mb-2">
        <span className={cn("h-1.5 w-1.5 rounded-full shrink-0", severityDot[s.severity])} />
        {channelLabel && (
          <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">
            {channelLabel}
          </span>
        )}
        <span className="text-[9px] text-muted-foreground/60">·</span>
        <Icon className="h-3 w-3 text-muted-foreground" />
        <span className="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground truncate">
          {s.domain === "campaign" ? "Advertising" : s.domain === "retail" ? "Listing" : s.domain}
        </span>
        {event.autoApproved && (
          <span className="ml-auto text-[9px] uppercase tracking-wider font-semibold text-primary shrink-0">Auto</span>
        )}
        {isExecuting && (
          <span className="ml-auto text-[9px] uppercase tracking-wider font-semibold text-primary shrink-0 animate-pulse">Executing</span>
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

      <div className="mt-2.5 flex items-center justify-end">
        <button
          onClick={onOpenDetails}
          className="text-[11px] text-primary hover:underline inline-flex items-center gap-0.5 font-medium"
        >
          View more <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

// Back-compat alias for existing imports.
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
    <div className="grid grid-cols-[76px_1fr] gap-3 items-baseline py-0.5">
      <span
        className={cn(
          "text-[9px] uppercase tracking-wider font-semibold",
          tone === "success" ? "text-success" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
      <div className="text-[12.5px] leading-snug line-clamp-2">{children}</div>
    </div>
  );
}
