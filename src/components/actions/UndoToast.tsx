import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight visible undo affordance. Listens for `action-item:undoable`
 * CustomEvents dispatched by the store; renders a bottom-center pill with a
 * live 30-second countdown ring. Clicking Undo dispatches
 * `action-item:undo` back so the source can roll back.
 *
 * The store already ships a sonner toast for accessibility + text feedback.
 * This overlay is the *visual* countdown — the "am I still in the undo
 * window?" indicator the user asked for.
 */

export interface UndoEvent {
  id: string;
  label: string;
  onUndo: () => void;
  durationMs?: number;
}

interface ActiveUndo extends UndoEvent {
  startedAt: number;
}

export function UndoToast() {
  const [stack, setStack] = useState<ActiveUndo[]>([]);
  const [, force] = useState(0);

  // subscribe to global undoable events
  useEffect(() => {
    function onEv(ev: Event) {
      const detail = (ev as CustomEvent<UndoEvent>).detail;
      if (!detail) return;
      setStack((s) => [...s.filter((x) => x.id !== detail.id), { ...detail, startedAt: Date.now() }]);
    }
    window.addEventListener("action-item:undoable", onEv as EventListener);
    return () => window.removeEventListener("action-item:undoable", onEv as EventListener);
  }, []);

  // tick every 200ms
  useEffect(() => {
    if (stack.length === 0) return;
    const id = setInterval(() => {
      const now = Date.now();
      setStack((s) => s.filter((x) => now - x.startedAt < (x.durationMs ?? 30_000)));
      force((t) => t + 1);
    }, 200);
    return () => clearInterval(id);
  }, [stack.length]);

  if (stack.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-2 items-center pointer-events-none">
      {stack.map((u) => {
        const dur = u.durationMs ?? 30_000;
        const remaining = Math.max(0, dur - (Date.now() - u.startedAt));
        const pct = (remaining / dur) * 100;
        const secs = Math.ceil(remaining / 1000);
        return (
          <div
            key={u.id + u.startedAt}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-border bg-card shadow-lg px-3 py-2 min-w-[280px]"
          >
            {/* Countdown ring */}
            <div className="relative h-7 w-7 shrink-0">
              <svg viewBox="0 0 28 28" className="h-7 w-7 -rotate-90">
                <circle cx="14" cy="14" r="12" strokeWidth="2" className="fill-none stroke-muted" />
                <circle
                  cx="14"
                  cy="14"
                  r="12"
                  strokeWidth="2"
                  strokeDasharray={2 * Math.PI * 12}
                  strokeDashoffset={(1 - pct / 100) * 2 * Math.PI * 12}
                  className="fill-none stroke-primary transition-[stroke-dashoffset] duration-200"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold text-foreground tabular-nums">
                {secs}
              </span>
            </div>
            <div className="flex-1 min-w-0 text-[12.5px] text-foreground truncate">{u.label}</div>
            <button
              onClick={() => {
                u.onUndo();
                setStack((s) => s.filter((x) => x.id !== u.id));
              }}
              className={cn(
                "shrink-0 inline-flex items-center gap-1 rounded-full border border-border bg-background text-foreground",
                "text-[11.5px] font-medium h-7 px-2.5 hover:bg-muted transition-colors",
              )}
            >
              <Undo2 className="h-3 w-3" /> Undo
            </button>
          </div>
        );
      })}
    </div>
  );
}

/** Helper for stores/components to publish an undoable action. */
export function publishUndoable(u: UndoEvent) {
  window.dispatchEvent(new CustomEvent<UndoEvent>("action-item:undoable", { detail: u }));
}
