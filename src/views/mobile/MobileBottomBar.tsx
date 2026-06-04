import { Lightbulb, Bell, Sun, Moon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AanGlyph } from "@/components/aan/AanGlyph";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useInsights } from "@/components/insights";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

export function MobileBottomBar() {
  const navigate = useNavigate();
  const { dataPanel, setDataPanel } = useActivePanel();
  const { openPanel: openInsights, criticalCount } = useInsights();
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const items = [
    {
      key: "insights",
      label: "Insights",
      icon: Lightbulb,
      active: dataPanel === "insights",
      badge: criticalCount,
      onClick: () => (dataPanel === "insights" ? setDataPanel("none") : openInsights()),
    },
    {
      key: "notifications",
      label: "Alerts",
      icon: Bell,
      active: dataPanel === "notifications",
      onClick: () => setDataPanel(dataPanel === "notifications" ? "none" : "notifications"),
    },
    {
      key: "aan",
      label: "Aan",
      icon: AanGlyph,
      iconClass: "aan-gradient-text",
      onClick: () => navigate("/aan"),
    },
    {
      key: "theme",
      label: isDark ? "Light" : "Dark",
      icon: isDark ? Sun : Moon,
      onClick: () => setTheme(isDark ? "light" : "dark"),
    },
  ] as const;

  return (
    <nav
      className="h-14 shrink-0 sticky bottom-0 z-30 bg-background/95 backdrop-blur-sm border-t border-border/40 grid grid-cols-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {items.map(it => {
        const Icon = it.icon as any;
        return (
          <button
            key={it.key}
            onClick={it.onClick}
            className={cn(
              "relative flex flex-col items-center justify-center gap-0.5 h-full text-[11px]",
              (it as any).active ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className={cn("h-5 w-5", (it as any).iconClass)} {...((it as any).iconClass ? { staticEyes: true } : {})} />
            <span>{it.label}</span>
            {"badge" in it && (it as any).badge ? (
              <span className="absolute top-1.5 right-[28%] h-1.5 w-1.5 rounded-full bg-destructive" />
            ) : null}
          </button>
        );
      })}
    </nav>
  );
}
