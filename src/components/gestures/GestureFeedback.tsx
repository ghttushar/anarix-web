import { useEffect, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { GESTURES, useGestures, GESTURE_ACTIONS } from "@/contexts/GestureContext";

const DIR_ICON = { up: ArrowUp, down: ArrowDown, left: ArrowLeft, right: ArrowRight };

/**
 * Slim toast that confirms which gesture fired and what action ran.
 * Lives at the top of the viewport, auto-hides after 1.2s.
 */
export function GestureFeedback() {
  const { lastTriggered } = useGestures();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastTriggered) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 1200);
    return () => clearTimeout(t);
  }, [lastTriggered]);

  if (!lastTriggered) return null;
  const gesture = GESTURES.find((g) => g.key === lastTriggered.key);
  const action = GESTURE_ACTIONS.find((a) => a.id === lastTriggered.action);
  if (!gesture || !action) return null;
  const Icon = DIR_ICON[gesture.direction];

  return (
    <div
      className={cn(
        "pointer-events-none fixed top-4 left-1/2 -translate-x-1/2 z-[100]",
        "flex items-center gap-2 px-3 py-1.5 rounded-full",
        "bg-card border border-primary/40 shadow-md",
        "transition-all duration-200",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
    >
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
        {gesture.fingers}F
      </span>
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="h-3 w-px bg-border" />
      <span className="text-xs font-medium text-foreground">{action.label}</span>
    </div>
  );
}
