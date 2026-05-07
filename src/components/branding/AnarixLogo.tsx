import { useBranding } from "@/contexts/BrandingContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

import legacyLightFull from "@/assets/logo-light-full.svg";
import legacyDarkFull from "@/assets/logo-dark-full.svg";
import legacyLightSymbol from "@/assets/logo-light-symbol.svg";
import legacyDarkSymbol from "@/assets/logo-dark-symbol.svg";

import newFullLight from "@/assets/branding/anarix-full-light.svg";
import newFullDark from "@/assets/branding/anarix-full-dark.svg";
import newSymbol from "@/assets/branding/anarix-symbol.svg";

interface AnarixLogoProps {
  variant?: "full" | "symbol";
  className?: string;
  alt?: string;
}

export function AnarixLogo({ variant = "full", className, alt = "Anarix" }: AnarixLogoProps) {
  const { newBranding } = useBranding();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  let src: string;
  if (newBranding) {
    src = variant === "symbol" ? newSymbol : (isDark ? newFullDark : newFullLight);
  } else {
    if (variant === "symbol") {
      src = isDark ? legacyDarkSymbol : legacyLightSymbol;
    } else {
      src = isDark ? legacyDarkFull : legacyLightFull;
    }
  }

  return <img src={src} alt={alt} className={cn("object-contain", className)} />;
}
