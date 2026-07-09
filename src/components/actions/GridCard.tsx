import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ValueBlock } from "./ValueBlock";
import { SourceGlyph } from "./SourceGlyph";
import { ActionChoiceRow } from "./ActionChoiceRow";
import { ShareMenu } from "./ShareMenu";
import { SettledStrip, settledTintClasses } from "./SettledStrip";
import { InlineMeetingWorkspace } from "./InlineMeetingWorkspace";

import { useActionsStore } from "@/state/actionsStore";
import { useSelection } from "@/state/selectionStore";
import type { Decision } from "@/data/mockDecisions";

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

/**
 * Grid card. Single chevron toggle. When expanded, height is ~2× collapsed.
 * Parent uses CSS columns so expanding one card only pushes cards below it
 * in the same column — the neighbour column is untouched.
 */
export function GridCard({ decision: d, expanded, onToggleExpand, onOpenDetail }: Props) {
  const { approve, reject } = useActionsStore();
  let sel: ReturnType<typeof useSelection> | null = null;
  try { sel = useSelection(); } catch { sel = null; }
  const isSelected = sel ? sel.isSelected(d.id) : false;
  const [hover, setHover] = useState(false);

  const isActionable = d.status === "open";
  const isFyi = d.severity === "fyi";
  const tag = STATUS_TAG[d.status];

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={cn(
        "group relative flex overflow-hidden rounded-lg border bg-card transition-all break-inside-avoid mb-3",
        expanded ? "border-primary/40 shadow-sm" : "border-border hover:border-border/80 hover:shadow-sm",
        !isActionable && settledTintClasses(d.status),
        isSelected && "ring-1 ring-primary/40",
      )}
    >

      <div className={cn("w-1 shrink-0", SEV_RAIL[d.severity])} aria-hidden />

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header row — click toggles expand */}
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
            <ValueBlock cents={d.valueCents} kind={d.valueKind} caption={d.valueCaption} size="md" />
            <div className="mt-2.5 text-[14.5px] font-medium leading-snug text-foreground">{d.insight}</div>
            <div className="mt-2 flex items-center gap-2 flex-wrap text-[12.5px] text-muted-foreground">
              <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={14} />
              <span className="text-foreground/70">{d.sourceRef.label}</span>
              <span className="text-border">·</span>
              <span>{timeAgo(d.createdAt)}</span>
              {tag && (
                <span className={cn("ml-1 rounded-full border px-2 py-[1px] text-[11px] font-medium", tag.className)}>
                  {tag.label}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-end gap-1">
            <Button
              variant="ghost" size="icon"
              onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
              className="h-7 w-7 text-muted-foreground"
              title={expanded ? "Collapse" : "Expand"}
              aria-label={expanded ? "Collapse" : "Expand"}
            >
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
            </Button>
            {!expanded && isActionable && !isFyi && (
              <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">
                Expand for actions
              </span>
            )}
            {!expanded && !isActionable && (
              <SettledStrip decision={d} size="sm" className="px-0 py-0" />
            )}
          </div>
        </div>

        {/* Expanded body — target ~2× collapsed height */}
        {expanded && (
          <div className="px-4 pb-4 pt-1 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-150">
            {d.insightDetail && (
              <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">{d.insightDetail}</p>
            )}
            {d.meetingRef && (
              <div className="mt-3">
                <InlineMeetingWorkspace bundleId={d.meetingRef.bundleId} onDiscuss={(taskId) => onOpenDetail(taskId ?? d.id, "custom")} />
              </div>
            )}

            {isActionable && !isFyi && (
              <div className="mt-4 flex justify-start">
                <ActionChoiceRow
                  decision={d}
                  handlers={{
                    approve: () => approve(d.id),
                    reject: () => reject(d.id),
                    custom: () => onOpenDetail(d.id, "custom"),
                  }}
                  layout="horizontal"
                />
              </div>
            )}

            {!isActionable && (
              <div className="mt-4">
                <SettledStrip decision={d} />
              </div>
            )}

            {isFyi && isActionable && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12.5px] text-muted-foreground">Notification only, no action required.</span>
                <Button size="sm" variant="outline" onClick={() => approve(d.id)} className="h-8 text-[12.5px]">
                  Got it
                </Button>
              </div>
            )}

            <div className="mt-4 flex items-center justify-end border-t border-border/40 pt-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="More">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuItem onSelect={() => onOpenDetail(d.id, "custom")}>
                    Discuss with Aan
                  </DropdownMenuItem>
                  {d.deepLink && (
                    <DropdownMenuItem onSelect={() => window.location.assign(d.deepLink!.href)}>
                      {d.deepLink.label} <ExternalLink className="h-3 w-3 ml-auto" />
                    </DropdownMenuItem>
                  )}
                  <div className="px-2 py-1">
                    <ShareMenu itemLabel={d.insight} />
                  </div>
                  {isActionable && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onSelect={() => reject(d.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        Dismiss
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
