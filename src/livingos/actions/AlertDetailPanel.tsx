import { useEffect, useRef, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AanMark } from "@/components/branding/AanMark";
import { Send } from "lucide-react";
import { SourceGlyph } from "./SourceGlyph";
import { ValueBlock } from "./ValueBlock";
import { useActionsStore } from "@/livingos/state/actionsStore";

export type PanelMode = "detail" | "ask_aan" | "custom";

export interface PanelState {
  decisionId: string | null;
  mode: PanelMode;
}

export const CLOSED_PANEL: PanelState = { decisionId: null, mode: "custom" };

interface Msg { role: "user" | "aan"; text: string; ts: number }

interface Props {
  state: PanelState;
  onOpenChange: (open: boolean) => void;
  /** Retained for API compatibility. */
  onModeChange?: (mode: PanelMode) => void;
}

/**
 * Minimised Aan chat side-panel — opens whenever the user picks
 * "Write custom action / Discuss with Aan" on a row/card/task.
 * Pre-seeded with the decision context.
 */
export function AlertDetailPanel({ state, onOpenChange }: Props) {
  const { decisions, delegateToAan } = useActionsStore();
  const d = decisions.find((x) => x.id === state.decisionId);
  const open = state.decisionId !== null;

  const [message, setMessage] = useState("");
  const [thread, setThread] = useState<Msg[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setMessage("");
    if (d) {
      setThread([{
        role: "aan",
        text: `I have full context on "${d.insight}". Tell me exactly how you want it handled, or ask me anything about it.`,
        ts: Date.now(),
      }]);
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setThread([]);
    }
  }, [state.decisionId]);

  function send() {
    if (!message.trim() || !d) return;
    const text = message.trim();
    setThread((t) => [...t, { role: "user", text, ts: Date.now() }]);
    setMessage("");
    setTimeout(() => {
      setThread((t) => [...t, {
        role: "aan",
        text: `Got it. I'll handle "${d.insight}" per your instruction and post the outcome in your Aan feed.`,
        ts: Date.now(),
      }]);
      delegateToAan(d.id);
    }, 500);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-[440px] p-0 flex flex-col">
        {d && (
          <>
            <SheetHeader className="px-4 pt-4 pb-3 border-b border-border space-y-2">
              <div className="flex items-center gap-2">
                <AanMark size={16} className="text-primary" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-primary">Discuss with Aan</span>
              </div>
              <SheetTitle className="text-[14px] font-medium leading-snug text-left">
                {d.insight}
              </SheetTitle>
              <div className="flex items-center justify-between gap-3">
                <ValueBlock cents={d.valueCents} kind={d.valueKind} caption={d.valueCaption} size="sm" />
                <SourceGlyph source={d.source} refLabel={d.sourceRef.label} size={16} />
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1 min-h-0">
              <div className="px-4 py-4 space-y-3">
                {thread.map((m, i) => (
                  <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                    <div className={
                      m.role === "user"
                        ? "max-w-[85%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-[13px]"
                        : "max-w-[85%] rounded-lg border border-border bg-muted/40 text-foreground px-3 py-2 text-[13px]"
                    }>
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-border px-3 py-3">
              <Textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
                }}
                placeholder="Write a custom instruction, or ask Aan anything…"
                className="min-h-[72px] text-[13px] resize-none"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Enter to send · Shift+Enter for a new line</span>
                <Button size="sm" onClick={send} disabled={!message.trim()} className="h-8 text-[12.5px] gap-1.5">
                  <Send className="h-3.5 w-3.5" /> Send
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
