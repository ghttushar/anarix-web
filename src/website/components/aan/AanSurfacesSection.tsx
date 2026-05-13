import { motion } from "framer-motion";
import { Bot, Bell, Sparkles, ArrowUpRight } from "lucide-react";

/** Distinct mini-mocks built from app tokens. No images. */

function CopilotMock() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/30">
        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-primary/40" />
        <div className="text-xs font-semibold">Aan Copilot</div>
        <div className="ml-auto text-[10px] text-muted-foreground">v3 - this chat</div>
      </div>
      <div className="p-3 space-y-2">
        <div className="text-[11px] text-muted-foreground">You</div>
        <div className="text-xs">Why did Sponsored Display ROAS drop yesterday?</div>
        <div className="text-[11px] text-muted-foreground pt-2 flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-primary text-[#f26e76]" /> Aan
        </div>
        <div className="text-xs leading-relaxed">
          Loss is concentrated on retargeting placements for ASIN B07X9. Likely a competitor launch.
        </div>
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-2 text-[11px] flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="font-medium">Draft rule</span>
          <span className="text-muted-foreground">Pause B07X9 retargeting</span>
          <span className="ml-auto text-primary text-[#f26e76] font-semibold">Preview</span>
        </div>
      </div>
    </div>
  );
}

function AskAanMock() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm relative">
      <div className="px-3 py-2 border-b border-border text-[10px] uppercase tracking-wider text-muted-foreground">Campaign Manager</div>
      <div className="p-3 text-xs">
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <div><div className="text-muted-foreground text-[10px]">Spend</div><div className="font-bold">$12,840</div></div>
          <div><div className="text-muted-foreground text-[10px]">Sales</div><div className="font-bold">$48,210</div></div>
          <div className="relative">
            <div className="text-muted-foreground text-[10px]">ROAS</div>
            <div className="font-bold inline-block bg-primary/15 px-1 rounded">3.76x</div>
            <div className="absolute -top-2 left-full ml-2 w-44 z-10">
              <div className="rounded-lg border border-primary/40 bg-card shadow-lg p-2 text-[10px]">
                <div className="flex items-center gap-1 text-primary text-[#f26e76] font-semibold mb-1">
                  <Sparkles className="w-2.5 h-2.5" /> Ask Aan
                </div>
                <div className="text-muted-foreground leading-relaxed">Explain this number, find anomalies, draft a fix.</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-3 h-12 rounded-md bg-gradient-to-r from-muted/40 via-primary/10 to-muted/40" />
      </div>
    </div>
  );
}

function FullScreenMock() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
      <div className="flex h-full">
        <div className="w-20 border-r border-border bg-muted/20 p-2 space-y-1.5">
          <div className="text-[9px] uppercase text-muted-foreground tracking-wider mb-1">Chats</div>
          <div className="h-4 rounded bg-primary/15 border border-primary/30" />
          <div className="h-4 rounded bg-muted/60" />
          <div className="h-4 rounded bg-muted/60" />
          <div className="h-4 rounded bg-muted/40" />
        </div>
        <div className="flex-1 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/40" />
            <div className="text-[11px] font-semibold">Q4 Spend Audit</div>
            <span className="ml-auto text-[10px] text-muted-foreground">artifact v2</span>
          </div>
          <div className="rounded-lg border border-border p-2 space-y-1">
            <div className="h-1.5 w-3/4 bg-muted rounded" />
            <div className="h-1.5 w-2/3 bg-muted rounded" />
            <div className="h-12 rounded bg-gradient-to-br from-primary/10 to-accent/30 mt-2" />
          </div>
          <div className="text-[10px] text-muted-foreground">Aan is drafting...</div>
        </div>
      </div>
    </div>
  );
}

function FloatingIslandMock() {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 h-full p-4 flex items-end justify-end relative overflow-hidden">
      <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(400px 200px at 80% 90%, hsl(var(--primary) / 0.2), transparent)" }} />
      <div className="relative flex items-center gap-1.5 px-3 py-2 rounded-pill bg-card border-2 border-primary/60 shadow-lg">
        <button className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-primary text-[#f26e76]" />
        </button>
        <div className="w-px h-5 bg-border" />
        <button className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center relative">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-red-500" />
        </button>
        <button className="w-7 h-7 rounded-full hover:bg-muted flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5" />
        </button>
        <button className="px-2.5 py-1 ml-1 rounded-full bg-primary text-primary-foreground text-[10px] font-medium flex items-center gap-1">
          Ask Aan <ArrowUpRight className="w-2.5 h-2.5" />
        </button>
      </div>
    </div>
  );
}

const surfaces = [
  {
    title: "Aan Copilot",
    sub: "The right-side workspace",
    body: "Open it on any page. Aan keeps the context, drafts the action, and shows its work. Every output gets a preview before it touches your account.",
    use: "When ROAS dips and you need a diagnosis in under a minute.",
    Mock: CopilotMock,
  },
  {
    title: "Ask Aan",
    sub: "Highlight any number, get the why",
    body: "Select text anywhere in the app. A small tooltip appears - click it and Aan explains the metric, traces the source, and offers next steps without leaving the page.",
    use: "When a stakeholder asks 'what is this number' and you need an answer that doesn't make you look bad.",
    Mock: AskAanMock,
  },
  {
    title: "Full-Screen Aan",
    sub: "/aan - the deep work room",
    body: "A dedicated workspace with chat history, multi-artifact reasoning, and long context. Use it for audits, weekly reviews, and rule design that needs room to breathe.",
    use: "When the question is bigger than a sidebar.",
    Mock: FullScreenMock,
  },
  {
    title: "Floating Action Island",
    sub: "Always nearby. Never in the way.",
    body: "A persistent control hub at the bottom-right. System alerts, Ask Aan, quick-create rules, command palette - one reach, every action.",
    use: "When you live in the app and need everything one motion away.",
    Mock: FloatingIslandMock,
  },
];

export default function AanSurfacesSection() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center px-3 py-1 mb-4 rounded-pill bg-primary/10 text-primary text-[#f26e76] text-xs font-medium uppercase tracking-[0.14em]">
            Where Aan lives
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.1]">
            Four surfaces. <span className="text-gradient-primary">Same brain.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Aan is not a chatbot in a corner. It's an intelligence layer that meets you where the work is happening.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {surfaces.map((s, i) => (
            <motion.article
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="text-xs text-primary/80 uppercase tracking-wider mt-1">{s.sub}</p>
                </div>
              </div>
              <div className="h-44 mb-4">
                <s.Mock />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{s.body}</p>
              <div className="text-xs italic text-foreground/80 border-l-2 border-primary/40 pl-3">
                Use it: {s.use}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
