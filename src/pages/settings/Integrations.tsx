import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useIntegrations } from "@/contexts/IntegrationsContext";
import { IntegrationCard } from "@/components/integrations/IntegrationCard";
import { ConnectionRow } from "@/components/integrations/ConnectionRow";
import { WhatsAppPurposeInfo } from "@/components/integrations/WhatsAppPurposeInfo";
import { IntegrationWhatsAppFlow } from "./IntegrationWhatsApp";
import { toast } from "sonner";

const breadcrumbItems = [
  { label: "Settings", href: "/settings/integrations" },
  { label: "Integrations" },
];

export default function Integrations() {
  const { integrations, removeIntegration, toggleEnabled } = useIntegrations();
  const [flowOpen, setFlowOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  const openCreate = () => {
    setEditId(null);
    setFlowOpen(true);
  };

  const openEdit = (id: string) => {
    setEditId(id);
    setFlowOpen(true);
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      removeIntegration(pendingDelete);
      toast.success("Integration removed");
      setPendingDelete(null);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-5xl">
        <PageBreadcrumb items={breadcrumbItems} />

        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">
            Send Anarix alerts to the channels you actually check.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-sm font-medium text-foreground">Available integrations</h2>
          <IntegrationCard count={integrations.length} onConnect={openCreate} />
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-foreground">Your connections</h2>
            {integrations.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {integrations.length} {integrations.length === 1 ? "connection" : "connections"}
              </span>
            )}
          </div>

          {integrations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card/50 p-8 text-center">
              <p className="text-sm font-medium text-foreground">No integrations yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
                Connect WhatsApp to receive operational alerts — ACoS spikes, stockouts, rule triggers — for the
                accounts and services you care about.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {integrations.map((it) => (
                <ConnectionRow
                  key={it.id}
                  integration={it}
                  onToggle={() => {
                    toggleEnabled(it.id);
                    toast.success(it.enabled ? "Alerts paused" : "Alerts resumed");
                  }}
                  onEdit={() => openEdit(it.id)}
                  onDelete={() => setPendingDelete(it.id)}
                />
              ))}
            </div>
          )}
        </section>

        <section className="pt-2">
          <WhatsAppPurposeInfo />
        </section>
      </div>

      <IntegrationWhatsAppFlow
        open={flowOpen}
        onOpenChange={setFlowOpen}
        editId={editId}
      />

      <AlertDialog open={!!pendingDelete} onOpenChange={(o) => !o && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove WhatsApp integration?</AlertDialogTitle>
            <AlertDialogDescription>
              This number will stop receiving Anarix alerts. You can reconnect it anytime.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
