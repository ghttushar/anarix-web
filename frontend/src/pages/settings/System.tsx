import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Eye, EyeOff, Copy, Search } from "lucide-react";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const mockLogs = [
  { id: "l1", timestamp: "2025-12-02 09:15:32", user: "John Smith", action: "Login", module: "Auth", details: "Successful login from 192.168.1.1" },
  { id: "l2", timestamp: "2025-12-02 09:18:45", user: "John Smith", action: "Campaign Updated", module: "Advertising", details: "Budget changed from $50 to $75 for 'Brand SP'" },
  { id: "l3", timestamp: "2025-12-02 09:22:10", user: "Sarah Johnson", action: "Report Generated", module: "Reports", details: "Weekly Performance Report exported" },
  { id: "l4", timestamp: "2025-12-01 16:42:00", user: "Sarah Johnson", action: "Rule Created", module: "Advertising", details: "Auto-bid rule 'ROAS Target 4x' created" },
  { id: "l5", timestamp: "2025-12-01 14:30:15", user: "John Smith", action: "User Invited", module: "Settings", details: "Invitation sent to alex@partner.com" },
  { id: "l6", timestamp: "2025-12-01 11:05:33", user: "Mike Chen", action: "Query Executed", module: "AMC", details: "Ran 'New-to-Brand Customers' query" },
  { id: "l7", timestamp: "2025-11-30 09:00:00", user: "System", action: "Data Sync", module: "System", details: "Amazon SP data sync completed (245 campaigns)" },
  { id: "l8", timestamp: "2025-11-29 15:20:00", user: "Emily Davis", action: "Account Connected", module: "Settings", details: "Walmart account 'Brand Store' connected" },
];

const moduleColors: Record<string, string> = {
  Auth: "bg-muted text-muted-foreground",
  Advertising: "bg-primary/10 text-primary",
  Reports: "bg-accent/20 text-accent-foreground",
  Settings: "bg-muted text-muted-foreground",
  AMC: "bg-warning/10 text-warning",
  System: "bg-success/10 text-success",
};


const breadcrumbItems = [
  { label: "Settings", href: "/settings/system" },
  { label: "System" },
];
export default function System() {
  const [defaultMarketplace, setDefaultMarketplace] = useState("amazon");
  const [defaultDateRange, setDefaultDateRange] = useState("last30");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [logSearch, setLogSearch] = useState("");
  const apiKey = "ak_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const handleSave = () => toast.success("Configuration saved");

  const filteredLogs = mockLogs.filter(l =>
    !logSearch ||
    l.user.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.action.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.module.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.details.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl space-y-8">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">System</h1>
          <p className="text-sm text-muted-foreground">Defaults, notifications, API keys, and activity logs</p>
        </div>
        <Separator />

        {/* Defaults */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-medium text-foreground">Defaults</h2>
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-foreground">Default Marketplace</p><p className="text-xs text-muted-foreground">Applied when opening the app</p></div>
              <Select value={defaultMarketplace} onValueChange={setDefaultMarketplace}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="amazon">Amazon</SelectItem>
                  <SelectItem value="walmart">Walmart</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-foreground">Default Date Range</p><p className="text-xs text-muted-foreground">Initial date range for dashboards</p></div>
              <Select value={defaultDateRange} onValueChange={setDefaultDateRange}>
                <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="last7">Last 7 Days</SelectItem>
                  <SelectItem value="last30">Last 30 Days</SelectItem>
                  <SelectItem value="last90">Last 90 Days</SelectItem>
                  <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <Separator />

        {/* Notifications */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-medium text-foreground">Notifications</h2>
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-foreground">Email Notifications</p><p className="text-xs text-muted-foreground">Receive alerts via email</p></div>
              <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div><p className="font-medium text-foreground">Slack Notifications</p><p className="text-xs text-muted-foreground">Send alerts to Slack channel</p></div>
              <Switch checked={slackNotifs} onCheckedChange={setSlackNotifs} />
            </div>
          </div>
        </section>

        <Separator />

        {/* API Keys */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-medium text-foreground">API Keys</h2>
          <div className="rounded-lg border border-border bg-card p-4 space-y-3">
            <p className="text-sm text-muted-foreground">Use this key to access the Anarix API programmatically.</p>
            <div className="flex gap-2">
              <Input readOnly value={showApiKey ? apiKey : "ak_live_••••••••••••••••••••••••••••"} className="font-mono text-sm" />
              <Button variant="outline" size="icon" onClick={() => setShowApiKey(!showApiKey)} title={showApiKey ? "Hide API key" : "Show API key"}>
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(apiKey); toast.success("API key copied"); }} title="Copy API key">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <div className="flex justify-end"><Button onClick={handleSave}>Save Configuration</Button></div>

        <Separator />

        {/* Activity Logs */}
        <section className="space-y-4">
          <h2 className="font-heading text-lg font-medium text-foreground">Activity Logs</h2>
          <p className="text-sm text-muted-foreground">Audit trail of all actions performed in the system</p>
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter logs..." value={logSearch} onChange={e => setLogSearch(e.target.value)} className="pl-9" />
          </div>
          <div className="rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map(l => (
                  <TableRow key={l.id}>
                    <TableCell className="text-muted-foreground font-mono text-xs">{l.timestamp}</TableCell>
                    <TableCell className="font-medium">{l.user}</TableCell>
                    <TableCell>{l.action}</TableCell>
                    <TableCell><Badge className={moduleColors[l.module] || "bg-muted text-muted-foreground"}>{l.module}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-[300px] truncate">{l.details}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
</AppLayout>
  );
}
