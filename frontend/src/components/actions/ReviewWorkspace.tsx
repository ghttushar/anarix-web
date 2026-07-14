import { useState } from "react";
import { X, Check, Reply, Ban, Clock, UserPlus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ImpactChip } from "./chips/ImpactChip";
import { ConfidenceChip } from "./chips/ConfidenceChip";
import { IfIgnoredChip } from "./chips/IfIgnoredChip";
import { SourceGlyph } from "./SourceGlyph";
import { useActionsStore } from "@/state/actionsStore";
import { lifecycleFor, LIFECYCLE_LABEL } from "@/lib/decisions/lifecycle";
import type { Decision } from "@/data/mockDecisions";

interface Props {
  decision: Decision | null;
  onClose: () => void;
  onDiscussAan: (id: string) => void;
}

type Tab = "decide" | "replay" | "compare" | "audit";

function Block({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
        {eyebrow}
      </div>
      <div className="text-[13.5px] leading-relaxed text-foreground/90">{children}</div>
    </section>
  );
}

export function ReviewWorkspace({ decision: d, onClose, onDiscussAan }: Props) {
  const { approve, reject, delegateToAan, snooze } = useActionsStore();
  const [tab, setTab] = useState<Tab>("decide");
  const [auditOpen, setAuditOpen] = useState(false);

  if (!d) {
    return (
      <div className="flex-1 min-h-0 flex items-center justify-center border border-dashed border-border rounded-lg bg-card/50">
        <p className="text-[13.5px] text-muted-foreground">Pick a decision on the left to review.</p>
      </div>
    );
  }

  const lc = lifecycleFor(d);
  const isTerminal = lc === "completed_today" || lc === "history";

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-lg border border-border bg-card overflow-hidden">
      {/* Header */}
      <header className="px-5 pt-4 pb-3 border-b border-border">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
              <span>{d.domain}</span>
              <span className="text-border">·</span>
              <span>{d.sourceRef.label}</span>
              <span className="text-border">·</span>
              <span className="text-primary">{LIFECYCLE_LABEL[lc]}</span>
            </div>
            <h2 className="font-heading text-[18px] font-semibold text-foreground leading-snug">
              {d.insight}
            </h2>
          </div>
          <button onClick={onClose} className="shrink-0 h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div role="tablist" className="mt-3 flex items-center gap-1 border-b border-transparent -mb-3">
          {(["decide", "replay", "compare", "audit"] as Tab[]).map((k) => {
            const active = tab === k;
            const disabled = (k === "replay" && !isTerminal);
            return (
              <button
                key={k}
                role="tab"
                aria-selected={active}
                disabled={disabled}
                onClick={() => setTab(k)}
                className={cn(
                  "h-8 px-3 text-[12.5px] rounded-t-md capitalize transition-colors",
                  active ? "text-foreground border-b-2 border-primary font-medium" :
                  "text-muted-foreground hover:text-foreground",
                  disabled && "opacity-40 cursor-not-allowed",
                )}
              >
                {k}
              </button>
            );
          })}
        </div>
      </header>

      {/* Body */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-5 py-4 space-y-5">
          {tab === "decide" && (
            <>
              <Block eyebrow="Why this matters">
                {d.insightDetail || "This decision affects revenue trajectory over the next reporting window."}
              </Block>

              <Block eyebrow="Recommendation">
                <div className="rounded-md border border-border bg-muted/30 p-3 space-y-2">
                  <div className="font-medium text-foreground">{d.actionVerb}</div>
                  <div className="text-[12.5px] text-muted-foreground">
                    {d.valueBasis}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <ImpactChip decision={d} />
                    <ConfidenceChip decision={d} />
                    <IfIgnoredChip decision={d} />
                  </div>
                </div>
              </Block>

              <Block eyebrow="Alternative actions">
                <ul className="text-[12.5px] text-muted-foreground space-y-1.5">
                  <li>· Snooze until tomorrow morning</li>
                  <li>· Delegate this decision to Aan</li>
                  <li>· Reject and stand down for 24h</li>
                </ul>
              </Block>

              {d.valueInputs && d.valueInputs.length > 0 && (
                <Block eyebrow="Evidence">
                  <ul className="text-[12.5px] text-muted-foreground space-y-1">
                    {d.valueInputs.map((line, i) => (
                      <li key={i} className="flex gap-2">
                        <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={12} />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </Block>
              )}

              <Block eyebrow="Previous outcomes">
                <p className="text-[12.5px] text-muted-foreground">
                  Last time you approved a similar decision, Aan recovered value within 3 days.
                </p>
              </Block>

              <div>
                <button
                  onClick={() => setAuditOpen((v) => !v)}
                  className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground"
                >
                  Audit trail {auditOpen ? "▾" : "▸"}
                </button>
                {auditOpen && (
                  <div className="mt-2 rounded-md border border-border bg-muted/20 p-3 text-[12px] text-muted-foreground space-y-1">
                    <div>Created · {new Date(d.createdAt).toLocaleString()} · {d.sourceRef.label}</div>
                    <div>Updated · {new Date(d.updatedAt).toLocaleString()} · status = {d.status}</div>
                    <div>Confidence · derived from {d.severity} severity</div>
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "replay" && (
            <div className="text-[13px] text-muted-foreground py-8">
              Replay opens once this decision has been resolved. It will show the original recommendation, your action, and the final outcome.
            </div>
          )}

          {tab === "compare" && (
            <div className="text-[13px] text-muted-foreground py-8">
              Select a peer decision from the list to compare side-by-side.
            </div>
          )}

          {tab === "audit" && (
            <div className="rounded-md border border-border bg-muted/20 p-3 text-[12px] text-muted-foreground space-y-1">
              <div>Created · {new Date(d.createdAt).toLocaleString()} · source: {d.source}</div>
              <div>Last updated · {new Date(d.updatedAt).toLocaleString()} · status: {d.status}</div>
              <div>AI involvement · recommendation drafted by Aan, awaiting user action</div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer — actions */}
      {tab === "decide" && (
        <footer className="border-t border-border p-3 flex flex-wrap items-center gap-2">
          {isTerminal ? (
            <span className="text-[12.5px] text-muted-foreground px-1">This decision is closed.</span>
          ) : (
            <>
              <Button size="sm" onClick={() => approve(d.id)} className="h-8 text-[12.5px] gap-1.5">
                <Check className="h-3.5 w-3.5" /> Approve
              </Button>
              <Button size="sm" variant="outline" onClick={() => onDiscussAan(d.id)} className="h-8 text-[12.5px] gap-1.5">
                <Sparkles className="h-3.5 w-3.5" /> Modify
              </Button>
              <Button size="sm" variant="outline" onClick={() => reject(d.id)} className="h-8 text-[12.5px] gap-1.5">
                <Ban className="h-3.5 w-3.5" /> Reject
              </Button>
              <Button size="sm" variant="outline" onClick={() => delegateToAan(d.id)} className="h-8 text-[12.5px] gap-1.5">
                <Reply className="h-3.5 w-3.5" /> Delegate
              </Button>
              <div className="ml-auto flex items-center gap-2">
                <Button size="sm" variant="ghost" className="h-8 text-[12.5px] gap-1.5" disabled>
                  <UserPlus className="h-3.5 w-3.5" /> Assign
                </Button>
                <Button size="sm" variant="ghost" onClick={() => snooze(d.id, "tomorrow")}
                  className="h-8 text-[12.5px] gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Snooze
                </Button>
              </div>
            </>
          )}
        </footer>
      )}
    </div>
  );
}
