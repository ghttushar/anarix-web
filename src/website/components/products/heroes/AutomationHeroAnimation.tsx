import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CheckCircle2, Eye, ShieldCheck, Play } from "lucide-react";

const steps = [
  { icon: Eye, label: "Draft", sub: "Aan or you" },
  { icon: ShieldCheck, label: "Simulate", sub: "Historical preview" },
  { icon: CheckCircle2, label: "Approve", sub: "One-click" },
  { icon: Play, label: "Execute", sub: "Logged & reversible" },
];

/**
 * Pipeline hero - a traveling pulse moves through 4 nodes (Draft →
 * Simulate → Approve → Execute), highlighting each as it passes.
 */
const AutomationHeroAnimation = () => {
  const { ref, isVisible } = useScrollReveal(0.3);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const dur = 2400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible]);

  // current active step
  const active = Math.min(3, Math.floor(t * 4));

  return (
    <div ref={ref} className="rounded-3xl border border-border bg-card p-8 sm:p-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Rule pipeline</span>
        </div>
        <span className="text-[11px] text-muted-foreground tabular-nums">no surprises</span>
      </div>
      <div className="relative grid grid-cols-4 gap-4">
        {/* connector line */}
        <div className="absolute top-7 left-[12%] right-[12%] h-px bg-border" />
        <div
          className="absolute top-7 left-[12%] h-px bg-primary"
          style={{ width: `calc(${t * 76}% )`, transition: "width 80ms linear" }}
        />
        {steps.map((s, i) => {
          const isActive = i <= active;
          return (
            <div key={s.label} className="relative flex flex-col items-center text-center">
              <div
                className={`w-14 h-14 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                  isActive ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"
                }`}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <div className="mt-3 text-sm font-semibold text-foreground">{s.label}</div>
              <div className="text-[11px] text-muted-foreground">{s.sub}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-8 pt-6 border-t border-border grid grid-cols-3 gap-6">
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Silent executions</div>
          <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">0</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Reversible</div>
          <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">100%</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Avg approval</div>
          <div className="mt-1 text-2xl font-bold text-foreground tabular-nums">7s</div>
        </div>
      </div>
    </div>
  );
};

export default AutomationHeroAnimation;
