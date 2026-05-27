import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { AddKeywordTargetModal } from "@/components/advertising/AddKeywordTargetModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Archive, DollarSign } from "lucide-react";
import { mockTargetingActions, mockTargetCampaigns, mockTargetAdGroups } from "@/data/mockTargetingActions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
type ActionTab = "keyword-action" | "history" | "archive";

const tabs = [
  { value: "keyword-action", label: "Keyword Action" },
  { value: "history", label: "History" },
  { value: "archive", label: "Archive" },
];

const FILTER_FIELDS = ["Search Term", "Term Type", "Match Type", "ROAS", "ACOS", "Ad Spend", "Ad Sales", "Impressions", "Clicks"];

const SORTABLE_FIELDS = [
  { id: "searchTerm", label: "Search Term" },
  { id: "impressions", label: "Impressions" },
  { id: "clicks", label: "Clicks" },
  { id: "adSpend", label: "Ad Spend" },
  { id: "adSales", label: "Ad Sales" },
  { id: "roas", label: "ROAS" },
];


const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/targeting" },
  { label: "Targeting Actions" },
];
export default function TargetingActions() {
  const [activeTab, setActiveTab] = useState<ActionTab>("keyword-action");
  const [searchQuery, setSearchQuery] = useState("");
  const [bidAction, setBidAction] = useState("increase_pct");
  const [bidValue, setBidValue] = useState("");
  const [addKeywordsOpen, setAddKeywordsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ id: string; field: string; operator: string; value: string }[]>([]);
  const [showDeltas, setShowDeltas] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredActions = mockTargetingActions.filter((action) => {
    const matchesSearch =
      action.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.normalizedTerm.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === "archive") return matchesSearch && action.archived;
    return matchesSearch && !action.archived;
  });

  const { formatCurrency } = useCurrency();
  const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);
  const formatPercent = (value: number) => `${value.toFixed(2)}%`;

  const handleFetchKeywords = () => { toast.info("Fetching keywords..."); };
  const handleDownload = () => { toast.success("Exporting targeting data..."); };
  const handleApplyBid = () => {
    if (!bidValue) return;
    toast.success(`Bid adjustment applied: ${bidAction === "set_to" ? "Set to" : bidAction === "increase_pct" ? "Increase by" : "Decrease by"} ${bidValue}${bidAction !== "set_to" ? "%" : ""}`);
    setBidValue("");
  };
  const handleAddKeywords = (keywords: any[], campaignId: string, adGroupId: string) => {
    toast.success(`Added ${keywords.length} keyword(s) to target campaign`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Targeting Actions"
          subtitle="Convert search terms into keyword targets across your campaigns"
        />
        <AppTaskbar breadcrumbItems={breadcrumbItems}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Action Type</span>
              <Select defaultValue="auto-manual">
                <SelectTrigger className="h-8 w-[140px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto-manual" className="text-xs">Auto to Manual</SelectItem>
                  <SelectItem value="manual-manual" className="text-xs">Manual to Manual</SelectItem>
                  <SelectItem value="new-keywords" className="text-xs">New Keywords</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Priority</span>
              <Select defaultValue="high">
                <SelectTrigger className="h-8 w-[80px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="high" className="text-xs">High</SelectItem>
                  <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                  <SelectItem value="low" className="text-xs">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button size="sm" className="gap-1.5 h-8" onClick={handleFetchKeywords}>Fetch</Button>
        </AppTaskbar>

        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as ActionTab)} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search terms..."
          activeFilters={activeFilters}
          onFiltersChange={setActiveFilters}
          filterFields={FILTER_FIELDS}
          onDownload={handleDownload}
          showDeltas={showDeltas}
          onShowDeltasChange={setShowDeltas}
          showViewToggle
          viewMode="view"
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
          rightContent={
            <>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                    <DollarSign className="h-3.5 w-3.5" />Custom Bid
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72" align="end">
                  <div className="space-y-3">
                    <p className="text-sm font-medium">Adjust Bids</p>
                    <Select value={bidAction} onValueChange={setBidAction}>
                      <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="increase_pct">Increase By %</SelectItem>
                        <SelectItem value="decrease_pct">Decrease By %</SelectItem>
                        <SelectItem value="set_to">Set To</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input type="number" placeholder={bidAction === "set_to" ? "Enter bid value" : "Enter percentage"} value={bidValue} onChange={(e) => setBidValue(e.target.value)} className="h-8 text-xs" step={bidAction === "set_to" ? 0.01 : 1} />
                    <p className="text-xs text-muted-foreground">Are you sure you want to adjust the budget? This action might affect the spends.</p>
                    <Button size="sm" className="w-full" onClick={handleApplyBid} disabled={!bidValue}>Apply</Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setAddKeywordsOpen(true)}>
                <Plus className="h-3.5 w-3.5" />Add Keywords
              </Button>
            </>
          }
        />

        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="min-w-[200px] sticky left-0 z-10 bg-muted">Search Term</TableHead>
                  <TableHead className="min-w-[160px]">Normalized Term</TableHead>
                  <TableHead className="min-w-[140px]">Source Campaign</TableHead>
                  <TableHead className="min-w-[130px]">Source AdGroup</TableHead>
                  <TableHead className="min-w-[150px]">Target Campaign</TableHead>
                  <TableHead className="min-w-[150px]">Target Ad Group</TableHead>
                  <TableHead className="min-w-[260px]">Match Types</TableHead>
                  <TableHead className="w-14 text-center">Archive</TableHead>
                  <TableHead className="text-right">Impressions</TableHead>
                  <TableHead className="text-right">Clicks</TableHead>
                  <TableHead className="text-right">CTR</TableHead>
                  <TableHead className="text-right">CPC</TableHead>
                  <TableHead className="text-right">Ad Spend</TableHead>
                  <TableHead className="text-right">Ad Sales</TableHead>
                  <TableHead className="text-right">Ad Units</TableHead>
                  <TableHead className="text-right">CVR</TableHead>
                  <TableHead className="text-right">ROAS</TableHead>
                  <TableHead className="text-right">ACOS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.map((action) => {
                  const acos = action.adSales > 0 ? (action.adSpend / action.adSales) * 100 : 0;
                  return (
                    <TableRow key={action.id}>
                      <TableCell className="sticky left-0 z-10 bg-background">
                        <div className="space-y-1">
                          <span className="font-medium text-sm text-foreground">{action.searchTerm}</span>
                          <Select defaultValue={action.termType}>
                            <SelectTrigger className="h-6 w-24 text-[11px] border-dashed"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="generic">Generic</SelectItem>
                              <SelectItem value="branded">Branded</SelectItem>
                              <SelectItem value="competitor">Competitor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{action.normalizedTerm}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{action.sourceCampaignName}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{action.sourceAdGroupName}</TableCell>
                      <TableCell>
                        <Select defaultValue={action.targetCampaignId || ""}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>{mockTargetCampaigns.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select defaultValue={action.targetAdGroupId || ""}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select..." /></SelectTrigger>
                          <SelectContent>{mockTargetAdGroups.map((ag) => (<SelectItem key={ag.id} value={ag.id}>{ag.name}</SelectItem>))}</SelectContent>
                        </Select>
                      </TableCell>
                      {(["broad", "exact", "phrase"] as const).map((matchType) => {
                        const mt = action.matchTypes[matchType];
                        return (
                          <TableCell key={matchType} className="px-1.5">
                            <div className={cn("relative flex flex-col items-center gap-1 rounded-lg border p-2 min-w-[80px] transition-colors", mt.selected ? "border-primary/40 bg-primary/5" : "border-border bg-background")}>
                              <Checkbox checked={mt.selected} className="absolute left-1.5 top-1.5 h-3 w-3" />
                              <span className={cn("text-[10px] uppercase font-medium tracking-wide", mt.selected ? "text-primary" : "text-muted-foreground")}>{matchType}</span>
                              <Input type="number" value={mt.bid} step={0.01} className="h-6 w-14 text-center text-xs border-border bg-background shadow-none focus-visible:ring-1 focus-visible:ring-primary/30 rounded px-1" />
                            </div>
                          </TableCell>
                        );
                      })}
                      <TableCell className="text-center">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0"><Archive className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatNumber(action.impressions)}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatNumber(action.clicks)}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatPercent(action.ctr)}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatCurrency(action.cpc)}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatCurrency(action.adSpend)}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatCurrency(action.adSales)}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatNumber(action.adUnits)}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatPercent(action.cvr)}</TableCell>
                      <TableCell className="text-right tabular-nums font-medium text-foreground">{action.roas.toFixed(2)}</TableCell>
                      <TableCell className="text-right tabular-nums text-foreground">{formatPercent(acos)}</TableCell>
                    </TableRow>
                  );
                })}
                {filteredActions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={20} className="h-32 text-center text-muted-foreground">
                      {activeTab === "archive" ? "No archived items found" : activeTab === "history" ? "No history available" : "No targeting actions found. Try fetching keywords."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <AddKeywordTargetModal isOpen={addKeywordsOpen} onClose={() => setAddKeywordsOpen(false)} onAdd={handleAddKeywords} />
</AppLayout>
  );
}
