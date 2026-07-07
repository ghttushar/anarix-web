import { Video, Users, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MeetingTaskBundle } from "@/data/mockMeetingTasks";
import { useAanEvents } from "./AanEventsContext";

interface Props {
  bundle: MeetingTaskBundle;
  onOpenDetails: () => void;
}

function initials(name: string): string {
  return name
    .replace(/\(.*?\)/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

/**
 * Meeting-originated task bundle overview card.
 * A meeting produced N action items — user can approve/reject all, or open
 * the detail panel to act on each item independently.
 */
export function MeetingBundleCard({ bundle, onOpenDetails }: Props) {
  const { approveAllMeetingItems, rejectAllMeetingItems } = useAanEvents();
  const pending = bundle.actionItems.filter((it) => it.status === "pending").length;
  const approved = bundle.actionItems.filter((it) => it.status === "approved").length;
  const rejected = bundle.actionItems.filter((it) => it.status === "rejected").length;
  const total = bundle.actionItems.length;
  const shownParticipants = bundle.participants.slice(0, 4);
  const overflow = Math.max(0, bundle.participants.length - shownParticipants.length);

  return (
    <div className="rounded-lg border border-l-4 border-l-primary bg-card px-5 py-4 transition-colors hover:bg-muted/20">
      {/* Meta strip */}
      <div className="flex items-center gap-1.5 mb-3">
        <span className="h-1.5 w-1.5 rounded-full shrink-0 bg-primary" />
        <span className="text-[9.5px] uppercase tracking-wider font-semibold text-primary">From meeting</span>
        <span className="text-[9px] text-muted-foreground/60">·</span>
        <Video className="h-3 w-3 text-muted-foreground" />
        <span className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground truncate">
          {bundle.meetingWhen}
        </span>
        <span className="ml-auto text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground shrink-0">
          {bundle.duration}
        </span>
      </div>

      {/* Title | Action items count */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3 items-start">
        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold text-foreground leading-snug">
            {bundle.meetingTitle}
          </h3>
          <p className="mt-0.5 text-[12px] text-muted-foreground leading-snug line-clamp-2">
            {bundle.summary}
          </p>
        </div>

        <div className="rounded-md border-l-2 border-primary bg-primary/[0.05] px-3 py-2">
          <div className="text-[9.5px] uppercase tracking-wider font-semibold text-primary mb-0.5">
            Action items
          </div>
          <div className="text-[13.5px] font-semibold text-foreground leading-snug">
            {pending} pending
            <span className="text-[11px] font-normal text-muted-foreground"> / {total} total</span>
          </div>
          {(approved > 0 || rejected > 0) && (
            <div className="text-[10.5px] text-muted-foreground mt-0.5">
              {approved > 0 && <span className="text-success">{approved} approved</span>}
              {approved > 0 && rejected > 0 && <span> · </span>}
              {rejected > 0 && <span>{rejected} rejected</span>}
            </div>
          )}
        </div>
      </div>

      {/* Participants */}
      <div className="mt-3 flex items-center gap-2">
        <Users className="h-3 w-3 text-muted-foreground shrink-0" />
        <div className="flex -space-x-1.5">
          {shownParticipants.map((p) => (
            <span
              key={p.name}
              title={`${p.name} — ${p.role}`}
              className="h-6 w-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[9.5px] font-semibold text-foreground/70"
            >
              {initials(p.name)}
            </span>
          ))}
          {overflow > 0 && (
            <span className="h-6 w-6 rounded-full border-2 border-card bg-muted flex items-center justify-center text-[9.5px] font-semibold text-muted-foreground">
              +{overflow}
            </span>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground truncate">
          {bundle.participants.map((p) => p.name.split(" ")[0]).join(", ")}
        </span>
      </div>


      {/* Footer */}
      <div className="mt-3.5 flex items-center justify-between gap-2 pt-2.5 border-t border-border/40">
        <div className="flex items-center gap-1.5">
          {pending > 0 ? (
            <>
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); approveAllMeetingItems(bundle.bundleId); }}
                className="h-7 px-3 text-[11.5px] shadow-none"
              >
                <Check className="h-3 w-3 mr-1" />
                Approve all
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => { e.stopPropagation(); rejectAllMeetingItems(bundle.bundleId); }}
                className="h-7 px-2.5 text-[11.5px] text-muted-foreground hover:text-destructive"
              >
                <X className="h-3 w-3 mr-1" />
                Reject all
              </Button>
            </>
          ) : (
            <span className="text-[11px] text-muted-foreground italic">All items resolved</span>
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
