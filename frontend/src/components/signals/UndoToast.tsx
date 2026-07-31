import { useEffect, useState } from "react";


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

  // Global 30s undo toast intentionally disabled — inline 5s undo lives on
  // the review card itself. Kept as no-op renderer so existing mounts work.
  void stack; void force;
  return null;
}

/** Helper for stores/components to publish an undoable action. */
export function publishUndoable(u: UndoEvent) {
  window.dispatchEvent(new CustomEvent<UndoEvent>("action-item:undoable", { detail: u }));
}

