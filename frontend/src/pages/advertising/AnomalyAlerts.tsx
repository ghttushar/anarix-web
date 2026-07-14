import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Bell, BellOff, TrendingUp, TrendingDown, AlertTriangle, CheckCircle } from "lucide-react";
import { mockAnomalyAlerts, type AnomalyAlert } from "@/data/mockAnomalyAlerts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const severityStyles: Record<string, string> = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  info: "border-l-primary bg-primary/5",
};

const severityBadge: Record<string, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  warning: "bg-warning/10 text-warning border-warning/20",
  info: "bg-primary/10 text-primary border-primary/20",
};


const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/anomaly-alerts" },
  { label: "Anomaly Alerts" },
];
export default function AnomalyAlerts() {
  const [alerts, setAlerts] = useState(mockAnomalyAlerts);
  const [showAcknowledged, setShowAcknowledged] = useState(false);

  const filtered = showAcknowledged ? alerts : alerts.filter((a) => !a.acknowledged);
  const unackCount = alerts.filter((a) => !a.acknowledged).length;

  const acknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)));
    toast.success("Alert acknowledged");
  };

  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, acknowledged: true })));
    toast.success("All alerts acknowledged");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Aan Anomaly Alerts"
          subtitle="Proactive AI-powered alerts when metrics deviate significantly from expected patterns"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowAcknowledged(!showAcknowledged)}>
                {showAcknowledged ? <BellOff className="mr-2 h-4 w-4" /> : <Bell className="mr-2 h-4 w-4" />}
                {showAcknowledged ? "Hide Acknowledged" : "Show All"}
              </Button>
              {unackCount > 0 && (
                <Button variant="outline" size="sm" onClick={acknowledgeAll}>
                  <CheckCircle className="mr-2 h-4 w-4" />Acknowledge All
                </Button>
              )}
            </div>
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Unacknowledged</p>
            <p className="text-xl font-semibold text-foreground">{unackCount}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Critical</p>
            <p className="text-xl font-semibold text-destructive">{alerts.filter((a) => a.severity === "critical").length}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Warnings</p>
            <p className="text-xl font-semibold text-warning">{alerts.filter((a) => a.severity === "warning").length}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Total Alerts (24h)</p>
            <p className="text-xl font-semibold text-foreground">{alerts.length}</p>
          </CardContent></Card>
        </div>

        {/* Alert List */}
        <div className="space-y-3">
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onAcknowledge={acknowledge} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium">No alerts to show</p>
              <p className="text-sm mt-1">All anomaly alerts have been acknowledged.</p>
            </div>
          )}
        </div>
      </div>
</AppLayout>
  );
}

function AlertCard({ alert, onAcknowledge }: { alert: AnomalyAlert; onAcknowledge: (id: string) => void }) {
  return (
    <div className={cn("rounded-lg border-l-4 border border-border p-4", severityStyles[alert.severity], alert.acknowledged && "opacity-60")}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-0.5">
            {alert.direction === "up" ? <TrendingUp className="h-5 w-5 text-destructive" /> : <TrendingDown className="h-5 w-5 text-warning" />}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground text-sm">{alert.metric} — {alert.campaign}</span>
              <Badge variant="outline" className={severityBadge[alert.severity]}>{alert.severity}</Badge>
              {alert.acknowledged && <Badge variant="outline" className="text-xs">Acknowledged</Badge>}
            </div>

            {/* Aan explanation */}
            <div className="rounded-md bg-primary/5 border border-primary/10 p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">Aan Analysis</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{alert.message}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Current: <strong className="text-foreground">{alert.currentValue}</strong></span>
              <span>Expected: <strong className="text-foreground">{alert.expectedValue}</strong></span>
              <span>Deviation: <strong className={alert.direction === "up" ? "text-destructive" : "text-warning"}>{alert.deviation > 0 ? "+" : ""}{alert.deviation}%</strong></span>
              <span>{formatDistanceToNow(alert.detectedAt, { addSuffix: true })}</span>
            </div>
          </div>
        </div>

        {!alert.acknowledged && (
          <Button variant="outline" size="sm" onClick={() => onAcknowledge(alert.id)}>
            <CheckCircle className="mr-1 h-3 w-3" />Acknowledge
          </Button>
        )}
      </div>
    </div>
  );
}
