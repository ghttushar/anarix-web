import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type TrialState = "none" | "syncing" | "active" | "expired" | "paid";

const STORAGE_KEY = "anarix-trial-state";
const SYNC_DURATION_MS = 20_000;

interface TrialContextType {
  trial: TrialState;
  setTrial: (s: TrialState) => void;
  startSync: () => void;
  forceExpire: () => void;
  reset: () => void;
}

const TrialContext = createContext<TrialContextType>({
  trial: "none",
  setTrial: () => {},
  startSync: () => {},
  forceExpire: () => {},
  reset: () => {},
});

export function TrialProvider({ children }: { children: ReactNode }) {
  const [trial, setState] = useState<TrialState>(() => {
    try {
      const v = localStorage.getItem(STORAGE_KEY);
      return (v as TrialState) || "none";
    } catch { return "none"; }
  });

  const persist = (v: TrialState) => {
    setState(v);
    try { localStorage.setItem(STORAGE_KEY, v); } catch {}
  };

  const setTrial = useCallback((s: TrialState) => persist(s), []);
  const reset = useCallback(() => persist("none"), []);
  const forceExpire = useCallback(() => persist("expired"), []);
  const startSync = useCallback(() => persist("syncing"), []);

  // Auto-progress: syncing -> active after SYNC_DURATION_MS, then active -> expired after another SYNC_DURATION_MS (demo).
  useEffect(() => {
    if (trial === "syncing") {
      const t = setTimeout(() => persist("active"), SYNC_DURATION_MS);
      return () => clearTimeout(t);
    }
    if (trial === "active") {
      const t = setTimeout(() => persist("expired"), SYNC_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [trial]);

  return (
    <TrialContext.Provider value={{ trial, setTrial, startSync, forceExpire, reset }}>
      {children}
    </TrialContext.Provider>
  );
}

export function useTrial() {
  return useContext(TrialContext);
}
