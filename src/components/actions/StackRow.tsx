import { useCallback, useEffect, useRef } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ValueBlock } from "./ValueBlock";
import { SourceGlyph } from "./SourceGlyph";
import { ActionChoiceRow } from "./ActionChoiceRow";
import { ShareMenu } from "./ShareMenu";
import { SettledStrip, settledTintClasses } from "./SettledStrip";

import { useActionsStore } from "@/state/actionsStore";
import { useSelection } from "@/state/selectionStore";
import { formatValue } from "@/lib/decisions/valueFormat";
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
  onOpenDetail: (id: string, mode?: "detail" | "ask_aan" | "custom") => void;
  interactive?: boolean;
}

export function StackRow({ decision: d, onOpenDetail, interactive = true }: Props) {
  const { approve, reject } = useActionsStore();
  let sel: ReturnType<typeof useSelection> | null = null;
  try { sel = useSelection(); } catch { sel = null; }
  const isSelected = interactive && sel ? sel.isSelected(d.id) : false;
  const isFocused = interactive && sel ? sel.focusedId === d.id : false;
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFocused) rowRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [isFocused]);

  const isActionable = d.status === "open";
  const isFyi = d.severity === "fyi";
  const tag = STATUS_TAG[d.status];

  const handleRowClick = useCallback(() => {
    onOpenDetail(d.id, "detail");
  }, [d.id, onOpenDetail]);

  return (
    <div
      ref={rowRef}
      className={cn(
        "group relative flex items-stretch border-b border-border/60 last:border-b-0 transition-colors",
        !isActionable && settledTintClasses(d.status),
        isSelected && "bg-primary/[0.05]",
        isFocused && "ring-1 ring-primary/50 ring-inset",
        !isSelected && isActionable && "hover:bg-muted/30",
      )}
    >
      <div className={cn("w-1 shrink-0", SEV_RAIL[d.severity])} aria-hidden />


      <div className="flex-1 min-w-0 flex items-center gap-4 px-4 py-4">
        {interactive && sel && (
          <div
            className={cn(
              "shrink-0 transition-opacity",
              isSelected || isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100",
            )}
          >
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => sel!.toggle(d.id)}
              onClick={(e) => {
                if ((e as unknown as MouseEvent).shiftKey) {
                  e.preventDefault();
                  sel!.toggle(d.id, true);
                }
                e.stopPropagation();
              }}
              aria-label="Select alert"
            />
          </div>
        )}

        <button onClick={handleRowClick} className="shrink-0 w-[140px] text-left" aria-label="Open details">
          <ValueBlock cents={d.valueCents} kind={d.valueKind} cadence={d.cadence} caption={d.valueCaption} size="md" />
        </button>

        <button onClick={handleRowClick} className="flex-1 min-w-0 text-left">
          <div className="text-[15px] font-medium text-foreground leading-snug">{d.insight}</div>
          <div className="mt-1.5 flex items-center gap-2 flex-wrap text-[12.5px] text-muted-foreground">
            <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={11} />
            <span className="text-foreground/70">{d.sourceRef.label}</span>
            <span className="text-border">·</span>
            <span>{timeAgo(d.createdAt)}</span>
            {d.meetingRef && (
              <>
                <span className="text-border">·</span>
                <span className="text-foreground/70">from {d.meetingRef.title}</span>
              </>
            )}
            {tag && (
              <span className={cn("ml-1 rounded-full border px-2 py-[1px] text-[11px] font-medium", tag.className)}>
                {tag.label}
              </span>
            )}
          </div>
        </button>

        {/* Actions cluster — fixed slots, aligned across rows */}
        <div className="shrink-0 flex items-center gap-1.5">
          {isFyi && isActionable ? (
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => { e.stopPropagation(); approve(d.id); }}
              className="h-9 text-[13px] px-3"
            >
              Got it
            </Button>
          ) : isActionable ? (
            <ActionChoiceRow
              decision={d}
              handlers={{
                approve: () => approve(d.id),
                reject: () => reject(d.id),
                custom: () => onOpenDetail(d.id, "custom"),
                viewMore: () => onOpenDetail(d.id, "detail"),
              }}
              layout="horizontal"
            />
          ) : (
            <SettledStrip decision={d} size="sm" />
          )}


          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9" title="More">
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
    </div>
  );
}
