import { useState } from "react";
import { FloatingAanFab } from "./FloatingAanFab";
import { TabletRightPanel } from "../shell/TabletRightPanel";
import { useStylusHover } from "../primitives/useStylusHover";

/**
 * Tablet Aan presence:
 *  - Tap-driven only (no pointer-follow on finger).
 *  - Stylus hover (pointerType=pen) allowed — exposed via useStylusHover for child anchors.
 *  - Persistent bottom-right FAB opens the Aan panel.
 *
 * The actual Aan chat content is deferred to a later phase; this controller
 * provides the tablet shell entry point.
 */
export function TabletAanController() {
  const [open, setOpen] = useState(false);
  const stylusActive = useStylusHover();

  return (
    <>
      <FloatingAanFab onClick={() => setOpen(true)} pulsing={stylusActive} />
      <TabletRightPanel open={open} onClose={() => setOpen(false)} title="Aan" width={420}>
        <div className="p-6 text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">Aan tablet workspace</p>
          <p>
            The full Aan conversation interface is mounted in a later phase. This panel confirms
            the tablet FAB, swipe-to-close edge, and keyboard-aware sizing are wired correctly.
          </p>
        </div>
      </TabletRightPanel>
    </>
  );
}
