import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ChevronDown, ChevronRight, ExternalLink, MoreHorizontal, X, Play, ArrowRight, Copy, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ValuePill } from "./ValuePill";
import { SourceGlyph } from "./SourceGlyph";
import { ShareMenu } from "./ShareMenu";
import { SnoozeMenu } from "./SnoozeMenu";
import type { Decision } from "@/data/mockDecisions";
import { useActionsStore, type SnoozeChoice } from "@/state/actionsStore";
import { formatValue } from "@/lib/decisions/valueFormat";
import { useSelection } from "@/state/selectionStore";

interface Props {
  decision: Decision;
  /** Other decisions merged into this row via `dupeKey`. */
  duplicates?: Decision[];
  /** If true, this row participates in Decide selection/keyboard nav. */
  interactive?: boolean;
}

const STATUS_TONE: Record<Decision["status"], { label: string; className: string }> = {
  open:       { label: "Open",         className: "text-muted-foreground" },
  with_aan:   { label: "With Aan",     className: "text-primary" },
  in_flight:  { label: "In flight",    className: "text-primary" },
  completed:  { label: "Completed",    className: "text-success" },
  rejected:   { label: "Rejected",     className: "text-muted-foreground" },
  snoozed:    { label: "Snoozed",      className: "text-amber-600 dark:text-amber-400" },
  expired:    { label: "Expired",      className: "text-muted-foreground" },
};

/** Live progress for in-flight items: currentStep index + % done. */
function useLiveProgress(startedAt: number | undefined, steps: Decision["steps"]) {
  const [, tick] = useState(0);
  useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => tick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  return useMemo(() => {
    if (!startedAt || steps.length === 0) return { currentStep: 0, pct: 0, elapsed: 0, total: 0 };
    const total = steps.reduce((s, x) => s + x.etaSec, 0);
    const elapsed = Math.max(0, (Date.now() - startedAt) / 1000);
    let acc = 0;
    let currentStep = steps.length;
    for (let i = 0; i < steps.length; i++) {
      acc += steps[i].etaSec;
      if (elapsed < acc) { currentStep = i; break; }
    }
    return { currentStep, pct: Math.min(100, (elapsed / total) * 100), elapsed, total };
  }, [startedAt, steps]);
}

export function DecisionRow({ decision: d, duplicates = [], interactive = false }: Props) {
  const [open, setOpen] = useState(false);
  const { approve, reject, delegateToAan, snooze } = useActionsStore();
  // Selection context is optional — safely no-op when the row isn't inside a SelectionProvider.
  let sel: ReturnType<typeof useSelection> | null = null;
  try { sel = useSelection(); } catch { sel = null; }
  const isSelected = interactive && sel ? sel.isSelected(d.id) : false;
  const isFocused = interactive && sel ? sel.focusedId === d.id : false;
  const rowRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFocused) rowRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [isFocused]);

  const isActionable = d.status === "open";
  const isTerminal = ["completed", "rejected", "expired"].includes(d.status);
  const tone = STATUS_TONE[d.status];
  const isStale = d.status === "snoozed" && d.snoozedUntil !== undefined && d.snoozedUntil < Date.now();

  const onSnooze = useCallback((c: SnoozeChoice) => snooze(d.id, c), [d.id, snooze]);
  const live = useLiveProgress(d.startedAt, d.steps);

  return (
    <div
      ref={rowRef}
      data-decision-id={d.id}
      className={cn(
        "group border-b border-border/50 transition-colors",
        isSelected && "bg-primary/[0.06]",
        isFocused && "ring-1 ring-primary/50 ring-inset bg-primary/[0.04]",
        !open && "hover:bg-muted/30",
      )}
    >
      {/* Row — 56px */}
      <div className="flex items-center gap-3 px-3 h-14">
        {/* Selection checkbox (interactive rows only) */}
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
              }}
              aria-label="Select decision"
            />
          </div>
        )}

        {/* Expand toggle */}
        <button
          aria-label={open ? "Collapse" : "Expand"}
          onClick={() => setOpen((o) => !o)}
          className="shrink-0 h-6 w-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        {/* Source glyph — stacked cluster if duplicates from other sources */}
        {duplicates.length > 0 && duplicates.some((x) => x.source !== d.source) ? (
          <div className="flex items-center -space-x-1">
            <SourceGlyph source={d.source} refLabel={d.sourceRef.label} />
            {Array.from(new Set(duplicates.map((x) => x.source).filter((s) => s !== d.source))).slice(0, 2).map((s) => (
              <SourceGlyph key={s} source={s} size={11} />
            ))}
          </div>
        ) : (
          <SourceGlyph source={d.source} refLabel={d.sourceRef.label} />
        )}

        {/* Value pill */}
        <ValuePill cents={d.valueCents} kind={d.valueKind} cadence={d.cadence} />

        {/* Insight — the main scannable line */}
        <div className="flex-1 min-w-0 flex items-baseline gap-2">
          <span className="text-[13.5px] text-foreground truncate" title={d.insight}>
            {d.insight}
          </span>
          {duplicates.length > 0 && (
            <span
              className="text-[10.5px] font-mono font-semibold text-primary shrink-0 inline-flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5"
              title={`Merged with ${duplicates.length} duplicate signal${duplicates.length === 1 ? "" : "s"}`}
            >
              <Copy className="h-2.5 w-2.5" /> ×{duplicates.length + 1}
            </span>
          )}
          {isStale && (
            <span
              className="text-[10px] font-semibold text-amber-700 dark:text-amber-400 shrink-0 inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 uppercase tracking-wider"
              title="Data may be stale — this item returned from snooze"
            >
              <AlertCircle className="h-2.5 w-2.5" /> Stale
            </span>
          )}
          {d.meetingRef && (
            <span className="text-[10.5px] text-muted-foreground shrink-0">
              from meeting
            </span>
          )}
          {isTerminal && (
            <span className={cn("text-[10.5px] font-medium shrink-0 uppercase tracking-wider", tone.className)}>
              {tone.label}
            </span>
          )}
        </div>

        {/* Trailing controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {d.status === "in_flight" && (
            <span className="text-[10.5px] text-primary uppercase tracking-wider font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              I'm on it
            </span>
          )}
          {d.status === "with_aan" && (
            <span className="text-[10.5px] text-primary uppercase tracking-wider font-semibold">
              Handed to Aan
            </span>
          )}
          {isActionable && (
            <>
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); approve(d.id); }}
                className="h-7 px-3 text-[11.5px] gap-1"
              >
                {d.actionVerb}
                <ArrowRight className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => { e.stopPropagation(); delegateToAan(d.id); }}
                className="h-7 px-2.5 text-[11.5px]"
                title="You take care of it — hand this to Aan"
              >
                You take care of it
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7" title="More">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onSelect={() => onSnooze("1h")}>Snooze 1 hour</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onSnooze("tomorrow")}>Snooze until tomorrow</DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => onSnooze("next_week")}>Snooze until next week</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {d.deepLink && (
                    <DropdownMenuItem onSelect={() => window.location.assign(d.deepLink!.href)}>
                      {d.deepLink.label}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    onSelect={() => { navigator.clipboard.writeText(`${formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence }).text} — ${d.valueBasis}`); }}
                  >
                    Copy $ rationale
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => reject(d.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>

      {/* Inline expansion — the "know more" panel */}
      {open && (
        <div className="px-3 pb-4 pt-1 bg-muted/20 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="pl-9 pr-2 space-y-4">
            {/* Why this number */}
            <section>
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                Why this number
              </div>
              <div className="text-[12.5px] text-foreground/85 leading-snug">{d.valueBasis}</div>
            </section>

            {/* Evidence */}
            {d.evidence && <EvidenceBlock evidence={d.evidence} />}

            {/* What I'll do — live-ticking ETAs when in flight */}
            {d.steps.length > 0 && (
              <section>
                <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                  {d.status === "in_flight" ? "What I'm doing now" : "What I'll do"}
                </div>
                <StepList steps={d.steps} currentStep={d.status === "in_flight" ? live.currentStep : 0} />
              </section>
            )}

            {/* Duplicates — collapsed compact list of merged signals */}
            {duplicates.length > 0 && (
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="flex items-center gap-1.5 text-[11.5px] text-primary hover:underline">
                  <ChevronRight className="h-3 w-3 transition-transform data-[state=open]:rotate-90" />
                  {duplicates.length} duplicate signal{duplicates.length === 1 ? "" : "s"} merged
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1.5 rounded-md border border-border/60 bg-card divide-y divide-border/50">
                  {duplicates.map((dup) => (
                    <div key={dup.id} className="flex items-center gap-2 px-2.5 py-1.5 text-[11.5px]">
                      <SourceGlyph source={dup.source} size={10} />
                      <span className="text-foreground/80 flex-1 truncate" title={dup.insight}>{dup.insight}</span>
                      <span className="text-[10.5px] text-muted-foreground font-mono shrink-0">
                        {new Date(dup.sourceRef.ts).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
                      </span>
                    </div>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* From meeting — collapsed by default */}
            {d.meetingRef && (
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="flex items-center gap-1.5 text-[11.5px] text-primary hover:underline">
                  <ChevronRight className="h-3 w-3 transition-transform data-[state=open]:rotate-90" />
                  From meeting: {d.meetingRef.title}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1.5 rounded-md border border-border/60 bg-card px-3 py-2 text-[11.5px] text-muted-foreground italic">
                  {d.meetingRef.excerpt}
                </CollapsibleContent>
              </Collapsible>
            )}

            {/* Source ref */}
            <div className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground">
              <span className="uppercase tracking-wider font-semibold">Source</span>
              <span>·</span>
              <SourceGlyph source={d.source} size={10} />
              <span>{d.sourceRef.label}</span>
              <span>·</span>
              <span className="font-mono">{new Date(d.sourceRef.ts).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
            </div>

            {/* Action bar */}
            {isActionable && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
                <Button size="sm" onClick={() => approve(d.id)} className="h-8 text-[12px] gap-1">
                  <Play className="h-3 w-3" /> {d.actionVerb}
                </Button>
                <Button size="sm" variant="outline" onClick={() => delegateToAan(d.id)} className="h-8 text-[12px]">
                  You take care of it
                </Button>
                <SnoozeMenu onSelect={onSnooze} />
                <Button size="sm" variant="ghost" onClick={() => reject(d.id)} className="h-8 text-[12px] text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3 mr-1" /> Reject
                </Button>
                <div className="ml-auto flex items-center gap-1">
                  <ShareMenu itemLabel={d.insight} />
                  {d.deepLink && (
                    <Button asChild size="sm" variant="ghost" className="h-7 text-[11.5px]">
                      <a href={d.deepLink.href}>
                        {d.deepLink.label} <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* In-flight progress — live */}
            {d.status === "in_flight" && (
              <div className="pt-2 border-t border-border/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10.5px] uppercase tracking-wider font-semibold text-primary flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    Running · step {Math.min(live.currentStep + 1, d.steps.length)} of {d.steps.length}
                  </span>
                  <span className="text-[10.5px] text-muted-foreground font-mono tabular-nums">
                    {Math.round(live.elapsed)}s / ~{live.total}s
                  </span>
                </div>
                <Progress value={live.pct} className="h-1" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- helpers ---

function EvidenceBlock({ evidence }: { evidence: NonNullable<Decision["evidence"]> }) {
  if (evidence.kind === "delta" && evidence.delta) {
    const { beforeLabel, before, afterLabel, after, unit } = evidence.delta;
    const max = Math.max(Math.abs(before), Math.abs(after), 1);
    const wBefore = (Math.abs(before) / max) * 100;
    const wAfter = (Math.abs(after) / max) * 100;
    return (
      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Evidence</div>
        <div className="space-y-1.5">
          <DeltaBar label={beforeLabel} value={`${before}${unit ?? ""}`} width={wBefore} tone="muted" />
          <DeltaBar label={afterLabel}  value={`${after}${unit ?? ""}`}  width={wAfter}  tone="primary" />
        </div>
      </section>
    );
  }
  if (evidence.kind === "table" && evidence.table) {
    const { headers, rows } = evidence.table;
    return (
      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">Evidence</div>
        <div className="rounded-md border border-border/60 bg-card overflow-hidden">
          <table className="w-full text-[11.5px]">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>{headers.map((h) => <th key={h} className="text-left font-normal px-2.5 py-1">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t border-border/40">
                  {r.map((c, j) => <td key={j} className="px-2.5 py-1 font-mono tabular-nums text-foreground/85">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  if (evidence.kind === "sparkline" && evidence.sparkline) {
    const s = evidence.sparkline.series;
    const min = Math.min(...s), max = Math.max(...s);
    const range = max - min || 1;
    const pts = s.map((v, i) => `${(i / (s.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(" ");
    return (
      <section>
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">{evidence.sparkline.label}</div>
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="w-full h-10">
          <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary" />
        </svg>
      </section>
    );
  }
  return null;
}

function DeltaBar({ label, value, width, tone }: { label: string; value: string; width: number; tone: "muted" | "primary" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 text-[10.5px] text-muted-foreground shrink-0">{label}</div>
      <div className="flex-1 h-3 bg-muted/60 rounded overflow-hidden">
        <div
          className={cn("h-full transition-[width]", tone === "primary" ? "bg-primary" : "bg-muted-foreground/40")}
          style={{ width: `${width}%` }}
        />
      </div>
      <div className="w-16 text-right text-[11.5px] font-mono tabular-nums shrink-0">{value}</div>
    </div>
  );
}

function StepList({ steps, currentStep }: { steps: Decision["steps"]; currentStep: number }) {
  return (
    <ol className="space-y-1">
      {steps.map((s, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <li key={i} className="flex items-center gap-2 text-[12px]">
            <span
              className={cn(
                "h-4 w-4 rounded-full border flex items-center justify-center text-[9px] font-semibold shrink-0",
                done ? "bg-success border-success text-white"
                  : active ? "border-primary text-primary"
                  : "border-border text-muted-foreground"
              )}
            >
              {done ? "✓" : i + 1}
            </span>
            <span className={cn(done ? "text-muted-foreground line-through" : "text-foreground/85")}>{s.label}</span>
            <span className="text-[10.5px] text-muted-foreground ml-auto font-mono">~{s.etaSec}s</span>
          </li>
        );
      })}
    </ol>
  );
}
