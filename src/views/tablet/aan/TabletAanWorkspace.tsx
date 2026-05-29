import { useEffect } from "react";
import { useAan } from "@/components/aan/AanContext";
import { AanConversation } from "@/components/aan/AanConversation";
import { AanInput } from "@/components/aan/AanInput";
import { AanArtifactViewer } from "@/components/aan/AanArtifactViewer";
import { AanPresenceProvider } from "@/components/aan/AanPresenceContext";
import { AanPresencePortal } from "@/components/aan/AanPresencePortal";
import { TabletRightPanel } from "../shell/TabletRightPanel";

/**
 * Full-screen Aan workspace, tablet variant.
 *
 * Reuses the existing AanConversation + AanInput so business logic, drafts,
 * artifacts, and conversation history match the desktop workspace exactly.
 * Differences vs desktop:
 *  - Mounts inside the tablet shell <main> (sidebar + taskbar already provided).
 *  - Artifact viewer renders as a TabletRightPanel instead of a fixed pane.
 *  - No separate AanWorkspaceSidebar — the tablet sidebar's "Aan" entry is the entry point.
 */
export function TabletAanWorkspace() {
  const { viewingArtifact, closeArtifactView, mode, openWorkspace } = useAan();

  useEffect(() => {
    if (mode !== "workspace") openWorkspace();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AanPresenceProvider>
      <div className="flex flex-col h-full min-w-0 bg-background">
        <AanConversation />
        <AanInput />
        <TabletRightPanel
          open={!!viewingArtifact}
          onClose={closeArtifactView}
          title={viewingArtifact?.title ?? "Artifact"}
          width={440}
        >
          {viewingArtifact && (
            <AanArtifactViewer artifact={viewingArtifact} onClose={closeArtifactView} />
          )}
        </TabletRightPanel>
        <AanPresencePortal />
      </div>
    </AanPresenceProvider>
  );
}
