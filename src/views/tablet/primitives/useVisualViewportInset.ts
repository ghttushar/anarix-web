import { useEffect, useState } from "react";

/**
 * Returns the on-screen keyboard inset in px (0 when not visible).
 * Uses visualViewport API; falls back to 0 if unsupported.
 */
export function useVisualViewportInset(): number {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      const next = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      setInset(next);
    };
    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  useEffect(() => {
    if (inset <= 0) return;
    const active = document.activeElement as HTMLElement | null;
    if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA" || active.isContentEditable)) {
      active.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [inset]);

  return inset;
}
