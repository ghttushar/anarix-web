import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Check, Loader2, ArrowRight, Slack, Mail, Video, FileText, Pencil, Send, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AanEvent, useAanEvents } from "./AanEventsContext";
import { AanMascot } from "@/components/aan/AanMascot";

interface Props {
  event: AanEvent;
  onClose: () => void;
}

interface ChatMsg {
  id: string;
  role: "user" | "aan";
  text: string;
}

const contextIcons = { slack: Slack, email: Mail, meeting: Video, doc: FileText };

function aanReplyFor(question: string, event: AanEvent): string {
  const s = event.scenario;
  const q = question.toLowerCase();
  if (q.includes("why") || q.includes("how")) {
    return `Here's my reasoning on "${s.title}": ${s.reasoning?.[0] ?? s.signal}. Confidence ${s.confidence}%.`;
  }
  if (q.includes("alternative") || q.includes("instead") || q.includes("other")) {
    return `Alternatives I considered before recommending "${s.recommendation}": I weighed the trade-offs against ${s.evidence?.[0]?.label ?? "current performance"} — happy to walk through a specific option.`;
  }
  if (q.includes("risk") || q.includes("safe")) {
    return `Risk profile: this recommendation is bounded by the guardrails on your active policy. Worst-case impact stays within your approved thresholds.`;
  }
  return `Noted. On "${s.title}": ${s.impact}. Want me to draft an alternative or explain a specific step?`;
}

function initials(name: string): string {
  const first = name.replace(/\(.*?\)/g, "").trim().split(/\s+/)[0] ?? "";
  return first.slice(0, 2).toUpperCase();
}

export function ExecutionArtifact({ event, onClose }: Props) {
  const { approve, reject } = useAanEvents();
  const navigate = useNavigate();
  const s = event.scenario;
  const [editValue, setEditValue] = useState<string>(s.editable?.current ?? "");
  const [chatDraft, setChatDraft] = useState("");
  const [chatMsgs, setChatMsgs] = useState<ChatMsg[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const progress = event.executionProgress ?? 0;

  const ContextIcon = s.workspaceContext ? contextIcons[s.workspaceContext.kind] : null;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMsgs.length]);

  const handleEditAlert = () => {
    navigate("/settings/appearance#edit-alerts");
  };

  const handleAskAan = () => {
    const q = chatDraft.trim();
    if (!q) return;
    const userMsg: ChatMsg = { id: `u-${Date.now()}`, role: "user", text: q };
    setChatMsgs((prev) => [...prev, userMsg]);
    setChatDraft("");
    setTimeout(() => {
      setChatMsgs((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "aan", text: aanReplyFor(q, event) },
      ]);
    }, 500);
  };

  const snapshotTone = event.lifecycle === "fulfilled"
    ? "border-success bg-success/[0.05] text-success"
    : event.lifecycle === "rejected"
    ? "border-muted-foreground/40 bg-muted/40 text-muted-foreground"
    : "border-primary bg-primary/[0.05] text-primary";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/20" onClick={onClose} aria-hidden />
      <div className="fixed top-0 right-0 bottom-0 z-50 flex h-full w-[580px] max-w-[92vw] shrink-0 flex-col border-l border-border bg-background shadow-xl animate-in slide-in-from-right duration-200">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border px-4 py-3 shrink-0 gap-2">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-primary/80">Aan Alert · Details</div>
            <h2 className="font-heading text-sm font-semibold text-foreground truncate">{s.title}</h2>
            <p className="text-[11px] text-muted-foreground">{s.marketplace} · Confidence {s.confidence}%</p>
            {s.tags && s.tags.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {s.tags.map((t) => (
                  <span key={t} className="text-[9.5px] rounded bg-muted px-1.5 py-0.5 text-foreground/70">{t}</span>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEditAlert}
              className="h-7 w-7 text-muted-foreground hover:text-primary"
              title="Edit alert rule"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-4 space-y-5">
            {/* SNAPSHOT — payoff-first hero band */}
            <section>
              <SectionHeader label="Snapshot" />
              <div className={cn("rounded-md border-l-2 px-3 py-2.5", snapshotTone)}>
                <div className="text-[9.5px] uppercase tracking-wider font-semibold opacity-80">
                  {event.lifecycle === "fulfilled" ? "Result" : event.lifecycle === "rejected" ? "Status" : "Projected value"}
                </div>
                <div className="text-[14px] font-semibold text-foreground leading-snug mt-0.5">
                  {event.lifecycle === "fulfilled"
                    ? s.fulfillmentNote
                    : event.lifecycle === "rejected"
                    ? "Declined. Aan won't repeat this for 24h."
                    : s.impact}
                </div>
                <div className="text-[11.5px] text-muted-foreground mt-1 leading-snug">{s.subtitle}</div>
              </div>
            </section>

            {/* INSIGHT */}
            <section>
              <SectionHeader label="Insight" />
              <div className="text-[12.5px] text-foreground/80 leading-relaxed mb-3">{s.signal}</div>
              <div className="space-y-1.5">
                {s.evidence.map((row, i) => (
                  <div key={i} className="flex items-center justify-between gap-2 rounded-md bg-muted/40 px-3 py-2">
                    <span className="text-[11px] text-muted-foreground">{row.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] font-medium text-foreground">{row.value}</span>
                      {row.delta && (
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            row.deltaTone === "positive" && "text-success",
                            row.deltaTone === "negative" && "text-destructive",
                            !row.deltaTone && "text-muted-foreground"
                          )}
                        >
                          {row.delta}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {s.sources.map((src) => (
                  <span key={src} className="text-[9.5px] uppercase tracking-wider font-medium text-muted-foreground bg-muted rounded px-1.5 py-0.5">
                    {src}
                  </span>
                ))}
              </div>
            </section>

            {/* REASONING */}
            <section>
              <SectionHeader label="Reasoning" />
              <ul className="space-y-1.5">
                {s.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed">
                    <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                    <span className="text-foreground/80">{r}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* FROM MEETING */}
            {s.meetingRef && (
              <section>
                <SectionHeader label="From meeting" />
                <div className="rounded-md border border-primary/25 bg-primary/[0.03] p-3 space-y-3">
                  {/* Meeting header */}
                  <div className="flex items-start gap-2">
                    <Video className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="text-[12.5px] font-semibold text-foreground leading-snug">{s.meetingRef.title}</div>
                      <div className="text-[10.5px] text-muted-foreground">{s.meetingRef.when}</div>
                    </div>
                  </div>

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

                  {/* Decisions */}
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

                  {/* Action items */}
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

                  {/* Callouts */}
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

                  {/* Notes */}
                  {s.meetingRef.notes && (
                    <div>
                      <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Notes</div>
                      <p className="text-[11.5px] text-foreground/75 leading-relaxed">{s.meetingRef.notes}</p>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* WORKSPACE CONTEXT (non-meeting sources) */}
            {s.workspaceContext && ContextIcon && (
              <section>
                <SectionHeader label="Workspace context" />
                <div className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                    <ContextIcon className="h-3 w-3" />
                    {s.workspaceContext.who} · {s.workspaceContext.when}
                  </div>
                  <div className="text-[12px] italic text-foreground/80">"{s.workspaceContext.quote}"</div>
                </div>
              </section>
            )}

            {/* RECOMMENDATION & CONTROLS */}
            <section>
              <SectionHeader label="Recommendation" />
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                <div className="text-[12.5px] text-foreground mb-3">{s.recommendation}</div>
                {s.editable && event.lifecycle === "awaiting_approval" && (
                  <div className="mb-3">
                    <Label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
                      {s.editable.label}
                    </Label>
                    {s.editable.kind === "select" && s.editable.options ? (
                      <select
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="mt-1 w-full h-8 rounded-md border border-border bg-background text-[12px] px-2"
                      >
                        {s.editable.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="mt-1 h-8 text-[12px]"
                      />
                    )}
                  </div>
                )}
                {event.lifecycle === "awaiting_approval" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => approve(event.eventId, s.editable ? { [s.editable.label]: editValue } : undefined)}
                      className="h-8 text-[12px]"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      {s.actionLabel}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => reject(event.eventId)} className="h-8 text-[12px]">
                      Reject
                    </Button>
                  </div>
                )}
                {event.lifecycle === "rejected" && <div className="text-[11px] text-muted-foreground italic">You rejected this recommendation.</div>}
              </div>
            </section>

            {/* EXECUTION */}
            {(event.lifecycle === "executing" || event.lifecycle === "fulfilled") && (
              <section>
                <SectionHeader label="Execution" />
                <div className="space-y-1.5">
                  {s.steps.map((step, i) => {
                    const done = i < progress || event.lifecycle === "fulfilled";
                    const active = i === progress && event.lifecycle === "executing";
                    return (
                      <div key={i} className="rounded-md border border-border bg-card px-3 py-2 flex items-start gap-2.5">
                        <div className="w-4 pt-0.5">
                          {done ? (
                            <Check className="h-3.5 w-3.5 text-success" />
                          ) : active ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                          ) : (
                            <span className="block h-2 w-2 rounded-full bg-muted mt-1" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={cn("text-[12px]", done && "text-muted-foreground line-through", active && "text-foreground font-medium")}>
                            {step.label}
                          </div>
                          {step.detail && <div className="text-[10.5px] font-mono text-muted-foreground/80 mt-0.5">{step.detail}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* VERIFICATION */}
            {event.lifecycle === "fulfilled" && (
              <section>
                <SectionHeader label="Verification" />
                <div className="rounded-md border border-success/30 bg-success/5 p-3">
                  <div className="flex items-start gap-2 text-[12px] text-foreground mb-3">
                    <Check className="h-3.5 w-3.5 text-success mt-0.5 shrink-0" />
                    <span>{s.fulfillmentNote}</span>
                  </div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Before / After</div>
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
                  <div className="mt-3 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>Share:</span>
                    <button className="rounded bg-muted px-1.5 py-0.5 hover:bg-primary/10 hover:text-primary">Slack</button>
                    <button className="rounded bg-muted px-1.5 py-0.5 hover:bg-primary/10 hover:text-primary">Teams</button>
                    <button className="rounded bg-muted px-1.5 py-0.5 hover:bg-primary/10 hover:text-primary">Email</button>
                    <button className="ml-auto text-muted-foreground hover:text-foreground">Undo</button>
                  </div>
                </div>
                <div className="mt-2 text-[10px] font-mono text-muted-foreground">
                  audit_log · evt_{event.eventId.slice(-8)} · {new Date(event.updatedAt).toLocaleString()} · actor:aan · policy:{event.policyId ?? "user_approval"}
                </div>
              </section>
            )}
          </div>
        </ScrollArea>

        {/* Talk to Aan about this event — inline thread + composer */}
        <div className="border-t border-border shrink-0 bg-muted/20 flex flex-col max-h-[45%]">
          <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5 shrink-0">
            <AanMascot size={16} state="idle" interactive={false} />
            <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">
              Talk to Aan about this
            </div>
          </div>
          {chatMsgs.length > 0 && (
            <ScrollArea className="flex-1 min-h-0 px-3">
              <div className="space-y-2 py-2">
                {chatMsgs.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "text-[12px] leading-relaxed rounded-md px-2.5 py-1.5 max-w-[92%]",
                      m.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-card border border-border text-foreground"
                    )}
                  >
                    {m.text}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>
          )}
          <div className="p-3 pt-2 flex items-center gap-1.5 shrink-0">
            <Input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAskAan();
              }}
              placeholder="Ask a question, request an alternative…"
              className="h-8 text-[12px] flex-1"
            />
            <Button size="sm" onClick={handleAskAan} disabled={!chatDraft.trim()} className="h-8 px-2.5">
              <Send className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

      </div>
    </>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <div className="text-[10px] uppercase tracking-wider font-semibold text-primary mb-2">{label}</div>;
}
