import { useState } from "react";
import { X, Check, Loader2, ArrowRight, Slack, Mail, Video, FileText, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AanEvent, useAanEvents } from "./AanEventsContext";

interface Props {
  event: AanEvent;
  onClose: () => void;
}


const contextIcons = { slack: Slack, email: Mail, meeting: Video, doc: FileText };

export function ExecutionArtifact({ event, onClose }: Props) {
  const { approve, reject } = useAanEvents();
  const s = event.scenario;
  const [editValue, setEditValue] = useState<string>(s.editable?.current ?? "");
  const progress = event.executionProgress ?? 0;

  const ContextIcon = s.workspaceContext ? contextIcons[s.workspaceContext.kind] : null;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/20" onClick={onClose} aria-hidden />
      <div className="fixed top-0 left-0 bottom-0 z-50 flex h-full w-[560px] max-w-[92vw] shrink-0 flex-col border-r border-border bg-background shadow-xl animate-in slide-in-from-left duration-200">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 shrink-0">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-primary/80">Aan Execution Artifact</div>
          <h2 className="font-heading text-sm font-semibold text-foreground truncate">{s.title}</h2>
          <p className="text-[11px] text-muted-foreground">{s.marketplace} · Confidence {s.confidence}%</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>


      <ScrollArea className="flex-1 min-h-0">
        <div className="p-4 space-y-5">
          {/* INPUT */}
          <section>
            <SectionHeader label="Input" />
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

          {/* VALUE */}
          <section>
            <SectionHeader label="Value" />
            <ul className="space-y-1.5">
              {s.reasoning.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-[12px] leading-relaxed">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" />
                  <span className="text-foreground/80">{r}</span>
                </li>
              ))}
            </ul>
            {s.workspaceContext && ContextIcon && (
              <div className="mt-3 rounded-md border border-border bg-muted/30 p-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">
                  <ContextIcon className="h-3 w-3" />
                  Workspace context · {s.workspaceContext.who} · {s.workspaceContext.when}
                </div>
                <div className="text-[12px] italic text-foreground/80">"{s.workspaceContext.quote}"</div>
              </div>
            )}
          </section>

          {/* ACTION */}
          <section>
            <SectionHeader label="Action" />
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary/80 mb-1">Recommendation</div>
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
                  <Button size="sm" variant="ghost" className="h-8 text-[12px] text-primary ml-auto" title="Save this decision pattern as a policy Aan can auto-apply next time">
                    <Shield className="h-3.5 w-3.5 mr-1" />
                    Set as policy
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

          {/* FULFILLMENT */}
          {event.lifecycle === "fulfilled" && (
            <section>
              <SectionHeader label="Fulfillment" />
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
              {/* Audit log line */}
              <div className="mt-2 text-[10px] font-mono text-muted-foreground">
                audit_log · evt_{event.eventId.slice(-8)} · {new Date(event.updatedAt).toLocaleString()} · actor:aan · policy:{event.policyId ?? "user_approval"}
              </div>
            </section>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function SectionHeader({ label }: { label: string }) {
  return <div className="text-[10px] uppercase tracking-wider font-semibold text-primary mb-2">{label}</div>;
}
