import { useEffect } from "react";
import { useSelection } from "@/state/selectionStore";
import { useActionsStore } from "@/livingos/state/actionsStore";

/**
 * Wires Decide-surface keyboard shortcuts. Called once from AlertsInner.
 * j/k move focus, a/d/r/s act on focused, x select, Shift+x range-select.
 */
export function useDecideKeyboard(enabled: boolean) {
  const { moveFocus, focusedId, toggle, clear, selected } = useSelection();
  const { approve, reject, delegateToAan, snooze, bulkApprove, decisions } = useActionsStore();

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const target = focusedId ? decisions.find((d) => d.id === focusedId) : null;
      const isOpen = target?.status === "open";

      switch (e.key) {
        case "j":
        case "ArrowDown":
          e.preventDefault();
          moveFocus(1);
          break;
        case "k":
        case "ArrowUp":
          e.preventDefault();
          moveFocus(-1);
          break;
        case "a":
          if (selected.size > 1) { bulkApprove(Array.from(selected)); clear(); }
          else if (isOpen && target) approve(target.id);
          break;
        case "d":
          if (isOpen && target) delegateToAan(target.id);
          break;
        case "r":
          if (isOpen && target) reject(target.id);
          break;
        case "s":
          if (isOpen && target) snooze(target.id, "tomorrow");
          break;
        case "x":
          if (target) toggle(target.id, e.shiftKey);
          break;
        case "Escape":
          if (selected.size > 0) clear();
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, moveFocus, focusedId, decisions, approve, reject, delegateToAan, snooze, bulkApprove, toggle, clear, selected]);
}
