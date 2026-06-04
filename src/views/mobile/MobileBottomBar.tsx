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

  const baseBtn = "relative flex flex-col items-center justify-center gap-0.5 h-full text-[11px]";
  const muted = "text-muted-foreground hover:text-foreground";
  const active = "text-primary";

  return (
    <nav
      className="h-14 shrink-0 sticky bottom-0 z-30 bg-background/95 backdrop-blur-sm border-t border-border/40 grid grid-cols-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <button
        onClick={() => (dataPanel === "insights" ? setDataPanel("none") : openInsights())}
        className={cn(baseBtn, dataPanel === "insights" ? active : muted)}
      >
        <Lightbulb className="h-5 w-5" />
        <span>Insights</span>
        {criticalCount > 0 && (
          <span className="absolute top-1.5 right-[28%] h-1.5 w-1.5 rounded-full bg-destructive" />
        )}
      </button>

      <button
        onClick={() => setDataPanel(dataPanel === "notifications" ? "none" : "notifications")}
        className={cn(baseBtn, dataPanel === "notifications" ? active : muted)}
      >
        <Bell className="h-5 w-5" />
        <span>Alerts</span>
      </button>

      <button onClick={() => navigate("/aan")} className={cn(baseBtn, muted)}>
        <AanGlyph className="h-5 w-5 aan-gradient-text" staticEyes />
        <span>Aan</span>
      </button>

      <button onClick={() => setTheme(isDark ? "light" : "dark")} className={cn(baseBtn, muted)}>
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        <span>{isDark ? "Light" : "Dark"}</span>
      </button>
    </nav>
  );
}
