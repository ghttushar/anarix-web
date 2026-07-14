// Local selection + focus state for the Decide surface.
// Kept out of the actions store so it doesn't collide with meetings/questions.

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";

interface SelectionCtx {
  selected: Set<string>;
  isSelected: (id: string) => boolean;
  toggle: (id: string, shiftKey?: boolean) => void;
  selectOnly: (id: string) => void;
  selectMany: (ids: string[]) => void;
  clear: () => void;
  focusedId: string | null;
  setFocusedId: (id: string | null) => void;
  registerOrder: (ids: string[]) => void;
  moveFocus: (delta: 1 | -1) => void;
  focusedIndex: number;
  orderedIds: string[];
}

const Ctx = createContext<SelectionCtx | undefined>(undefined);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const orderedRef = useRef<string[]>([]);
  const anchorRef = useRef<string | null>(null);
  const [orderVer, setOrderVer] = useState(0); // triggers focusedIndex recompute

  const registerOrder = useCallback((ids: string[]) => {
    const prev = orderedRef.current;
    if (prev.length === ids.length && prev.every((v, i) => v === ids[i])) return;
    orderedRef.current = ids;
    setOrderVer((v) => v + 1);
  }, []);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  const toggle = useCallback((id: string, shiftKey = false) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (shiftKey && anchorRef.current) {
        const order = orderedRef.current;
        const a = order.indexOf(anchorRef.current);
        const b = order.indexOf(id);
        if (a !== -1 && b !== -1) {
          const [lo, hi] = a < b ? [a, b] : [b, a];
          for (let i = lo; i <= hi; i++) next.add(order[i]);
          return next;
        }
      }
      if (next.has(id)) next.delete(id); else next.add(id);
      anchorRef.current = id;
      return next;
    });
  }, []);

  const selectOnly = useCallback((id: string) => {
    setSelected(new Set([id]));
    anchorRef.current = id;
  }, []);

  const selectMany = useCallback((ids: string[]) => {
    setSelected(new Set(ids));
    anchorRef.current = ids[ids.length - 1] ?? null;
  }, []);

  const clear = useCallback(() => {
    setSelected(new Set());
    anchorRef.current = null;
  }, []);

  const focusedIndex = useMemo(() => {
    void orderVer;
    return focusedId ? orderedRef.current.indexOf(focusedId) : -1;
  }, [focusedId, orderVer]);

  const moveFocus = useCallback((delta: 1 | -1) => {
    const order = orderedRef.current;
    if (order.length === 0) return;
    const current = focusedId ? order.indexOf(focusedId) : -1;
    const next = Math.max(0, Math.min(order.length - 1, current === -1 ? 0 : current + delta));
    setFocusedId(order[next] ?? null);
  }, [focusedId]);

  const value = useMemo<SelectionCtx>(() => ({
    selected, isSelected, toggle, selectOnly, selectMany, clear,
    focusedId, setFocusedId, registerOrder, moveFocus, focusedIndex,
    orderedIds: orderedRef.current,
  }), [selected, isSelected, toggle, selectOnly, selectMany, clear, focusedId, registerOrder, moveFocus, focusedIndex]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useSelection(): SelectionCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSelection must be used inside <SelectionProvider>");
  return v;
}
