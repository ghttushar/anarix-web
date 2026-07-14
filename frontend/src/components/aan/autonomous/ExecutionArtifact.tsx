import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X, Check, Loader2, ArrowRight, Slack, Mail, Video, FileText,
  Pencil, Send, Users, Sparkles, ChevronDown, Share2, Link as LinkIcon, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { AanEvent, useAanEvents } from "./AanEventsContext";
import { AanMascot } from "@/components/aan/AanMascot";
import { toast } from "sonner";

interface Props {
  event: AanEvent;
  onClose: () => void;
}

interface ChatMsg { id: string; role: "user" | "aan"; text: string; }

const contextIcons = { slack: Slack, email: Mail, meeting: Video, doc: FileText };

function aanReplyFor(question: string, event: AanEvent): string {
  const s = event.scenario;
  const q = question.toLowerCase();
  if (q.includes("why") || q.includes("how")) {
    return `Here's my reasoning on "${s.title}": ${s.reasoning?.[0] ?? s.signal}. I'm at ${s.confidence}% confidence.`;
  }
  if (q.includes("alternative") || q.includes("instead") || q.includes("other")) {
    return `Before recommending "${s.recommendation}", I weighed it against ${s.evidence?.[0]?.label ?? "current performance"}. Happy to walk through a specific option.`;
  }
  if (q.includes("risk") || q.includes("safe")) {
    return `I've kept this inside your active policy guardrails. Worst-case impact stays within your approved thresholds.`;
  }
  return `Noted. On "${s.title}": ${s.impact}. Want me to draft an alternative or explain a step?`;
}

function initials(name: string): string {
  const first = name.replace(/\(.*?\)/g, "").trim().split(/\s+/)[0] ?? "";
  return first.slice(0, 2).toUpperCase();
}

function statusPill(lifecycle: AanEvent["lifecycle"]) {
  switch (lifecycle) {
    case "awaiting_approval":
    case "detected":
    case "analyzing":
      return { label: "I'm waiting on you", tone: "bg-primary/10 text-primary border-primary/30" };
    case "executing":
      return { label: "I'm on it", tone: "bg-primary/10 text-primary border-primary/30 animate-pulse" };
    case "fulfilled":
      return { label: "I wrapped this up", tone: "bg-success/10 text-success border-success/30" };
    case "rejected":
      return { label: "I stood down", tone: "bg-muted text-muted-foreground border-border" };
  }
}

/** Semi-circular confidence gauge — small SVG. */
function ConfidenceGauge({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const r = 26;
  const c = Math.PI * r;
  const offset = c - (clamped / 100) * c;
  return (
    <div className="relative h-14 w-14 shrink-0" title={`Confidence ${clamped}%`}>
      <svg viewBox="0 0 60 60" className="h-full w-full -rotate-90">
        <circle cx="30" cy="30" r={r} className="fill-none stroke-muted" strokeWidth="4" />
        <circle
          cx="30" cy="30" r={r}
          className="fill-none stroke-primary transition-all"
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-[13px] font-semibold text-foreground leading-none">{clamped}</div>
        <div className="text-[7.5px] uppercase tracking-wider text-muted-foreground mt-0.5">conf</div>
      </div>
    </div>
  );
}

/** Evidence row with delta magnitude bar. */
function EvidenceBar({ label, value, delta, deltaTone }: { label: string; value: string; delta?: string; deltaTone?: "positive" | "negative" | "neutral" }) {
  const magnitude = delta ? Math.min(100, Math.abs(parseFloat(delta.replace(/[^\d.-]/g, "")) || 0)) : 0;
  const barColor = deltaTone === "positive" ? "bg-success" : deltaTone === "negative" ? "bg-destructive" : "bg-muted-foreground";
  return (
    <div className="rounded-md bg-muted/40 px-3 py-2">
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-[11px] text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-medium text-foreground">{value}</span>
          {delta && (
            <span className={cn(
              "text-[10px] font-medium",
              deltaTone === "positive" && "text-success",
              deltaTone === "negative" && "text-destructive",
              !deltaTone && "text-muted-foreground"
            )}>{delta}</span>
          )}
        </div>
      </div>
      {delta && (
        <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
          <div className={cn("h-full rounded-full transition-all", barColor)} style={{ width: `${magnitude}%` }} />
        </div>
      )}
    </div>
  );
}

function Section({ label, children, right }: { label: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">{label}</div>
        {right}
      </div>
      {children}
    </section>
  );
}

function CollapseSection({ label, defaultOpen = false, badge, children }: { label: string; defaultOpen?: boolean; badge?: React.ReactNode; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="w-full flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 hover:bg-muted/40 transition-colors">
        <div className="flex items-center gap-2">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">{label}</div>
          {badge}
        </div>
        <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2.5">{children}</CollapsibleContent>
    </Collapsible>
  );
}

export function ExecutionArtifact({ event, onClose }: Props) {
  const { approve, reject } = useAanEvents();
  const navigate = useNavigate();
  const s = event.scenario;
  const [editValue, setEditValue] = useState<string>(s.editable?.current ?? "");
  const [chatDraft, setChatDraft] = useState("");
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const [showAllEvidence, setShowAllEvidence] = useState(false);
  const [showAllReasoning, setShowAllReasoning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const progress = event.executionProgress ?? 0;
  const totalSteps = s.steps.length;
  const stepPct = totalSteps > 0 ? Math.round((progress / totalSteps) * 100) : 0;

  const ContextIcon = s.workspaceContext ? contextIcons[s.workspaceContext.kind] : null;
  const pill = statusPill(event.lifecycle);
  const isTerminal = event.lifecycle === "fulfilled" || event.lifecycle === "rejected";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs.length]);

  const handleEditAlert = () => navigate("/settings/appearance#edit-alerts");

  const handleAskAan = () => {
    const q = chatDraft.trim();
    if (!q) return;
    setChatMsgs((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text: q }]);
    setChatDraft("");
    setTimeout(() => {
      setChatMsgs((prev) => [...prev, { id: `a-${Date.now()}`, role: "aan", text: aanReplyFor(q, event) }]);
    }, 500);
  };

  const shareTo = (channel: string) => toast.success(`Shared to ${channel}.`);
  const copyLink = () => { navigator.clipboard?.writeText(`action-item://${event.eventId}`); toast.success("Link copied."); };

  const snapshotTone = event.lifecycle === "fulfilled"
    ? "border-success bg-success/[0.04]"
    : event.lifecycle === "rejected"
    ? "border-muted-foreground/40 bg-muted/40"
    : "border-primary bg-primary/[0.04]";

  const evidenceShown = showAllEvidence ? s.evidence : s.evidence.slice(0, 3);
  const reasoningShown = showAllReasoning ? s.reasoning : s.reasoning.slice(0, 1);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/25 backdrop-blur-[1px]" onClick={onClose} aria-hidden />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex h-full w-[760px] max-w-[94vw] shrink-0 flex-col border-l border-border bg-background shadow-2xl animate-in slide-in-from-right duration-200">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-6 py-4 shrink-0 gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary/80">Aan · Action Item</div>
              <span className={cn("text-[9.5px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded border", pill.tone)}>
                {pill.label}
              </span>
            </div>
            <h2 className="font-heading text-[17px] font-semibold text-foreground leading-snug">{s.title}</h2>
            <p className="text-[11.5px] text-muted-foreground mt-0.5">{s.marketplace}</p>
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button variant="ghost" size="icon" onClick={handleEditAlert} className="h-8 w-8 text-muted-foreground hover:text-primary" title="Edit alert rule">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6 space-y-5">
            {/* SNAPSHOT — hero with confidence gauge */}
            <section>
              <div className={cn("rounded-lg border-l-4 px-4 py-3.5 flex items-start gap-4", snapshotTone)}>
                <ConfidenceGauge value={s.confidence} />
                <div className="min-w-0 flex-1">
                  <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground">
                    {event.lifecycle === "fulfilled" ? "Result" : event.lifecycle === "rejected" ? "Status" : "Projected value"}
                  </div>
                  <div className="text-[15px] font-semibold text-foreground leading-snug mt-0.5">
                    {event.lifecycle === "fulfilled"
                      ? s.fulfillmentNote
                      : event.lifecycle === "rejected"
                      ? "I've stood down. I won't repeat this for 24h."
                      : s.impact}
                  </div>
                  <div className="text-[12px] text-muted-foreground mt-1 leading-snug">{s.subtitle}</div>
                </div>
              </div>
            </section>

            {/* INSIGHT + evidence bars */}
            <Section label="What I noticed" right={s.evidence.length > 3 && (
              <button onClick={() => setShowAllEvidence(v => !v)} className="text-[10.5px] text-primary hover:underline">
                {showAllEvidence ? "Show less" : `Show all ${s.evidence.length}`}
              </button>
            )}>
              <div className="text-[12.5px] text-foreground/85 leading-relaxed mb-3">{s.signal}</div>
              <div className="space-y-1.5">
                {evidenceShown.map((row, i) => (
                  <EvidenceBar key={i} label={row.label} value={row.value} delta={row.delta} deltaTone={row.deltaTone} />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {s.sources.map((src) => (
                  <span key={src} className="text-[9.5px] uppercase tracking-wider font-medium text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                    {src}
                  </span>
                ))}
              </div>
            </Section>

            {/* REASONING — collapsible after first */}
            <Section label="My reasoning" right={s.reasoning.length > 1 && (
              <button onClick={() => setShowAllReasoning(v => !v)} className="text-[10.5px] text-primary hover:underline">
                {showAllReasoning ? "Collapse" : `Show my full reasoning (${s.reasoning.length})`}
              </button>
            )}>
              <ul className="space-y-1.5">
                {reasoningShown.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12.5px] leading-relaxed">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    <span className="text-foreground/85">{r}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* FROM MEETING — collapsed by default */}
            {s.meetingRef && (
              <CollapseSection
                label="From meeting"
                defaultOpen={false}
                badge={
                  <span className="text-[10.5px] text-foreground/70 font-medium truncate max-w-[260px]">
                    {s.meetingRef.title} · {s.meetingRef.when} · {s.meetingRef.attendees.length} people
                  </span>
                }
              >
                <div className="rounded-md border border-primary/25 bg-primary/[0.03] p-3.5 space-y-3.5">
                  {/* Attendees */}
                  <div>
                    <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Attendees
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {s.meetingRef.attendees.map((a) => (
                        <div key={a} className="flex items-center gap-1.5 rounded-full bg-muted pl-0.5 pr-2 py-0.5">
                          <span className="h-4 w-4 rounded-full bg-primary/15 text-primary text-[8.5px] font-semibold flex items-center justify-center">
                            {initials(a)}
                          </span>
                          <span className="text-[10.5px] text-foreground/80">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {s.meetingRef.decisions.length > 0 && (
                    <div>
                      <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Decisions</div>
                      <ul className="space-y-1">
                        {s.meetingRef.decisions.map((d, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-[11.5px] leading-snug text-foreground/85">
                            <Check className="h-3 w-3 text-success mt-0.5 shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {s.meetingRef.actionItems.length > 0 && (
                    <div>
                      <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Action items</div>
                      <ul className="space-y-1">
                        {s.meetingRef.actionItems.map((it, i) => (
                          <li key={i} className="flex items-start gap-2 text-[11.5px] leading-snug rounded bg-background/60 px-2 py-1.5">
                            <span className={cn("mt-0.5 h-3 w-3 rounded-full border shrink-0 flex items-center justify-center", it.done ? "bg-success/15 border-success" : "border-muted-foreground/40")}>
                              {it.done && <Check className="h-2 w-2 text-success" />}
                            </span>
                            <div className="min-w-0 flex-1">
                              <div className={cn(it.done && "text-muted-foreground line-through")}>{it.task}</div>
                              <div className="text-[10px] text-muted-foreground mt-0.5">
                                <span className="font-medium">{it.owner}</span> · due {it.due}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {s.meetingRef.callouts.length > 0 && (
                    <div>
                      <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1 flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Callouts
                      </div>
                      <ul className="space-y-1">
                        {s.meetingRef.callouts.map((c, i) => (
                          <li key={i} className="text-[11.5px] italic text-foreground/80 border-l-2 border-primary/40 pl-2 leading-snug">
                            "{c}"
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {s.meetingRef.notes && (
                    <div>
                      <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Notes</div>
                      <p className="text-[11.5px] text-foreground/75 leading-relaxed">{s.meetingRef.notes}</p>
                    </div>
                  )}
                </div>
              </CollapseSection>
            )}

            {/* WORKSPACE CONTEXT */}
            {s.workspaceContext && ContextIcon && (
              <Section label="Workspace context">
                <div className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                    <ContextIcon className="h-3 w-3" />
                    {s.workspaceContext.who} · {s.workspaceContext.when}
                  </div>
                  <div className="text-[12px] italic text-foreground/80">"{s.workspaceContext.quote}"</div>
                </div>
              </Section>
            )}

            {/* RECOMMENDATION */}
            <Section label="What I recommend">
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3.5">
                <div className="text-[12.5px] text-foreground mb-3">{s.recommendation}</div>
                {s.editable && event.lifecycle === "awaiting_approval" && (
                  <div>
                    <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {s.editable.label}
                    </Label>
                    {s.editable.kind === "select" && s.editable.options ? (
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="mt-1 w-full h-8 rounded-md border border-border bg-background text-[12px] px-2"
                      >
                        {s.editable.options.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <Input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="mt-1 h-8 text-[12px]" />
                    )}
                  </div>
                )}
              </div>
            </Section>

            {/* EXECUTION — vertical stepper with progress */}
            {(event.lifecycle === "executing" || event.lifecycle === "fulfilled") && (
              <Section label="Progress" right={
                <span className="text-[10.5px] font-medium text-muted-foreground">
                  {Math.min(progress, totalSteps)} of {totalSteps} · {stepPct}%
                </span>
              }>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden mb-3">
                  <div className="h-full bg-primary transition-all" style={{ width: `${stepPct}%` }} />
                </div>
                <ol className="relative space-y-2 pl-6">
                  <span className="absolute left-[8px] top-2 bottom-2 w-px bg-border" aria-hidden />
                  {s.steps.map((step, i) => {
                    const done = i < progress || event.lifecycle === "fulfilled";
                    const active = i === progress && event.lifecycle === "executing";
                    return (
                      <li key={i} className="relative">
                        <span className={cn(
                          "absolute -left-[22px] top-1 h-4 w-4 rounded-full border-2 flex items-center justify-center",
                          done ? "bg-success border-success" : active ? "bg-primary border-primary" : "bg-card border-border"
                        )}>
                          {done ? <Check className="h-2.5 w-2.5 text-success-foreground" /> : active ? <Loader2 className="h-2.5 w-2.5 animate-spin text-primary-foreground" /> : null}
                        </span>
                        <div className={cn("text-[12.5px] leading-snug", done && "text-muted-foreground line-through", active && "text-foreground font-medium")}>
                          {step.label}
                        </div>
                        {step.detail && <div className="text-[10.5px] font-mono text-muted-foreground/80 mt-0.5">{step.detail}</div>}
                      </li>
                    );
                  })}
                </ol>
              </Section>
            )}

            {/* VERIFICATION — visible after terminal state */}
            {isTerminal && (
              <Section label="Verification">
                <div className={cn(
                  "rounded-md border p-3.5",
                  event.lifecycle === "fulfilled" ? "border-success/30 bg-success/5" : "border-border bg-muted/30"
                )}>
                  <div className="flex items-start gap-2 text-[12.5px] text-foreground mb-3">
                    <ShieldCheck className={cn("h-4 w-4 mt-0.5 shrink-0", event.lifecycle === "fulfilled" ? "text-success" : "text-muted-foreground")} />
                    <span>
                      {event.lifecycle === "fulfilled"
                        ? s.fulfillmentNote
                        : "I've stood down on this. I won't repeat it for 24h."}
                    </span>
                  </div>
                  {event.lifecycle === "fulfilled" && s.diff.length > 0 && (
                    <>
                      <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Before → After</div>
                      <div className="space-y-1.5">
                        {s.diff.map((d, i) => (
                          <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded bg-background/60 px-2.5 py-1.5">
                            <div>
                              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{d.field}</div>
                              <div className="text-[11.5px] text-muted-foreground line-through">{d.before}</div>
                            </div>
                            <ArrowRight className="h-3 w-3 text-muted-foreground" />
                            <div className="text-right">
                              <div className="text-[9px] uppercase tracking-wider text-success">now</div>
                              <div className="text-[11.5px] text-foreground font-medium">{d.after}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {/* Share group */}
                  <div className="mt-3 pt-3 border-t border-border/60">
                    <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Share2 className="h-3 w-3" /> Share this verification
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <button onClick={() => shareTo("Slack")} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                        <Slack className="h-3 w-3" /> Slack
                      </button>
                      <button onClick={() => shareTo("Teams")} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                        <Video className="h-3 w-3" /> Teams
                      </button>
                      <button onClick={() => shareTo("Email")} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                        <Mail className="h-3 w-3" /> Email
                      </button>
                      <button onClick={copyLink} className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
                        <LinkIcon className="h-3 w-3" /> Copy link
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-muted-foreground">
                  audit_log · evt_{event.eventId.slice(-8)} · {new Date(event.updatedAt).toLocaleString()} · actor:aan · policy:{event.policyId ?? "user_approval"}
                </div>
              </Section>
            )}
          </div>
        </ScrollArea>

        {/* Sticky action bar (when awaiting) */}
        {event.lifecycle === "awaiting_approval" && (
          <div className="border-t border-border bg-background/95 backdrop-blur px-6 py-3 shrink-0 flex items-center justify-between gap-2">
            <div className="text-[11px] text-muted-foreground">You have 30s to undo after either action.</div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={() => reject(event.eventId)} className="h-8 px-3 text-[12px] text-muted-foreground hover:text-destructive">
                Reject
              </Button>
              <Button size="sm" onClick={() => approve(event.eventId, s.editable ? { [s.editable.label]: editValue } : undefined)} className="h-8 px-4 text-[12px]">
                <Check className="h-3.5 w-3.5 mr-1" />
                {s.actionLabel}
              </Button>
            </div>
          </div>
        )}

        {/* Chat zone — visually distinct */}
        <div className="border-t-2 border-border shrink-0 bg-card flex flex-col max-h-[42%]">
          <div className="px-5 pt-3 pb-1.5 flex items-center gap-2 shrink-0 border-b border-border/50">
            <AanMascot size={18} state="idle" interactive={false} />
            <div className="text-[11px] uppercase tracking-wider font-semibold text-foreground/80">
              Talk to me about this
            </div>
            <span className="ml-auto text-[10px] text-muted-foreground">First-person, in context</span>
          </div>
          {chatMsgs.length > 0 && (
            <ScrollArea className="flex-1 min-h-0 px-5">
              <div className="space-y-2.5 py-3">
                {chatMsgs.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "text-[12.5px] leading-relaxed rounded-lg px-3 py-2 max-w-[85%]",
                      m.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-background border border-border text-foreground"
                    )}
                  >
                    {m.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
          )}
          <div className="p-4 pt-3 flex items-center gap-2 shrink-0">
            <Input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleAskAan(); }}
              placeholder="Ask me anything — why, what if, alternatives…"
              className="h-10 text-[13px] flex-1 rounded-lg bg-background shadow-sm border-border focus-visible:ring-1 focus-visible:ring-primary/40"
            />
            <Button size="sm" onClick={handleAskAan} disabled={!chatDraft.trim()} className="h-10 w-10 p-0 rounded-lg">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}
