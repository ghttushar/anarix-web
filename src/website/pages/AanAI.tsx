import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { AanMascot } from "@/components/aan/AanMascot";
import { streamMockReply } from "../aan/mockAanEngine";

interface Msg { role: "user" | "aan"; text: string; }

export default function AanAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "aan", text: "Hi — I'm Aan. Ask me anything about Anarix: profitability, advertising, rules, pricing, or how I work." },
  ]);
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(question?: string) {
    const q = (question ?? input).trim();
    if (!q || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text: q }, { role: "aan", text: "" }]);
    setStreaming(true);
    let acc = "";
    await streamMockReply(q, (chunk) => {
      acc += chunk;
      setMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { role: "aan", text: acc };
        return next;
      });
    });
    setStreaming(false);
  }

  const suggestions = ["What does Anarix do?", "How do rules stay safe?", "Pricing", "Tell me about Day Parting"];

  return (
    <section className="px-6 pb-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <AanMascot state={streaming ? "thinking" : "idle"} size={96} interactive floating />
          <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Talk to Aan
          </div>
          <h1 className="mt-5 font-[Satoshi] text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
            The AI copilot for marketplace operators.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            Aan reads your data, diagnoses what's off, drafts the fix, and waits for your approval. Try a question.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-border bg-card p-5">
          <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : ""}>
                <div
                  className={
                    m.role === "user"
                      ? "inline-block max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "inline-block max-w-[90%] rounded-2xl bg-secondary/10 px-4 py-2.5 text-left text-sm text-foreground"
                  }
                >
                  {m.text || (streaming && i === messages.length - 1 ? "…" : "")}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                disabled={streaming}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="mt-4 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Aan anything…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || streaming}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
