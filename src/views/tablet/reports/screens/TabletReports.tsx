import { useState } from "react";
import { FileText, Plus, Send, Download, Eye, Calendar, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TabletDataTable } from "../../data/TabletDataTable";
import { TabletTableToolbar } from "../../data/TabletTableToolbar";
import type { TabletColumn } from "../../data/types";
import { TabletKpiBand } from "../../advertising/kpi/TabletKpiBand";
import { TabletRightPanel } from "../../shell/TabletRightPanel";
import { TouchTarget } from "../../primitives/TouchTarget";
import { mockClientReports, type ClientReport } from "@/data/mockClientReports";

const TEMPLATES = [
  { id: "performance", label: "Performance", desc: "Campaign metrics, ROAS, conversions", icon: "📊" },
  { id: "pnl", label: "P&L", desc: "Revenue, costs, profit margins", icon: "💰" },
  { id: "advertising", label: "Advertising", desc: "Ad spend, targeting, search terms", icon: "📢" },
  { id: "custom", label: "Custom", desc: "Build your own report", icon: "🛠" },
];

const statusBadge: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  generated: "bg-primary/10 text-primary",
  sent: "bg-emerald-100 text-emerald-700",
  scheduled: "bg-amber-100 text-amber-700",
};

export function TabletReports() {
  const [reports, setReports] = useState<ClientReport[]>(mockClientReports);
  const [panelOpen, setPanelOpen] = useState(false);
  const [template, setTemplate] = useState("performance");
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [period, setPeriod] = useState("");
  const [schedule, setSchedule] = useState("none");

  const sentCount = reports.filter((r) => r.status === "sent").length;
  const scheduledCount = reports.filter((r) => r.status === "scheduled").length;
  const uniqueClients = new Set(reports.map((r) => r.clientName)).size;

  const openCreate = (tplId?: string) => {
    if (tplId) setTemplate(tplId);
    setPanelOpen(true);
  };

  const handleCreate = () => {
    if (!name || !client) {
      toast.error("Name and client are required");
      return;
    }
    const newReport: ClientReport = {
      id: `report-${Date.now()}`,
      name,
      clientName: client,
      period: period || "Custom",
      status: schedule !== "none" ? "scheduled" : "draft",
      sections: ["Executive Summary", "Performance", "Recommendations"],
      scheduleCron: schedule !== "none" ? schedule : undefined,
    };
    setReports((prev) => [newReport, ...prev]);
    setPanelOpen(false);
    setName(""); setClient(""); setPeriod(""); setSchedule("none");
    toast.success("Report created");
  };

  const cols: TabletColumn<ClientReport>[] = [
    {
      id: "name", header: "Report Name", sticky: true, sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2 min-w-[200px]">
          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
          <span className="font-medium">{r.name}</span>
        </div>
      ),
    },
    { id: "client", header: "Client", sortable: true, cell: (r) => r.clientName },
    { id: "period", header: "Period", cell: (r) => r.period },
    {
      id: "status", header: "Status",
      cell: (r) => (
        <span className={`text-xs rounded px-2 py-1 ${statusBadge[r.status]}`}>{r.status}</span>
      ),
    },
    {
      id: "sections", header: "Sections", align: "right",
      cell: (r) => <span className="text-muted-foreground">{r.sections.length}</span>,
    },
    {
      id: "schedule", header: "Schedule",
      cell: (r) => r.scheduleCron ? (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" /> {r.scheduleCron}
        </div>
      ) : <span className="text-muted-foreground">—</span>,
    },
    {
      id: "actions", header: "Actions",
      cell: (r) => (
        <div className="flex gap-1">
          <TouchTarget aria-label="Preview" className="h-10 w-10" onClick={() => toast.info("Opening preview…")}>
            <Eye className="h-4 w-4" />
          </TouchTarget>
          <TouchTarget aria-label="Download" className="h-10 w-10" onClick={() => toast.success("Downloading PDF…")}>
            <Download className="h-4 w-4" />
          </TouchTarget>
          {r.status !== "sent" && (
            <TouchTarget aria-label="Send" className="h-10 w-10" onClick={() => toast.success(`Sent to ${r.clientName}`)}>
              <Send className="h-4 w-4" />
            </TouchTarget>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col h-full p-3 gap-3 min-w-0">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Reports</h1>
        <Button className="h-12" onClick={() => openCreate()}>
          <Plus className="h-4 w-4 mr-2" /> Create Report
        </Button>
      </div>

      <TabletKpiBand
        items={[
          { label: "Total", value: String(reports.length) },
          { label: "Clients", value: String(uniqueClients) },
          { label: "Sent", value: String(sentCount) },
          { label: "Scheduled", value: String(scheduledCount) },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => openCreate(t.id)}
            className="text-left rounded-md border border-border bg-card p-3 min-h-[88px] active:bg-muted"
          >
            <div className="text-lg mb-1">{t.icon}</div>
            <div className="text-sm font-medium">{t.label}</div>
            <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{t.desc}</div>
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0">
        <TabletDataTable
          rows={reports}
          columns={cols}
          rowKey={(r) => r.id}
          toolbar={<TabletTableToolbar title="All Reports" />}
        />
      </div>

      <TabletRightPanel open={panelOpen} onClose={() => setPanelOpen(false)} title="Create Report" width={440}>
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Template</label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TEMPLATES.map((t) => (
                    <SelectItem key={t.id} value={t.id}>{t.icon} {t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Report Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Monthly Performance" className="h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Client</label>
              <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Client name" className="h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Period</label>
              <Input value={period} onChange={(e) => setPeriod(e.target.value)} placeholder="e.g. March 2026" className="h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Schedule</label>
              <Select value={schedule} onValueChange={setSchedule}>
                <SelectTrigger className="h-12"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">One-time (no schedule)</SelectItem>
                  <SelectItem value="Every Monday at 9 AM">Weekly — Monday 9 AM</SelectItem>
                  <SelectItem value="1st of every month">Monthly — 1st</SelectItem>
                  <SelectItem value="First Monday of quarter">Quarterly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
              Drafts are not sent automatically. You can preview and confirm before sending to the client.
            </div>
          </div>
          <div className="border-t border-border p-3 flex gap-2">
            <Button variant="outline" className="flex-1 h-12" onClick={() => setPanelOpen(false)}>
              <X className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button className="flex-1 h-12" onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </TabletRightPanel>
    </div>
  );
}
