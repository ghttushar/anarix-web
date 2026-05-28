import { NavLink, useLocation } from "react-router-dom";
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
import { useEffect, useState, Fragment } from "react";
import { cn } from "@/lib/utils";
import { LongPressTooltip } from "../primitives/LongPressTooltip";

const ITEMS = [
  { to: "/tablet/profitability", label: "Profitability", icon: LayoutDashboard },
  { to: "/tablet/advertising/campaigns", base: "/tablet/advertising", label: "Advertising", icon: Megaphone },
  { to: "/tablet/bi", label: "Business Intel", icon: TrendingUp },
  { to: "/tablet/catalog", label: "Catalog", icon: Package },
  { to: "/tablet/reports", label: "Reports", icon: BarChart3 },
  { to: "/tablet/amc", label: "AMC", icon: Database },
  { to: "/tablet/dayparting", label: "Day Parting", icon: Clock },
  { to: "/tablet/aan", label: "Aan", icon: Sparkles },
  { to: "/tablet/settings", label: "Settings", icon: Settings },
];

const ADVERTISING_SUB = [
  { to: "/tablet/advertising/campaigns", label: "Campaigns" },
  { to: "/tablet/advertising/impact", label: "Impact" },
  { to: "/tablet/advertising/targeting", label: "Targeting" },
  { to: "/tablet/advertising/budget-pacing", label: "Budget Pacing" },
  { to: "/tablet/advertising/search-harvesting", label: "Search Harvesting" },
  { to: "/tablet/advertising/anomaly-alerts", label: "Anomalies" },
  { to: "/tablet/advertising/creative-analyzer", label: "Creative" },
  { to: "/tablet/advertising/rules/agents", label: "Rule Agents" },
  { to: "/tablet/advertising/rules/applied", label: "Applied Rules" },
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
  const { pathname } = useLocation();
  const advertisingActive = pathname.startsWith("/tablet/advertising");

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
        {ITEMS.map(({ to, base, label, icon: Icon }) => {
          const isActive = base ? pathname.startsWith(base) : pathname.startsWith(to);
          const link = (
            <NavLink
              to={to}
              className={cn(
                "flex items-center gap-3 mx-2 my-0.5 rounded-md min-h-11 px-3",
                "text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                isActive && "bg-muted text-foreground font-medium",
                rail && "justify-center px-0",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!rail && <span className="truncate">{label}</span>}
            </NavLink>
          );
          return (
            <Fragment key={to}>
              {rail ? <LongPressTooltip label={label}>{link}</LongPressTooltip> : <div>{link}</div>}
              {!rail && label === "Advertising" && advertisingActive && (
                <div className="ml-7 my-1 space-y-0.5 border-l border-border pl-2">
                  {ADVERTISING_SUB.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive: a }) =>
                        cn(
                          "block min-h-10 px-2 py-1 rounded text-xs",
                          a ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground",
                        )
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </Fragment>
          );
        })}
      </nav>
    </aside>
  );
}

