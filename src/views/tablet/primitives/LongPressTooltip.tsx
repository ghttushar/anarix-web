import { ReactNode, cloneElement, isValidElement, useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface LongPressTooltipProps {
  label: string;
  /** Single interactive child (button/icon). */
  children: ReactNode;
  delayMs?: number;
}

/**
 * Long-press (default 500ms) to reveal a tooltip on touch.
 * Forwards `title` for stylus / hardware-keyboard / mouse users.
 */
export function LongPressTooltip({ label, children, delayMs = 500 }: LongPressTooltipProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const timer = useRef<number | null>(null);
  const anchor = useRef<HTMLElement | null>(null);

  const clear = useCallback(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const close = useCallback(() => {
    clear();
    setOpen(false);
  }, [clear]);

  const start = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "mouse") return; // mouse uses title attr
      clear();
      timer.current = window.setTimeout(() => {
        const rect = anchor.current?.getBoundingClientRect();
        if (rect) setPos({ x: rect.left + rect.width / 2, y: rect.bottom + 8 });
        setOpen(true);
      }, delayMs);
    },
    [clear, delayMs],
  );

  useEffect(() => {
    if (!open) return;
    const onScroll = () => close();
    window.addEventListener("scroll", onScroll, true);
    return () => window.removeEventListener("scroll", onScroll, true);
  }, [open, close]);

  if (!isValidElement(children)) return <>{children}</>;

  const child = cloneElement(children as React.ReactElement, {
    ref: (node: HTMLElement) => {
      anchor.current = node;
    },
    title: label,
    onPointerDown: start,
    onPointerUp: close,
    onPointerLeave: close,
    onPointerCancel: close,
  });

  return (
    <>
      {child}
      {open && pos &&
        createPortal(
          <div
            role="tooltip"
            style={{ position: "fixed", left: pos.x, top: pos.y, transform: "translateX(-50%)" }}
            className="z-[100] pointer-events-none rounded-md bg-foreground px-2 py-1 text-xs text-background shadow"
          >
            {label}
          </div>,
          document.body,
        )}
    </>
  );
}
