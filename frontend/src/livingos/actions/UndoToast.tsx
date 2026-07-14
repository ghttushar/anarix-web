import { useEffect, useState } from "react";
import { Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CountdownRing } from "./CountdownRing";

/**
 * Bottom-center undo pill. Listens for `action-item:undoable` CustomEvents
 * dispatched by the store; renders a live 30-second countdown ring and an
 * inline Undo button. On undo it also fires `action-item:undo-consumed` so
 * sibling surfaces (row / card / detail panel) can clear their inline strip.
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

  useEffect(() => {
    function onEv(ev: Event) {
      const detail = (ev as CustomEvent<UndoEvent>).detail;
      if (!detail) return;
      // Approve/complete events are rendered inline on the card itself —
      // suppress the floating toast for those to avoid duplicate UI.
      if (/^dec:[^:]+:approve$/.test(detail.id)) return;
      if (/^task:[^:]+:done$/.test(detail.id)) return;
      setStack((s) => [...s.filter((x) => x.id !== detail.id), { ...detail, startedAt: Date.now() }]);
    }
    function onConsume(ev: Event) {
      const detail = (ev as CustomEvent<{ id: string }>).detail;
      if (!detail?.id) return;
      setStack((s) => s.filter((x) => x.id !== detail.id));
    }
    window.addEventListener("action-item:undoable", onEv as EventListener);
    window.addEventListener("action-item:undo-consumed", onConsume as EventListener);
    return () => {
      window.removeEventListener("action-item:undoable", onEv as EventListener);
      window.removeEventListener("action-item:undo-consumed", onConsume as EventListener);
    };
  }, []);

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
        const pct = remaining / dur;
        const secs = Math.ceil(remaining / 1000);
        return (
          <div
            key={u.id + u.startedAt}
            className="pointer-events-auto flex items-center gap-3 rounded-full border border-border bg-card shadow-lg px-3 py-2 min-w-[280px]"
          >
            <CountdownRing pct={pct} secs={secs} />
            <div className="flex-1 min-w-0 text-[12.5px] text-foreground truncate">{u.label}</div>
            <button
              onClick={() => {
                u.onUndo();
                window.dispatchEvent(new CustomEvent("action-item:undo-consumed", { detail: { id: u.id } }));
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

