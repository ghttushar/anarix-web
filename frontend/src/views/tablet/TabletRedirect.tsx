import { Navigate, useLocation } from "react-router-dom";

/**
 * Tablet parity: the /tablet/* URL space serves the same routes and DOM as
 * the desktop app. The "tablet view" is a CSS/behavior layer applied via
 * `data-view="tablet"` on <html>, not a separate UI fork. This component
 * strips the /tablet prefix and forwards to the matching desktop route so
 * every page, KPI card, chart, taskbar, sidebar, panel, and island renders
 * identically to desktop. Touch/stylus deltas are layered globally.
 */
export default function TabletRedirect() {
  const { pathname, search, hash } = useLocation();
  let stripped = pathname.replace(/^\/tablet(?=\/|$)/, "");
  if (stripped === "") stripped = "/profitability/dashboard";
  return <Navigate to={`${stripped}${search}${hash}`} replace />;
}
