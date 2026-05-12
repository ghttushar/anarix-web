import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
import { AanMascot } from "@/components/aan/AanMascot";
import { FloatingDots } from "@/components/aan/FloatingDots";
import { streamMockReply, generateMockReply } from "../aan/mockAanEngine";
import { cn } from "@/lib/utils";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

interface AanChatSurfaceProps {
  initialPrompt?: string;
  suggestedQuestions?: string[];
  variant?: "hero" | "compact";
  contextHint?: string;
  className?: string;
}

const DEFAULT_SUGGESTIONS = [
  "What does Anarix do?",
  "How does Aan work?",
  "Show me Profitability",
  "Pricing",
];

/** Live-feel mock chat: real Aan mascot + FloatingDots, simulated streaming. */
export function AanChatSurface({
  initialPrompt,
  suggestedQuestions = DEFAULT_SUGGESTIONS,
  variant = "hero",
  contextHint,
  className,
}: AanChatSurfaceProps) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState(initialPrompt ?? "");
  const [isGenerating, setIsGenerating] = useState(false);
  const [followups, setFollowups] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useCallback(
    async (text: string) => {
      const q = text.trim();
      if (!q || isGenerating) return;
      const seeded = contextHint ? `${q} (${contextHint})` : q;
      setMessages((m) => [...m, { role: "user", content: q }, { role: "assistant", content: "" }]);
      setInput("");
      setFollowups([]);
      setIsGenerating(true);
      let acc = "";
      await streamMockReply(seeded, (chunk) => {
        acc += chunk;
        setMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { role: "assistant", content: acc };
          return next;
        });
      });
      const reply = generateMockReply(seeded);
      setFollowups(reply.followups ?? []);
      setIsGenerating(false);
    },
    [contextHint, isGenerating]
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border bg-card shadow-sm",
        isHero ? "p-5" : "p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 pb-3">
        <AanMascot
          state={isGenerating ? "working" : "idle"}
          size={isHero ? 36 : 28}
          interactive={false}
          floating={isHero}
        />
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Talk to Aan</span>
          <span className="text-xs text-muted-foreground">
            Ask anything about Anarix · live demo
          </span>
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Demo
        </span>
      </div>

      <div
        ref={scrollRef}
        className={cn(
          "flex flex-col gap-3 overflow-y-auto rounded-lg border border-border/60 bg-background/60 p-3",
          isHero ? "h-[280px]" : "h-[200px]"
        )}
      >
        {messages.length === 0 && (
          <div className="m-auto max-w-md text-center text-sm text-muted-foreground">
            <p>I'm Aan. Ask me about the product, pricing, or how the rules engine works.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <MsgBubble key={i} msg={m} />
        ))}
        {isGenerating && messages[messages.length - 1]?.content === "" && (
          <div className="flex items-center gap-2 self-start rounded-2xl bg-secondary/5 px-3 py-2">
            <FloatingDots />
          </div>
        )}
      </div>

      {followups.length > 0 && !isGenerating && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {followups.map((f) => (
            <button
              key={f}
              onClick={() => send(f)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition-colors hover:bg-secondary/10"
            >
              {f}
            </button>
          ))}
        </div>
      )}

      {messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-secondary/10"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        className="mt-3 flex items-end gap-2 rounded-xl border border-border bg-background p-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <textarea
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          placeholder="Ask Aan anything…"
          className="min-h-[28px] flex-1 resize-none bg-transparent px-2 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={!input.trim() || isGenerating}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
          aria-label="Send"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function MsgBubble({ msg }: { msg: Msg }) {
  if (msg.role === "user") {
    return (
      <div className="self-end max-w-[80%] rounded-2xl bg-primary px-3 py-2 text-sm text-primary-foreground">
        {msg.content}
      </div>
    );
  }
  return (
    <div className="self-start max-w-[88%] rounded-2xl bg-secondary/5 px-3 py-2 text-sm leading-relaxed text-foreground">
      {msg.content || "…"}
    </div>
  );
}

export default AanChatSurface;
