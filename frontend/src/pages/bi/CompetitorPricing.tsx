import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { mockCompetitorProducts, type CompetitorProduct } from "@/data/mockCompetitorPricing";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartType, ChartMetric } from "@/components/charts/ChartContainer";
import { useCurrency } from "@/contexts/CurrencyContext";
import { TablePagination } from "@/components/tables/TablePagination";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

function PriceHistoryChart({ selected }: { selected: CompetitorProduct }) {
  const { formatCurrency } = useCurrency();
  const [chartType, setChartType] = useState<ChartType>("line");
  const [activeMetrics, setActiveMetrics] = useState<string[]>(["price"]);

  const metrics: ChartMetric[] = [
    { key: "price", label: "Competitor Price", color: "hsl(var(--primary))", active: activeMetrics.includes("price") },
  ];

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "bar" ? (
        <BarChart data={selected.priceHistory}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} domain={["auto", "auto"]} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("price") && <Bar dataKey="price" fill="hsl(var(--primary))" name="Competitor Price" radius={[3, 3, 0, 0]} />}
        </BarChart>
      ) : chartType === "area" ? (
        <AreaChart data={selected.priceHistory}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} domain={["auto", "auto"]} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("price") && <Area type="monotone" dataKey="price" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Competitor Price" />}
        </AreaChart>
      ) : (
        <LineChart data={selected.priceHistory}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} domain={["auto", "auto"]} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("price") && <Line type="monotone" dataKey="price" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} name="Competitor Price" />}
        </LineChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <ChartContainer title={`Price History — ${selected.productName}`} metrics={metrics} onMetricToggle={toggleMetric} chartType={chartType} onChartTypeChange={setChartType} expandedChildren={renderChart(400)}>
      {renderChart(220)}
      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span>Your Price: <strong className="text-foreground">{formatCurrency(selected.yourPrice)}</strong></span>
        <span>Competitor: <strong className="text-foreground">{formatCurrency(selected.currentPrice)}</strong></span>
        <span>Diff: <strong className={selected.currentPrice < selected.yourPrice ? "text-destructive" : "text-success"}>{formatCurrency(selected.yourPrice - selected.currentPrice)}</strong></span>
      </div>
    </ChartContainer>
  );
}


const breadcrumbItems = [
  { label: "Business Intelligence", href: "/bi/competitor-pricing" },
  { label: "Competitor Pricing" },
];
export default function CompetitorPricing() {
  const { formatCurrency } = useCurrency();
  const [selected, setSelected] = useState<CompetitorProduct | null>(mockCompetitorProducts[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeltas, setShowDeltas] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filteredProducts = mockCompetitorProducts.filter((p) =>
    p.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.competitorName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedProducts = filteredProducts.slice((page - 1) * pageSize, page * pageSize);

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Competitor Price Tracking"
          subtitle="Track competitor pricing over time and correlate with your sales and conversion changes"
          actions={
            <Button variant="outline" size="sm" onClick={() => toast.info("Refreshing competitor data...")}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="h-full bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Tracked Competitors</p>
            <p className="text-xl font-semibold text-foreground">{new Set(mockCompetitorProducts.map((p) => p.competitorName)).size}</p>
          </CardContent></Card>
          <Card className="h-full bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Products Tracked</p>
            <p className="text-xl font-semibold text-foreground">{mockCompetitorProducts.length}</p>
          </CardContent></Card>
          <Card className="h-full bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Price Undercut</p>
            <p className="text-xl font-semibold text-destructive">{mockCompetitorProducts.filter((p) => p.currentPrice < p.yourPrice).length}</p>
          </CardContent></Card>
          <Card className="h-full bg-card"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Price Advantage</p>
            <p className="text-xl font-semibold text-success">{mockCompetitorProducts.filter((p) => p.currentPrice > p.yourPrice).length}</p>
          </CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {selected ? <PriceHistoryChart selected={selected} /> : (
              <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground py-12">Select a product to view price history</div>
            )}
          </div>
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">Your Impact</h3>
            {selected && (
              <Card className="bg-card">
                <CardContent className="pt-4 pb-3 px-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Sales Impact</span>
                    <div className="flex items-center gap-1">
                      {selected.yourSalesImpact >= 0 ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                      <span className={cn("text-sm font-medium", selected.yourSalesImpact >= 0 ? "text-success" : "text-destructive")}>{selected.yourSalesImpact > 0 ? "+" : ""}{selected.yourSalesImpact}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CVR Impact</span>
                    <div className="flex items-center gap-1">
                      {selected.yourCvrImpact >= 0 ? <TrendingUp className="h-3 w-3 text-success" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                      <span className={cn("text-sm font-medium", selected.yourCvrImpact >= 0 ? "text-success" : "text-destructive")}>{selected.yourCvrImpact > 0 ? "+" : ""}{selected.yourCvrImpact}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search competitors..."
              onDownload={() => toast.success("Exporting pricing data...")}
              showDeltas={showDeltas}
              onShowDeltasChange={setShowDeltas}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[200px]">Product</TableHead>
                <TableHead>Competitor</TableHead>
                <TableHead className="text-right">Their Price</TableHead>
                <TableHead className="text-right">Your Price</TableHead>
                <TableHead className="text-right">Difference</TableHead>
                <TableHead className="text-right">Sales Impact</TableHead>
                <TableHead className="text-right">CVR Impact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((p) => {
                const diff = p.yourPrice - p.currentPrice;
                return (
                  <TableRow key={p.id} className={cn("cursor-pointer", selected?.id === p.id && "bg-primary/5")} onClick={() => setSelected(p)}>
                    <TableCell className="font-medium">{p.productName}</TableCell>
                    <TableCell className="text-muted-foreground">{p.competitorName}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.currentPrice)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(p.yourPrice)}</TableCell>
                    <TableCell className={cn("text-right font-medium", diff > 0 ? "text-destructive" : "text-success")}>{diff > 0 ? "+" : ""}{formatCurrency(diff)}</TableCell>
                    <TableCell className={cn("text-right", p.yourSalesImpact >= 0 ? "text-success" : "text-destructive")}>{p.yourSalesImpact > 0 ? "+" : ""}{p.yourSalesImpact}%</TableCell>
                    <TableCell className={cn("text-right", p.yourCvrImpact >= 0 ? "text-success" : "text-destructive")}>{p.yourCvrImpact > 0 ? "+" : ""}{p.yourCvrImpact}%</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination page={page} pageSize={pageSize} totalItems={filteredProducts.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
</AppLayout>
  );
}
