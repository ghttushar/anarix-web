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

function viewFromWidth(width: number): AppView {
  if (width < 768) return "mobile";
  if (width < 1180) return "tablet";
  return "desktop";
}

function entryPathFor(v: AppView): string {
  if (v === "desktop") return "/profitability/dashboard";
  if (v === "tablet") return "/tablet";
  return "/mobile";
}

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<AppView>(() => {
    if (typeof window !== "undefined") {
      const auto = viewFromWidth(window.innerWidth);
      if (auto === "mobile") return "mobile";
    }
    return loadView();
  });

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

  // Auto-track viewport width: phone widths always use mobile shell,
  // regardless of stored preference. Above phone width we honor the
  // user's stored choice (desktop or tablet).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const apply = () => {
      const w = window.innerWidth;
      if (w < 768) {
        setViewState((prev) => (prev === "mobile" ? prev : "mobile"));
      } else {
        setViewState((prev) => {
          if (prev !== "mobile") return prev;
          // Coming out of phone width — fall back to stored preference,
          // but default to a non-mobile view based on width.
          const stored = loadView();
          if (stored !== "mobile") return stored;
          return w < 1180 ? "tablet" : "desktop";
        });
      }
    };
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(orientation: portrait)");
    const apply = () => {
      document.documentElement.setAttribute(
        "data-orientation",
        mq.matches ? "portrait" : "landscape"
      );
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

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
