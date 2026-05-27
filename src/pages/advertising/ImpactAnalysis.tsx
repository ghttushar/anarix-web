import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { UnderlineTabs } from "@/components/advertising/UnderlineTabs";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { ImpactTable } from "@/components/tables/ImpactTable";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronDown, Download, Maximize2 } from "lucide-react";
import { toast } from "sonner";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useFilter } from "@/contexts/FilterContext";
import {
  mockImpactCampaigns,
  mockImpactAdGroups,
  mockImpactProducts,
  mockImpactKeywords,
  mockImpactSearchTerms,
} from "@/data/mockImpactData";
type ImpactTab = "campaigns" | "ad-groups" | "products" | "keywords" | "search-terms";

const tabs = [
  { value: "campaigns", label: "Campaigns" },
  { value: "ad-groups", label: "Ad Groups" },
  { value: "products", label: "Products" },
  { value: "keywords", label: "Keywords" },
  { value: "search-terms", label: "Search Terms" },
];

const impactChartData = mockImpactCampaigns.map((c) => ({
  name: c.name.length > 20 ? c.name.slice(0, 20) + "…" : c.name,
  "Previous Spend": c.baseline.adSpend,
  "Current Spend": c.impact.adSpend,
  "Previous Sales": c.baseline.adSales,
  "Current Sales": c.impact.adSales,
}));

const SORTABLE_FIELDS = [
  { id: "name", label: "Name" },
  { id: "impactPercentage", label: "Impact %" },
  { id: "adSpend", label: "Ad Spend" },
  { id: "adSales", label: "Ad Sales" },
  { id: "roas", label: "ROAS" },
];


const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/impact" },
  { label: "Impact Analysis" },
];
export default function ImpactAnalysis() {
  const { adType, setAdType } = useFilter();
  const [activeTab, setActiveTab] = useState<ImpactTab>("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("adSpend");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const getTabData = () => {
    switch (activeTab) {
      case "campaigns": return { data: mockImpactCampaigns };
      case "ad-groups": return { data: mockImpactAdGroups };
      case "products": return { data: mockImpactProducts };
      case "keywords": return { data: mockImpactKeywords };
      case "search-terms": return { data: mockImpactSearchTerms };
      default: return { data: mockImpactCampaigns };
    }
  };

  const { data } = getTabData();

  const handleDownload = () => {
    toast.success("Exporting impact data as CSV...");
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Impact Analysis"
          subtitle="Compare performance across time periods to measure campaign impact"
        />
        <AppTaskbar showRunButton onRun={() => toast.info("Analyzing impact comparison...")} breadcrumbItems={breadcrumbItems}>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Previous period</span>
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm font-normal px-1.5 cursor-pointer">
                <Calendar className="h-3 w-3" />Jan 1 – Jan 7<ChevronDown className="h-3 w-3" />
              </Button>
            </div>
            <span className="text-xs font-medium text-muted-foreground">vs</span>
            <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Current period</span>
              <Button variant="ghost" size="sm" className="h-8 gap-1 text-sm font-normal px-1.5 cursor-pointer">
                <Calendar className="h-3 w-3" />Jan 15 – Jan 22<ChevronDown className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Metrics</span>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="h-8 w-[120px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adSpend" className="text-xs cursor-pointer">Ad Spend</SelectItem>
                <SelectItem value="adSales" className="text-xs cursor-pointer">Ad Sales</SelectItem>
                <SelectItem value="acos" className="text-xs cursor-pointer">ACOS</SelectItem>
                <SelectItem value="roas" className="text-xs cursor-pointer">ROAS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AppTaskbar>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading text-sm font-medium text-foreground">Performance Comparison</h3>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" title="Expand chart"><Maximize2 className="h-3.5 w-3.5" /></Button>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 cursor-pointer" onClick={handleDownload} title="Download data"><Download className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={impactChartData} barGap={2} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "6px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "11px" }} />
              <Bar dataKey="Previous Spend" fill="hsl(var(--muted-foreground))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Current Spend" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Previous Sales" fill="hsl(var(--muted-foreground) / 0.5)" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Current Sales" fill="hsl(var(--success))" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <UnderlineTabs tabs={tabs} value={activeTab} onChange={(v) => setActiveTab(v as ImpactTab)} />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder={`Search ${activeTab.replace("-", " ")}...`}
          onDownload={handleDownload}
          sortableFields={SORTABLE_FIELDS}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={(f, d) => { setSortField(f); setSortDirection(d); }}
        />

        <ImpactTable data={data} searchQuery={searchQuery} />
      </div>
</AppLayout>
  );
}
