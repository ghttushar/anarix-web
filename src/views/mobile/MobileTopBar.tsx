import { Menu, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { AanGlyph } from "@/components/aan/AanGlyph";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useInsights } from "@/components/insights";

interface Props {
  onOpenDrawer: () => void;
}

export function MobileTopBar({ onOpenDrawer }: Props) {
  const navigate = useNavigate();
  const { setDataPanel } = useActivePanel();
  const { criticalCount } = useInsights();

  return (
    <header className="h-14 shrink-0 sticky top-0 z-30 bg-background border-b border-border/40 flex items-center px-3 gap-2">
      <button
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted active:bg-muted/80"
      >
        <Menu className="h-5 w-5" />
      </button>
      <button
        onClick={() => navigate("/profitability/dashboard")}
        className="flex-1 flex items-center gap-2 min-w-0 h-10"
      >
        <AnarixLogo variant="full" className="h-5 w-auto" />
      </button>
      <button
        onClick={() => setDataPanel("notifications")}
        aria-label="Notifications"
        className="relative h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted"
      >
        <Bell className="h-5 w-5" />
        {criticalCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        )}
      </button>
      <button
        onClick={() => navigate("/aan")}
        aria-label="Ask Aan"
        className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted"
      >
        <AanGlyph className="h-5 w-5 aan-gradient-text" staticEyes />
      </button>
    </header>
  );
}
