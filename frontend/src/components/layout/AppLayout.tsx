import { ReactNode, useEffect, useRef, lazy, Suspense, useCallback } from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { AanInboxPanel } from "@/components/aan/autonomous/AanInboxPanel";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useDensity } from "@/contexts/DensityContext";
import { useTrial } from "@/contexts/TrialContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";
import { DataSyncingState } from "@/components/billing/DataSyncingState";
import { TrialExpiredState } from "@/components/billing/TrialExpiredState";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileShell } from "@/views/mobile/MobileShell";
import { cn } from "@/lib/utils";


const AanCopilotPanel = lazy(() => import("@/components/aan/AanCopilotPanel").then(m => ({ default: m.AanCopilotPanel })));
const AskAanTooltip = lazy(() => import("@/components/aan/AskAanTooltip").then(m => ({ default: m.AskAanTooltip })));

function LayoutInner({ children }: { children: ReactNode }) {
  const { dataPanel, aiPanel, hasAnyPanel, closeDataPanel } = useActivePanel();
  const { open, setOpen } = useSidebar();
  const { density } = useDensity();
  const { trial } = useTrial();
  const { billingFlowEnabled } = useBillingFlow();
  const showSyncOverlay = billingFlowEnabled && trial === "syncing";
  const showExpiredOverlay = billingFlowEnabled && trial === "expired";

  const autoCollapsedRef = useRef(false);
  const prevHasPanelRef = useRef(hasAnyPanel);

  const showInboxPanel = dataPanel === "aan-inbox";
  const showCopilot = aiPanel === "copilot";

  // Close data panels (productDetail, periodBreakdown) when clicking main content
  const isClosableDataPanel = dataPanel === "productDetail" || dataPanel === "periodBreakdown";

  const handleMainClick = useCallback(() => {
    if (isClosableDataPanel) {
      closeDataPanel();
    }
  }, [isClosableDataPanel, closeDataPanel]);

  useEffect(() => {
    const panelJustOpened = hasAnyPanel && !prevHasPanelRef.current;
    const panelJustClosed = !hasAnyPanel && prevHasPanelRef.current;

    if (panelJustOpened && open) {
      autoCollapsedRef.current = true;
      setOpen(false);
    } else if (panelJustClosed && autoCollapsedRef.current) {
      autoCollapsedRef.current = false;
      setOpen(true);
    }

    prevHasPanelRef.current = hasAnyPanel;
  }, [hasAnyPanel, open, setOpen]);

  // Tablet portrait: auto-collapse sidebar to icon rail once on first entry
  // into portrait. After that, user toggles win — we don't clobber them.
  const portraitAppliedRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (document.documentElement.getAttribute("data-view") !== "tablet") return;
    const mq = window.matchMedia("(orientation: portrait)");
    const apply = () => {
      if (mq.matches && !portraitAppliedRef.current) {
        portraitAppliedRef.current = true;
        setOpen(false);
      } else if (!mq.matches) {
        // Reset so re-entering portrait collapses again.
        portraitAppliedRef.current = false;
      }
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [setOpen]);

  const showAnyPanel = showInboxPanel || showCopilot;

  const handleBackdropClick = useCallback(() => {
    if (isClosableDataPanel || showInboxPanel) {
      closeDataPanel();
    }
  }, [isClosableDataPanel, showInboxPanel, closeDataPanel]);

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden">
      <AppSidebar />
      <div data-panel-host className="relative flex flex-1 min-w-0 h-screen overflow-hidden">
        <main
          className={cn(
            "flex-1 overflow-auto bg-background min-h-0 min-w-0",
            density === "compact" ? "p-4" : "p-6"
          )}
          onClick={handleMainClick}
        >
          {showSyncOverlay ? (
            <DataSyncingState />
          ) : showExpiredOverlay ? (
            <TrialExpiredState />
          ) : (
            children
          )}
        </main>
        {showAnyPanel && (
          <div
            data-panel-backdrop
            className="absolute inset-0 z-20 bg-foreground/20 hidden"
            onClick={handleBackdropClick}
            aria-hidden="true"
          />
        )}
        {showInboxPanel && <AanInboxPanel />}
        {showCopilot && <Suspense fallback={null}><AanCopilotPanel /></Suspense>}
      </div>
      <Suspense fallback={null}><AskAanTooltip /></Suspense>
    </div>
  );
}

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { view } = useViewport();
  if (view === "mobile") {
    return <MobileShell>{children}</MobileShell>;
  }
  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}

