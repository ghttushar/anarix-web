import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  TrendingUp,
  Package,
  BarChart3,
  Database,
  Clock,
  Sparkles,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LongPressTooltip } from "../primitives/LongPressTooltip";

const ITEMS = [
  { to: "/tablet/profitability", label: "Profitability", icon: LayoutDashboard },
  { to: "/tablet/advertising", label: "Advertising", icon: Megaphone },
  { to: "/tablet/bi", label: "Business Intel", icon: TrendingUp },
  { to: "/tablet/catalog", label: "Catalog", icon: Package },
  { to: "/tablet/reports", label: "Reports", icon: BarChart3 },
  { to: "/tablet/amc", label: "AMC", icon: Database },
  { to: "/tablet/dayparting", label: "Day Parting", icon: Clock },
  { to: "/tablet/aan", label: "Aan", icon: Sparkles },
  { to: "/tablet/settings", label: "Settings", icon: Settings },
];

function usePortrait() {
  const [portrait, setPortrait] = useState(
    typeof window !== "undefined" ? window.matchMedia("(orientation: portrait)").matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia("(orientation: portrait)");
    const handler = (e: MediaQueryListEvent) => setPortrait(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);
  return portrait;
}

export function TabletSidebar() {
  const portrait = usePortrait();
  const rail = portrait;

  return (
    <aside
      className={cn(
        "shrink-0 border-r border-border bg-card flex flex-col",
        rail ? "w-16" : "w-56",
      )}
    >
      <div className="h-14 flex items-center justify-center border-b border-border">
        <span className="font-semibold text-sm tracking-tight">{rail ? "A" : "Anarix"}</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {ITEMS.map(({ to, label, icon: Icon }) => {
          const link = (
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 mx-2 my-0.5 rounded-md min-h-11 px-3",
                  "text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  isActive && "bg-muted text-foreground font-medium",
                  rail && "justify-center px-0",
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!rail && <span className="truncate">{label}</span>}
            </NavLink>
          );
          return rail ? (
            <LongPressTooltip key={to} label={label}>
              {link}
            </LongPressTooltip>
          ) : (
            <div key={to}>{link}</div>
          );
        })}
      </nav>
    </aside>
  );
}
