// Global living clock — single shared 6s tick, respects reduced motion.
import { useEffect, useState } from "react";

let listeners: Array<(t: number) => void> = [];
let tick = 0;
let started = false;

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mq.matches) return;
  setInterval(() => {
    tick += 1;
    for (const l of listeners) l(tick);
  }, 6000);
}
start();

export function useLivingTick(): number {
  const [t, setT] = useState(tick);
  useEffect(() => {
    const fn = (n: number) => setT(n);
    listeners.push(fn);
    return () => {
      listeners = listeners.filter((f) => f !== fn);
    };
  }, []);
  return t;
}
