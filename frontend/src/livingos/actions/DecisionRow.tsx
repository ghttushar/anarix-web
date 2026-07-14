import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ChevronDown, ChevronRight, ExternalLink, MoreHorizontal, X, Play, ArrowRight, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { ValuePill } from "./ValuePill";
import { SourceGlyph } from "./SourceGlyph";
import { ShareMenu } from "./ShareMenu";
import { SnoozeMenu } from "./SnoozeMenu";
import type { Decision } from "@/livingos/data/mockDecisions";
import { useActionsStore, type SnoozeChoice } from "@/livingos/state/actionsStore";
import { formatValue } from "@/livingos/lib/decisions/valueFormat";
import { useSelection } from "@/state/selectionStore";
import { getSourceMeta } from "@/livingos/lib/decisions/sourceRegistry";

interface Props {
  decision: Decision;
  duplicates?: Decision[];
  interactive?: boolean;
}

const STATUS_TONE: Record<Decision["status"], { label: string; className: string }> = {
  open:       { label: "Open",         className: "text-muted-foreground" },
  with_aan:   { label: "With me",      className: "text-primary" },
  in_flight:  { label: "In flight",    className: "text-primary" },
  completed:  { label: "Completed",    className: "text-success" },
  rejected:   { label: "Rejected",     className: "text-muted-foreground" },
  snoozed:    { label: "Snoozed",      className: "text-muted-foreground" },
  expired:    { label: "Expired",      className: "text-muted-foreground" },
};

const SEVERITY_DOT: Record<Decision["severity"], string> = {
  critical:    "bg-destructive",
  opportunity: "bg-primary",
  fyi:         "bg-muted-foreground/40",
};

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.round(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
}

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
  const sourceMeta = getSourceMeta(d.source);

  const onSnooze = useCallback((c: SnoozeChoice) => snooze(d.id, c), [d.id, snooze]);
  const live = useLiveProgress(d.startedAt, d.steps);

  const metaParts: string[] = [];
  metaParts.push(sourceMeta.label);
  metaParts.push(d.sourceRef.label);
  metaParts.push(timeAgo(d.createdAt));
  if (duplicates.length > 0) metaParts.push(`×${duplicates.length + 1} signals merged`);
  if (isStale) metaParts.push("stale after snooze");
  if (d.meetingRef) metaParts.push(`from ${d.meetingRef.title}`);
  if (isTerminal) metaParts.push(tone.label);

  return (
    <div
      ref={rowRef}
      data-decision-id={d.id}
      className={cn(
        "group border-b border-border/60 transition-colors",
        isSelected && "bg-primary/[0.06]",
        isFocused && "ring-1 ring-primary/50 ring-inset bg-primary/[0.04]",
        !open && "hover:bg-muted/25",
      )}
    >
      {/* Row body — 2 lines */}
      <div className="flex items-start gap-3 px-4 py-3.5">
        {/* Selection checkbox */}
        {interactive && sel && (
          <div
            className={cn(
              "shrink-0 pt-1 transition-opacity",
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
          className="shrink-0 mt-1 h-6 w-6 flex items-center justify-center rounded hover:bg-muted text-muted-foreground"
        >
          {open ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
        </button>

        {/* Severity dot + source */}
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <span className={cn("h-1.5 w-1.5 rounded-full", SEVERITY_DOT[d.severity])} title={d.severity} />
          <SourceGlyph source={d.source} refLabel={d.sourceRef.label} />
        </div>

        {/* Value + insight stack */}
        <div className="flex-1 min-w-0">
          {/* Line 1 — value headline */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <ValuePill cents={d.valueCents} kind={d.valueKind} cadence={d.cadence} size="md" />
            <span className="text-[12.5px] text-muted-foreground">{d.valueCaption}</span>
          </div>
          {/* Line 2 — insight */}
          <div className="mt-1.5 text-[14px] text-foreground leading-snug">{d.insight}</div>
          {/* Line 3 — meta */}
          <div className="mt-1.5 text-[11.5px] text-muted-foreground flex items-center gap-1.5 flex-wrap">
            {metaParts.map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5">
                {i > 0 && <span className="opacity-50">·</span>}
                <span className={cn(isTerminal && i === metaParts.length - 1 && tone.className, "uppercase tracking-wide text-[10.5px] font-medium")}>
                  {p}
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Trailing action cluster */}
        <div className="flex items-center gap-1.5 shrink-0 pt-1">
          {d.status === "in_flight" && (
            <span className="text-[11px] text-primary uppercase tracking-wider font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> I'm on it
            </span>
          )}
          {d.status === "with_aan" && (
            <span className="text-[11px] text-primary uppercase tracking-wider font-semibold">
              You handed to me
            </span>
          )}
          {isActionable && (
            <>
              <Button
                size="sm"
                onClick={(e) => { e.stopPropagation(); approve(d.id); }}
                className="h-8 px-3.5 text-[12.5px] gap-1 font-medium"
              >
                {d.actionVerb}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => { e.stopPropagation(); delegateToAan(d.id); }}
                className="h-8 px-2.5 text-[12px]"
                title="Hand this to me — I'll take care of it"
              >
                You take care of it
              </Button>
              <ShareMenu itemLabel={d.insight} />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8" title="More">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
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

      {/* Expanded "Know more" — 5 sections */}
      {open && (
        <div className="px-4 pb-5 pt-1 bg-muted/15 border-t border-border/40 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="pl-12 pr-2 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-5">
            {/* LEFT COLUMN */}
            <div className="space-y-5">
              {/* 1 · Value */}
              <section>
                <SectionLabel>Value</SectionLabel>
                <div className="mt-2 flex items-start gap-3">
                  <ValuePill cents={d.valueCents} kind={d.valueKind} cadence={d.cadence} size="md" />
                  <span className="text-[12px] text-muted-foreground pt-1">{d.valueCaption}</span>
                </div>
                <p className="mt-2 text-[13px] text-foreground/85 leading-relaxed">{d.valueBasis}</p>
                {d.valueInputs && d.valueInputs.length > 0 && (
                  <div className="mt-2.5 rounded-md border border-border/60 bg-card px-3 py-2">
                    <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">How I got here</div>
                    <ul className="space-y-0.5">
                      {d.valueInputs.map((v, i) => (
                        <li key={i} className="text-[12px] text-foreground/80 flex items-start gap-2">
                          <span className="text-primary mt-1">›</span>
                          <span>{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>

              {/* 2 · Insight */}
              <section>
                <SectionLabel>Insight</SectionLabel>
                <p className="mt-2 text-[13px] text-foreground/85 leading-relaxed">
                  {d.insightDetail ?? d.insight}
                </p>
              </section>
            </div>

            {/* RIGHT COLUMN */}
            <div className="space-y-5">
              {/* 3 · Evidence */}
              {d.evidence && <EvidenceBlock evidence={d.evidence} />}

              {/* 4 · Steps */}
              {d.steps.length > 0 && (
                <section>
                  <SectionLabel>
                    {d.status === "in_flight" ? "What I'm doing now" : "What I'll do if you approve"}
                  </SectionLabel>
                  <StepList
                    steps={d.steps}
                    currentStep={d.status === "in_flight" ? live.currentStep : 0}
                    isInFlight={d.status === "in_flight"}
                  />
                  {d.status === "in_flight" && (
                    <div className="mt-2">
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
                </section>
              )}
            </div>
          </div>

          {/* 5 · Context & source (full width) */}
          <div className="pl-12 pr-2 mt-5 space-y-3 border-t border-border/40 pt-4">
            {duplicates.length > 0 && (
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="flex items-center gap-1.5 text-[12px] text-primary hover:underline">
                  <ChevronRight className="h-3 w-3 transition-transform data-[state=open]:rotate-90" />
                  {duplicates.length} duplicate signal{duplicates.length === 1 ? "" : "s"} merged
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1.5 rounded-md border border-border/60 bg-card divide-y divide-border/50">
                  {duplicates.map((dup) => (
                    <div key={dup.id} className="flex items-center gap-2 px-2.5 py-1.5 text-[12px]">
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

            {d.meetingRef && (
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="flex items-center gap-1.5 text-[12px] text-primary hover:underline">
                  <ChevronRight className="h-3 w-3 transition-transform data-[state=open]:rotate-90" />
                  From meeting: {d.meetingRef.title}
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-1.5 rounded-md border border-border/60 bg-card px-3 py-2 text-[12px] text-muted-foreground italic">
                  {d.meetingRef.excerpt}
                </CollapsibleContent>
              </Collapsible>
            )}

            <div className="flex items-center gap-3 flex-wrap text-[12px] text-muted-foreground">
              <SectionLabel inline>Source</SectionLabel>
              <SourceGlyph source={d.source} withLabel size={12} />
              <span>·</span>
              <span>{d.sourceRef.label}</span>
              <span>·</span>
              <span className="font-mono">{new Date(d.sourceRef.ts).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}</span>
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

            {/* Bottom action bar duplicates row CTAs for reachability */}
            {isActionable && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-border/40">
                <Button size="sm" onClick={() => approve(d.id)} className="h-8 text-[12.5px] gap-1">
                  <Play className="h-3 w-3" /> {d.actionVerb}
                </Button>
                <Button size="sm" variant="outline" onClick={() => delegateToAan(d.id)} className="h-8 text-[12.5px]">
                  You take care of it
                </Button>
                <SnoozeMenu onSelect={onSnooze} />
                <Button size="sm" variant="ghost" onClick={() => reject(d.id)} className="h-8 text-[12.5px] text-muted-foreground hover:text-destructive">
                  <X className="h-3 w-3 mr-1" /> Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- helpers ----------

function SectionLabel({ children, inline }: { children: React.ReactNode; inline?: boolean }) {
  return (
    <div className={cn(
      "text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground",
      inline && "inline",
    )}>
      {children}
    </div>
  );
}

function EvidenceBlock({ evidence }: { evidence: NonNullable<Decision["evidence"]> }) {
  if (evidence.kind === "delta" && evidence.delta) {
    const { beforeLabel, before, afterLabel, after, unit } = evidence.delta;
    const max = Math.max(Math.abs(before), Math.abs(after), 1);
    const wBefore = (Math.abs(before) / max) * 100;
    const wAfter = (Math.abs(after) / max) * 100;
    return (
      <section>
        <SectionLabel>Evidence</SectionLabel>
        <div className="mt-2 space-y-1.5">
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
        <SectionLabel>Evidence</SectionLabel>
        <div className="mt-2 rounded-md border border-border/60 bg-card overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>{headers.map((h) => <th key={h} className="text-left px-2.5 py-1.5 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {rows.map((r, i) => (
                <tr key={i}>{r.map((c, j) => <td key={j} className="px-2.5 py-1.5 font-mono tabular-nums">{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }
  return null;
}

function DeltaBar({ label, value, width, tone }: { label: string; value: string; width: number; tone: "muted" | "primary" }) {
  return (
    <div className="flex items-center gap-2 text-[12px]">
      <span className="w-28 shrink-0 text-muted-foreground truncate">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn("h-full transition-[width]", tone === "primary" ? "bg-primary" : "bg-muted-foreground/40")}
          style={{ width: `${width}%` }}
        />
      </div>
      <span className="w-20 text-right font-mono tabular-nums text-foreground/85 shrink-0">{value}</span>
    </div>
  );
}

function StepList({ steps, currentStep, isInFlight }: { steps: Decision["steps"]; currentStep: number; isInFlight: boolean }) {
  return (
    <ol className="mt-2 space-y-1.5">
      {steps.map((step, i) => {
        const done = isInFlight && i < currentStep;
        const active = isInFlight && i === currentStep;
        return (
          <li key={i} className="flex items-start gap-2.5 text-[12.5px]">
            <span className={cn(
              "mt-0.5 h-4 w-4 rounded-full border shrink-0 flex items-center justify-center text-[9px] font-semibold",
              done && "bg-success border-success text-success-foreground",
              active && "border-primary text-primary bg-primary/10",
              !done && !active && "border-border text-muted-foreground",
            )}>
              {done ? "✓" : i + 1}
            </span>
            <span className={cn("flex-1", done && "text-muted-foreground line-through", active && "text-foreground font-medium")}>
              {step.label}
            </span>
            {step.why && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="text-muted-foreground hover:text-foreground shrink-0">
                      <HelpCircle className="h-3 w-3" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-[11px] max-w-[240px]">{step.why}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span className="text-[10.5px] text-muted-foreground font-mono tabular-nums shrink-0">~{step.etaSec}s</span>
          </li>
        );
      })}
    </ol>
  );
}
