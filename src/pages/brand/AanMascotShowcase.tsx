import { useState } from "react";
import { Navigate } from "react-router-dom";
import { AanMascot, AanMascotState } from "@/components/aan/AanMascot";
import { useBranding } from "@/contexts/BrandingContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function AanMascotShowcase() {
  const { newBranding } = useBranding();
  const [chatValue, setChatValue] = useState("");
  const [thinking, setThinking] = useState(false);

  if (!newBranding) {
    return <Navigate to="/settings/preferences" replace />;
  }

  const states: { state: AanMascotState; label: string; desc: string }[] = [
    { state: "idle", label: "Idle", desc: "Floating presence. Eyes track the cursor." },
    { state: "listening", label: "Listening", desc: "User is typing. Soft coral glow, gentle scale pulse." },
    { state: "thinking", label: "Thinking", desc: "Processing request. Diamond morphs and shifts to Anarix blue." },
    { state: "anchor", label: "Anchor", desc: "Static. Used inline as an avatar or button glyph." },
  ];

  const isTyping = chatValue.length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-8 py-16 space-y-20">
        {/* Hero */}
        <section className="text-center space-y-8">
          <div className="flex justify-center">
            <AanMascot state="idle" size={140} />
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Meet Aan</p>
            <h1 className="font-heading text-5xl font-semibold">Anarix Analytical Nural</h1>
            <p className="mx-auto max-w-2xl text-muted-foreground leading-relaxed">
              Aan (आन) — Hindi for self-respect, dignity, the sun. A short, modern unisex name
              chosen for its weight and clarity. The diamond is Anarix's mark; Aan is the
              intelligence sitting on top of it, connected to every node in the system.
            </p>
          </div>
        </section>

        {/* State catalog */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold">States</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {states.map(({ state, label, desc }) => (
              <div
                key={state}
                className="rounded-lg border border-border bg-card p-8 flex items-center gap-6"
              >
                <div className="shrink-0 w-20 h-20 flex items-center justify-center">
                  <AanMascot state={state} size={64} />
                </div>
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{label}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Listening / typing demo */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold">Above the chat input</h2>
          <p className="text-sm text-muted-foreground">
            Aan rests above the input. While you type, it shifts to listening. Press send, it
            transitions to thinking.
          </p>
          <div className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex justify-center pb-2">
              <AanMascot
                state={thinking ? "thinking" : isTyping ? "listening" : "idle"}
                size={56}
              />
            </div>
            <div className="flex gap-2">
              <Input
                value={chatValue}
                onChange={(e) => setChatValue(e.target.value)}
                placeholder="Ask Aan anything..."
                disabled={thinking}
              />
              <Button
                onClick={() => {
                  if (!chatValue) return;
                  setThinking(true);
                  setTimeout(() => {
                    setThinking(false);
                    setChatValue("");
                  }, 2400);
                }}
                disabled={!chatValue || thinking}
              >
                Send
              </Button>
            </div>
          </div>
        </section>

        {/* Cursor tracking playground */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold">Cursor-aware</h2>
          <p className="text-sm text-muted-foreground">
            Move your cursor across the canvas. Eye movement is intentionally subtle — never more
            than a couple of pixels.
          </p>
          <div
            className={cn(
              "rounded-xl border border-border bg-muted/30 h-[320px] flex items-center justify-center"
            )}
          >
            <AanMascot state="idle" size={120} />
          </div>
        </section>

        {/* Inline sizes */}
        <section className="space-y-6">
          <h2 className="font-heading text-2xl font-semibold">Sizes</h2>
          <div className="rounded-lg border border-border bg-card p-8 flex items-end gap-10">
            {[20, 28, 40, 64, 96].map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <AanMascot state="idle" size={s} interactive={false} />
                <span className="text-xs text-muted-foreground">{s}px</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
