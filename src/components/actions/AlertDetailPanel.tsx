import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { AanMark } from "@/components/branding/AanMark";
import { ArrowRight, ExternalLink, MessageSquare, Send } from "lucide-react";
import { SourceGlyph } from "./SourceGlyph";
import { ValueBlock } from "./ValueBlock";
import { SettledStrip, settledTintClasses } from "./SettledStrip";
import { useUndoFor } from "./useUndoFor";
import { useActionsStore } from "@/state/actionsStore";
import type { Decision } from "@/data/mockDecisions";


export type PanelMode = "detail" | "ask_aan" | "custom";

export interface PanelState {
  decisionId: string | null;
  mode: PanelMode;
}

export const CLOSED_PANEL: PanelState = { decisionId: null, mode: "detail" };

interface Props {
  state: PanelState;
  onOpenChange: (open: boolean) => void;
  onModeChange: (mode: PanelMode) => void;
}

export function AlertDetailPanel({ state, onOpenChange, onModeChange }: Props) {
  const { decisions, approve, delegateToAan, reject } = useActionsStore();
  const d = decisions.find((x) => x.id === state.decisionId);
  const open = state.decisionId !== null;

  const [message, setMessage] = useState("");
  useEffect(() => { setMessage(""); }, [state.decisionId, state.mode]);

  // Auto-close panel after the 30s undo window elapses on a settled decision.
  useEffect(() => {
    if (!d || d.status === "open") return;
    const t = setTimeout(() => onOpenChange(false), 30_000);
    return () => clearTimeout(t);
  }, [d?.id, d?.status, onOpenChange]);


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[540px] p-0 flex flex-col"
      >

        {d && (
          <>
            {/* Header */}
            <SheetHeader className="px-5 pt-5 pb-4 border-b border-border space-y-3">
              <div className="flex items-start justify-between gap-3">
                <ValueBlock
                  cents={d.valueCents}
                  kind={d.valueKind}
                  cadence={d.cadence}
                  caption={d.valueCaption}
                  size="lg"
                />
                <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={14} />
              </div>
              <SheetTitle className="text-[15px] font-medium leading-snug text-left">
                {d.insight}
              </SheetTitle>
              {/* Mode tabs */}
              <div className="flex items-center gap-1 pt-1">
                {(["detail", "ask_aan", "custom"] as PanelMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => onModeChange(m)}
                    className={
                      "h-7 px-2.5 rounded-md text-[12.5px] transition-colors " +
                      (state.mode === m
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted")
                    }
                  >
                    {m === "detail" ? "Details" : m === "ask_aan" ? "Ask Aan" : "Custom instruction"}
                  </button>
                ))}
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="px-5 py-5">
                {state.mode === "detail" && <DetailBody d={d} />}
                {state.mode === "ask_aan" && <AskAanBody d={d} message={message} setMessage={setMessage} />}
                {state.mode === "custom" && (
                  <CustomBody
                    d={d}
                    message={message}
                    setMessage={setMessage}
                    onSend={() => {
                      delegateToAan(d.id);
                      onOpenChange(false);
                    }}
                  />
                )}
              </div>
            </ScrollArea>

            {/* Footer — action bar (open) or confirmation strip (settled) */}
            {state.mode === "detail" && d.status === "open" && (
              <div className="border-t border-border px-5 py-3 flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => approve(d.id)}
                  className="h-9 text-[13px] gap-1.5 flex-1"
                >
                  {d.actionVerb} <ArrowRight className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onModeChange("custom")}
                  className="h-9 text-[13px] gap-1.5"
                >
                  Write custom action
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onModeChange("ask_aan")}
                  className="h-9 text-[13px] gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
                >
                  <AanMark size={13} className="text-primary" /> Ask Aan
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => reject(d.id)}
                  className="h-9 text-[13px] text-muted-foreground hover:text-destructive"
                >
                  Reject
                </Button>
              </div>
            )}
            {d.status !== "open" && (
              <div className={"border-t border-border px-3 py-3 " + settledTintClasses(d.status)}>
                <SettledStrip decision={d} />
                <div className="mt-1 px-2 text-[11.5px] text-muted-foreground">
                  Closing automatically when the undo window ends.
                </div>
              </div>
            )}

          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ---------------- Body variants ---------------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">
      {children}
    </div>
  );
}

function DetailBody({ d }: { d: Decision }) {
  return (
    <div className="space-y-5">
      <section>
        <SectionLabel>Why this matters</SectionLabel>
        <p className="text-[13.5px] leading-relaxed text-foreground/90">{d.valueBasis}</p>
        {d.valueInputs && d.valueInputs.length > 0 && (
          <ul className="mt-3 space-y-1.5">
            {d.valueInputs.map((v, i) => (
              <li key={i} className="text-[12.5px] text-foreground/80 flex items-start gap-2">
                <span className="text-primary mt-0.5">›</span>
                <span>{v}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {d.insightDetail && (
        <section>
          <SectionLabel>Full context</SectionLabel>
          <p className="text-[13.5px] leading-relaxed text-foreground/90">{d.insightDetail}</p>
        </section>
      )}

      {d.steps.length > 0 && (
        <section>
          <SectionLabel>Steps I'll run</SectionLabel>
          <ol className="space-y-2">
            {d.steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px]">
                <span className="mt-0.5 h-5 w-5 rounded-full border border-border text-[10.5px] font-semibold flex items-center justify-center shrink-0 text-muted-foreground">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="text-foreground">{s.label}</div>
                  {s.why && <div className="text-[11.5px] text-muted-foreground mt-0.5">{s.why}</div>}
                </div>
                <span className="text-[11px] text-muted-foreground font-mono tabular-nums shrink-0">~{s.etaSec}s</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      <Separator />

      <section className="space-y-2">
        <SectionLabel>Source</SectionLabel>
        <div className="flex items-center gap-2 text-[12.5px] text-muted-foreground">
          <SourceGlyph source={d.source} withLabel size={12} />
          <span>·</span>
          <span>{d.sourceRef.label}</span>
        </div>
        {d.deepLink && (
          <Button asChild size="sm" variant="outline" className="h-8 text-[12.5px] gap-1.5 mt-2">
            <a href={d.deepLink.href}>
              {d.deepLink.label} <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </section>
    </div>
  );
}

function AskAanBody({ d, message, setMessage }: { d: Decision; message: string; setMessage: (v: string) => void }) {
  return (
    <div className="space-y-4">
      <div className="rounded-md border border-primary/30 bg-primary/[0.05] px-3.5 py-3">
        <div className="flex items-start gap-2">
          <AanMark size={14} className="text-primary mt-0.5" />
          <div className="text-[13px] text-foreground/90">
            Ask me anything about <span className="font-medium">{d.insight}</span>. I have the full context — value math, evidence, and history.
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="e.g. 'What's the risk if I wait 24h?' or 'Show me similar past decisions.'"
          className="min-h-[110px] text-[13.5px] resize-none"
        />
        <div className="flex items-center justify-between">
          <div className="text-[11.5px] text-muted-foreground">Answers land in your Aan chat.</div>
          <Button
            size="sm"
            className="h-8 text-[12.5px] gap-1.5"
            disabled={!message.trim()}
            onClick={() => {
              // Fire-and-forget: reuses Aan chat surface via existing toast.
              setMessage("");
            }}
          >
            <MessageSquare className="h-3.5 w-3.5" /> Ask
          </Button>
        </div>
      </div>
    </div>
  );
}

function CustomBody({
  d, message, setMessage, onSend,
}: {
  d: Decision;
  message: string;
  setMessage: (v: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="space-y-4">
      <div className="text-[13px] text-foreground/85">
        Tell me how you want <span className="font-medium">{d.insight}</span> handled — I'll execute your instruction instead of the default plan.
      </div>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`e.g. '${d.actionVerb} but only after 6pm', 'Cap the shift at $500', 'Do half of it and confirm before the rest.'`}
        className="min-h-[140px] text-[13.5px] resize-none"
      />
      <div className="flex items-center justify-end">
        <Button
          size="sm"
          className="h-9 text-[13px] gap-1.5"
          disabled={!message.trim()}
          onClick={onSend}
        >
          <Send className="h-3.5 w-3.5" /> Send to Aan
        </Button>
      </div>
    </div>
  );
}
