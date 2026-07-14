import { useEffect } from "react";
import { useAan } from "@/components/aan/AanContext";
import { useViewport } from "@/contexts/ViewportContext";
import { MiniSidebar } from "@/components/layout/MiniSidebar";
import { AanWorkspaceSidebar } from "@/components/aan/AanWorkspaceSidebar";
import { AanConversation } from "@/components/aan/AanConversation";
import { AanInput } from "@/components/aan/AanInput";
import { AanArtifactViewer } from "@/components/aan/AanArtifactViewer";
import { AanPresenceProvider } from "@/components/aan/AanPresenceContext";
import { AanPresencePortal } from "@/components/aan/AanPresencePortal";
import { MobileAanLayout } from "@/views/mobile/MobileAanLayout";

export default function AanWorkspacePage() {
  const { viewingArtifact, closeArtifactView, openWorkspace, mode } = useAan();
  const { view } = useViewport();

  useEffect(() => {
    if (mode !== "workspace") openWorkspace();
  }, []);

  if (view === "mobile") {
    return <MobileAanLayout />;
  }

  const showArtifactPanel = !!viewingArtifact;
  return (
    <AanPresenceProvider>
      <div className="fixed inset-0 z-[60] flex bg-background">
        <MiniSidebar />
        <div className="flex-1 flex min-w-0 overflow-hidden">
          <AanWorkspaceSidebar />
          <main className="flex-1 flex flex-col overflow-hidden min-w-0">
            <AanConversation />
            <AanInput />
          </main>
          {showArtifactPanel && viewingArtifact && (
            <AanArtifactViewer artifact={viewingArtifact} onClose={closeArtifactView} />
          )}
        </div>
        <AanPresencePortal />
      </div>
    </AanPresenceProvider>
  );
}
