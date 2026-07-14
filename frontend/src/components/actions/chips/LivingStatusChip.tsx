import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { Decision } from "@/data/mockDecisions";
import { livingStatusPhrase } from "@/lib/decisions/lifecycle";

/** Rotating living-verb chip for Aan Working rows. Single shared 6s tick. */
let tickListeners: Array<(t: number) => void> = [];
let currentTick = 0;
if (typeof window !== "undefined") {
  setInterval(() => {
    currentTick += 1;
    tickListeners.forEach((fn) => fn(currentTick));
  }, 6000);
}
function useLivingTick(): number {
  const [t, setT] = useState(currentTick);
  useEffect(() => {
    const fn = (n: number) => setT(n);
    tickListeners.push(fn);
    return () => { tickListeners = tickListeners.filter((f) => f !== fn); };
  }, []);
  return t;
}

export function LivingStatusChip({ decision }: { decision: Decision }) {
  const tick = useLivingTick();
  const phrase = livingStatusPhrase(decision.domain, tick);
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 h-6 px-2 rounded-full border text-[11.5px]",
      "text-primary bg-primary/5 border-primary/25",
    )}>
      <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
      {phrase}
    </span>
  );
}
