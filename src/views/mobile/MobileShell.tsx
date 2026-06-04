import { ReactNode, useState, lazy, Suspense } from "react";
import { MobileTopBar } from "./MobileTopBar";
import { MobileDrawerNav } from "./MobileDrawerNav";
import { MobileBottomBar } from "./MobileBottomBar";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";

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
  const { dataPanel, aiPanel } = useActivePanel();

  const showInsights = dataPanel === "insights";
  const showNotifications = dataPanel === "notifications";
  const showCopilot = aiPanel === "copilot";
  const anyPanel = showInsights || showNotifications || showCopilot;

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      <MobileTopBar onOpenDrawer={() => setDrawerOpen(true)} />
      <MobileDrawerNav open={drawerOpen} onOpenChange={setDrawerOpen} />

      <main className="flex-1 min-h-0 overflow-auto">
        {children}
      </main>

      <MobileBottomBar />

      {anyPanel && (
        <div className="fixed inset-0 z-40 bg-background flex flex-col">
          {showInsights && <InsightsPanel />}
          {showNotifications && <NotificationsPanel />}
          {showCopilot && (
            <Suspense fallback={null}>
              <AanCopilotPanel />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}
