import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { SOVChart } from "@/components/bi/SOVChart";
import { SOVKPIStrip } from "@/components/bi/SOVKPIStrip";
import { BrandCoverageTable } from "@/components/bi/BrandCoverageTable";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brands, sovTrendData, sovMetrics } from "@/data/mockBrandSOV";
import { toast } from "sonner";
const breadcrumbItems = [
  { label: "Business Intelligence", href: "/bi/brand-sov" },
  { label: "Brand SOV" },
];
export default function BrandSOV() {
  const [keyword, setKeyword] = useState("memory foam mattress");
  const [dateRange, setDateRange] = useState("today");
  const [position, setPosition] = useState("all");
  const [frequency, setFrequency] = useState("hourly");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);

  return (
    <AppLayout>
      <div className="space-y-6">
        <PageHeader
          title="Brand Share of Voice"
          subtitle="Track brand visibility across search results"
        />

        <AppTaskbar showRunButton onRun={() => toast.info("Running SOV analysis...")} breadcrumbItems={breadcrumbItems}>
          <div className="relative min-w-[180px] max-w-[240px]">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search keyword..." value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-8 h-8 text-xs" />
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Date Range</span>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="h-8 w-[120px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="today" className="text-xs">Today</SelectItem>
                <SelectItem value="yesterday" className="text-xs">Yesterday</SelectItem>
                <SelectItem value="7days" className="text-xs">Last 7 Days</SelectItem>
                <SelectItem value="30days" className="text-xs">Last 30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Position</span>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="h-8 w-[100px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">All</SelectItem>
                <SelectItem value="1" className="text-xs">Position 1</SelectItem>
                <SelectItem value="1-3" className="text-xs">Top 3</SelectItem>
                <SelectItem value="1-10" className="text-xs">Top 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5 rounded-md bg-muted/40 px-2.5 py-1">
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Frequency</span>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger className="h-8 w-[90px] text-sm border-0 bg-transparent shadow-none px-1.5 cursor-pointer"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="hourly" className="text-xs">Hourly</SelectItem>
                <SelectItem value="daily" className="text-xs">Daily</SelectItem>
                <SelectItem value="weekly" className="text-xs">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AppTaskbar>

        <SOVKPIStrip metrics={sovMetrics} />
        <SOVChart data={sovTrendData} title="Share of Voice Trend" subtitle={`Jan 31 (${frequency})`} />

        <div>
          <h2 className="text-lg font-semibold mb-4">Brand Coverage</h2>
          <DataTableToolbar
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            searchPlaceholder="Search brands..."
            onDownload={() => toast.success("Exporting SOV data...")}
            showDeltas={showDeltas}
            onShowDeltasChange={setShowDeltas}
          />
          <BrandCoverageTable brands={brands} onViewTrend={(brandId) => console.log("View trend for brand:", brandId)} />
        </div>
      </div>
</AppLayout>
  );
}
