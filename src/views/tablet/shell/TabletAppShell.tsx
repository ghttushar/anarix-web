import { ReactNode } from "react";
import { TabletSidebar } from "./TabletSidebar";
import { TabletTaskbar } from "./TabletTaskbar";
import { TabletFloatingIsland } from "./TabletFloatingIsland";
import { TabletAanController } from "../aan/TabletAanController";

interface TabletAppShellProps {
  children?: ReactNode;
}

/**
 * Root tablet layout. Uses h-dvh so the on-screen keyboard overlays rather
 * than shrinks the app. Sidebar adapts to orientation via TabletSidebar.
 */
export function TabletAppShell({ children }: TabletAppShellProps) {
  return (
    <div className="h-dvh w-screen flex overflow-hidden bg-background text-foreground" data-view="tablet">
      <TabletSidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <TabletTaskbar />
        <main className="flex-1 min-h-0 min-w-0 overflow-y-auto">
          {children ?? (
            <div className="h-full flex items-center justify-center p-8 text-center">
              <div className="max-w-md">
                <h1 className="text-lg font-semibold mb-2">Tablet shell ready</h1>
                <p className="text-sm text-muted-foreground">
                  Phase 2 complete. Module screens (Advertising, Profitability, Reports, BI, Catalog,
                  AMC, Settings) will mount inside this shell starting Phase 3.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <TabletFloatingIsland />
      <TabletAanController />
    </div>
  );
}
