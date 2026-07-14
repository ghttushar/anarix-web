import { Link } from "react-router-dom";
import { Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppLayout } from "@/components/layout/AppLayout";

/**
 * Mobile is a strict view-only companion. Routes that exist solely to
 * create, edit, connect, or configure render this blocker instead.
 */
export function MobileBlockedRoute({
  title = "Open on desktop",
  description = "This action isn't available on mobile. Sign in on a desktop browser to make changes.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center min-h-[60vh]">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Monitor className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-lg font-semibold text-foreground mb-2">{title}</h1>
        <p className="text-sm text-muted-foreground max-w-xs mb-6">{description}</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/profitability/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </AppLayout>
  );
}

export default MobileBlockedRoute;
