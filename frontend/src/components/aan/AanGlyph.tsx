import { Sparkles } from "lucide-react";
import { useBranding } from "@/contexts/BrandingContext";
import { AanMascot, AanMascotState } from "./AanMascot";
import { cn } from "@/lib/utils";

interface AanGlyphProps {
  className?: string;
  state?: AanMascotState;
  size?: number;
  interactive?: boolean;
  staticEyes?: boolean;
}

/**
 * AanGlyph - drop-in replacement for the legacy `<Sparkles />` icon used to
 * mark Aan AI surfaces. Renders the original Sparkles when New Branding is
 * OFF; renders the AanMascot diamond when ON.
 */
export function AanGlyph({ className, state = "idle", size, interactive = false, staticEyes = false }: AanGlyphProps) {
  const { newBranding } = useBranding();

  if (!newBranding) {
    return <Sparkles className={className} />;
  }

  let inferred = 16;
  if (className?.includes("h-3.5")) inferred = 14;
  else if (className?.includes("h-3")) inferred = 12;
  else if (className?.includes("h-4")) inferred = 16;
  else if (className?.includes("h-5")) inferred = 20;
  else if (className?.includes("h-6")) inferred = 24;
  else if (className?.includes("h-8")) inferred = 32;

  return (
    <span className={cn("inline-flex items-center justify-center shrink-0", className)}>
      <AanMascot state={state} size={size ?? inferred} interactive={interactive} staticEyes={staticEyes} />
    </span>
  );
}
