import { ReactNode } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { TabletSidebar } from "./TabletSidebar";
import { TabletTaskbar } from "./TabletTaskbar";
import { TabletFloatingIsland } from "./TabletFloatingIsland";
import { TabletAanController } from "../aan/TabletAanController";
import TablePreview from "../_preview/TablePreview";
import { TabletAdvertisingRoutes } from "../advertising/AdvertisingRoutes";
import { TabletProfitabilityRoutes } from "../profitability/ProfitabilityRoutes";
import { TabletReportsRoutes } from "../reports/ReportsRoutes";
import { TabletAanWorkspace } from "../aan/TabletAanWorkspace";

interface TabletAppShellProps {
  children?: ReactNode;
}

function EmptyState() {
  return (
    <div className="h-full flex items-center justify-center p-8 text-center">
      <div className="max-w-md">
        <h1 className="text-lg font-semibold mb-2">Tablet shell ready</h1>
        <p className="text-sm text-muted-foreground mb-4">
          Phase 3 primitives available. Module screens land in Phase 4+.
        </p>
        <Link
          to="/tablet/_preview/tables"
          className="inline-flex items-center justify-center min-h-11 px-4 rounded-md bg-primary text-primary-foreground text-sm"
        >
          Open Phase 3 preview
        </Link>
      </div>
    </div>
  );
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
        <main className="flex-1 min-h-0 min-w-0 overflow-hidden">
          {children ?? (
            <Routes>
              <Route path="advertising/*" element={<TabletAdvertisingRoutes />} />
              <Route path="profitability/*" element={<TabletProfitabilityRoutes />} />
              <Route path="reports/*" element={<TabletReportsRoutes />} />
              <Route path="aan" element={<TabletAanWorkspace />} />
              <Route path="_preview/tables" element={<TablePreview />} />
              <Route path="*" element={<EmptyState />} />
            </Routes>
          )}
        </main>
      </div>
      <TabletFloatingIsland />
      <TabletAanController />
    </div>
  );
}

