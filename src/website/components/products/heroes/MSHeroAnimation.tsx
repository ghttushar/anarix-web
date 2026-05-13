import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { TrendingUp } from "lucide-react";

const team = [
  { initials: "RK", role: "Strategist · Amazon", color: "bg-amber-500/15 text-amber-700" },
  { initials: "MS", role: "Strategist · Walmart", color: "bg-blue-500/15 text-blue-700" },
  { initials: "AT", role: "Analyst · Profitability", color: "bg-emerald-500/15 text-emerald-700" },
  { initials: "JL", role: "Engineer · Aan", color: "bg-purple-500/15 text-purple-700" },
];

/**
 * Managed services hero - staggered avatars stack in, then a subtle
 * "ROAS up" arrow draws across the bottom indicating outcome alignment.
 */
const MSHeroAnimation = () => {
  const { ref, isVisible } = useScrollReveal(0.3);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const dur = 1600;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible]);

  return (
    <div ref={ref} className="rounded-3xl border border-border bg-card p-8 sm:p-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Your dedicated team</span>
        </div>
        <span className="text-[11px] text-muted-foreground tabular-nums">always-on</span>
      </div>

      <div className="space-y-3">
        {team.map((m, i) => {
          const delay = i * 0.18;
          const local = Math.max(0, Math.min(1, (t - delay) / 0.4));
          return (
            <div
              key={m.initials}
              className="flex items-center gap-4 p-3 rounded-xl border border-border bg-background"
              style={{
                opacity: local,
                transform: `translateY(${(1 - local) * 6}px)`,
              }}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${m.color}`}>
                {m.initials}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-foreground">{m.role}</div>
                <div className="text-[11px] text-muted-foreground tabular-nums">on-call · this week</div>
              </div>
              <span className="text-[10px] uppercase tracking-[0.14em] text-emerald-600 font-medium">Active</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Outcomes - not hours - billed</span>
        </div>
        <div className="text-sm font-semibold text-foreground tabular-nums">
          {Math.round(t * 92)}% retention
        </div>
      </div>
    </div>
  );
};

export default MSHeroAnimation;
