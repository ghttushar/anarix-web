import { useMemo, useState } from "react";
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
import { Plus, Archive, DollarSign, MoreHorizontal } from "lucide-react";
import { mockTargetingActions, mockTargetCampaigns, mockTargetAdGroups } from "@/data/mockTargetingActions";
import { MatchTypePicker } from "@/components/advertising/MatchTypePicker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useMarketplace } from "@/contexts/MarketplaceContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AmazonTab = "product-action" | "keyword-negation" | "product-negation" | "history" | "archive";
type WalmartTab = "keyword-action" | "history" | "archive";

const AMAZON_TABS = [
  { value: "product-action", label: "Product Action" },
  { value: "keyword-negation", label: "Keyword Negation" },
  { value: "product-negation", label: "Product Negation" },
  { value: "history", label: "History" },
  { value: "archive", label: "Archive" },
];

const WALMART_TABS = [
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
  const { isWalmart } = useMarketplace();
  const tabs = isWalmart ? WALMART_TABS : AMAZON_TABS;
  const defaultTab = (isWalmart ? "keyword-action" : "product-action") as AmazonTab | WalmartTab;

  const [activeTab, setActiveTab] = useState<AmazonTab | WalmartTab>(defaultTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [bidAction, setBidAction] = useState("increase_pct");
  const [bidValue, setBidValue] = useState("");
  const [addKeywordsOpen, setAddKeywordsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ id: string; field: string; operator: string; value: string }[]>([]);
  const [showDeltas, setShowDeltas] = useState(false);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [matchTypeState, setMatchTypeState] = useState<Record<string, any>>(() =>
    Object.fromEntries(mockTargetingActions.map((a) => [a.id, a.matchTypes]))
  );
  const [archivedIds, setArchivedIds] = useState<Set<string>>(
    () => new Set(mockTargetingActions.filter((a) => a.archived).map((a) => a.id))
  );
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  // Switch tab when marketplace switches
  useMemo(() => {
    setActiveTab(defaultTab);
    setSelectedRowIds(new Set());
  }, [defaultTab]);

  const filteredActions = mockTargetingActions.filter((action) => {
    const matchesSearch =
      action.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.normalizedTerm.toLowerCase().includes(searchQuery.toLowerCase());
    const isArchived = archivedIds.has(action.id);
    if (activeTab === "archive") return matchesSearch && isArchived;
    if (activeTab === "history") return matchesSearch;
    return matchesSearch && !isArchived;
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
  const handleAddKeywords = (keywords: any[], _campaignId: string, _adGroupId: string) => {
    toast.success(`Added ${keywords.length} keyword(s) to target campaign`);
    setSelectedRowIds(new Set());
  };

  const toggleRow = (id: string) => {
    setSelectedRowIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAll = () => {
    const ids = filteredActions.map((a) => a.id);
    const allSelected = ids.length > 0 && ids.every((id) => selectedRowIds.has(id));
    if (allSelected) setSelectedRowIds(new Set());
    else setSelectedRowIds(new Set(ids));
  };

  const archiveOne = (id: string) => {
    setArchivedIds((prev) => { const next = new Set(prev); next.add(id); return next; });
    toast.success("Moved to Archive");
  };
  const unarchiveOne = (id: string) => {
    setArchivedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
    toast.success("Restored from Archive");
  };
  const archiveSelected = () => {
    setArchivedIds((prev) => { const next = new Set(prev); selectedRowIds.forEach((id) => next.add(id)); return next; });
    toast.success(`Archived ${selectedRowIds.size} item(s)`);
    setSelectedRowIds(new Set());
  };

  const hasSelection = selectedRowIds.size > 0;
  const allSelected = filteredActions.length > 0 && filteredActions.every((a) => selectedRowIds.has(a.id));
  const someSelected = filteredActions.some((a) => selectedRowIds.has(a.id));

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Targeting Actions"
          subtitle="Convert search terms into keyword targets across your campaigns"
        />
        <AppTaskbar showDateRange breadcrumbItems={breadcrumbItems}>
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

        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as any)} />

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
              {hasSelection && activeTab !== "archive" && (
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={archiveSelected}>
                  <Archive className="h-3.5 w-3.5" />Archive ({selectedRowIds.size})
                </Button>
              )}
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" disabled={!hasSelection}>
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
              <Button
                data-write-action
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={() => setAddKeywordsOpen(true)}
                disabled={!hasSelection}
                title={hasSelection ? "Add selected search terms as keyword targets" : "Select at least one search term to enable"}
              >
                <Plus className="h-3.5 w-3.5" />Add Keyword{hasSelection ? ` (${selectedRowIds.size})` : ""}
              </Button>
            </>
          }
        />

        <div className="rounded-lg border border-border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="w-10 sticky left-0 z-10 bg-muted">
                    <Checkbox
                      checked={allSelected ? true : someSelected ? "indeterminate" : false}
                      onCheckedChange={toggleAll}
                      aria-label="Select all rows"
                    />
                  </TableHead>
                  <TableHead className="min-w-[200px] sticky left-10 z-10 bg-muted">Search Term</TableHead>
                  <TableHead className="min-w-[160px]">Normalized Term</TableHead>
                  <TableHead className="min-w-[140px]">Source Campaign</TableHead>
                  <TableHead className="min-w-[130px]">Source AdGroup</TableHead>
                  <TableHead className="min-w-[150px]">Target Campaign</TableHead>
                  <TableHead className="min-w-[150px]">Target Ad Group</TableHead>
                  <TableHead className="min-w-[200px]">Match Type to Add</TableHead>
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
                  <TableHead className="w-12 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActions.map((action) => {
                  const acos = action.adSales > 0 ? (action.adSpend / action.adSales) * 100 : 0;
                  const isSelected = selectedRowIds.has(action.id);
                  const isArchived = archivedIds.has(action.id);
                  return (
                    <TableRow key={action.id} data-state={isSelected ? "selected" : undefined} className={cn("group data-[state=selected]:bg-primary/5")}>
                      <TableCell className="sticky left-0 z-10 bg-background group-hover:bg-muted group-data-[state=selected]:bg-primary/5 transition-colors">
                        <Checkbox checked={isSelected} onCheckedChange={() => toggleRow(action.id)} aria-label={`Select ${action.searchTerm}`} />
                      </TableCell>
                      <TableCell className="sticky left-10 z-10 bg-background group-hover:bg-muted group-data-[state=selected]:bg-primary/5 transition-colors">
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
                      <TableCell className="px-2 align-top py-2">
                        <MatchTypePicker
                          value={matchTypeState[action.id]}
                          onChange={(next) => setMatchTypeState((s) => ({ ...s, [action.id]: next }))}
                        />
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
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" title="Row actions">
                              <MoreHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {isArchived ? (
                              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => unarchiveOne(action.id)}>
                                <Archive className="mr-2 h-3.5 w-3.5" /> Restore
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="text-xs cursor-pointer" onClick={() => archiveOne(action.id)}>
                                <Archive className="mr-2 h-3.5 w-3.5" /> Archive
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
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
