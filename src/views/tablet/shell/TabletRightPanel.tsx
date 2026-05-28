import { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SwipeToCloseEdge } from "../primitives/SwipeToCloseEdge";
import { TouchTarget } from "../primitives/TouchTarget";
import { useVisualViewportInset } from "../primitives/useVisualViewportInset";

interface TabletRightPanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  width?: number;
  children: ReactNode;
}

export function TabletRightPanel({ open, onClose, title, width = 480, children }: TabletRightPanelProps) {
  const kb = useVisualViewportInset();

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed top-0 right-0 z-40 bg-card border-l border-border flex flex-col",
        "transition-transform duration-200",
        open ? "translate-x-0" : "translate-x-full",
      )}
      style={{ width, height: `calc(100dvh - ${kb}px)` }}
    >
      <SwipeToCloseEdge onClose={onClose} />
      <header className="h-14 shrink-0 flex items-center justify-between px-4 border-b border-border">
        <h2 className="text-sm font-medium truncate">{title}</h2>
        <TouchTarget priority="primary" aria-label="Close panel" onClick={onClose}>
          <X className="h-5 w-5" />
        </TouchTarget>
      </header>
      <div className="flex-1 min-h-0 overflow-y-auto">{children}</div>
    </div>
  );
}
