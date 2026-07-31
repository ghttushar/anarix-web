import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type AanPanelMode = "side" | "main";

const KEY = "aan:panel-mode";

interface Ctx {
  mode: AanPanelMode;
  setMode: (m: AanPanelMode) => void;
}

const AanPanelContext = createContext<Ctx | null>(null);

export function AanPanelProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AanPanelMode>(() => {
    if (typeof window === "undefined") return "side";
    try {
      const raw = localStorage.getItem(KEY);
      return raw === "main" || raw === "side" ? raw : "side";
    } catch {
      return "side";
    }
  });

  useEffect(() => {
    try { localStorage.setItem(KEY, mode); } catch { /* noop */ }
  }, [mode]);

  return (
    <AanPanelContext.Provider value={{ mode, setMode: setModeState }}>
      {children}
    </AanPanelContext.Provider>
  );
}

export function useAanPanel(): Ctx {
  const ctx = useContext(AanPanelContext);
  if (!ctx) throw new Error("useAanPanel must be used within AanPanelProvider");
  return ctx;
}
