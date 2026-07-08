import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp, Maximize2, Minimize2, MoreHorizontal, ExternalLink } from "lucide-react";
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

import { useActionsStore } from "@/state/actionsStore";
import { useSelection } from "@/state/selectionStore";
import type { Decision } from "@/data/mockDecisions";
import { formatValue } from "@/lib/decisions/valueFormat";

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
  rejected: { label: "Rejected", className: "text-muted-foreground bg-muted border-border" },
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
  focused?: boolean;
  onToggleExpand: () => void;
  onToggleFocus: () => void;
  onOpenDetail: (id: string, mode?: "detail" | "ask_aan" | "custom") => void;
}

export function GridCard({ decision: d, expanded, focused, onToggleExpand, onToggleFocus, onOpenDetail }: Props) {
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
        "group relative flex overflow-hidden rounded-lg border bg-card transition-all",
        expanded ? "border-primary/40 shadow-sm" : "border-border hover:border-border/80 hover:shadow-sm",
        !isActionable && settledTintClasses(d.status),
        isSelected && "ring-1 ring-primary/40",
      )}
    >

      <div className={cn("w-1 shrink-0", SEV_RAIL[d.severity])} aria-hidden />

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
            <ValueBlock cents={d.valueCents} kind={d.valueKind} cadence={d.cadence} caption={d.valueCaption} size="md" />
            <div className="mt-2.5 text-[14.5px] font-medium leading-snug text-foreground">{d.insight}</div>
            <div className="mt-2 flex items-center gap-2 flex-wrap text-[12.5px] text-muted-foreground">
              <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={11} />
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
            <div className="flex items-center gap-0.5">
              <Button
                variant="ghost" size="icon"
                onClick={(e) => { e.stopPropagation(); onToggleFocus(); }}
                className="h-7 w-7 text-muted-foreground"
                title={focused ? "Exit focus" : "Focus this card"}
              >
                {focused ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
              </Button>
              <Button
                variant="ghost" size="icon"
                onClick={(e) => { e.stopPropagation(); onToggleExpand(); }}
                className="h-7 w-7 text-muted-foreground"
                title={expanded ? "Collapse" : "Expand"}
              >
                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              </Button>
            </div>
            {!expanded && isActionable && !isFyi && (
              <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">
                Expand for actions
              </span>
            )}
          </div>
        </div>

        {/* Expanded body */}
        {expanded && (
          <div className="px-4 pb-4 pt-1 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-150">
            {d.meetingRef && (
              <div className="mt-3 rounded-md border border-border/60 bg-muted/30 px-3 py-2 text-[12.5px] text-muted-foreground">
                <span className="uppercase tracking-wider text-[10.5px] font-semibold text-foreground/70 mr-2">From meeting</span>
                {d.meetingRef.title} — <span className="italic">"{d.meetingRef.excerpt}"</span>
              </div>
            )}

            {d.insightDetail && (
              <p className="mt-3 text-[13px] leading-relaxed text-foreground/85">{d.insightDetail}</p>
            )}

            {isActionable && !isFyi && (
              <div className="mt-4">
                <ActionChoiceRow
                  decision={d}
                  handlers={{
                    approve: () => approve(d.id),
                    reject: () => reject(d.id),
                    custom: () => onOpenDetail(d.id, "custom"),
                    viewMore: () => onOpenDetail(d.id, "detail"),
                  }}
                  layout={focused ? "horizontal" : "horizontal"}
                />
              </div>
            )}

            {isFyi && isActionable && (
              <div className="mt-4 flex items-center justify-between">
                <span className="text-[12.5px] text-muted-foreground">Notification only — no action required.</span>
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
                  <DropdownMenuItem onSelect={() => onOpenDetail(d.id, "ask_aan")}>
                    Ask Aan about this
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      navigator.clipboard.writeText(
                        `${formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence }).text} — ${d.valueBasis}`,
                      );
                    }}
                  >
                    Copy $ rationale
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
                        Reject
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
