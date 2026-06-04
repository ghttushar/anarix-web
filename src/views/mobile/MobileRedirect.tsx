import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useViewport } from "@/contexts/ViewportContext";

/**
 * /mobile/* parity: switch app into mobile view and strip the /mobile prefix
 * so the same page components render — but inside MobileShell (AppLayout
 * branches on view). Mirrors TabletRedirect's pattern.
 */
export default function MobileRedirect() {
  const { pathname, search, hash } = useLocation();
  const { setView } = useViewport();

  useEffect(() => {
    setView("mobile");
  }, [setView]);

  let stripped = pathname.replace(/^\/mobile(?=\/|$)/, "");
  if (stripped === "") stripped = "/profitability/dashboard";
  return <Navigate to={`${stripped}${search}${hash}`} replace />;
}
