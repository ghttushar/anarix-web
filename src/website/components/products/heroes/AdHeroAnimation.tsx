import { useEffect, useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * KPI scoreboard hero - ROAS climbs 2.1x → 3.4x with bars rising from
 * left to right. Single-pass scroll-triggered animation.
 */
const AdHeroAnimation = () => {
  const { ref, isVisible } = useScrollReveal(0.3);
  const [t, setT] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const start = performance.now();
    const dur = 1400;
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setT(easeOut(p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isVisible]);

  const roas = (2.1 + (3.4 - 2.1) * t).toFixed(1);
  const bars = [0.3, 0.45, 0.4, 0.62, 0.58, 0.78, 0.72, 0.92];

  return (
    <div ref={ref} className="rounded-3xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Live ROAS</span>
        </div>
        <span className="text-[11px] text-muted-foreground tabular-nums">last 90 days</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
        <div className="p-6 border-r border-border">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Blended ROAS</div>
          <div className="mt-2 text-5xl font-bold text-foreground tabular-nums">{roas}x</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">▲ {(t * 62).toFixed(0)}% vs baseline</div>
        </div>
        <div className="p-6 border-r border-border">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">TACoS</div>
          <div className="mt-2 text-5xl font-bold text-foreground tabular-nums">{(18 - t * 5.4).toFixed(1)}%</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">▼ {(t * 30).toFixed(0)}% reduction</div>
        </div>
        <div className="p-6">
          <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Wasted spend</div>
          <div className="mt-2 text-5xl font-bold text-foreground tabular-nums">${Math.round(28 - t * 22).toLocaleString()}k</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">▼ {(t * 78).toFixed(0)}% cut</div>
        </div>
      </div>
      <div className="px-6 pb-6 pt-2">
        <div className="flex items-end gap-2 h-24">
          {bars.map((b, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-primary/80"
              style={{
                height: `${b * t * 100}%`,
                transition: "height 200ms linear",
                opacity: 0.4 + b * 0.6,
              }}
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>Wk 1</span><span>Wk 4</span><span>Wk 8</span><span>Wk 12</span>
        </div>
      </div>
    </div>
  );
};

export default AdHeroAnimation;
