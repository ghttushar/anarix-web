import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { AanMascot } from "@/components/aan/AanMascot";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

interface Props {
  scope?: "general" | "docs";
  suggested?: string[];
  className?: string;
  height?: string;
  initialMessage?: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/website-aan`;

export default function WebsiteAanChat({
  scope = "general",
  suggested = [
    "What does Anarix do?",
    "How is Aan different from other AI tools?",
    "What does it cost?",
    "Which channels do you support?",
  ],
  className,
  height = "h-[460px]",
  initialMessage = "Hi, I'm Aan. Ask me anything about Anarix - products, pricing, integrations, or how I work.",
}: Props) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: initialMessage },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aanState, setAanState] = useState<"idle" | "listening" | "thinking" | "speaking">("idle");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    setAanState("thinking");

    let assistantBuf = "";
    const upsert = (chunk: string) => {
      assistantBuf += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && last.content !== initialMessage) {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantBuf } : m));
        }
        return [...prev, { role: "assistant", content: assistantBuf }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, scope }),
      });

      if (!resp.ok || !resp.body) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${resp.status})`);
      }

      setAanState("speaking");
      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx);
          buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
      setAanState("idle");
    }
  };

  return (
    <div className={cn("rounded-2xl border border-border bg-card overflow-hidden flex flex-col shadow-medium", height, className)}>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-muted/30">
        <AanMascot state={aanState} size={28} interactive={false} />
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">Aan</div>
          <div className="text-[11px] text-muted-foreground flex items-center gap-1">
            <span className={cn("w-1.5 h-1.5 rounded-full", loading ? "bg-yellow-500" : "bg-green-500")} />
            {loading ? "Thinking…" : "Online"}
          </div>
        </div>
        <Sparkles className="w-4 h-4 text-primary" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm whitespace-pre-wrap"
                  : "bg-accent text-foreground rounded-bl-sm prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-1 prose-strong:text-foreground"
              )}
            >
              {m.role === "assistant" ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
            </div>
          </motion.div>
        ))}
        {loading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-accent rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
          </div>
        )}
        {error && (
          <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
            {error}
          </div>
        )}
      </div>

      {messages.length <= 1 && suggested.length > 0 && (
        <div className="px-3 pb-2 flex flex-wrap gap-1.5">
          {suggested.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-[11px] px-2.5 py-1 rounded-pill bg-accent text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="border-t border-border p-3 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setAanState(e.target.value ? "listening" : "idle"); }}
          placeholder="Ask Aan…"
          disabled={loading}
          className="flex-1 px-3 py-2 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-3 rounded-xl bg-primary text-primary-foreground disabled:opacity-50 hover:bg-primary/90 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
