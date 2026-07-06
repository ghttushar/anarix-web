import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, AlertTriangle, Clock, Zap, Search, Check, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AlertType = "success" | "warning" | "info" | "action";
type Severity = "critical" | "warning" | "info";
type Status = "unread" | "acknowledged" | "snoozed";

interface AlertRow {
  id: string;
  type: AlertType;
  severity: Severity;
  source: "Automation" | "Budget" | "Inventory" | "Reports" | "Rules" | "COGS";
  title: string;
  description: string;
  timestamp: Date;
  status: Status;
  relatedRoute?: string;
}

const now = Date.now();
const MOCK_ALERTS: AlertRow[] = [
  { id: "a1", type: "warning", severity: "critical", source: "Budget", title: "Budget threshold reached", description: "Campaign 'SP | Bamboo Queen' spent 90% of daily budget by 2:00 PM.", timestamp: new Date(now - 30 * 60_000), status: "unread", relatedRoute: "/advertising/budget-pacing" },
  { id: "a2", type: "action", severity: "warning", source: "Rules", title: "Rule triggered: Pause Low ROAS", description: "3 keywords paused for ROAS below 1.5x threshold.", timestamp: new Date(now - 60 * 60_000), status: "unread", relatedRoute: "/advertising/rules/applied" },
  { id: "a3", type: "success", severity: "info", source: "Automation", title: "Schedule completed", description: "Day parting schedule 'Peak Hours Boost' executed for 12 campaigns.", timestamp: new Date(now - 10 * 60_000), status: "unread", relatedRoute: "/dayparting" },
  { id: "a4", type: "warning", severity: "critical", source: "Inventory", title: "Inventory alert", description: "5 products have less than 7 days of inventory remaining.", timestamp: new Date(now - 8 * 3600_000), status: "acknowledged", relatedRoute: "/catalog/inventory-ads" },
  { id: "a5", type: "info", source: "COGS", severity: "info", title: "COGS upload processed", description: "electronics_q1.csv processed. 47 products updated.", timestamp: new Date(now - 2 * 3600_000), status: "acknowledged" },
  { id: "a6", type: "success", severity: "info", source: "Reports", title: "Weekly report ready", description: "Weekly Performance Report for Jan 1–7 is ready to view.", timestamp: new Date(now - 4 * 3600_000), status: "acknowledged", relatedRoute: "/reports/client-portal" },
  { id: "a7", type: "action", severity: "warning", source: "Rules", title: "Bid adjustment applied", description: "Bulk +15% bid applied to 8 keywords in 'SP | Catch All Brand'.", timestamp: new Date(now - 12 * 3600_000), status: "acknowledged", relatedRoute: "/advertising/rules/applied" },
  { id: "a8", type: "warning", severity: "warning", source: "Inventory", title: "SKU MI-212 out of stock", description: "Sponsored campaigns automatically stopped serving.", timestamp: new Date(now - 26 * 3600_000), status: "acknowledged" },
];

const TYPE_META: Record<AlertType, { icon: any; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
  warning: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  info: { icon: Clock, color: "text-muted-foreground", bg: "bg-muted" },
  action: { icon: Zap, color: "text-primary", bg: "bg-primary/10" },
};

const SEVERITIES: { value: "all" | Severity; label: string }[] = [
  { value: "all", label: "All" },
  { value: "critical", label: "Critical" },
  { value: "warning", label: "Warning" },
  { value: "info", label: "Info" },
];
const SOURCES: AlertRow["source"][] = ["Automation", "Budget", "Inventory", "Reports", "Rules", "COGS"];
const STATUS_TABS: { value: "all" | Status; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "snoozed", label: "Snoozed" },
];

function timeAgo(d: Date): string {
  const diff = Date.now() - d.getTime();
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function dayGroup(d: Date): string {
  const day = new Date(d); day.setHours(0, 0, 0, 0);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - day.getTime()) / 86_400_000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return day.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRow[]>(MOCK_ALERTS);
  const [severity, setSeverity] = useState<"all" | Severity>("all");
  const [source, setSource] = useState<"all" | AlertRow["source"]>("all");
  const [status, setStatus] = useState<"all" | Status>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (severity !== "all" && a.severity !== severity) return false;
      if (source !== "all" && a.source !== source) return false;
      if (status !== "all" && a.status !== status) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!a.title.toLowerCase().includes(q) && !a.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [alerts, severity, source, status, query]);

  const groups = useMemo(() => {
    const map = new Map<string, AlertRow[]>();
    for (const a of filtered) {
      const g = dayGroup(a.timestamp);
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(a);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const unreadCount = alerts.filter((a) => a.status === "unread").length;

  const acknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "acknowledged" } : a)));
    toast.success("Alert acknowledged");
  };
  const snooze = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status: "snoozed" } : a)));
    toast.info("Snoozed for 4 hours");
  };
  const acknowledgeAll = () => {
    setAlerts((prev) => prev.map((a) => (a.status === "unread" ? { ...a, status: "acknowledged" } : a)));
    toast.success("All unread alerts acknowledged");
  };

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Alerts" }]} />
      <div className="p-6 max-w-[1400px] mx-auto">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">System</div>
              <h1 className="font-heading text-2xl font-semibold text-foreground">Alerts</h1>
              <p className="text-[13px] text-muted-foreground mt-1">
                {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up"} · {alerts.length} total
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={acknowledgeAll} disabled={unreadCount === 0}>
              <Check className="h-3.5 w-3.5 mr-1.5" /> Acknowledge all
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-[240px_1fr] gap-6">
          {/* Filter rail */}
          <aside className="space-y-5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search alerts"
                className="w-full h-9 pl-8 pr-3 text-sm rounded-md border border-border bg-card focus:outline-none focus:border-primary"
              />
            </div>

            <FilterGroup label="Status">
              {STATUS_TABS.map((s) => (
                <FilterPill key={s.value} active={status === s.value} onClick={() => setStatus(s.value)}>
                  {s.label}
                  {s.value === "unread" && unreadCount > 0 && (
                    <span className="ml-1.5 text-[9px] font-bold text-primary">{unreadCount}</span>
                  )}
                </FilterPill>
              ))}
            </FilterGroup>

            <FilterGroup label="Severity">
              {SEVERITIES.map((s) => (
                <FilterPill key={s.value} active={severity === s.value} onClick={() => setSeverity(s.value)}>
                  {s.label}
                </FilterPill>
              ))}
            </FilterGroup>

            <FilterGroup label="Source">
              <FilterPill active={source === "all"} onClick={() => setSource("all")}>All</FilterPill>
              {SOURCES.map((s) => (
                <FilterPill key={s} active={source === s} onClick={() => setSource(s)}>{s}</FilterPill>
              ))}
            </FilterGroup>
          </aside>

          {/* Alerts list */}
          <div className="bg-card rounded-lg border border-border min-w-0">
            <ScrollArea className="h-[calc(100vh-240px)]">
              {groups.length === 0 ? (
                <div className="p-12 text-center text-sm text-muted-foreground">No alerts match the current filters.</div>
              ) : (
                <div className="divide-y divide-border">
                  {groups.map(([day, rows]) => (
                    <div key={day}>
                      <div className="px-4 py-2 bg-muted/30 text-[10px] uppercase tracking-wider font-semibold text-muted-foreground sticky top-0 z-10">
                        {day} · {rows.length}
                      </div>
                      <ul className="divide-y divide-border/50">
                        {rows.map((a) => {
                          const meta = TYPE_META[a.type];
                          const Icon = meta.icon;
                          const isUnread = a.status === "unread";
                          return (
                            <li key={a.id} className={cn("group px-4 py-3 hover:bg-muted/30 transition-colors", isUnread && "bg-primary/[0.02]")}>
                              <div className="flex items-start gap-3">
                                <div className={cn("mt-0.5 rounded-full p-1.5 shrink-0", meta.bg)}>
                                  <Icon className={cn("h-3.5 w-3.5", meta.color)} />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[13px] font-medium text-foreground">{a.title}</span>
                                    <span className={cn(
                                      "text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded",
                                      a.severity === "critical" && "bg-destructive/10 text-destructive",
                                      a.severity === "warning" && "bg-warning/10 text-warning",
                                      a.severity === "info" && "bg-muted text-muted-foreground",
                                    )}>{a.severity}</span>
                                    <span className="text-[10px] text-muted-foreground">· {a.source}</span>
                                    {isUnread && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                                  </div>
                                  <p className="mt-0.5 text-[12px] text-muted-foreground leading-relaxed">{a.description}</p>
                                  <div className="mt-1 text-[10px] text-muted-foreground/70">{timeAgo(a.timestamp)}</div>
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                  {a.status !== "acknowledged" && (
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => acknowledge(a.id)}>
                                      <Check className="h-3 w-3 mr-1" /> Ack
                                    </Button>
                                  )}
                                  {a.status !== "snoozed" && (
                                    <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px]" onClick={() => snooze(a.id)}>
                                      <Archive className="h-3 w-3 mr-1" /> Snooze
                                    </Button>
                                  )}
                                  {a.relatedRoute && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 px-2 text-[11px] text-primary"
                                      onClick={() => (window.location.href = a.relatedRoute!)}
                                    >
                                      Open →
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2 px-1">{label}</div>
      <div className="flex flex-wrap gap-1">{children}</div>
    </div>
  );
}

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "text-[11px] px-2.5 py-1 rounded-md border transition-colors",
        active
          ? "bg-primary/10 border-primary/30 text-primary font-medium"
          : "bg-card border-border text-foreground hover:bg-muted"
      )}
    >
      {children}
    </button>
  );
}
