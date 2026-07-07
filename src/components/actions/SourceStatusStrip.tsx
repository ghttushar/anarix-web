import { WifiOff, AlertTriangle } from "lucide-react";
import { anyDegraded } from "@/lib/decisions/sourceStatus";
import { getSourceMeta } from "@/lib/decisions/sourceRegistry";

/**
 * Slim strip at the top of Decide that surfaces any degraded source connections.
 * Hidden when everything is fresh.
 */
export function SourceStatusStrip() {
  const degraded = anyDegraded();
  if (degraded.length === 0) return null;

  return (
    <div className="rounded-md border border-border/70 bg-muted/30 px-3 py-1.5 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">
        <AlertTriangle className="h-3 w-3 text-amber-500" /> Source health
      </div>
      {degraded.map(({ source, health }) => {
        const meta = getSourceMeta(source);
        const Icon = meta.icon;
        const isOffline = health.status === "offline";
        return (
          <div
            key={source}
            className="flex items-center gap-1.5 text-[11px] rounded-full border border-border bg-card px-2 py-0.5"
            title={health.note}
          >
            {isOffline ? (
              <WifiOff className="h-3 w-3 text-destructive" />
            ) : (
              <Icon className="h-3 w-3 text-muted-foreground" />
            )}
            <span className="font-medium text-foreground/80">{meta.label}</span>
            <span className="text-muted-foreground">
              {isOffline ? "offline" : `last synced ${health.lastSyncedMinAgo}m ago`}
            </span>
          </div>
        );
      })}
      <span className="text-[10.5px] text-muted-foreground italic ml-auto">
        New items from degraded sources are held, not silently lost.
      </span>
    </div>
  );
}
