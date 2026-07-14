import { useState, useEffect, useRef } from "react";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ValueBlock } from "./ValueBlock";
import { SourceGlyph } from "./SourceGlyph";
import { ActionChoiceRow } from "./ActionChoiceRow";
import { ShareMenu } from "./ShareMenu";
import { SettledStrip, settledTintClasses } from "./SettledStrip";
import { InlineMeetingWorkspace } from "./InlineMeetingWorkspace";
import { ExpandedAlertBody } from "./ExpandedAlertBody";
import { AttendeePill } from "./AttendeePill";
import { CountdownRing } from "./CountdownRing";
import { useUndoFor } from "./useUndoFor";

import { useActionsStore } from "@/livingos/state/actionsStore";
import { useSelection } from "@/state/selectionStore";
import type { Decision } from "@/livingos/data/mockDecisions";



const SEV_RAIL: Record<Decision["severity"], string> = {
  critical: "bg-destructive",
  opportunity: "bg-success",
  fyi: "bg-muted-foreground/40",
};

const STATUS_TAG: Record<Decision["status"], { label: string; className: string } | null> = {
  open: null,
  with_aan: { label: "Custom action set", className: "text-primary bg-primary/10 border-primary/30" },
  in_flight: { label: "In progress", className: "text-primary bg-primary/10 border-primary/30" },
  completed: { label: "Completed", className: "text-success bg-success/10 border-success/25" },
  rejected: { label: "Dismissed", className: "text-muted-foreground bg-muted border-border" },
  snoozed: { label: "Snoozed", className: "text-muted-foreground bg-muted border-border" },
  expired: { label: "Expired", className: "text-muted-foreground bg-muted border-border" },
};

function timeAgo(ts: number): string {
  const m = Math.round((Date.now() - ts) / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

interface Props {
  decision: Decision;
  expanded: boolean;
  onToggleExpand: () => void;
  onOpenDetail: (id: string, mode?: "detail" | "ask_aan" | "custom") => void;
}

export function GridCard({ decision: d, expanded, onToggleExpand, onOpenDetail }: Props) {
  const { approve, reject, meetings, tasksForBundle } = useActionsStore();
  let sel: ReturnType<typeof useSelection> | null = null;
  try { sel = useSelection(); } catch { sel = null; }
  const isSelected = sel ? sel.isSelected(d.id) : false;
  const [hover, setHover] = useState(false);
  const [hidden, setHidden] = useState(false);
  const undo = useUndoFor(d.id);
  const wasActiveRef = useRef(false);
  useEffect(() => {
    if (undo.active) { wasActiveRef.current = true; return; }
    if (wasActiveRef.current) {
      wasActiveRef.current = false;
      if (d.status !== "open") setHidden(true);
    }
  }, [undo.active, d.status]);

  if (hidden) return null;

  const isActionable = d.status === "open";
  const isFyi = d.severity === "fyi";
  const tag = STATUS_TAG[d.status];
  const isMeeting = !!d.meetingRef;
  const bundle = isMeeting ? meetings.find((m) => m.id === d.meetingRef!.bundleId) : null;
  const meetingTaskCount = bundle ? tasksForBundle(bundle.id).length : 0;
  const meetingAttendeeCount = bundle ? bundle.attendees.length : 0;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "group relative flex overflow-hidden rounded-lg border bg-card transition-all",
        !expanded && "min-h-[160px]",

        expanded ? "border-primary/40 shadow-sm" : "border-border hover:border-border/80 hover:shadow-sm",
        !isActionable && settledTintClasses(d.status),
        isSelected && "ring-1 ring-primary/40",
      )}
    >
      <div className={cn(isMeeting ? "w-[3px] bg-primary" : "w-1", "shrink-0", !isMeeting && SEV_RAIL[d.severity])} aria-hidden />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header row */}
        <div onClick={onToggleExpand} className="flex items-start gap-3 px-4 pt-4 pb-3 cursor-pointer">
          {sel && (
            <div
              className={cn(
                "shrink-0 pt-0.5 transition-opacity",
                isSelected || hover ? "opacity-100" : "opacity-0 group-hover:opacity-100",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <Checkbox
                checked={isSelected}
                onCheckedChange={() => sel!.toggle(d.id)}
                aria-label="Select alert"
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            {isMeeting ? (
              <div className="text-[16px] font-semibold leading-snug text-foreground">
                {d.meetingRef!.title}
              </div>
            ) : (
              <>
                <ValueBlock cents={d.valueCents} kind={d.valueKind} caption={d.valueCaption} size="md" />
                <div className="mt-2.5 text-[14.5px] font-medium leading-snug text-foreground">{d.insight}</div>
              </>
            )}
            <div className="mt-2 flex items-center gap-2 flex-wrap text-[12.5px] text-muted-foreground">
              <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={14} />
              <span className="text-foreground/70">{d.sourceRef.label}</span>
              <span className="text-border">·</span>
              <span>{timeAgo(d.createdAt)}</span>
              {isMeeting && (
                <>
                  <span className="text-border">·</span>
                  <span className="text-foreground/70">{meetingTaskCount} action items</span>
                  <span className="text-border">·</span>
                  <span className="text-foreground/70">{meetingAttendeeCount} attendees</span>
                </>
              )}
              {tag && (
                <span className={cn("ml-1 rounded-full border px-2 py-[1px] text-[11px] font-medium", tag.className)}>
                  {tag.label}
                </span>
              )}
            </div>
          </div>

          {expanded && (
            <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
              <ShareMenu itemLabel={isMeeting ? d.meetingRef!.title : d.insight} />
            </div>
          )}
        </div>

        {/* Meeting preview (collapsed only) — fills empty space with summary + attendee avatars */}
        {isMeeting && !expanded && bundle && (
          <div className="px-4 pb-3 flex flex-col gap-2.5" onClick={onToggleExpand}>
            <p className="text-[13px] leading-relaxed text-muted-foreground line-clamp-2">
              {bundle.summary}
            </p>
            <div className="flex items-center gap-1.5">
              <div className="flex -space-x-1.5">
                {bundle.attendees.slice(0, 5).map((a) => (
                  <AttendeePill key={a.name} name={a.name} role={a.role} size={22} />
                ))}
              </div>
              {bundle.attendees.length > 5 && (
                <span className="text-[11.5px] text-muted-foreground ml-1">
                  +{bundle.attendees.length - 5}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Overview actions — left-aligned; hidden for meetings (per-item actions live in the expanded workspace) */}
        {!isMeeting && (
          <div className="px-4 pb-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {!isActionable ? (
              <SettledStrip decision={d} size="sm" className="px-0" />
            ) : isFyi ? (
              undo.active ? (
                <button
                  onClick={(e) => { e.stopPropagation(); undo.undo(); }}
                  className="h-9 text-[13px] inline-flex items-center gap-2 rounded-md border border-success/40 bg-success/10 text-success px-2.5 pr-3 font-medium hover:bg-success/15 transition-colors"
                  title="Undo — reverts the action"
                >
                  <CountdownRing pct={undo.pct} secs={undo.secondsLeft} size={22} />
                  <Undo2 className="h-3.5 w-3.5" />
                  <span>Undo</span>
                </button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => approve(d.id)}
                  className="h-9 text-[13px] px-3"
                >
                  Got it
                </Button>
              )
            ) : (
              <ActionChoiceRow
                decision={d}
                handlers={{
                  approve: () => approve(d.id),
                  reject: () => reject(d.id),
                  custom: () => onOpenDetail(d.id, "custom"),
                }}
                layout="horizontal"
              />
            )}
          </div>
        )}


        {/* Expanded body — shares card background so it reads as the card growing taller */}
        {expanded && (
          <div className="border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-150">
            {isMeeting ? (
              <div className="p-3">
                <InlineMeetingWorkspace
                  bundleId={d.meetingRef!.bundleId}
                  onDiscuss={(taskId) => onOpenDetail(taskId ?? d.id, "custom")}
                />
              </div>
            ) : (
              <ExpandedAlertBody
                decision={d}
                onApprove={() => approve(d.id)}
                onDiscuss={() => onOpenDetail(d.id, "custom")}
              />
            )}

          </div>
        )}
      </div>
    </div>
  );
}

