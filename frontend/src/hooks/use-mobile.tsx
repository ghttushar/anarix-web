import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Returns true only when the device should use a true "mobile" UI.
 * Tablet view (`html[data-view="tablet"]`) is treated as desktop-rail,
 * never Sheet/offcanvas, regardless of width — required for the
 * tablet-portrait sidebar to remain togglable.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const compute = () => {
      const view = typeof document !== "undefined"
        ? document.documentElement.getAttribute("data-view")
        : null;
      if (view === "tablet" || view === "desktop") {
        setIsMobile(false);
        return;
      }
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    mql.addEventListener("change", compute);
    // Re-evaluate when data-view changes.
    const observer = new MutationObserver(compute);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-view"] });
    compute();
    return () => {
      mql.removeEventListener("change", compute);
      observer.disconnect();
    };
  }, []);

  return !!isMobile;
}
