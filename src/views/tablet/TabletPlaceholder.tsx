import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tablet } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

export default function TabletPlaceholder() {
  const { setView } = useViewport();

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background p-6">
      <div className="max-w-lg w-full rounded-lg border border-border bg-card p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Tablet className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground">Tablet view</h1>
            <p className="text-xs text-muted-foreground">Touch-optimized variant of Anarix</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          The tablet variant is being built in phases. Phase 1 (this scaffold) reserves the
          <code className="mx-1 px-1 py-0.5 rounded bg-muted text-xs">/tablet/*</code>
          route prefix and persists your view choice. Phase 2 introduces the touch-first shell,
          Aan FAB, and primitives. Subsequent phases roll out each module's tablet layout.
        </p>

        <div className="rounded-md border border-border bg-muted/30 p-3 space-y-1.5">
          <p className="text-xs font-medium text-foreground">Locked decisions</p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
            <li>44×44 min tap targets (48×48 for primary actions)</li>
            <li>No hover-only affordances — everything is persistently visible</li>
            <li>Long-press (500ms) tooltips; stylus retains native title hover</li>
            <li>Swipe-left row actions; swipe-right edge closes side panels</li>
            <li>Aan: tap + stylus hover + persistent bottom-right FAB</li>
            <li>Keyboard overlays via dvh + visualViewport; layout never shrinks</li>
            <li>Single responsive layout for portrait & landscape</li>
          </ul>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <Button asChild>
            <Link to="/profitability/dashboard" onClick={() => setView("desktop")}>
              Switch to Desktop
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/settings/appearance">Open Preferences</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
