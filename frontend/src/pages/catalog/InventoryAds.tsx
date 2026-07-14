import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, ArrowDown, ArrowUp, Minus, Pause, Play, RefreshCw } from "lucide-react";
import { mockInventoryProducts } from "@/data/mockInventoryAds";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const stockColors: Record<string, string> = {
  healthy: "bg-success/10 text-success border-success/20",
  low: "bg-warning/10 text-warning border-warning/20",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  overstock: "bg-primary/10 text-primary border-primary/20",
};

const actionIcons: Record<string, React.ReactNode> = {
  increase: <ArrowUp className="h-3 w-3 text-success" />,
  decrease: <ArrowDown className="h-3 w-3 text-warning" />,
  maintain: <Minus className="h-3 w-3 text-muted-foreground" />,
  pause: <Pause className="h-3 w-3 text-destructive" />,
};


const breadcrumbItems = [
  { label: "Catalog", href: "/catalog/inventory-ads" },
  { label: "Inventory & Ads" },
];
export default function InventoryAds() {
  const { formatCurrency } = useCurrency();
  const criticalCount = mockInventoryProducts.filter((p) => p.stockStatus === "critical").length;
  const overstockCount = mockInventoryProducts.filter((p) => p.stockStatus === "overstock").length;
  const totalSavings = mockInventoryProducts.reduce((s, p) => s + Math.max(0, p.dailyAdSpend - p.suggestedAdSpend), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Inventory-Aware Ad Optimization"
          subtitle="Automatically adjust ad spend based on stock levels — reduce spend on stockouts, increase on overstock"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => toast.info("Syncing inventory data...")}><RefreshCw className="mr-2 h-4 w-4" />Sync Inventory</Button>
              <Button size="sm" onClick={() => toast.success("Applying all suggested changes...")}><Play className="mr-2 h-4 w-4" />Apply All Suggestions</Button>
            </div>
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Products Tracked</p>
            <p className="text-xl font-semibold text-foreground">{mockInventoryProducts.length}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Critical Stock</p>
            <p className="text-xl font-semibold text-destructive">{criticalCount}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Overstock Items</p>
            <p className="text-xl font-semibold text-primary">{overstockCount}</p>
          </CardContent></Card>
          <Card className="h-full"><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Daily Savings Available</p>
            <p className="text-xl font-semibold text-success">{formatCurrency(totalSavings)}</p>
          </CardContent></Card>
        </div>

        {/* Alerts */}
        {mockInventoryProducts.filter((p) => p.stockStatus === "critical").map((p) => (
          <div key={p.id} className="rounded-lg border-l-4 border-l-destructive border border-border bg-destructive/5 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 text-destructive shrink-0" />
              <div>
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.reason}</p>
              </div>
              <Button size="sm" variant="outline" className="ml-auto shrink-0" onClick={() => toast.success(`Ad spend for ${p.name} adjusted`)}>
                Apply
              </Button>
            </div>
          </div>
        ))}

        {/* Products Table */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[200px]">Product</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Days of Supply</TableHead>
                <TableHead className="text-center">Stock Status</TableHead>
                <TableHead className="text-right">Current Ad Spend</TableHead>
                <TableHead className="text-right">Suggested Spend</TableHead>
                <TableHead className="text-center">Action</TableHead>
                <TableHead className="text-right">Revenue (30d)</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInventoryProducts.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground block">{p.sku}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{p.currentStock.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{p.daysOfSupply}</TableCell>
                  <TableCell className="text-center"><Badge variant="outline" className={stockColors[p.stockStatus]}>{p.stockStatus}</Badge></TableCell>
                  <TableCell className="text-right">{formatCurrency(p.dailyAdSpend)}/day</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(p.suggestedAdSpend)}/day</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {actionIcons[p.adSpendAction]}
                      <span className="text-xs capitalize">{p.adSpendAction}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(p.revenue30d)}</TableCell>
                  <TableCell className="text-right">{p.roas > 0 ? `${p.roas.toFixed(1)}x` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
</AppLayout>
  );
}
