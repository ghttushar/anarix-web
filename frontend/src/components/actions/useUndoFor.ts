import { useEffect, useState } from "react";
import type { UndoEvent } from "./UndoToast";

interface Active extends UndoEvent {
  startedAt: number;
}

/**
 * Subscribes to the global `action-item:undoable` bus and returns undo state
 * for events whose id contains the given decision/task id (matches the
 * `dec:{id}:*` / `task:{id}:*` conventions used by actionsStore).
 *
 * Kept independent from `UndoToast`'s local state so multiple surfaces can
 * observe the same underlying undo window without prop drilling.
 */
export function useUndoFor(targetId: string | null | undefined) {
  const [entry, setEntry] = useState<Active | null>(null);
  const [, tick] = useState(0);

  useEffect(() => {
    if (!targetId) return;
    function onPublish(ev: Event) {
      const d = (ev as CustomEvent<UndoEvent>).detail;
      if (!d?.id.includes(`:${targetId}:`)) return;
      setEntry({ ...d, startedAt: Date.now() });
    }
    function onConsume(ev: Event) {
      const d = (ev as CustomEvent<{ id: string }>).detail;
      if (!d?.id) return;
      setEntry((prev) => (prev && prev.id === d.id ? null : prev));
    }
    window.addEventListener("action-item:undoable", onPublish as EventListener);
    window.addEventListener("action-item:undo-consumed", onConsume as EventListener);
    return () => {
      window.removeEventListener("action-item:undoable", onPublish as EventListener);
      window.removeEventListener("action-item:undo-consumed", onConsume as EventListener);
    };
  }, [targetId]);

  useEffect(() => {
    if (!entry) return;
    const id = setInterval(() => {
      const dur = entry.durationMs ?? 30_000;
      if (Date.now() - entry.startedAt >= dur) {
        setEntry(null);
        return;
      }
      tick((t) => t + 1);
    }, 200);
    return () => clearInterval(id);
  }, [entry]);

  if (!entry) {
    return { active: false as const, secondsLeft: 0, pct: 0, label: "", undo: () => {} };
  }
  const dur = entry.durationMs ?? 30_000;
  const remaining = Math.max(0, dur - (Date.now() - entry.startedAt));
  return {
    active: true as const,
    secondsLeft: Math.ceil(remaining / 1000),
    pct: remaining / dur,
    label: entry.label,
    undo: () => {
      entry.onUndo();
      window.dispatchEvent(new CustomEvent("action-item:undo-consumed", { detail: { id: entry.id } }));
      setEntry(null);
    },
  };
}
