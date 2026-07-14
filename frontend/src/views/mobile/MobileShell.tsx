import { ReactNode, useState } from "react";
import { X } from "lucide-react";
import { MobileTopBar } from "./MobileTopBar";
import { MobileDrawerNav } from "./MobileDrawerNav";
import { MobileAccountSheet } from "./MobileAccountSheet";
import { MobileAanFab } from "./MobileAanFab";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Mobile shell — sticky global top bar [☰ | Title | 👤], drawer nav, account
 * sheet, floating Aan FAB. Insights/Alerts kept as right-side sheets for
 * legacy entry points.
 */
export function MobileShell({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { dataPanel, closeDataPanel } = useActivePanel();

  const showInsights = dataPanel === "insights";
  const showNotifications = dataPanel === "notifications";
  const anySheet = showInsights || showNotifications;
  const sheetTitle = showInsights ? "Insights" : showNotifications ? "Alerts" : "";

  return (
    <div
      data-mobile-shell
      className="flex flex-col min-h-[100dvh] w-full bg-background overflow-x-hidden"
    >
      <MobileTopBar
        onOpenDrawer={() => setDrawerOpen(true)}
        onOpenAccount={() => setAccountOpen(true)}
      />
      <MobileDrawerNav open={drawerOpen} onOpenChange={setDrawerOpen} />
      <MobileAccountSheet open={accountOpen} onOpenChange={setAccountOpen} />

      <main className="flex-1 min-h-0 overflow-x-hidden pb-20">{children}</main>

      <MobileAanFab />

      {anySheet && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/30"
            onClick={closeDataPanel}
            aria-hidden
          />
          <aside
            className={cn(
              "fixed top-0 right-0 bottom-0 z-50 w-[92vw] max-w-[420px] bg-background border-l border-border flex flex-col animate-in slide-in-from-right duration-200"
            )}
          >
            <div className="flex items-center justify-between border-b border-border px-3 h-12 shrink-0">
              <span className="text-sm font-semibold text-foreground">{sheetTitle}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={closeDataPanel}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-auto">
              {showInsights && <InsightsPanel />}
              {showNotifications && <NotificationsPanel />}
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
