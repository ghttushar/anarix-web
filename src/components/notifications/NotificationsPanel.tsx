import { X, Bell, CheckCircle2, AlertTriangle, Clock, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "success" | "warning" | "info" | "action";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: "n1", type: "success", title: "Schedule completed", description: "Day parting schedule 'Peak Hours Boost' executed successfully for 12 campaigns.", timestamp: new Date(Date.now() - 600000), read: false },
  { id: "n2", type: "warning", title: "Budget threshold reached", description: "Campaign 'SP | Bamboo Queen' has spent 90% of daily budget by 2:00 PM.", timestamp: new Date(Date.now() - 1800000), read: false },
  { id: "n3", type: "action", title: "Rule triggered: Pause Low ROAS", description: "Automation rule paused 3 keywords with ROAS below 1.5x threshold.", timestamp: new Date(Date.now() - 3600000), read: false },
  { id: "n4", type: "info", title: "COGS upload processed", description: "Your COGS file (electronics_q1.csv) has been processed. 47 products updated.", timestamp: new Date(Date.now() - 7200000), read: true },
  { id: "n5", type: "success", title: "Report generated", description: "Weekly Performance Report for Jan 1-7 is ready to view.", timestamp: new Date(Date.now() - 14400000), read: true },
  { id: "n6", type: "warning", title: "Inventory alert", description: "5 products have less than 7 days of inventory remaining.", timestamp: new Date(Date.now() - 28800000), read: true },
  { id: "n7", type: "action", title: "Bid adjustment applied", description: "Bulk bid increase of 15% applied to 8 keywords in 'SP | Catch All Brand'.", timestamp: new Date(Date.now() - 43200000), read: true },
];

const typeConfig = {
  success: { icon: CheckCircle2, colorClass: "text-success", bgClass: "bg-success/10" },
  warning: { icon: AlertTriangle, colorClass: "text-warning", bgClass: "bg-warning/10" },
  info: { icon: Clock, colorClass: "text-muted-foreground", bgClass: "bg-muted" },
  action: { icon: Zap, colorClass: "text-primary", bgClass: "bg-primary/10" },
};

function formatTimeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function NotificationsPanel() {
  const { dataPanel, closeDataPanel } = useActivePanel();
  if (dataPanel !== "notifications") return null;

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  return (
    <div data-app-panel="notifications" className="flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-background">
      <div className="border-b border-border shrink-0">
        <div className="flex items-center justify-between px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Bell className="h-3.5 w-3.5 text-primary" />
            </div>
            <div>
              <h2 className="font-heading text-sm font-semibold text-foreground">Notifications</h2>
              <p className="text-[10px] text-muted-foreground">{unreadCount} unread</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={closeDataPanel} className="h-7 w-7" title="Close notifications">
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2 space-y-1">
          {mockNotifications.map((notification) => {
            const config = typeConfig[notification.type];
            const Icon = config.icon;
            return (
              <div
                key={notification.id}
                className={cn(
                  "rounded-lg p-3 transition-colors hover:bg-muted/50 cursor-pointer",
                  !notification.read && "bg-primary/5 border border-primary/10"
                )}
              >
                <div className="flex items-start gap-2.5">
                  <div className={cn("mt-0.5 rounded-full p-1.5 shrink-0", config.bgClass)}>
                    <Icon className={cn("h-3.5 w-3.5", config.colorClass)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-medium text-xs text-foreground leading-tight line-clamp-1">{notification.title}</h4>
                      {!notification.read && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                    </div>
                    <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed line-clamp-2">{notification.description}</p>
                    <span className="mt-1 text-[10px] text-muted-foreground/60">{formatTimeAgo(notification.timestamp)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
