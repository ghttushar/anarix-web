import { Button } from "@/components/ui/button";
import { WhatsAppLogo } from "./WhatsAppLogo";

interface Props {
  count: number;
  onConnect: () => void;
}

export function IntegrationCard({ count, onConnect }: Props) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-start gap-4">
      <div className="h-12 w-12 rounded-xl bg-success/10 flex items-center justify-center shrink-0">
        <WhatsAppLogo className="h-7 w-7" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-medium text-foreground">WhatsApp</h3>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground border border-border rounded px-1.5 py-0.5">
            Alerts
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Receive Anarix alerts and notifications on WhatsApp. Choose which services and accounts trigger messages.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Button size="sm" onClick={onConnect}>
            {count > 0 ? "Add another connection" : "Connect WhatsApp"}
          </Button>
          {count > 0 && (
            <span className="text-xs text-muted-foreground">
              {count} active {count === 1 ? "connection" : "connections"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
