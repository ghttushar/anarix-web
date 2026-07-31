// Discuss-with-Aan slide-out drawer. Replaces the SignalDetailPanel path.
import { useState } from "react";
import { X, Send, Sparkles } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Decision } from "@/types/signals";

interface Msg {
  who: "user" | "aan";
  text: string;
  ts: number;
}

interface Props {
  decision: Decision | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

export function DiscussDrawer({ decision, open, onOpenChange }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");

  const send = () => {
    const t = text.trim();
    if (!t || !decision) return;
    const user: Msg = { who: "user", text: t, ts: Date.now() };
    const aan: Msg = {
      who: "aan",
      text: `Got it. I'll factor that in when I re-check ${decision.sourceRef.label} — the recommendation still holds on today's data.`,
      ts: Date.now() + 1,
    };
    setMsgs((m) => [...m, user, aan]);
    setText("");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] p-0 flex flex-col">
        <header className="px-4 py-3 border-b border-border flex items-center gap-2">
          <span className="h-7 w-7 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold text-foreground">Discuss with Aan</div>
            <div className="text-[11.5px] text-muted-foreground truncate">
              {decision?.insight || ""}
            </div>
          </div>
          <button onClick={() => onOpenChange(false)} className="h-7 w-7 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground">
            <X className="h-3.5 w-3.5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
          {msgs.length === 0 && (
            <div className="text-[12.5px] text-muted-foreground py-6 text-center">
              Ask me anything about this decision — assumptions, tradeoffs, alternatives, or evidence.
            </div>
          )}
          {msgs.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-[13px]",
                m.who === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted/50 text-foreground",
              )}
            >
              {m.text}
            </div>
          ))}
        </div>

        <footer className="border-t border-border p-3 flex items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
            placeholder="Ask Aan…"
            className="h-9 text-[13px]"
          />
          <Button size="sm" onClick={send} disabled={!text.trim()} className="h-9">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </footer>
      </SheetContent>
    </Sheet>
  );
}
