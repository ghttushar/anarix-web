import { ReactNode } from "react";
import { useLocation, Navigate } from "react-router-dom";

const STORAGE_KEY = "anarix-cancel-from-app";

/**
 * Guards a route so it only renders if the user came from inside the app
 * (via a redirect that set sessionStorage anarix-cancel-from-app=1, or
 * a ?from=app query param). Direct URL access falls back to NotFound.
 */
export function HiddenRouteGuard({ children }: { children: ReactNode }) {
  const location = useLocation();
  const fromQuery = new URLSearchParams(location.search).get("from") === "app";
  const fromSession = (() => {
    try { return sessionStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  })();

  if (!fromQuery && !fromSession) {
    return <Navigate to="/website" replace />;
  }
  // Persist the flag so deeper hidden routes (downgrade-plan) work too.
  try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
  return <>{children}</>;
}
