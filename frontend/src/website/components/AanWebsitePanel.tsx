import { useEffect, useRef, useState, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { X, Send, Calendar, User, Square, Paperclip } from "lucide-react";
import { useLocation } from "react-router-dom";
import { AanLogo } from "@/components/aan/AanLogo";
import { useAan } from "@/components/aan/AanContext";
import { AanPresenceProvider, useAanPresence } from "@/components/aan/AanPresenceContext";
import { AanPresencePortal } from "@/components/aan/AanPresencePortal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/website-aan`;

const SUGGESTED = [
  "What does Anarix do?",
  "How is Aan different?",
  "Pricing & onboarding",
  "Which marketplaces?",
];

const PAGE_LABELS: Record<string, string> = {
  "/website": "Home",
  "/website/product": "Anarix Insight Engine",
  "/website/pricing": "Pricing",
  "/website/about": "About",
  "/website/contact": "Contact",
  "/website/career": "Careers",
  "/website/demo": "Book a demo",
  "/website/documentation": "Documentation",
};

/**
 * Right-side fixed Aan chatbot for the website. Internally provides its own
 * AanPresenceProvider so the morphing mascot from the app travels into the
 * input slot above the textarea - exact same shape-morph behavior as the
 * in-app AanCopilotPanel + AanInput.
 */
export default function AanWebsitePanel() {
  return (
    <AanPresenceProvider>
      <PanelInner />
    </AanPresenceProvider>
  );
}

function PanelInner() {
  const { mode, closeAan, setInputFocused, setGenerationState } = useAan();
  const location = useLocation();
  const isOpen = mode === "copilot";

  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi, I'm **Aan**. Ask me anything about Anarix - products, pricing, integrations, or how I work." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { registerAnchor } = useAanPresence();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);

  const pageLabel = PAGE_LABELS[location.pathname] ?? "Anarix.ai";

  // Register the input slot as the resting anchor for the travelling mascot.
  useEffect(() => {
    registerAnchor("input", anchorEl, 44);
    return () => registerAnchor("input", null);
  }, [anchorEl, registerAnchor]);

  // Drive the mascot "thinking" state via the shared Aan context.
  useEffect(() => {
    setGenerationState(loading, null, 0);
  }, [loading, setGenerationState]);

  // Lock body scroll on mobile when open
  useEffect(() => {
    if (!isOpen) return;
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    if (!isMobile) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  const stop = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  };

  const send = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    let buf = "";
    let pushedAssistant = false;
    const upsert = (chunk: string) => {
      buf += chunk;
      setMessages((prev) => {
        if (!pushedAssistant) {
          pushedAssistant = true;
          return [...prev, { role: "assistant", content: buf }];
        }
        return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: buf } : m));
      });
    };

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: next, scope: "general" }),
      });
      if (!resp.ok || !resp.body) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${resp.status})`);
      }
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let raw = "";
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        raw += dec.decode(value, { stream: true });
        let idx: number;
        while ((idx = raw.indexOf("\n")) !== -1) {
          let line = raw.slice(0, idx);
          raw = raw.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const c = p.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            raw = line + "\n" + raw;
            break;
          }
        }
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setError(e instanceof Error ? e.message : "Something went wrong");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="sm:hidden fixed inset-0 z-[55] bg-foreground/30"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }} onClick={closeAan}
          />
          <motion.aside
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
            className={cn(
              "fixed z-[56] bg-background border border-border shadow-strong flex flex-col overflow-hidden",
              "inset-x-3 bottom-3 top-20 rounded-2xl",
              "sm:inset-auto sm:right-4 sm:top-4 sm:bottom-4 sm:w-[400px] sm:rounded-2xl"
            )}
            role="dialog"
            aria-label="Chat with Aan"
          >
            {/* Header - AanLogo + context bar (mirrors AanCopilotPanel) */}
            <div className="border-b border-border shrink-0">
              <div className="flex items-center justify-between px-4 py-4">
                <AanLogo />
                <button
                  type="button"
                  onClick={closeAan}
                  className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex items-center gap-4 border-t border-border/50 bg-muted/30 px-4 py-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium">Context:</span>
                  <span>{pageLabel}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>anarix.ai</span>
                </div>
              </div>
            </div>

            {/* Conversation - no per-message mascot, mirrors app pattern */}
            <ScrollArea className="flex-1 min-h-0">
              <div className="p-4 space-y-4">
                {messages.map((m, i) => (
                  <div key={i} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center",
                      m.role === "assistant" ? "" : "rounded-full bg-muted text-muted-foreground"
                    )}>
                      {m.role === "user" && <User className="h-4 w-4" />}
                    </div>
                    <div className={cn("flex max-w-[80%] flex-col gap-2", m.role === "user" ? "items-end" : "items-start")}>
                      <div className={cn(
                        "rounded-2xl px-4 py-2.5 text-sm",
                        m.role === "assistant"
                          ? "bg-card text-foreground border border-border prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-headings:my-1 prose-strong:text-foreground"
                          : "bg-primary text-primary-foreground whitespace-pre-wrap"
                      )}>
                        {m.role === "assistant" ? <ReactMarkdown>{m.content}</ReactMarkdown> : m.content}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex flex-row gap-3">
                    <div className="h-8 w-8 shrink-0" />
                    <div className="flex max-w-[80%] flex-col gap-2 items-start">
                      <div className="rounded-2xl px-4 py-2.5 text-sm bg-card text-muted-foreground border border-border flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <motion.span
                            key={d}
                            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 0.6, delay: d * 0.15, repeat: Infinity }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="text-xs text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
                    {error}
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggestions */}
            {messages.length <= 1 && !loading && (
              <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
                {SUGGESTED.map((q) => (
                  <button
                    key={q}
                    onClick={() => send(q)}
                    className="text-[11px] px-2.5 py-1 rounded-pill bg-card border border-border text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input area - mascot anchor lives ABOVE the textarea (app parity) */}
            <div className="shrink-0 bg-background border-t border-border">
              <div className="px-4 pb-4 pt-3">
                {/* Mascot slot (left-aligned, 52x52). The travelling AanMascot
                    portals into this element via AanPresencePortal. */}
                <div className="flex items-center gap-3 pl-3 mb-2 h-[52px]">
                  <div
                    ref={setAnchorEl}
                    data-aan-anchor="input"
                    className="w-[52px] h-[52px] flex items-center justify-center shrink-0"
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                    {loading ? "Thinking…" : "Ask Aan"}
                  </span>
                </div>

                {/* Input container - chrome matches AanInput */}
                <div className="relative flex items-end gap-0 rounded-lg border border-border bg-card focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                  <button
                    type="button"
                    className="shrink-0 p-2.5 pb-3 text-muted-foreground/40 cursor-not-allowed"
                    title="Attachments not available in website chat"
                    disabled
                  >
                    <Paperclip className="h-4 w-4" />
                  </button>
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    onFocus={() => setInputFocused(true)}
                    onBlur={() => setInputFocused(input.trim().length > 0)}
                    placeholder="Ask Aan anything…"
                    rows={1}
                    disabled={loading}
                    className="min-h-[44px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 pr-12 pl-0"
                  />
                  <div className="absolute right-2 bottom-2">
                    {loading ? (
                      <Button size="icon" variant="destructive" onClick={stop} className="h-8 w-8 rounded-lg" title="Stop">
                        <Square className="h-3.5 w-3.5" />
                      </Button>
                    ) : (
                      <Button size="icon" onClick={() => send(input)} disabled={!input.trim()} className="h-8 w-8 rounded-lg bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-30">
                        <Send className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Travelling mascot - portals into the input slot above */}
            <AanPresencePortal />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
