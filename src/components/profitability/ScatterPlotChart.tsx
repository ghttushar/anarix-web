import { useState } from "react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, ReferenceArea, ZAxis,
  BarChart, Bar, LineChart, Line,
} from "recharts";
import { ScatterDataPoint } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Download, BarChart3, Activity, Target, BoxSelect } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ScatterPlotChartProps {
  data: ScatterDataPoint[];
  selectedIds?: string[];
  onPointToggle?: (id: string) => void;
}

type ChartView = "scatter" | "bar" | "line";

const quadrantColors = {
  winners: "hsl(142, 76%, 36%)",
  grow: "hsl(142, 76%, 70%)",
  optimize: "hsl(48, 96%, 53%)",
  review: "hsl(0, 84%, 60%)",
};

const quadrantLabels = {
  winners: { title: "Winners", description: "High margin, high sales" },
  grow: { title: "Grow", description: "High margin, low sales" },
  optimize: { title: "Optimize", description: "Low margin, high sales" },
  review: { title: "Review", description: "Low margin, low sales" },
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-border bg-popover p-3 shadow-lg">
        <p className="font-medium text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          Profit Margin: <span className="text-foreground">{data.profitMargin.toFixed(1)}%</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Total Sales: <span className="text-foreground">${data.totalSales.toLocaleString()}</span>
        </p>
        <p className="mt-1 text-xs capitalize" style={{ color: quadrantColors[data.quadrant as keyof typeof quadrantColors] }}>
          {quadrantLabels[data.quadrant as keyof typeof quadrantLabels].title}
        </p>
      </div>
    );
  }
  return null;
};

const viewIcons: Record<ChartView, React.ComponentType<{ className?: string }>> = {
  scatter: Target,
  bar: BarChart3,
  line: Activity,
};

export function ScatterPlotChart({ data, selectedIds, onPointToggle }: ScatterPlotChartProps) {
  const [expanded, setExpanded] = useState(false);
  const [chartView, setChartView] = useState<ChartView>("scatter");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [areaSelectMode, setAreaSelectMode] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const hasSelection = (selectedIds?.length ?? 0) > 0;

  const maxSales = Math.max(...data.map((d) => d.totalSales)) * 1.1;
  const maxMargin = Math.max(...data.map((d) => d.profitMargin)) * 1.1;
  const midMargin = 25;
  const midSales = maxSales / 2;

  const zoomedMaxSales = maxSales / zoomLevel;
  const zoomedMaxMargin = maxMargin / zoomLevel;

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z * 1.3, 4));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z / 1.3, 0.5));
  const handleReset = () => { setZoomLevel(1); setDragStart(null); setDragEnd(null); };

  const handleMouseDown = (e: any) => {
    if (!areaSelectMode || !e || e.xValue == null || e.yValue == null) return;
    setDragStart({ x: e.xValue, y: e.yValue });
    setDragEnd({ x: e.xValue, y: e.yValue });
  };
  const handleMouseMove = (e: any) => {
    if (!areaSelectMode || !dragStart || !e || e.xValue == null || e.yValue == null) return;
    setDragEnd({ x: e.xValue, y: e.yValue });
  };
  const handleMouseUp = () => {
    if (!areaSelectMode || !dragStart || !dragEnd || !onPointToggle) {
      setDragStart(null); setDragEnd(null); return;
    }
    const x1 = Math.min(dragStart.x, dragEnd.x);
    const x2 = Math.max(dragStart.x, dragEnd.x);
    const y1 = Math.min(dragStart.y, dragEnd.y);
    const y2 = Math.max(dragStart.y, dragEnd.y);
    let count = 0;
    data.forEach((d) => {
      if (d.profitMargin >= x1 && d.profitMargin <= x2 && d.totalSales >= y1 && d.totalSales <= y2) {
        if (!selectedIds?.includes(d.id)) { onPointToggle(d.id); count++; }
      }
    });
    if (count > 0) toast.success(`Selected ${count} product${count === 1 ? "" : "s"}`);
    setDragStart(null); setDragEnd(null);
  };


  // Aggregate data for bar/line views
  const quadrantAggregates = Object.keys(quadrantLabels).map((q) => {
    const items = data.filter((d) => d.quadrant === q);
    return {
      quadrant: quadrantLabels[q as keyof typeof quadrantLabels].title,
      count: items.length,
      avgMargin: items.length ? items.reduce((s, d) => s + d.profitMargin, 0) / items.length : 0,
      totalSales: items.reduce((s, d) => s + d.totalSales, 0),
      fill: quadrantColors[q as keyof typeof quadrantColors],
    };
  });

  const renderScatter = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <ReferenceArea x1={0} x2={midMargin} y1={midSales} y2={zoomedMaxSales} fill={quadrantColors.optimize} fillOpacity={0.1} />
        <ReferenceArea x1={midMargin} x2={zoomedMaxMargin} y1={midSales} y2={zoomedMaxSales} fill={quadrantColors.winners} fillOpacity={0.1} />
        <ReferenceArea x1={0} x2={midMargin} y1={0} y2={midSales} fill={quadrantColors.review} fillOpacity={0.1} />
        <ReferenceArea x1={midMargin} x2={zoomedMaxMargin} y1={0} y2={midSales} fill={quadrantColors.grow} fillOpacity={0.1} />
        <ReferenceLine x={midMargin} stroke="hsl(var(--border))" strokeDasharray="5 5" />
        <ReferenceLine y={midSales} stroke="hsl(var(--border))" strokeDasharray="5 5" />
        <XAxis type="number" dataKey="profitMargin" name="Profit Margin" unit="%" domain={[0, zoomedMaxMargin]} tick={{ fontSize: 12 }} className="text-muted-foreground" label={{ value: "Profit Margin (%)", position: "bottom", offset: 0 }} />
        <YAxis type="number" dataKey="totalSales" name="Total Sales" domain={[0, zoomedMaxSales]} tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} label={{ value: "Total Sales ($)", angle: -90, position: "insideLeft" }} />
        <ZAxis range={[80, 200]} />
        <Tooltip content={<CustomTooltip />} />
        {Object.keys(quadrantColors).map((quadrant) => {
          const quadrantData = data.filter((d) => d.quadrant === quadrant);
          return (
            <Scatter
              key={quadrant}
              name={quadrantLabels[quadrant as keyof typeof quadrantLabels].title}
              data={quadrantData}
              fill={quadrantColors[quadrant as keyof typeof quadrantColors]}
              fillOpacity={hasSelection ? 0.25 : 1}
              onClick={(p: any) => onPointToggle?.(p?.id)}
              style={{ cursor: onPointToggle ? "pointer" : "default" }}
            />
          );
        })}
        {hasSelection && (
          <Scatter
            name="Selected"
            data={data.filter((d) => selectedIds!.includes(d.id))}
            fill="hsl(var(--primary))"
            onClick={(p: any) => onPointToggle?.(p?.id)}
            style={{ cursor: onPointToggle ? "pointer" : "default" }}
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );

  const renderBar = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={quadrantAggregates} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="quadrant" tick={{ fontSize: 12 }} className="text-muted-foreground" />
        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
        {quadrantAggregates.map((item, i) => (
          <Bar key={i} dataKey="totalSales" fill={item.fill} radius={[4, 4, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );

  const renderLine = (height: number) => (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data.sort((a, b) => a.profitMargin - b.profitMargin)} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="profitMargin" tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => `${v.toFixed(0)}%`} />
        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(value: number, name: string) => name === "totalSales" ? `$${value.toLocaleString()}` : `${value.toFixed(1)}%`} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
        <Line type="monotone" dataKey="totalSales" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderChart = (height: number) => {
    switch (chartView) {
      case "bar": return renderBar(height);
      case "line": return renderLine(height);
      default: return renderScatter(height);
    }
  };

  const ViewIcon = viewIcons[chartView];

  const controls = (
    <div className="flex items-center gap-1">
      {chartView === "scatter" && (
        <>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleZoomIn} title="Zoom in"><ZoomIn className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleZoomOut} title="Zoom out"><ZoomOut className="h-3.5 w-3.5" /></Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={handleReset} title="Reset zoom"><RotateCcw className="h-3.5 w-3.5" /></Button>
          <div className="w-px h-4 bg-border mx-0.5" />
        </>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs px-2">
            <ViewIcon className="h-3.5 w-3.5" />
            {chartView === "scatter" ? "Scatter" : chartView === "bar" ? "Bar" : "Line"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setChartView("scatter")} className="text-xs gap-2 cursor-pointer"><Target className="h-3.5 w-3.5" />Scatter</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setChartView("bar")} className="text-xs gap-2 cursor-pointer"><BarChart3 className="h-3.5 w-3.5" />Bar</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setChartView("line")} className="text-xs gap-2 cursor-pointer"><Activity className="h-3.5 w-3.5" />Line</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success("Exporting chart...")} title="Export chart"><Download className="h-3.5 w-3.5" /></Button>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setExpanded(!expanded)} title="Expand">
        {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Product Performance Quadrants</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {chartView === "scatter" ? "Plot by profit margin vs total sales" : `Aggregated by quadrant (${chartView} view)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3">
              {Object.entries(quadrantLabels).map(([key, value]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: quadrantColors[key as keyof typeof quadrantColors] }} />
                  <span className="text-xs text-muted-foreground">{value.title}</span>
                </div>
              ))}
            </div>
            <div className="w-px h-5 bg-border" />
            {controls}
          </div>
        </div>
        <div className="h-[400px]">
          {renderChart(400)}
        </div>
      </div>

      {/* Expanded dialog */}
      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground text-lg">Product Performance Quadrants</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                {Object.entries(quadrantLabels).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: quadrantColors[key as keyof typeof quadrantColors] }} />
                    <span className="text-xs text-muted-foreground">{value.title}</span>
                  </div>
                ))}
              </div>
              <div className="w-px h-5 bg-border" />
              {controls}
            </div>
          </div>
          <div className="h-[70vh]">
            {renderChart(600)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
