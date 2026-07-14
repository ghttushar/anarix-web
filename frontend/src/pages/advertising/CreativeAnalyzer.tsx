import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sparkles, Upload, Download, Image, Video } from "lucide-react";
import { mockCreativeAssets, mockCreativeInsights } from "@/data/mockCreativeAnalyzer";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const impactColors: Record<string, string> = { high: "bg-destructive/10 text-destructive border-destructive/20", medium: "bg-warning/10 text-warning border-warning/20", low: "bg-primary/10 text-primary border-primary/20" };


const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/creative-analyzer" },
  { label: "Creative Analyzer" },
];
export default function CreativeAnalyzer() {
  const { formatCurrency } = useCurrency();
  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Creative Performance Analyzer"
          subtitle="Analyze which visual elements correlate with higher CTR and CVR across your ad creatives"
          actions={
            <div className="flex gap-2">
              <Button size="sm" onClick={() => toast.info("Upload creative assets to analyze...")}><Upload className="mr-2 h-4 w-4" />Upload Creatives</Button>
              <Button variant="outline" size="sm" onClick={() => toast.success("Exporting creative report...")}><Download className="mr-2 h-4 w-4" />Export</Button>
            </div>
          }
        />

        {/* AI Insights */}
        <div className="space-y-3">
          <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />Aan Creative Insights
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {mockCreativeInsights.map((insight) => (
              <div key={insight.id} className="rounded-lg border border-border bg-primary/5 p-3">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-foreground">{insight.insight}</p>
                  <Badge variant="outline" className={impactColors[insight.impact]}>{insight.impact}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span>Metric: {insight.metric}</span>
                  <span>Correlation: {insight.correlation > 0 ? "+" : ""}{(insight.correlation * 100).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Total Creatives</p>
            <p className="text-xl font-semibold text-foreground">{mockCreativeAssets.length}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Avg CTR</p>
            <p className="text-xl font-semibold text-foreground">{(mockCreativeAssets.reduce((s, c) => s + c.ctr, 0) / mockCreativeAssets.length).toFixed(1)}%</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Avg CVR</p>
            <p className="text-xl font-semibold text-foreground">{(mockCreativeAssets.reduce((s, c) => s + c.cvr, 0) / mockCreativeAssets.length).toFixed(1)}%</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Avg ROAS</p>
            <p className="text-xl font-semibold text-foreground">{(mockCreativeAssets.reduce((s, c) => s + c.roas, 0) / mockCreativeAssets.length).toFixed(2)}x</p>
          </CardContent></Card>
        </div>

        {/* Creative Table */}
        <div className="rounded-lg border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead className="min-w-[240px]">Creative</TableHead>
                <TableHead className="text-center">Type</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead className="text-right">Impressions</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">CTR</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">CVR</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCreativeAssets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell className="text-center">
                    {asset.type === "image" ? <Image className="h-4 w-4 mx-auto text-muted-foreground" /> : <Video className="h-4 w-4 mx-auto text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{asset.campaign}</TableCell>
                  <TableCell className="text-right">{asset.impressions.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{asset.clicks.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{asset.ctr.toFixed(1)}%</TableCell>
                  <TableCell className="text-right">{asset.orders}</TableCell>
                  <TableCell className="text-right">{asset.cvr.toFixed(1)}%</TableCell>
                  <TableCell className="text-right font-medium">{asset.roas.toFixed(2)}x</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {asset.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
</AppLayout>
  );
}
