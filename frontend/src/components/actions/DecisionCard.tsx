import { useCallback } from "react";
import { ArrowRight, Check, X, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShareMenu } from "./ShareMenu";
import { SnoozeMenu } from "./SnoozeMenu";
import { SourceGlyph } from "./SourceGlyph";
import type { Decision } from "@/data/mockDecisions";
import { useActionsStore, type SnoozeChoice } from "@/state/actionsStore";
import { getSourceMeta } from "@/lib/decisions/sourceRegistry";
import { formatValue } from "@/lib/decisions/valueFormat";

interface Props {
  decision: Decision;
  duplicates?: Decision[];
  interactive?: boolean;
}

const STATUS_PILL: Record<Decision["status"], { label: string; className: string } | null> = {
  open: null,
  with_aan: { label: "WITH ME", className: "text-primary border-primary/40 bg-primary/5" },
  in_flight: { label: "EXECUTING", className: "text-primary border-primary/40 bg-primary/5" },
  completed: { label: "DONE", className: "text-success border-success/40 bg-success/5" },
  rejected: { label: "REJECTED", className: "text-muted-foreground border-border bg-muted/50" },
  snoozed: { label: "SNOOZED", className: "text-muted-foreground border-border bg-muted/50" },
  expired: { label: "EXPIRED", className: "text-muted-foreground border-border bg-muted/50" },
};

function railColor(d: Decision): string {
  if (d.severity === "critical") return "bg-destructive";
  if (d.status === "in_flight" || d.status === "with_aan") return "bg-primary";
  if (d.severity === "opportunity") return "bg-success";
  return "bg-muted-foreground/40";
}

function statusEyebrow(d: Decision): string {
  if (d.status === "in_flight") return "EXECUTING";
  if (d.status === "with_aan") return "WITH ME";
  if (d.status === "completed") return "DONE";
  if (d.status === "rejected") return "REJECTED";
  if (d.status === "expired") return "EXPIRED";
  const hour = new Date(d.createdAt).getHours();
  if (hour >= 22 || hour < 8) return "OVERNIGHT";
  return "LIVE";
}

function statusDot(d: Decision): string {
  if (d.severity === "critical") return "bg-destructive";
  if (d.status === "in_flight" || d.status === "with_aan") return "bg-primary";
  return "bg-success";
}

function buildChips(d: Decision): string[] {
  const chips: string[] = [];
  const domainLabel: Record<Decision["domain"], string> = {
    campaign: "Campaign",
    retail: "Retail",
    profitability: "Margin",
    inventory: "Inventory",
    cs: "CS",
    buyer: "Buyer",
  };
  chips.push(domainLabel[d.domain]);
  // Pull one or two keywords from the sourceRef label (after the middle dot)
  const refBits = d.sourceRef.label.split("·").map((s) => s.trim()).filter(Boolean);
  const tail = refBits[refBits.length - 1];
  if (tail && tail.length < 22) chips.push(tail);
  if (d.cadence && d.cadence !== "one_time") chips.push({ daily: "Daily", weekly: "Weekly", monthly: "Monthly" }[d.cadence]);
  if (d.severity === "critical") chips.push("Critical");
  return chips.slice(0, 5);
}

export function DecisionCard({ decision: d, duplicates = [], interactive: _interactive = false }: Props) {
  const { approve, reject, snooze, delegateToAan } = useActionsStore();
  const sourceMeta = getSourceMeta(d.source);
  const value = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });
  const isActionable = d.status === "open";
  const pill = STATUS_PILL[d.status];
  const chips = buildChips(d);

  const onSnooze = useCallback((c: SnoozeChoice) => snooze(d.id, c), [d.id, snooze]);

  return (
    <div className="relative rounded-lg border border-border bg-card overflow-hidden hover:shadow-sm transition-shadow">
      {/* Left rail */}
      <div className={cn("absolute left-0 top-0 bottom-0 w-1", railColor(d))} />

      <div className="pl-5 pr-5 py-4">
        {/* Top row: status · source · pill */}
        <div className="flex items-center gap-2 text-[11.5px]">
          <span className={cn("h-1.5 w-1.5 rounded-full", statusDot(d))} />
          <span className="uppercase tracking-wider font-semibold text-foreground">{statusEyebrow(d)}</span>
          <span className="text-muted-foreground">·</span>
          <SourceGlyph source={d.source} size={11} className="!w-4 !h-4 border-0 bg-transparent" />
          <span className="uppercase tracking-wider font-semibold text-muted-foreground">{sourceMeta.label}</span>
          {duplicates.length > 0 && (
            <span className="text-[10px] rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground">
              ×{duplicates.length + 1}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            {pill && (
              <span className={cn("text-[10.5px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded border", pill.className)}>
                {pill.label}
              </span>
            )}
          </div>
        </div>

        {/* Main body: left content + right VALUE box */}
        <div className="mt-3 flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-[15.5px] font-semibold text-foreground leading-snug">{d.insight}</h3>
            {d.insightDetail && (
              <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                {d.insightDetail}
              </p>
            )}

            {chips.length > 0 && (
              <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="text-[11px] px-2 py-0.5 rounded border border-border text-muted-foreground bg-muted/30"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            {d.meetingRef && (
              <div className="mt-3 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>
                  From: <span className="text-foreground/80 font-medium">{d.meetingRef.title}</span>
                </span>
              </div>
            )}

            <div className="mt-3">
              <span className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mr-2">Action</span>
              <span className="text-[13.5px] text-foreground/90 leading-relaxed">
                {d.actionVerb}. {d.valueBasis.split(".")[0]}.
              </span>
            </div>
          </div>

          {/* VALUE box */}
          {d.valueKind !== "info" && (
            <div className="shrink-0 w-[190px] rounded-md border border-border bg-muted/25 px-3 py-2">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Value</div>
              <div className={cn(
                "text-[15px] font-semibold mt-0.5 leading-tight",
                d.valueKind === "gain" ? "text-success" : d.valueKind === "cost" ? "text-destructive" : "text-primary",
              )}>
                {value.text}
              </div>
              <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{d.valueCaption}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center gap-2">
          {isActionable ? (
            <>
              <Button
                size="sm"
                onClick={() => approve(d.id)}
                className="h-8 text-[12.5px] gap-1.5 font-medium"
              >
                <Check className="h-3.5 w-3.5" />
                Approve {d.actionVerb.toLowerCase()}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => reject(d.id)}
                className="h-8 text-[12.5px] gap-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
                Reject
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => delegateToAan(d.id)}
                className="h-8 text-[12px] text-muted-foreground hover:text-primary"
              >
                You take it
              </Button>
              <SnoozeMenu onSelect={onSnooze} />
              <ShareMenu itemLabel={d.insight} />
              <a
                href={d.deepLink?.href ?? "#"}
                className="ml-auto text-[12.5px] text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                View more <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </>
          ) : (
            <>
              <ShareMenu itemLabel={d.insight} />
              <a
                href={d.deepLink?.href ?? "#"}
                className="ml-auto text-[12.5px] text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                View more <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
