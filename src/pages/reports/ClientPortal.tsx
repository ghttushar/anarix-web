import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Send, FileText, Calendar, Download, Eye } from "lucide-react";
import { mockClientReports } from "@/data/mockClientReports";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SortableTableHead, usePinning, sortData, getSortHandler } from "@/components/tables/SortableTableHead";
import { TablePagination } from "@/components/tables/TablePagination";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { CreateReportPanel } from "@/components/panels/CreateReportPanel";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileCard, MobileCardList } from "@/views/mobile/MobileCardList";

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground border-muted",
  generated: "bg-primary/10 text-primary border-primary/20",
  sent: "bg-success/10 text-success border-success/20",
  scheduled: "bg-warning/10 text-warning border-warning/20",
};

const REPORT_TEMPLATES = [
  { id: "performance", label: "Performance", desc: "Campaign metrics, ROAS, conversions", icon: "📊" },
  { id: "pnl", label: "P&L", desc: "Revenue, costs, profit margins", icon: "💰" },
  { id: "advertising", label: "Advertising", desc: "Ad spend, targeting, search terms", icon: "📢" },
  { id: "custom", label: "Custom", desc: "Build your own report", icon: "🛠" },
];

const PINNABLE_FIELDS = ["name", "clientName", "period", "status", "sections", "scheduleCron"];
const SORTABLE_FIELDS = [
  { id: "name", label: "Report Name" },
  { id: "clientName", label: "Client" },
  { id: "status", label: "Status" },
  { id: "period", label: "Period" },
];

const breadcrumbItems = [
  { label: "Reports" },
];

export default function ClientPortal() {
  const [reports, setReports] = useState(mockClientReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("performance");
  const { view } = useViewport();
  const isMobile = view === "mobile";


  const { setDataPanel } = useActivePanel();

  // Sort / pin / pagination
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE_FIELDS, 240);
  const handleSort = getSortHandler(sortField, setSortField, sortDirection, setSortDirection);

  const sentCount = reports.filter((r) => r.status === "sent").length;
  const scheduledCount = reports.filter((r) => r.status === "scheduled").length;
  const uniqueClients = new Set(reports.map((r) => r.clientName)).size;

  const filteredReports = reports.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = sortData(filteredReports, sortField, sortDirection);
  const paginatedReports = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleOpenCreate = (template?: string) => {
    if (template) setSelectedTemplate(template);
    setDataPanel("createReport");
  };

  const handleReportSubmit = (data: { name: string; clientName: string; period: string; template: string; sections: string[]; schedule: string | null }) => {
    const newReport = {
      id: `report-${Date.now()}`,
      name: data.name,
      clientName: data.clientName,
      period: data.period,
      status: (data.schedule ? "scheduled" : "draft") as "draft" | "scheduled",
      sections: data.sections,
      scheduleCron: data.schedule ?? undefined,
    };
    setReports(prev => [newReport, ...prev]);
  };

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <AppLayout>
      <div className="space-y-6 min-w-0">
        <PageHeader
          title="Reports"
          subtitle="Generate, schedule, and share branded reports"
          actions={
            <Button data-write-action size="sm" onClick={() => handleOpenCreate()}>
              <Plus className="mr-2 h-4 w-4" />Create Report
            </Button>
          }
        />

        <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing reports...")} breadcrumbItems={breadcrumbItems} />

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Total Reports</p>
            <p className="text-xl font-semibold text-foreground">{reports.length}</p>
          </CardContent></Card>
          <Card className="bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Clients</p>
            <p className="text-xl font-semibold text-foreground">{uniqueClients}</p>
          </CardContent></Card>
          <Card className="bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Sent</p>
            <p className="text-xl font-semibold text-success">{sentCount}</p>
          </CardContent></Card>
          <Card className="bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-[10px] text-muted-foreground uppercase font-medium mb-1">Scheduled</p>
            <p className="text-xl font-semibold text-warning">{scheduledCount}</p>
          </CardContent></Card>
        </div>

        {/* Template Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">Quick Create</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {REPORT_TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => handleOpenCreate(t.id)}
                className="rounded-lg border border-border bg-card p-4 text-left hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer"
              >
                <div className="text-lg mb-1.5">{t.icon}</div>
                <p className="text-sm font-medium text-foreground">{t.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Reports Table */}
        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search reports..."
          onDownload={() => toast.success("Exporting reports...")}
          showDeltas={showDeltas}
          onShowDeltasChange={setShowDeltas}
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
        />

        {isMobile ? (
          <MobileCardList>
            {paginatedReports.map((report) => (
              <MobileCard
                key={report.id}
                title={<span className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground shrink-0" />{report.name}</span>}
                meta={`${report.clientName} • ${report.period}`}
                kpis={[
                  { label: "Status", value: <Badge variant="outline" className={statusStyles[report.status]}>{report.status}</Badge> },
                  { label: "Sections", value: report.sections.length },
                ]}
              />
            ))}
            {paginatedReports.length === 0 && (
              <div className="text-center py-10 text-sm text-muted-foreground">No reports found</div>
            )}
          </MobileCardList>
        ) : (
        <div className="rounded-lg border border-border bg-card overflow-auto">
          <Table>
            <TableHeader>
              <tr className="bg-muted/30 hover:bg-muted/30">
                <SortableTableHead field="name" isFixed className="min-w-[240px]" {...sp}>Report Name</SortableTableHead>
                <SortableTableHead field="clientName" {...sp} style={ps("clientName")} className={cn(pc("clientName", true))}>Client</SortableTableHead>
                <SortableTableHead field="period" {...sp} style={ps("period")} className={cn(pc("period", true))}>Period</SortableTableHead>
                <SortableTableHead field="status" align="center" {...sp} style={ps("status")} className={cn(pc("status", true))}>Status</SortableTableHead>
                <SortableTableHead field="sections" {...sp} style={ps("sections")} className={cn(pc("sections", true))}>Sections</SortableTableHead>
                <SortableTableHead field="scheduleCron" {...sp} style={ps("scheduleCron")} className={cn(pc("scheduleCron", true))}>Schedule</SortableTableHead>
                <SortableTableHead field="actions" isFixed align="center" sortField={null} sortDirection="asc" onSort={undefined} pinnedColumns={pinnedColumns} onPinToggle={undefined}>Actions</SortableTableHead>
              </tr>
            </TableHeader>
            <TableBody>
              {paginatedReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      {report.name}
                    </div>
                  </TableCell>
                  <TableCell style={ps("clientName")} className={cn("text-muted-foreground", pc("clientName"))}>{report.clientName}</TableCell>
                  <TableCell style={ps("period")} className={cn("text-muted-foreground", pc("period"))}>{report.period}</TableCell>
                  <TableCell style={ps("status")} className={cn("text-center", pc("status"))}>
                    <Badge variant="outline" className={statusStyles[report.status]}>{report.status}</Badge>
                  </TableCell>
                  <TableCell style={ps("sections")} className={cn(pc("sections"))}>
                    <span className="text-xs text-muted-foreground">{report.sections.length} sections</span>
                  </TableCell>
                  <TableCell style={ps("scheduleCron")} className={cn(pc("scheduleCron"))}>
                    {report.scheduleCron ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />{report.scheduleCron}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info("Opening report preview...")}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success("Downloading PDF...")}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      {report.status !== "sent" && (
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success(`Report sent to ${report.clientName}`)}>
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            page={currentPage}
            pageSize={pageSize}
            totalItems={filteredReports.length}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
        )}
</div>

      <CreateReportPanel initialTemplate={selectedTemplate} onSubmit={handleReportSubmit} />
    </AppLayout>
  );
}
