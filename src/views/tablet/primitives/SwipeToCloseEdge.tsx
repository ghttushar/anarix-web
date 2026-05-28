import { useRef, PointerEvent } from "react";

interface SwipeToCloseEdgeProps {
  onClose: () => void;
  /** Min horizontal distance (px) to trigger close. */
  threshold?: number;
  /** Width of the invisible grab strip. */
  width?: number;
}

/**
 * Invisible left-edge strip for right-side panels.
 * Swipe-right past threshold = close.
 */
export function SwipeToCloseEdge({ onClose, threshold = 60, width = 16 }: SwipeToCloseEdgeProps) {
  const startX = useRef<number | null>(null);

  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse") return;
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onUp = (e: PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (dx > threshold) onClose();
  };

  return (
    <div
      aria-hidden
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={() => (startX.current = null)}
      style={{ width, touchAction: "pan-y" }}
      className="absolute inset-y-0 left-0 z-10"
    />
  );
}
