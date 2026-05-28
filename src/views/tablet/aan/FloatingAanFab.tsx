import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVisualViewportInset } from "../primitives/useVisualViewportInset";

interface FloatingAanFabProps {
  onClick: () => void;
  pulsing?: boolean;
}

/**
 * Tablet-native persistent Aan FAB. Anchored bottom-right with safe-area + keyboard awareness.
 */
export function FloatingAanFab({ onClick, pulsing }: FloatingAanFabProps) {
  const kb = useVisualViewportInset();
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open Aan"
      style={{ bottom: `calc(env(safe-area-inset-bottom, 0px) + 16px + ${kb}px)` }}
      className={cn(
        "fixed right-4 z-40 h-14 w-14 rounded-full",
        "bg-gradient-to-br from-primary to-primary/70 text-primary-foreground",
        "flex items-center justify-center shadow-lg",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        pulsing && "animate-pulse",
      )}
    >
      <Sparkles className="h-6 w-6" />
    </button>
  );
}
