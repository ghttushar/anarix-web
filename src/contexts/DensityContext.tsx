import { createContext, useContext, useEffect } from "react";

type Density = "comfortable" | "compact";

interface DensityContextType {
  density: Density;
  setDensity: (density: Density) => void;
}

const DensityContext = createContext<DensityContextType | undefined>(undefined);

export function DensityProvider({ children }: { children: React.ReactNode }) {
  // Density is locked to "comfortable" — no user choice.
  const density: Density = "comfortable";

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty("--spacing-base", "4px");
    root.style.setProperty("--row-height", "44px");
    root.style.setProperty("--card-padding", "16px");
    root.classList.add("density-comfortable");
    root.classList.remove("density-compact");
    try { localStorage.removeItem("anarix-density"); } catch {}
  }, []);

  const setDensity = (_: Density) => {
    // no-op: density is locked to comfortable
  };

  return (
    <DensityContext.Provider value={{ density, setDensity }}>
      {children}
    </DensityContext.Provider>
  );
}

export function useDensity() {
  const context = useContext(DensityContext);
  if (context === undefined) {
    throw new Error("useDensity must be used within a DensityProvider");
  }
  return context;
}
