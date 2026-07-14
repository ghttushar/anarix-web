import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CircularProgress } from "@/components/ui/circular-progress";
import { TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import { mockHealthScore, type HealthDimension } from "@/data/mockHealthScore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const statusColors: Record<string, string> = {
  good: "text-success",
  warning: "text-warning",
  critical: "text-destructive",
};

const TrendIcon = ({ trend }: { trend: string }) => {
  if (trend === "up") return <TrendingUp className="h-3.5 w-3.5 text-success" />;
  if (trend === "down") return <TrendingDown className="h-3.5 w-3.5 text-destructive" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
};


const breadcrumbItems = [
  { label: "Workspace", href: "/workspace/health-score" },
  { label: "Health Score" },
];
export default function HealthScore() {
  const { compositeScore, previousScore, trend, dimensions } = mockHealthScore;
  const delta = compositeScore - previousScore;

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Marketplace Health Score"
          subtitle="Composite account health metric weighing profitability, ad efficiency, inventory, keyword coverage, and buy box"
          actions={
            <Button variant="outline" size="sm" onClick={() => toast.info("Recalculating health score...")}><RefreshCw className="mr-2 h-4 w-4" />Recalculate</Button>
          }
        />

        {/* Composite Score */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
          <Card className="flex items-center justify-center h-full">
            <CardContent className="pt-6 pb-4 px-6 text-center">
              <CircularProgress progress={compositeScore} size={160} strokeWidth={12} className="mx-auto" />
              <p className="text-3xl font-heading font-semibold text-foreground mt-4">{compositeScore}</p>
              <p className="text-sm text-muted-foreground">out of 100</p>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <TrendIcon trend={trend} />
                <span className={cn("text-sm font-medium", delta >= 0 ? "text-success" : "text-destructive")}>
                  {delta >= 0 ? "+" : ""}{delta} from last week
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Dimension Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {dimensions.map((dim) => (
              <DimensionCard key={dim.id} dimension={dim} />
            ))}
          </div>
        </div>

        {/* Detailed Sub-Metrics */}
        <div className="space-y-4">
          <h3 className="font-heading text-sm font-semibold text-foreground">Detailed Breakdown</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dimensions.map((dim) => (
              <Card key={dim.id}>
                <CardContent className="pt-4 pb-3 px-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground text-sm">{dim.label}</span>
                      <Badge variant="outline" className="text-xs">{dim.weight}% weight</Badge>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendIcon trend={dim.trend} />
                      <span className={cn("font-semibold", getScoreColor(dim.score))}>{dim.score}</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{dim.details}</p>
                  <div className="space-y-2">
                    {dim.subMetrics.map((sm) => (
                      <div key={sm.label} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{sm.label}</span>
                        <span className={cn("font-medium", statusColors[sm.status])}>{sm.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
</AppLayout>
  );
}

function DimensionCard({ dimension }: { dimension: HealthDimension }) {
  return (
    <Card className="h-full">
      <CardContent className="pt-4 pb-3 px-4 h-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">{dimension.label}</span>
          <TrendIcon trend={dimension.trend} />
        </div>
        <div className="flex items-end gap-2">
          <span className={cn("text-2xl font-semibold", getScoreColor(dimension.score))}>{dimension.score}</span>
          <span className="text-xs text-muted-foreground mb-1">/ 100</span>
        </div>
        <Progress value={dimension.score} className="mt-2 h-1.5" />
        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{dimension.details}</p>
      </CardContent>
    </Card>
  );
}
