import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Download, RefreshCw } from "lucide-react";
import { mockPacingCampaigns, mockPacingAlerts, type PacingCampaign } from "@/data/mockBudgetPacing";
import { toast } from "sonner";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartType, ChartMetric } from "@/components/charts/ChartContainer";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const statusConfig: Record<string, { label: string; class: string }> = {
  on_track: { label: "On Track", class: "bg-success/10 text-success border-success/20" },
  overspending: { label: "Overspending", class: "bg-destructive/10 text-destructive border-destructive/20" },
  underspending: { label: "Underspending", class: "bg-warning/10 text-warning border-warning/20" },
  depleted: { label: "Depleted", class: "bg-destructive/10 text-destructive border-destructive/20" },
};

const severityConfig: Record<string, string> = {
  critical: "border-l-destructive bg-destructive/5",
  warning: "border-l-warning bg-warning/5",
  info: "border-l-primary bg-primary/5",
};

function HourlySpendChart({ selectedCampaign, chartData }: { selectedCampaign: PacingCampaign; chartData: { hour: string; spend: number; target: number }[] }) {
  const [chartType, setChartType] = useState<ChartType>("area");
  const [activeMetrics, setActiveMetrics] = useState<string[]>(["spend", "target"]);

  const metrics: ChartMetric[] = [
    { key: "spend", label: "Actual Spend", color: "hsl(var(--primary))", active: activeMetrics.includes("spend") },
    { key: "target", label: "Target", color: "hsl(var(--muted-foreground))", active: activeMetrics.includes("target") },
  ];

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]);
  };

  const renderChart = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      {chartType === "line" ? (
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="hour" tick={{ fontSize: 10 }} className="text-muted-foreground" interval={2} />
          <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickFormatter={(v) => `$${v}`} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("target") && <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" name="Target" />}
          {activeMetrics.includes("spend") && <Line type="monotone" dataKey="spend" stroke="hsl(var(--primary))" strokeWidth={2} name="Actual Spend" />}
        </LineChart>
      ) : chartType === "bar" ? (
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="hour" tick={{ fontSize: 10 }} className="text-muted-foreground" interval={2} />
          <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickFormatter={(v) => `$${v}`} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("target") && <Bar dataKey="target" fill="hsl(var(--muted-foreground))" fillOpacity={0.3} name="Target" />}
          {activeMetrics.includes("spend") && <Bar dataKey="spend" fill="hsl(var(--primary))" name="Actual Spend" />}
        </BarChart>
      ) : (
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="hour" tick={{ fontSize: 10 }} className="text-muted-foreground" interval={2} />
          <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" tickFormatter={(v) => `$${v}`} />
          <RechartsTooltip contentStyle={{ fontSize: 12 }} />
          {activeMetrics.includes("target") && <Area type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" fill="none" name="Target" />}
          {activeMetrics.includes("spend") && <Area type="monotone" dataKey="spend" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} name="Actual Spend" />}
        </AreaChart>
      )}
    </ResponsiveContainer>
  );

  return (
    <ChartContainer
      title={`Hourly Spend — ${selectedCampaign.name}`}
      metrics={metrics}
      onMetricToggle={toggleMetric}
      chartType={chartType}
      onChartTypeChange={setChartType}
      expandedChildren={renderChart(400)}
    >
      {renderChart(220)}
    </ChartContainer>
  );
}


const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/budget-pacing" },
  { label: "Budget Pacing" },
];
export default function BudgetPacing() {
  const { formatCurrency } = useCurrency();
  const [selectedCampaign, setSelectedCampaign] = useState<PacingCampaign | null>(mockPacingCampaigns[0]);

  const totalDailyBudget = mockPacingCampaigns.reduce((s, c) => s + c.dailyBudget, 0);
  const totalSpentToday = mockPacingCampaigns.reduce((s, c) => s + c.spentToday, 0);
  const totalMonthlyBudget = mockPacingCampaigns.reduce((s, c) => s + c.monthlyBudget, 0);
  const totalSpentMonth = mockPacingCampaigns.reduce((s, c) => s + c.spentThisMonth, 0);

  const chartData = selectedCampaign
    ? selectedCampaign.hourlySpend.map((spend, hour) => ({
        hour: `${hour.toString().padStart(2, "0")}:00`,
        spend: +spend.toFixed(2),
        target: +(selectedCampaign.dailyBudget / 24).toFixed(2),
      }))
    : [];

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Budget Pacing"
          subtitle="Real-time burn rate visualization with projected overspend/underspend alerts"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.info("Refreshing pacing data...")}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>
              <Button variant="outline" size="sm" onClick={() => toast.success("Exporting pacing report...")}><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>
          }
        />

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Daily Budget</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalDailyBudget)}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Spent Today</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalSpentToday)}</p>
            <Progress value={(totalSpentToday / totalDailyBudget) * 100} className="mt-2 h-1.5" />
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Monthly Budget</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalMonthlyBudget)}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Spent This Month</p>
            <p className="text-xl font-semibold text-foreground">{formatCurrency(totalSpentMonth)}</p>
            <Progress value={(totalSpentMonth / totalMonthlyBudget) * 100} className="mt-2 h-1.5" />
          </CardContent></Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Alerts */}
          <div className="space-y-3">
            <h3 className="font-heading text-sm font-semibold text-foreground">Pacing Alerts</h3>
            {mockPacingAlerts.map((alert) => (
              <div key={alert.id} className={`rounded-lg border-l-4 p-3 ${severityConfig[alert.severity]}`}>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{alert.campaignName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hourly Chart */}
          <div className="lg:col-span-2">
            {selectedCampaign ? (
              <HourlySpendChart selectedCampaign={selectedCampaign} chartData={chartData} />
            ) : (
              <div className="rounded-lg border border-border bg-card p-4 text-center text-sm text-muted-foreground py-12">
                Select a campaign to view hourly spend
              </div>
            )}
          </div>
        </div>

        {/* Campaign Table */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[220px]">Campaign</TableHead>
                <TableHead className="text-right">Daily Budget</TableHead>
                <TableHead className="text-right">Spent Today</TableHead>
                <TableHead className="text-center">Burn Rate</TableHead>
                <TableHead className="text-right">Monthly Budget</TableHead>
                <TableHead className="text-right">Spent (Month)</TableHead>
                <TableHead className="text-right">Projected</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPacingCampaigns.map((c) => {
                const variance = c.projectedMonthlySpend - c.monthlyBudget;
                return (
                  <TableRow
                    key={c.id}
                    className={`cursor-pointer transition-colors ${selectedCampaign?.id === c.id ? "bg-primary/5" : ""}`}
                    onClick={() => setSelectedCampaign(c)}
                  >
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(c.dailyBudget)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(c.spentToday)}</TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Progress value={c.burnRate} className="w-16 h-1.5" />
                        <span className="text-xs text-muted-foreground w-10">{c.burnRate.toFixed(0)}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(c.monthlyBudget)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(c.spentThisMonth)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {variance > 0 ? <TrendingUp className="h-3 w-3 text-destructive" /> : variance < -500 ? <TrendingDown className="h-3 w-3 text-warning" /> : <Minus className="h-3 w-3 text-success" />}
                        <span className="text-sm">{formatCurrency(c.projectedMonthlySpend)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className={statusConfig[c.status].class}>{statusConfig[c.status].label}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
</AppLayout>
  );
}
