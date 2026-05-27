import { createContext, useContext, useState, useCallback, ReactNode } from "react";

const STORAGE_KEY = "anarix-new-features-visible";

interface FeatureToggleContextType {
  newFeaturesVisible: boolean;
  toggleNewFeatures: () => void;
}

const FeatureToggleContext = createContext<FeatureToggleContextType>({
  newFeaturesVisible: false,
  toggleNewFeatures: () => {},
});

export function FeatureToggleProvider({ children }: { children: ReactNode }) {
  const [newFeaturesVisible, setNewFeaturesVisible] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const toggleNewFeatures = useCallback(() => {
    setNewFeaturesVisible((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <FeatureToggleContext.Provider value={{ newFeaturesVisible, toggleNewFeatures }}>
      {children}
    </FeatureToggleContext.Provider>
  );
}

export function useFeatureToggle() {
  return useContext(FeatureToggleContext);
}
