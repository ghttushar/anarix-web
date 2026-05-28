import { useLocation } from "react-router-dom";
import { ViewBadge } from "@/components/layout/ViewBadge";

export function TabletTaskbar() {
  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <header className="sticky top-0 z-30 h-14 shrink-0 border-b border-border bg-background flex items-center px-4 gap-3">
      <div className="flex-1 min-w-0 truncate text-sm text-muted-foreground">
        {segments.length > 0 ? segments.join(" / ") : "Home"}
      </div>
      <ViewBadge />
    </header>
  );
}
