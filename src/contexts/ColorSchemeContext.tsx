import { createContext, useContext, useEffect, useState } from "react";

export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  light: Record<string, string>;
  dark: Record<string, string>;
}

const schemes: ColorScheme[] = [
  {
    id: "periwinkle-refined",
    name: "Periwinkle Refined",
    description: "Stripe/Linear inspired — flatter neutrals, warmer primary, softer borders",
    light: {
      "--background": "220 14% 98%",
      "--foreground": "240 10% 10%",
      "--card": "0 0% 100%",
      "--card-foreground": "240 10% 10%",
      "--popover": "0 0% 100%",
      "--popover-foreground": "240 10% 10%",
      "--primary": "234 68% 55%",
      "--primary-foreground": "0 0% 100%",
      "--secondary": "234 25% 22%",
      "--secondary-foreground": "0 0% 100%",
      "--muted": "220 14% 96%",
      "--muted-foreground": "220 9% 46%",
      "--accent": "231 74% 81%",
      "--accent-foreground": "240 10% 10%",
      "--border": "220 13% 91%",
      "--input": "220 13% 91%",
      "--ring": "234 68% 55%",
      "--sidebar-background": "0 0% 100%",
      "--sidebar-foreground": "220 9% 46%",
      "--sidebar-primary": "234 68% 55%",
      "--sidebar-primary-foreground": "0 0% 100%",
      "--sidebar-accent": "220 14% 96%",
      "--sidebar-accent-foreground": "240 10% 10%",
      "--sidebar-border": "220 13% 91%",
      "--sidebar-ring": "234 68% 55%",
    },
    dark: {
      "--background": "240 12% 8%",
      "--foreground": "240 100% 97%",
      "--card": "240 12% 12%",
      "--card-foreground": "240 100% 97%",
      "--popover": "240 12% 12%",
      "--popover-foreground": "240 100% 97%",
      "--primary": "231 88% 70%",
      "--primary-foreground": "240 12% 8%",
      "--secondary": "234 30% 28%",
      "--secondary-foreground": "240 100% 97%",
      "--muted": "240 12% 12%",
      "--muted-foreground": "230 20% 64%",
      "--accent": "231 100% 87%",
      "--accent-foreground": "240 12% 8%",
      "--border": "240 12% 18%",
      "--input": "240 12% 18%",
      "--ring": "231 88% 70%",
      "--sidebar-background": "240 12% 12%",
      "--sidebar-foreground": "230 20% 64%",
      "--sidebar-primary": "231 88% 70%",
      "--sidebar-primary-foreground": "240 12% 8%",
      "--sidebar-accent": "240 12% 8%",
      "--sidebar-accent-foreground": "240 100% 97%",
      "--sidebar-border": "240 12% 18%",
      "--sidebar-ring": "231 88% 70%",
    },
  },
];

const DEFAULT_SCHEME_ID = "periwinkle-refined";

interface ColorSchemeContextType {
  schemeId: string;
  setSchemeId: (id: string) => void;
  schemes: ColorScheme[];
  currentScheme: ColorScheme;
}

const ColorSchemeContext = createContext<ColorSchemeContextType | undefined>(undefined);

export function ColorSchemeProvider({ children }: { children: React.ReactNode }) {
  const [schemeId, setSchemeIdState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("anarix-color-scheme");
      if (stored && schemes.some((s) => s.id === stored)) return stored;
    }
    return DEFAULT_SCHEME_ID;
  });

  const currentScheme = schemes.find((s) => s.id === schemeId) || schemes[0];

  useEffect(() => {
    const root = document.documentElement;
    const isDark = root.classList.contains("dark");
    const vars = isDark ? currentScheme.dark : currentScheme.light;

    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [schemeId, currentScheme]);

  // Re-apply when theme (light/dark) changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const root = document.documentElement;
      const isDark = root.classList.contains("dark");
      const vars = isDark ? currentScheme.dark : currentScheme.light;
      Object.entries(vars).forEach(([key, value]) => {
        root.style.setProperty(key, value);
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [currentScheme]);

  const setSchemeId = (id: string) => {
    localStorage.setItem("anarix-color-scheme", id);
    setSchemeIdState(id);
  };

  return (
    <ColorSchemeContext.Provider value={{ schemeId, setSchemeId, schemes, currentScheme }}>
      {children}
    </ColorSchemeContext.Provider>
  );
}

export function useColorScheme() {
  const context = useContext(ColorSchemeContext);
  if (!context) throw new Error("useColorScheme must be used within ColorSchemeProvider");
  return context;
}
