import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";

export type AppView = "desktop" | "tablet" | "mobile";

const STORAGE_KEY = "anarix-app-view";
const DEFAULT_VIEW: AppView = "desktop";

interface ViewportContextValue {
  view: AppView;
  setView: (v: AppView) => void;
  /** Root entry path for a given view. */
  entryPath: (v: AppView) => string;
}

const ViewportContext = createContext<ViewportContextValue | null>(null);

function loadView(): AppView {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "desktop" || stored === "tablet" || stored === "mobile") return stored;
  } catch {
    /* noop */
  }
  return DEFAULT_VIEW;
}

function entryPathFor(v: AppView): string {
  // Desktop is the legacy app at root paths; tablet/mobile have dedicated prefixes.
  if (v === "desktop") return "/profitability/dashboard";
  if (v === "tablet") return "/tablet";
  return "/mobile";
}

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<AppView>(loadView);

  const setView = useCallback((v: AppView) => {
    setViewState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-view", view);
  }, [view]);

  return (
    <ViewportContext.Provider value={{ view, setView, entryPath: entryPathFor }}>
      {children}
    </ViewportContext.Provider>
  );
}

export function useViewport(): ViewportContextValue {
  const ctx = useContext(ViewportContext);
  if (!ctx) throw new Error("useViewport must be used inside ViewportProvider");
  return ctx;
}
