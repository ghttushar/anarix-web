// Standalone panel routes for html-to-figma export and shareable deep links.
// Every right-side panel/artifact state gets its own URL under /panels/*.
//
// Convention: when adding a new right-side panel, sheet, or artifact, add a
// matching route below and render the panel in `standalone` mode (no app chrome).

import { useParams } from "react-router-dom";
import { useMemo } from "react";
import { AanInboxPanel } from "@/components/aan/autonomous/AanInboxPanel";
import { ExecutionArtifact } from "@/components/aan/autonomous/ExecutionArtifact";
import { InsightsPanel } from "@/components/insights/InsightsPanel";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useEffect } from "react";

/** Minimal figma-friendly shell: fixed width, plain background, no app chrome. */
function PanelFrame({ children, width = 380 }: { children: React.ReactNode; width?: number }) {
  return (
    <div className="min-h-screen w-full bg-muted/40 flex items-start justify-center p-6">
      <div
        className="bg-background border border-border rounded-lg shadow-sm overflow-hidden"
        style={{ width, height: "min(900px, 90vh)" }}
      >
        {children}
      </div>
    </div>
  );
}

export function AanInboxPanelRoute() {
  return (
    <PanelFrame>
      <AanInboxPanel standalone />
    </PanelFrame>
  );
}

export function AanInboxMorningRoute() {
  return (
    <PanelFrame>
      <AanInboxPanel standalone onlyMorning />
    </PanelFrame>
  );
}

export function AanInboxMeetingActionsRoute() {
  return (
    <PanelFrame>
      <AanInboxPanel standalone onlyMeetingActions />
    </PanelFrame>
  );
}

export function AanInboxCardRoute() {
  const { scenarioId } = useParams();
  return (
    <PanelFrame>
      <AanInboxPanel standalone focusScenarioId={scenarioId} />
    </PanelFrame>
  );
}

export function AanArtifactRoute() {
  const { scenarioId } = useParams();
  const { events } = useAanEvents();
  const event = useMemo(
    () => events.find((e) => e.scenarioId === scenarioId) ?? events[0],
    [events, scenarioId]
  );
  if (!event) {
    return (
      <PanelFrame width={560}>
        <div className="p-6 text-sm text-muted-foreground">No event found for "{scenarioId}".</div>
      </PanelFrame>
    );
  }
  return (
    <PanelFrame width={560}>
      <ExecutionArtifact event={event} onClose={() => {}} />
    </PanelFrame>
  );
}

/** InsightsPanel reads its open-state from ActivePanelContext, so we force it open here. */
function ForceOpenPanel({ panel }: { panel: "insights" | "notifications" }) {
  const { setDataPanel } = useActivePanel();
  useEffect(() => {
    setDataPanel(panel);
  }, [panel, setDataPanel]);
  return null;
}

export function InsightsPanelRoute() {
  return (
    <PanelFrame width={320}>
      <ForceOpenPanel panel="insights" />
      <InsightsPanel />
    </PanelFrame>
  );
}

export function NotificationsPanelRoute() {
  return (
    <PanelFrame width={360}>
      <ForceOpenPanel panel="notifications" />
      <NotificationsPanel />
    </PanelFrame>
  );
}

/** Index/registry — useful for docs and for the html-to-figma workflow. */
export const PANEL_ROUTES = [
  { path: "/panels/aan-inbox", label: "Aan Inbox — full" },
  { path: "/panels/aan-inbox/morning", label: "Aan Inbox — morning briefing" },
  { path: "/panels/aan-inbox/meeting-actions", label: "Aan Inbox — action items from last meeting" },
  { path: "/panels/aan-inbox/card/:scenarioId", label: "Aan Inbox — focused card" },
  { path: "/panels/aan-inbox/details/:scenarioId", label: "Aan Inbox — execution artifact" },
  { path: "/panels/insights", label: "Insights panel" },
  { path: "/panels/notifications", label: "Alerts panel" },
];

export default function PanelIndex() {
  return (
    <div className="min-h-screen p-8 bg-background text-foreground">
      <h1 className="font-heading text-xl font-semibold mb-4">Panel routes</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Standalone URLs for every right-side panel state. Use these with html-to-figma to export designs.
      </p>
      <ul className="space-y-1.5">
        {PANEL_ROUTES.map((r) => (
          <li key={r.path}>
            <a href={r.path} className="text-primary hover:underline text-sm font-mono">{r.path}</a>
            <span className="text-xs text-muted-foreground ml-3">{r.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
