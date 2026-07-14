import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import { useViewport } from "@/contexts/ViewportContext";

export default function MobilePlaceholder() {
  const { setView } = useViewport();

  return (
    <div className="min-h-dvh flex items-center justify-center bg-background p-6">
      <div className="max-w-lg w-full rounded-lg border border-border bg-card p-8 space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Smartphone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-semibold text-foreground">Mobile view</h1>
            <p className="text-xs text-muted-foreground">Reserved — out of scope for now</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          The mobile variant is intentionally empty. The
          <code className="mx-1 px-1 py-0.5 rounded bg-muted text-xs">/mobile/*</code>
          route prefix is reserved so Figma links and routing land cleanly when work begins.
          Mobile may include feature and layout changes that tablet does not.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <Button asChild>
            <Link to="/profitability/dashboard" onClick={() => setView("desktop")}>
              Switch to Desktop
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/tablet" onClick={() => setView("tablet")}>
              Switch to Tablet
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
