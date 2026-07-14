import { createContext, useContext, useState, useCallback } from "react";

type VisualEffectKey = "ambientBackground" | "numberAnimations" | "floatingIsland";

interface VisualEffectsContextType {
  effects: Record<VisualEffectKey, boolean>;
  toggle: (key: VisualEffectKey) => void;
  set: (key: VisualEffectKey, value: boolean) => void;
}

const STORAGE_KEY = "anarix-visual-effects";

const defaults: Record<VisualEffectKey, boolean> = {
  ambientBackground: true,
  numberAnimations: true,
  floatingIsland: true,
};

function loadEffects(): Record<VisualEffectKey, boolean> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return { ...defaults, ...JSON.parse(stored) };
  } catch {}
  return { ...defaults };
}

const VisualEffectsContext = createContext<VisualEffectsContextType | undefined>(undefined);

export function VisualEffectsProvider({ children }: { children: React.ReactNode }) {
  const [effects, setEffects] = useState<Record<VisualEffectKey, boolean>>(loadEffects);

  const persist = (next: Record<VisualEffectKey, boolean>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const toggle = useCallback((key: VisualEffectKey) => {
    setEffects(prev => {
      const next = { ...prev, [key]: !prev[key] };
      persist(next);
      return next;
    });
  }, []);

  const set = useCallback((key: VisualEffectKey, value: boolean) => {
    setEffects(prev => {
      const next = { ...prev, [key]: value };
      persist(next);
      return next;
    });
  }, []);

  return (
    <VisualEffectsContext.Provider value={{ effects, toggle, set }}>
      {children}
    </VisualEffectsContext.Provider>
  );
}

export function useVisualEffects() {
  const ctx = useContext(VisualEffectsContext);
  if (!ctx) throw new Error("useVisualEffects must be used within VisualEffectsProvider");
  return ctx;
}
