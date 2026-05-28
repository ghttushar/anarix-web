import { ReactNode, useRef, useState, PointerEvent } from "react";
import { cn } from "@/lib/utils";

interface SwipeableRowProps {
  children: ReactNode;
  /** Rendered behind the row, revealed on swipe-left. */
  actions: ReactNode;
  /** Width of the action drawer in px. */
  actionWidth?: number;
  className?: string;
}

/**
 * Tablet row that supports swipe-left to reveal action buttons.
 * Snaps open/closed past 40% threshold. Rubber-bands at edges.
 */
export function SwipeableRow({ children, actions, actionWidth = 160, className }: SwipeableRowProps) {
  const startX = useRef(0);
  const baseX = useRef(0);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const clamp = (v: number) => Math.max(-actionWidth * 1.2, Math.min(0, v));

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    startX.current = e.clientX;
    baseX.current = x;
    setDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging) return;
    setX(clamp(baseX.current + (e.clientX - startX.current)));
  };
  const onUp = () => {
    setDragging(false);
    setX(Math.abs(x) > actionWidth * 0.4 ? -actionWidth : 0);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-y-0 right-0 flex items-stretch"
        style={{ width: actionWidth }}
      >
        {actions}
      </div>
      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        style={{
          transform: `translateX(${x}px)`,
          transition: dragging ? "none" : "transform 180ms cubic-bezier(0.2,0,0,1)",
          touchAction: "pan-y",
        }}
        className="relative bg-card"
      >
        {children}
      </div>
    </div>
  );
}
