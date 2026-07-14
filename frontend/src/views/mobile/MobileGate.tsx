import { ReactNode } from "react";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileBlockedRoute } from "./MobileBlockedRoute";

/**
 * Wrap a route element with this guard to redirect mobile users to a
 * read-only blocker. Desktop / tablet pass through unchanged.
 */
export function MobileGate({
  children,
  title,
  description,
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  const { view } = useViewport();
  if (view === "mobile") {
    return <MobileBlockedRoute title={title} description={description} />;
  }
  return <>{children}</>;
}

export default MobileGate;
