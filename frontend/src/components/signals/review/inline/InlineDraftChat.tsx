// Inline draft chat card — used for Draft Support Ticket / Analyze Listing when AI Panel mode = "main"
// Shows Aan's initial draft and lets the user chat further inline.
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AanMark } from "@/components/branding/AanMark";
import { toast } from "sonner";

interface Msg { role: "user" | "aan"; text: string; ts: number }

interface Props {
  title: string;                 // e.g. "Aan drafted this support ticket"
  approveLabel: string;          // e.g. "Approve & file ticket"
  approveSuccess: string;        // toast text on approve
  initialDraft: string;          // markdown draft body from AAN_SEEDS
  onCancel: () => void;
  onApprove: () => void;
}

export function InlineDraftChat({
  title, approveLabel, approveSuccess, initialDraft, onCancel, onApprove,
}: Props) {
  const [thread, setThread] = useState<Msg[]>([
    { role: "aan", text: initialDraft, ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [thread]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  function send() {
    const text = input.trim();
    if (!text) return;
    setThread((t) => [...t, { role: "user", text, ts: Date.now() }]);
    setInput("");
    setTimeout(() => {
      setThread((t) => [...t, {
        role: "aan",
        text: "Got it — I've updated the draft above with that change. Review the latest version and approve when you're ready.",
        ts: Date.now(),
      }]);
    }, 500);
  }

  function approve() {
    toast.success(approveSuccess);
    onApprove();
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AanMark size={14} className="text-primary" />
          <span className="text-[10.5px] uppercase tracking-widest font-semibold text-primary">
            {title}
          </span>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel} className="h-7 text-[11.5px] gap-1 text-muted-foreground">
          <X className="h-3 w-3" /> Cancel
        </Button>
      </div>

      <div className="rounded-xl border border-primary/25 bg-card overflow-hidden flex flex-col">
        <div
          ref={scrollRef}
          className="max-h-[420px] overflow-y-auto px-4 py-4 space-y-3"
        >
          {thread.map((m, i) => (
            <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
              <div
                className={
                  m.role === "user"
                    ? "max-w-[85%] rounded-lg bg-primary text-primary-foreground px-3 py-2 text-[13px] whitespace-pre-wrap"
                    : "max-w-[92%] rounded-lg border border-border bg-muted/40 text-foreground px-3.5 py-2.5 text-[13px] prose prose-sm max-w-none prose-p:my-1 prose-headings:my-1 prose-strong:text-foreground prose-ul:my-1"
                }
              >
                {m.role === "aan" ? <ReactMarkdown>{m.text}</ReactMarkdown> : m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border/60 p-2.5">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder="Ask Aan to revise the draft, or add more context…"
            className="min-h-[64px] text-[13px] resize-none"
          />
          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="h-3 w-3 text-primary" />
              Enter to send · Shift+Enter for a new line
            </span>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" onClick={send} disabled={!input.trim()} className="h-8 text-[12.5px] gap-1.5 text-muted-foreground">
                <Send className="h-3.5 w-3.5" /> Send
              </Button>
              <Button size="sm" onClick={approve} className="h-8 text-[12.5px] gap-1.5">
                <Check className="h-3.5 w-3.5" /> {approveLabel}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
