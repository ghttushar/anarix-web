import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAan } from "./AanContext";
import { AanWorkspaceSidebar } from "./AanWorkspaceSidebar";
import { AanConversation } from "./AanConversation";
import { AanInput } from "./AanInput";
import { AanArtifactViewer } from "./AanArtifactViewer";
import { MiniSidebar } from "@/components/layout/MiniSidebar";
import { AanPresenceProvider } from "./AanPresenceContext";
import { AanPresencePortal } from "./AanPresencePortal";

export function AanWorkspace() {
  const { mode, viewingArtifact, closeArtifactView } = useAan();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const isOpen = mode === "workspace";
  if (!isOpen) return null;

  const showSidebar = sidebarExpanded && !viewingArtifact;
  const showArtifactPanel = !!viewingArtifact;

  return (
    <div className="fixed inset-0 z-[60] flex bg-background">
      {/* Mini app sidebar for navigation */}
      <MiniSidebar />

      {/* Aan workspace content — no header bar */}
      <div className="flex-1 flex min-w-0 overflow-hidden">
        {showSidebar && <AanWorkspaceSidebar />}

        <main className="flex-1 flex flex-col overflow-hidden min-w-0">
          <AanConversation />
          <AanInput />
        </main>

        {showArtifactPanel && viewingArtifact && (
          <AanArtifactViewer artifact={viewingArtifact} onClose={closeArtifactView} />
        )}
      </div>
    </div>
  );
}
