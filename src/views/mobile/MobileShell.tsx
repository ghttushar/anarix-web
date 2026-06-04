import { ReactNode, useState, lazy, Suspense } from "react";
import { X } from "lucide-react";
import { MobileTopBar } from "./MobileTopBar";
import { MobileDrawerNav } from "./MobileDrawerNav";
import { MobileBottomBar } from "./MobileBottomBar";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { Button } from "@/components/ui/button";

const AanCopilotPanel = lazy(() =>
  import("@/components/aan/AanCopilotPanel").then(m => ({ default: m.AanCopilotPanel }))
);

/**
 * Mobile read-only shell.
 * - Top bar with hamburger + brand + bell + Aan
 * - Hamburger opens left drawer with full navigation
 * - Bottom mini-bar for Insights / Alerts / Aan / Theme
 * - Right-side panels render as full-screen overlays (single-panel rule
 *   enforced by ActivePanelContext on mobile).
 */
export function MobileShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { dataPanel, aiPanel, closeDataPanel, closeAiPanel } = useActivePanel();

  const showInsights = dataPanel === "insights";
  const showNotifications = dataPanel === "notifications";
  const showCopilot = aiPanel === "copilot";
  const anyPanel = showInsights || showNotifications || showCopilot;

  const closeAll = () => {
    closeDataPanel();
    closeAiPanel();
  };

  const panelTitle = showCopilot ? "Aan" : showNotifications ? "Notifications" : showInsights ? "Insights" : "";

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MobileTopBar onOpenDrawer={() => setDrawerOpen(true)} />
      <MobileDrawerNav open={drawerOpen} onOpenChange={setDrawerOpen} />

      <main className="flex-1 min-h-0 overflow-auto pb-16">
        {children}
      </main>

      <MobileBottomBar />

      {anyPanel && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between border-b border-border px-3 h-12 shrink-0">
            <span className="text-sm font-semibold text-foreground">{panelTitle}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={closeAll} aria-label="Close">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex-1 min-h-0 overflow-auto">
            {showInsights && <InsightsPanel />}
            {showNotifications && <NotificationsPanel />}
            {showCopilot && (
              <Suspense fallback={null}>
                <AanCopilotPanel />
              </Suspense>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
