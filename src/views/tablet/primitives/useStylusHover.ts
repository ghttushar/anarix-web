import { useEffect, useState } from "react";

/**
 * Returns true while a stylus (pointerType === 'pen') is currently hovering.
 * Use to selectively re-enable hover affordances on tablet.
 */
export function useStylusHover(): boolean {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "pen") setActive(true);
    };
    const onLeave = (e: PointerEvent) => {
      if (e.pointerType === "pen") setActive(false);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return active;
}
