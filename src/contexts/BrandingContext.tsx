import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const STORAGE_KEY = "anarix-new-branding";

interface BrandingContextType {
  newBranding: boolean;
  toggleNewBranding: () => void;
  setNewBranding: (v: boolean) => void;
}

const BrandingContext = createContext<BrandingContextType>({
  newBranding: false,
  toggleNewBranding: () => {},
  setNewBranding: () => {},
});

export function BrandingProvider({ children }: { children: ReactNode }) {
  const [newBranding, setNewBrandingState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const setNewBranding = useCallback((v: boolean) => {
    setNewBrandingState(v);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(v)); } catch {}
  }, []);

  const toggleNewBranding = useCallback(() => {
    setNewBrandingState((prev) => {
      const next = !prev;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  return (
    <BrandingContext.Provider value={{ newBranding, toggleNewBranding, setNewBranding }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  return useContext(BrandingContext);
}
