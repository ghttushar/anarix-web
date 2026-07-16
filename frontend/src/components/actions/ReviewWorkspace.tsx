// Review Workspace — single merged panel (no carousel).
// Hierarchy: title → current state → why it matters → evidence → strategy
// → collapsed { Related signals, Execution plan }.
// After Execute: the primary action position swaps to a completion +
// 5-second undo card; the card auto-closes when the countdown ends.
import { useMemo, useState, useEffect, useRef } from "react";
import { X, Check, Ban, Clock, Share2, Sparkles, Activity, TrendingUp, CornerDownLeft, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { StrategyPicker } from "./review/StrategyPicker";
import { ExecutionPlan } from "./review/ExecutionPlan";
import { RelatedDecisionChip } from "./review/RelatedDecisionChip";
import { AssignMenu } from "./review/AssignMenu";
import { DiscussDrawer } from "./review/DiscussDrawer";
import { SourceGlyph } from "./SourceGlyph";
import { useActionsStore } from "@/state/actionsStore";
import { strategiesFor } from "@/lib/decisions/strategies";
import { relationshipsFor } from "@/lib/decisions/relationships";
import { sourcePillFor, PILL_TONE_CLASS } from "@/lib/decisions/sourcePill";
import { formatValue } from "@/lib/decisions/valueFormat";
import { livingStatusPhrase } from "@/lib/decisions/lifecycle";
import { useLivingTick } from "@/hooks/useLivingClock";
import { useAan } from "@/components/aan/AanContext";
import { useAanPanel } from "@/contexts/AanPanelContext";
import { InlineEmailCompose, type EmailDraft } from "./review/inline/InlineEmailCompose";
import { InlineDraftChat } from "./review/inline/InlineDraftChat";
import type { Decision } from "@/data/mockDecisions";
import { toast } from "sonner";

interface Props {
  decision: Decision | null;
  onClose: () => void;
  onOpenDecision?: (id: string) => void;
  /** Unused — kept for backward-compat with existing callers. */
  defaultPage?: 0 | 1 | 2;
}

type State = "healthy" | "trending_up" | "blocked" | "critical" | "recovering";
function quickState(d: Decision): State {
  if (d.severity === "critical") return "critical";
  if (d.status === "in_flight" || d.status === "with_aan") return "recovering";
  if (d.severity === "opportunity") return "trending_up";
  if (d.status === "snoozed") return "blocked";
  return "healthy";
}
const STATE_LABEL: Record<State, string> = {
  healthy: "Healthy", trending_up: "Trending up", blocked: "Blocked",
  critical: "Critical", recovering: "Recovering",
};
const STATE_TONE: Record<State, string> = {
  healthy: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/25",
  trending_up: "bg-primary/10 text-primary border-primary/25",
  blocked: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/25",
  critical: "bg-destructive/10 text-destructive border-destructive/25",
  recovering: "bg-warning/10 text-warning border-warning/25",
};

const COUNTDOWN_SECONDS = 5;

const AAN_SEEDS: Record<string, { prompt: string; reply: string }> = {
  "notify-vm": {
    prompt:
      "Draft an email to the Vendor Manager about ASIN B0CSH8TCC6 (Sampler – Decaf 40 Count) losing advertising eligibility on 07 Jun 2026. Include revenue-at-risk ($6,885 over 7 days) and ask them to confirm listing status.",
    reply:
      "Here's a draft email for the Vendor Manager. Review and approve before I send it:\n\n**Subject:** ASIN B0CSH8TCC6 – Advertising eligibility lost (action needed)\n\nHi [VM name],\n\nAmazon disabled advertising eligibility on ASIN B0CSH8TCC6 (Sampler – Decaf 40 Count) on 07 Jun 2026, citing missing or incorrect listing information.\n\n- Estimated revenue at risk (next 7 days): **$6,885**\n- Estimated units at risk: **300**\n- Inventory available: **2,810 units** (~140 days of coverage)\n- Confidence: 82%\n\nCould you confirm whether a recent content change on your side triggered this, and share the last known-good listing snapshot so we can restore eligibility quickly?\n\nThanks,\nTushar",
  },
  "draft-ticket": {
    prompt:
      "Draft an Amazon Seller Support ticket disputing the loss of advertising eligibility on ASIN B0CSH8TCC6 on 07 Jun 2026. The listing has no known compliance issues; include the revenue at risk and ask for a manual review.",
    reply:
      "Here's a draft support ticket. Review and approve before I file it:\n\n**Subject:** Reinstate advertising eligibility – ASIN B0CSH8TCC6\n\n**Case type:** Advertising / Product eligibility\n\nHello Seller Support,\n\nOn 07 Jun 2026, ASIN B0CSH8TCC6 (Sampler – Decaf 40 Count) was flagged as ineligible for advertising with the reason: *\"This product is either missing important information or contains incorrect information.\"*\n\nOn our end, the listing contains all required attributes and matches the last known-eligible version. We believe this flag was raised in error and request a manual review.\n\n- Business impact: estimated **$6,885 in ad-driven revenue at risk** over the next 7 days (300 units).\n- Inventory on hand: 2,810 units, ~140 days of coverage — this is not a stock issue.\n\nPlease reinstate advertising eligibility or share the specific attribute that triggered the flag so we can correct it.\n\nThank you,\nTushar",
  },
  "recommended": {
    prompt:
      "Analyze the listing for ASIN B0CSH8TCC6 (Sampler – Decaf 40 Count). Diff against the last known-eligible version, identify the failing field Amazon flagged, and draft the compliant edit for my approval.",
    reply:
      "Here's what I found and the proposed fix. Approve before I publish:\n\n**ASIN:** B0CSH8TCC6 (Sampler – Decaf 40 Count)\n\n**Likely failing field:** `bullet_point_3` — currently reads *\"Best decaf coffee — cures fatigue and boosts energy\"*. Amazon's compliance model flagged this as an unsupported medical/functional claim.\n\n**Proposed edit:**\n> Smooth, low-acidity decaf blend — 40 single-serve pods per box, compatible with most single-serve brewers.\n\nOther fields (title, images, attributes) match the last eligible snapshot. Confidence: 84%.\n\nWant me to publish this edit, or should I tweak the wording first?",
  },
};

// Pre-parsed email draft used when AI Panel mode = "main" and the user picks Notify VM.
const NOTIFY_VM_EMAIL: EmailDraft = {
  to: "vendor.manager@amazon.com",
  cc: "",
  bcc: "",
  subject: "ASIN B0CSH8TCC6 – Advertising eligibility lost (action needed)",
  body:
`Hi [VM name],

Amazon disabled advertising eligibility on ASIN B0CSH8TCC6 (Sampler – Decaf 40 Count) on 07 Jun 2026, citing missing or incorrect listing information.

- Estimated revenue at risk (next 7 days): $6,885
- Estimated units at risk: 300
- Inventory available: 2,810 units (~140 days of coverage)
- Confidence: 82%

Could you confirm whether a recent content change on your side triggered this, and share the last known-good listing snapshot so we can restore eligibility quickly?

Thanks,
Tushar`,
};


function Block({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground mb-2">
        {eyebrow}
      </div>
      {children}
    </section>
  );
}

export function ReviewWorkspace({ decision: d, onClose, onOpenDecision }: Props) {
  const { decisions, approve, reject, delegateToAan, snooze, rollback } = useActionsStore();
  const { openCopilot, addMessage } = useAan();
  const { mode: panelMode } = useAanPanel();
  const [discuss, setDiscuss] = useState(false);
  const [inlineDraft, setInlineDraft] = useState<
    | { kind: "email"; strategyTitle: string; draft: EmailDraft }
    | { kind: "chat"; strategyTitle: string; title: string; approveLabel: string; approveSuccess: string; draft: string }
    | null
  >(null);
  const tick = useLivingTick();
  const rootRef = useRef<HTMLDivElement>(null);

  const strategies = useMemo(() => (d ? strategiesFor(d) : []), [d]);
  const [selectedStrategyId, setSelectedStrategyId] = useState<string>("");

  // Post-execute state — replaces the primary action button with an Undo card.
  const [executed, setExecuted] = useState<{
    strategyTitle: string;
    verifyMsg: string;
    canUndo: boolean;
  } | null>(null);
  const [countdown, setCountdown] = useState<number>(COUNTDOWN_SECONDS);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!d) return;
    const recommended = strategies.find((s) => s.recommended) || strategies[0];
    if (recommended) setSelectedStrategyId(recommended.id);
  }, [d?.id, strategies]);

  // Reset execution state when the decision changes.
  useEffect(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
    setExecuted(null);
    setCountdown(COUNTDOWN_SECONDS);
    setInlineDraft(null);
  }, [d?.id]);

  const relationships = useMemo(
    () => (d ? relationshipsFor(d, decisions) : []),
    [d, decisions],
  );
  const relatedById = useMemo(
    () => new Map(decisions.map((x) => [x.id, x] as const)),
    [decisions],
  );

  const selectedStrategy = strategies.find((s) => s.id === selectedStrategyId);

  function startCountdown() {
    setCountdown(COUNTDOWN_SECONDS);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = null;
          // Auto-close after countdown finishes.
          setTimeout(() => onClose(), 100);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  function onExecute() {
    if (!d || !selectedStrategy || executed) return;
    const shortId = selectedStrategy.id.split(":").pop() ?? "";
    let verifyMsg = "Change applied. Verifying downstream metrics…";
    let canUndo = true;

    const isInlineDraftAction =
      shortId === "notify-vm" ||
      shortId === "draft-ticket" ||
      (shortId === "recommended" && d.id === "critical-b0csh8tcc6");

    if (isInlineDraftAction && panelMode === "main") {
      // Render Aan's draft inline inside this review card — do not open the side panel.
      if (shortId === "notify-vm") {
        setInlineDraft({ kind: "email", strategyTitle: selectedStrategy.title, draft: NOTIFY_VM_EMAIL });
      } else if (shortId === "draft-ticket") {
        setInlineDraft({
          kind: "chat",
          strategyTitle: selectedStrategy.title,
          title: "Aan drafted this support ticket",
          approveLabel: "Approve & file ticket",
          approveSuccess: "Support ticket filed with Amazon Seller Support.",
          draft: AAN_SEEDS["draft-ticket"].reply,
        });
      } else {
        setInlineDraft({
          kind: "chat",
          strategyTitle: selectedStrategy.title,
          title: "Aan analyzed the listing",
          approveLabel: "Approve & publish edit",
          approveSuccess: "Listing edit published for review.",
          draft: AAN_SEEDS["recommended"].reply,
        });
      }
      return;
    }

    if (shortId === "notify-vm" || shortId === "draft-ticket") {
      const seed = AAN_SEEDS[shortId];
      openCopilot();
      addMessage(seed.prompt, "user");
      // Small delay so the assistant reply reads as a fresh response.
      setTimeout(() => addMessage(seed.reply, "assistant"), 400);
      verifyMsg =
        shortId === "notify-vm"
          ? "Aan drafted the email in the side panel. Review before it sends."
          : "Aan drafted the support ticket in the side panel. Review before it's filed.";
      canUndo = false;
    } else if (selectedStrategy.id.endsWith(":wait")) {
      snooze(d.id, "tomorrow");
      verifyMsg = "Queued for tomorrow 8am. Aan will re-check with fresh data.";
    } else if (selectedStrategy.id.endsWith(":aan")) {
      delegateToAan(d.id);
      verifyMsg = "Aan is executing within its policy budget.";
    } else {
      approve(d.id);
      verifyMsg = "Change applied. Verifying downstream metrics…";
    }

    setExecuted({ strategyTitle: selectedStrategy.title, verifyMsg, canUndo });
    startCountdown();
  }

  function completeInlineDraft() {
    if (!inlineDraft) return;
    const strategyTitle = inlineDraft.strategyTitle;
    const verifyMsg =
      inlineDraft.kind === "email"
        ? "Email sent. Aan is monitoring for a reply."
        : "Draft approved. Aan is tracking follow-up.";
    setInlineDraft(null);
    setExecuted({ strategyTitle, verifyMsg, canUndo: false });
    startCountdown();
  }

  function onUndo() {
    if (!d || !executed) return;
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
    rollback(d.id);
    setExecuted(null);
    setCountdown(COUNTDOWN_SECONDS);
  }

  // Enter → execute (default action). Ignore when typing or after execute.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!d || e.key !== "Enter" || executed) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (t && t.closest("[role='dialog']")) return;
      e.preventDefault();
      onExecute();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d?.id, selectedStrategyId, executed]);

  useEffect(() => () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  if (!d) return null;

  const pill = sourcePillFor(d);
  const isTerminal = d.status === "completed" || d.status === "rejected";
  const isRunning = d.status === "in_flight" || d.status === "with_aan";
  const state = quickState(d);
  const val = formatValue({ cents: d.valueCents, kind: d.valueKind, cadence: d.cadence });

  const progressPct = ((COUNTDOWN_SECONDS - countdown) / COUNTDOWN_SECONDS) * 100;

  return (
    <div
      ref={rootRef}
      className="flex flex-col flex-1 min-h-0 rounded-xl border border-border/70 bg-card overflow-hidden shadow-[0_1px_0_hsl(var(--border)/0.5),0_30px_60px_-30px_hsl(var(--primary)/0.25)]"
    >
      {/* Header */}
      <header className={cn(
        "relative px-5 pt-4 pb-3 border-b border-border shrink-0 transition-shadow duration-500",
        executed && "shadow-[inset_0_0_0_1px_hsl(var(--success)/0.35),0_0_40px_-10px_hsl(var(--success)/0.45)]",
      )}>
        <div className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent",
          executed ? "from-success/[0.10]" : "from-primary/[0.04]",
        )} />
        <div className="relative flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={cn(
                "inline-flex items-center gap-1.5 h-6 px-2 rounded-full border text-[11px] font-medium",
                PILL_TONE_CLASS[pill.tone],
              )}>
                <pill.Icon size={12} /> {pill.label}
              </span>
              <span className="text-[11px] text-muted-foreground uppercase tracking-widest">
                {d.domain}
              </span>
            </div>
            <h2 className="mt-2 font-heading text-[18px] font-semibold text-foreground leading-snug tracking-tight">
              {d.insight}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground"
            aria-label="Close review"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Body */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-5 py-5 space-y-6">
          {executed ? (
            /* Post-execute: large centered confirmation replaces strategy picker */
            <div className="flex flex-col items-center justify-center text-center py-10 gap-4">
              <div
                className="relative h-20 w-20 rounded-full flex items-center justify-center"
                style={{ background: `conic-gradient(hsl(var(--success)) ${progressPct}%, hsl(var(--muted)) 0)` }}
              >
                <div className="absolute inset-[4px] rounded-full bg-card flex items-center justify-center">
                  <Check className="h-9 w-9 text-success" />
                </div>
              </div>
              <div>
                <div className="font-heading text-[26px] font-semibold text-foreground leading-tight">
                  Executed: {executed.strategyTitle}
                </div>
                <p className="mt-2 text-[14.5px] text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {executed.verifyMsg}
                </p>
              </div>
              <div className="flex items-center gap-3 mt-1">
                {executed.canUndo && (
                  <Button variant="outline" size="sm" onClick={onUndo} className="gap-1.5">
                    <Undo2 className="h-3.5 w-3.5" /> Undo ({countdown}s)
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose} className="text-muted-foreground">
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Current state */}
              <Block eyebrow="Current state">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={cn(
                    "inline-flex items-center gap-1 h-7 px-2.5 rounded-full border text-[12px] font-medium",
                    STATE_TONE[state],
                  )}>
                    <Activity className="h-3 w-3" /> {STATE_LABEL[state]}
                  </span>
                  {isRunning && (
                    <span className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-primary/25 bg-primary/5 text-[12px] text-primary">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-60 animate-ping" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
                      </span>
                      {livingStatusPhrase(d.domain, tick)}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
                  {d.insightDetail || d.insight}
                </p>
              </Block>

              {/* Why it matters */}
              <Block eyebrow="Why it matters">
                <div className="rounded-lg border border-border/70 bg-gradient-to-br from-card to-primary/[0.03] p-4">
                  <div className="font-heading text-[28px] font-semibold text-success tabular-nums leading-none">
                    {val.text}
                  </div>
                </div>
                <p className="mt-3 text-[14.5px] leading-relaxed text-foreground/85">
                  {d.valueBasis || "This affects near-term revenue and needs a decision within the next 48 hours."}
                </p>
              </Block>

              {/* Evidence */}
              {d.valueInputs && d.valueInputs.length > 0 && (
                <Block eyebrow="Evidence">
                  <ul className="space-y-1.5">
                    {d.valueInputs.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-[13.5px] text-foreground/85">
                        <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={12} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              {/* Strategy — hidden after execute */}
              <Block eyebrow="Choose your strategy">
                <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] via-transparent to-transparent p-3 shadow-[0_1px_0_hsl(var(--border)/0.5),0_20px_50px_-30px_hsl(var(--primary)/0.35)]">
                  <StrategyPicker
                    strategies={strategies}
                    selectedId={selectedStrategyId}
                    onSelect={setSelectedStrategyId}
                  />
                </div>
              </Block>

              {/* Collapsed extras */}
              <Accordion type="multiple" className="border-t border-border/60 pt-2">
                {relationships.length > 0 && (
                  <AccordionItem value="related" className="border-b-0">
                    <AccordionTrigger className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground hover:no-underline py-3">
                      Related signals · {relationships.length}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {relationships.map((r) => {
                          const other = relatedById.get(r.otherId);
                          if (!other) return null;
                          return (
                            <RelatedDecisionChip
                              key={r.otherId + r.type}
                              decision={other}
                              type={r.type}
                              onOpen={(id) => onOpenDecision?.(id)}
                            />
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
                <AccordionItem value="plan" className="border-b-0">
                  <AccordionTrigger className="text-[10.5px] uppercase tracking-widest font-semibold text-muted-foreground hover:no-underline py-3">
                    Execution plan
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pt-1">
                      {selectedStrategy && <ExecutionPlan strategy={selectedStrategy} />}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </div>
      </ScrollArea>

      {/* Footer — hidden after execute (in-body confirmation handles CTAs) */}
      {!executed && (
        <footer className="border-t border-border p-3 flex flex-wrap items-center gap-2 bg-gradient-to-t from-muted/20 to-transparent shrink-0 min-h-[68px]">
          {isTerminal ? (
            <span className="text-[12.5px] text-muted-foreground px-1">This decision is closed.</span>
          ) : (
            <>
              <div className="relative max-w-[60%]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-1 rounded-lg ring-2 ring-primary/40 animate-pulse"
                />
                <Button
                  size="sm"
                  onClick={onExecute}
                  className="relative h-9 pl-3 pr-2 text-[13px] gap-1.5 font-medium w-full"
                >
                  <Check className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">
                    Execute{selectedStrategy ? `: ${selectedStrategy.title}` : " selected strategy"}
                  </span>
                  <span className="ml-1 inline-flex items-center gap-0.5 h-5 px-1.5 rounded border border-primary-foreground/30 bg-primary-foreground/10 text-[10px] font-mono shrink-0">
                    <CornerDownLeft className="h-2.5 w-2.5" /> Enter
                  </span>
                </Button>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setDiscuss(true)} className="h-9 text-[12.5px] gap-1.5 text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Modify
              </Button>
              <AssignMenu
                onAssign={(_key, label) => {
                  if (label === "Aan") delegateToAan(d.id);
                  else toast.success(`Assigned to ${label}.`);
                }}
              />
              <Button size="sm" variant="ghost" onClick={() => reject(d.id)} className="h-9 text-[12.5px] gap-1.5 text-muted-foreground">
                <Ban className="h-3.5 w-3.5" /> Dismiss
              </Button>
              <div className="ml-auto flex items-center gap-1">
                <Button size="sm" variant="ghost" onClick={() => snooze(d.id, "tomorrow")} className="h-8 text-[12px] gap-1.5 text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Snooze
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href + "#" + d.id);
                    toast.success("Link copied.");
                  }}
                  className="h-8 text-[12px] gap-1.5 text-muted-foreground"
                >
                  <Share2 className="h-3.5 w-3.5" /> Share
                </Button>
              </div>
            </>
          )}
        </footer>
      )}

      <DiscussDrawer decision={d} open={discuss} onOpenChange={setDiscuss} />
    </div>
  );
}
