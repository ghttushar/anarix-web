import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { HourlyHeatmap } from "@/components/dayparting/HourlyHeatmap";
import { HistoryTable } from "@/components/dayparting/HistoryTable";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { CreateSchedulePanel } from "@/components/panels/CreateSchedulePanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Calendar, Plus, Pause, Play, Trash2 } from "lucide-react";
import { hourlyData, calculateHourlySummary, dayPartingCampaigns, schedules as initialSchedules, executionHistory } from "@/data/mockDayParting";
import { MetricType, DayPartingSchedule } from "@/types/dayparting";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useFilter } from "@/contexts/FilterContext";
import { SortableTableHead, usePinning, sortData, getSortHandler } from "@/components/tables/SortableTableHead";
import { TablePagination } from "@/components/tables/TablePagination";
import { format } from "date-fns";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileCard, MobileCardList } from "@/views/mobile/MobileCardList";

const AVAILABLE_METRICS = [
  { key: "spend", label: "Spend", format: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
  { key: "revenue", label: "Revenue", format: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
  { key: "roas", label: "ROAS", format: (v: number) => `${v.toFixed(2)}x` },
  { key: "acos", label: "ACOS", format: (v: number) => `${v.toFixed(1)}%` },
  { key: "orders", label: "Orders", format: (v: number) => v.toString() },
  { key: "units", label: "Units", format: (v: number) => v.toString() },
  { key: "clicks", label: "Clicks", format: (v: number) => v.toLocaleString() },
  { key: "impressions", label: "Impressions", format: (v: number) => v.toLocaleString() },
  { key: "ctr", label: "CTR", format: (v: number) => `${v.toFixed(2)}%` },
  { key: "cpc", label: "CPC", format: (v: number) => `$${v.toFixed(2)}` },
  { key: "cvr", label: "CVR", format: (v: number) => `${v.toFixed(2)}%` },
  { key: "adSales", label: "Ad Sales", format: (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2 })}` },
];

const METRIC_VALUES: Record<string, number> = {
  spend: 0, revenue: 0, roas: 0, acos: 0, orders: 0, units: 0,
  clicks: 12450, impressions: 345000, ctr: 3.61, cpc: 0.82, cvr: 4.2, adSales: 0,
};

const PINNABLE_FIELDS = ["name", "status", "budget", "spend", "revenue", "roas", "action", "nextRun"];

const ACTION_LABELS: Record<string, string> = {
  pause: "Pause",
  reduce_budget: "Reduce Budget",
  increase_budget: "Increase Budget",
};

const breadcrumbItems = [{ label: "Day Parting" }];

export default function HourlyData() {
  const { adType, setAdType } = useFilter();
  const { setDataPanel } = useActivePanel();
  const location = useLocation();
  const nav = useNavigate();
  const initialTab = location.pathname === "/dayparting/history" ? "history" : "dayparting";
  const [activeTab, setActiveTab] = useState(initialTab);
  
  useEffect(() => {
    const tab = location.pathname === "/dayparting/history" ? "history" : "dayparting";
    setActiveTab(tab);
  }, [location.pathname]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>(["camp-1"]);
  const [metric, setMetric] = useState<MetricType>("roas");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);
  const [boxMetrics, setBoxMetrics] = useState<string[]>(["spend", "revenue", "roas", "acos", "orders", "units"]);

  // Table sort/pin
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE_FIELDS, 300);
  const handleSort = getSortHandler(sortField, setSortField, sortDirection, setSortDirection);

  // Schedules state
  const [schedules, setSchedules] = useState<DayPartingSchedule[]>(initialSchedules);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);

  // History state
  const [historySearch, setHistorySearch] = useState("");
  const [historyStatusFilter, setHistoryStatusFilter] = useState("all");

  const summary = calculateHourlySummary(hourlyData);
  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  const getMetricValue = (key: string): number => {
    const map: Record<string, number> = {
      spend: summary.totalSpend, revenue: summary.totalRevenue,
      roas: summary.avgRoas, acos: summary.avgAcos,
      orders: summary.totalOrders, units: summary.totalUnits,
      ...METRIC_VALUES,
    };
    map.adSales = summary.totalRevenue;
    return map[key] ?? 0;
  };

  const handleBoxMetricChange = (index: number, newMetric: string) => {
    setBoxMetrics(prev => { const next = [...prev]; next[index] = newMetric; return next; });
  };

  // Build unified rows: each campaign merged with its schedule info
  type UnifiedRow = {
    id: string;
    name: string;
    status: string;
    budget: number;
    spend: number;
    revenue: number;
    roas: number;
    action: string;
    scheduleStatus: string;
    nextRun: string;
    scheduleId: string | null;
  };

  const unifiedRows: UnifiedRow[] = dayPartingCampaigns.map((campaign) => {
    const campSchedules = schedules.filter((s) => s.campaignIds.includes(campaign.id));
    const activeSchedule = campSchedules.find((s) => s.status === "active") || campSchedules[0];
    return {
      id: campaign.id,
      name: campaign.name,
      status: campaign.status,
      budget: campaign.budget,
      spend: campaign.spend,
      revenue: campaign.revenue,
      roas: campaign.roas,
      action: activeSchedule ? ACTION_LABELS[activeSchedule.actionType] || activeSchedule.actionType : "—",
      scheduleStatus: activeSchedule?.status || "none",
      nextRun: activeSchedule?.nextRun || "",
      scheduleId: activeSchedule?.id || null,
    };
  });

  const filteredRows = unifiedRows.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = sortData(filteredRows, sortField, sortDirection);
  const paginatedRows = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };
  const { view } = useViewport();
  const isMobile = view === "mobile";

  const handlePauseResume = (scheduleId: string) => {
    setSchedules((prev) =>
      prev.map((s) => s.id === scheduleId ? { ...s, status: s.status === "active" ? "paused" : "active", updatedAt: new Date().toISOString() } : s)
    );
    toast.success("Schedule updated");
  };

  const handleDeleteClick = (scheduleId: string) => {
    setScheduleToDelete(scheduleId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (scheduleToDelete) {
      setSchedules((prev) => prev.filter((s) => s.id !== scheduleToDelete));
      toast.success("Schedule deleted successfully");
      setScheduleToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  // History filtering
  const filteredHistory = executionHistory.filter((h) => {
    const matchesSearch =
      h.scheduleName.toLowerCase().includes(historySearch.toLowerCase()) ||
      h.campaignName.toLowerCase().includes(historySearch.toLowerCase());
    if (historyStatusFilter === "all") return matchesSearch;
    return matchesSearch && h.status === historyStatusFilter;
  });

  const statusCounts = {
    all: executionHistory.length,
    success: executionHistory.filter((h) => h.status === "success").length,
    failed: executionHistory.filter((h) => h.status === "failed").length,
  };

  const SCHEDULE_STATUS_STYLES: Record<string, string> = {
    active: "bg-success/10 text-success border-success/30",
    paused: "bg-warning/10 text-warning border-warning/30",
    draft: "bg-primary/10 text-primary border-primary/30",
    none: "bg-muted text-muted-foreground",
  };

  return (
    <AppLayout>
      <div className="flex flex-1 min-h-0 min-w-0">
        <div className="flex-1 min-w-0 space-y-6 overflow-auto">
          <PageHeader
            title="Day Parting"
            subtitle="Analyze hourly performance and manage campaign schedules"
          />
          <AppTaskbar showDateRange showRunButton onRun={() => toast.info("Refreshing data...")} breadcrumbItems={breadcrumbItems}>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Ad Type</span>
              <Select value={adType} onValueChange={(v) => setAdType(v as any)}>
                <SelectTrigger className="h-8 w-[130px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                  <SelectValue placeholder="Ad Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All" className="text-xs cursor-pointer">All Types</SelectItem>
                  <SelectItem value="SP" className="text-xs cursor-pointer">Sponsored Products</SelectItem>
                  <SelectItem value="SB" className="text-xs cursor-pointer">Sponsored Brands</SelectItem>
                  <SelectItem value="SD" className="text-xs cursor-pointer">Sponsored Display</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Campaign</span>
              <Select value={selectedCampaigns[0]} onValueChange={(v) => setSelectedCampaigns([v])}>
                <SelectTrigger className="h-8 w-[200px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue placeholder="Select campaign" /></SelectTrigger>
                <SelectContent>{dayPartingCampaigns.map((camp) => (<SelectItem key={camp.id} value={camp.id} className="text-xs">{camp.name}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Metrics</span>
              <Select value={metric} onValueChange={(v) => setMetric(v as MetricType)}>
                <SelectTrigger className="h-8 w-[100px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="spend" className="text-xs">Spend</SelectItem>
                  <SelectItem value="revenue" className="text-xs">Revenue</SelectItem>
                  <SelectItem value="roas" className="text-xs">ROAS</SelectItem>
                  <SelectItem value="acos" className="text-xs">ACOS</SelectItem>
                  <SelectItem value="orders" className="text-xs">Orders</SelectItem>
                  <SelectItem value="ctr" className="text-xs">CTR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AppTaskbar>

          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); nav(v === "history" ? "/dayparting/history" : "/dayparting", { replace: true }); }}>
            <TabsList>
              <TabsTrigger value="dayparting">Day Parting</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            {/* Tab 1: Day Parting — Hero + Heatmap + Unified Table */}
            <TabsContent value="dayparting" className="mt-4 space-y-6">
              {/* Hero Metrics */}
              <div className="space-y-3">
                <h2 className="text-sm font-semibold text-foreground">Hourly Trends</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {boxMetrics.map((metricKey, index) => {
                    const metricDef = AVAILABLE_METRICS.find(m => m.key === metricKey) || AVAILABLE_METRICS[0];
                    const value = getMetricValue(metricKey);
                    return (
                      <div key={index} className="rounded-md border border-border bg-card px-3 py-2">
                        <div className="flex items-center justify-between mb-0.5">
                          <Select value={metricKey} onValueChange={(v) => handleBoxMetricChange(index, v)}>
                            <SelectTrigger className="h-5 w-auto border-0 bg-transparent shadow-none p-0 text-[10px] font-medium text-muted-foreground uppercase gap-0.5 cursor-pointer">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {AVAILABLE_METRICS.map((m) => (
                                <SelectItem key={m.key} value={m.key} className="text-xs">{m.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <p className="text-lg font-semibold text-foreground">{metricDef.format(value)}</p>
                      </div>
                    );
                  })}
                </div>
                <div className="overflow-auto">
                  <HourlyHeatmap data={hourlyData} metric={metric} />
                </div>
              </div>

              {/* Unified Campaigns & Schedules Table */}
              <div className="space-y-3">
                <DataTableToolbar
                  searchValue={searchQuery}
                  onSearchChange={setSearchQuery}
                  searchPlaceholder="Search campaigns..."
                  onDownload={() => toast.success("Exporting data...")}
                  showDeltas={showDeltas}
                  onShowDeltasChange={setShowDeltas}
                  leftContent={
                    <Button data-write-action size="sm" className="gap-1.5 text-xs h-8" onClick={() => setDataPanel("createSchedule")}>
                      <Plus className="h-3.5 w-3.5" />Create Schedule
                    </Button>
                  }
                />
                <div className="rounded-lg border border-border bg-card overflow-auto">
                  <Table>
                    <TableHeader>
                      <tr className="bg-muted/30 hover:bg-muted/30">
                        <SortableTableHead field="name" isFixed className="min-w-[260px]" {...sp}>Campaign</SortableTableHead>
                        <SortableTableHead field="status" align="center" {...sp}>Status</SortableTableHead>
                        <SortableTableHead field="budget" align="right" {...sp} style={ps("budget")} className={cn(pc("budget", true))}>Budget</SortableTableHead>
                        <SortableTableHead field="spend" align="right" {...sp} style={ps("spend")} className={cn(pc("spend", true))}>Spend</SortableTableHead>
                        <SortableTableHead field="revenue" align="right" {...sp} style={ps("revenue")} className={cn(pc("revenue", true))}>Revenue</SortableTableHead>
                        <SortableTableHead field="roas" align="right" {...sp} style={ps("roas")} className={cn(pc("roas", true))}>ROAS</SortableTableHead>
                        <SortableTableHead field="action" align="center" {...sp} style={ps("action")} className={cn(pc("action", true))}>Schedule Action</SortableTableHead>
                        <SortableTableHead field="nextRun" align="center" {...sp} style={ps("nextRun")} className={cn(pc("nextRun", true))}>Next Run</SortableTableHead>
                        <SortableTableHead field="actions" isFixed align="center" sortField={null} sortDirection="asc" onSort={undefined} pinnedColumns={pinnedColumns} onPinToggle={undefined}>Actions</SortableTableHead>
                      </tr>
                    </TableHeader>
                    <TableBody>
                      {paginatedRows.map((row) => (
                        <TableRow
                          key={row.id}
                          className={cn(
                            "hover:bg-muted/50 cursor-pointer",
                            selectedCampaigns.includes(row.id) && "bg-primary/5"
                          )}
                          onClick={() => setSelectedCampaigns([row.id])}
                        >
                          <TableCell className="font-medium">{row.name}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={cn("capitalize", row.status === "enabled" ? "bg-success/10 text-success border-success/30" : "bg-muted text-muted-foreground")}>
                              {row.status}
                            </Badge>
                          </TableCell>
                          <TableCell style={ps("budget")} className={cn("text-right", pc("budget"))}>{formatCurrency(row.budget)}</TableCell>
                          <TableCell style={ps("spend")} className={cn("text-right", pc("spend"))}>{formatCurrency(row.spend)}</TableCell>
                          <TableCell style={ps("revenue")} className={cn("text-right", pc("revenue"))}>{formatCurrency(row.revenue)}</TableCell>
                          <TableCell style={ps("roas")} className={cn("text-right", pc("roas"))}>
                            <span className={cn(row.roas >= 3 ? "text-success" : "text-foreground")}>{row.roas.toFixed(2)}x</span>
                          </TableCell>
                          <TableCell style={ps("action")} className={cn("text-center", pc("action"))}>
                            {row.scheduleId ? (
                              <div className="flex flex-col items-center gap-0.5">
                                <span className="text-sm">{row.action}</span>
                                <Badge variant="outline" className={cn("capitalize text-[10px] px-1.5 py-0", SCHEDULE_STATUS_STYLES[row.scheduleStatus])}>
                                  {row.scheduleStatus}
                                </Badge>
                              </div>
                            ) : (
                              <span className="text-muted-foreground text-sm">No schedule</span>
                            )}
                          </TableCell>
                          <TableCell style={ps("nextRun")} className={cn("text-center text-sm", pc("nextRun"))}>
                            {row.nextRun ? format(new Date(row.nextRun), "MMM dd, HH:mm") : "—"}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-0.5" onClick={(e) => e.stopPropagation()}>
                              {row.scheduleId && row.scheduleStatus !== "draft" && (
                                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handlePauseResume(row.scheduleId!)} title={row.scheduleStatus === "active" ? "Pause schedule" : "Resume schedule"}>
                                  {row.scheduleStatus === "active" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                                </Button>
                              )}
                              {row.scheduleId && (
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive/80 hover:bg-destructive/10" onClick={() => handleDeleteClick(row.scheduleId!)} title="Delete schedule">
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                              {!row.scheduleId && (
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => setDataPanel("createSchedule")}>
                                  <Plus className="h-3 w-3" />Add
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
                    totalItems={filteredRows.length}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={setPageSize}
                  />
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: History */}
            <TabsContent value="history" className="mt-4 space-y-4">
              <DataTableToolbar
                searchValue={historySearch}
                onSearchChange={setHistorySearch}
                searchPlaceholder="Search by schedule or campaign..."
                onDownload={() => toast.success("Exporting history...")}
              />
              <Tabs value={historyStatusFilter} onValueChange={setHistoryStatusFilter}>
                <TabsList>
                  <TabsTrigger value="all">All ({statusCounts.all})</TabsTrigger>
                  <TabsTrigger value="success">Completed ({statusCounts.success})</TabsTrigger>
                  <TabsTrigger value="failed">Failed ({statusCounts.failed})</TabsTrigger>
                </TabsList>
              </Tabs>
              {filteredHistory.length > 0 ? (
                <HistoryTable history={filteredHistory} onRetry={() => toast.info("Retrying execution...")} />
              ) : (
                <div className="text-center py-12 text-muted-foreground border border-border rounded-lg bg-card">
                  <p>No execution history found</p>
                  {historySearch && <p className="text-sm mt-1">Try adjusting your search query</p>}
                </div>
              )}
            </TabsContent>
          </Tabs>
</div>
        <CreateSchedulePanel />
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this schedule? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
