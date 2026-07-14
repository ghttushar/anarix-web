import { useMemo, useRef, useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { ScatterDataPoint } from "@/types/profitability";
import {
  Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCcw, Download,
  BarChart3, Activity, Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAan } from "@/components/aan/AanContext";
import { buildClusters, tierColor, tierOf, ClusterItem } from "./scatterCluster";
import { ScatterTooltipCard } from "./ScatterTooltipCard";

interface ScatterPlotChartProps {
  data: ScatterDataPoint[];
  selectedIds?: string[];
  onPointToggle?: (id: string) => void;
  onPointDetail?: (id: string) => void;
}

type ChartView = "scatter" | "bar" | "line";

const viewIcons: Record<ChartView, React.ComponentType<{ className?: string }>> = {
  scatter: Target,
  bar: BarChart3,
  line: Activity,
};

interface Hover {
  cluster: ClusterItem;
  x: number;
  y: number;
}

function ScatterCanvas({
  data,
  selectedIds,
  onPointToggle,
  onPointDetail,
  height,
}: {
  data: ScatterDataPoint[];
  selectedIds?: string[];
  onPointToggle?: (id: string) => void;
  onPointDetail?: (id: string) => void;
  height: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(800);
  const [view, setView] = useState({ xMin: -35, xMax: 100, yMin: 0, yMax: 90 });
  const [hover, setHover] = useState<Hover | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ sx: number; sy: number; view: typeof view; moved: boolean } | null>(null);
  const viewRef = useRef(view);
  useEffect(() => { viewRef.current = view; }, [view]);
  const hoverTimerRef = useRef<number | null>(null);
  const scheduleHoverClose = () => {
    if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => setHover(null), 180);
  };
  const cancelHoverClose = () => {
    if (hoverTimerRef.current) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };
  useEffect(() => () => { if (hoverTimerRef.current) window.clearTimeout(hoverTimerRef.current); }, []);
  const aan = useAan();

  // baseline matches PDF exactly: X -30→100, Y 0→90 (Ad Spend $)
  const baseDomain = useMemo(() => {
    const margins = data.map((d) => d.profitMargin);
    const ads = data.map((d) => d.adSpend);
    const xMin = Math.min(-35, Math.floor(Math.min(...margins, 0) / 10) * 10);
    const xMax = Math.max(100, Math.ceil(Math.max(...margins) / 10) * 10);
    const yMin = 0;
    const yMax = Math.max(90, Math.ceil(Math.max(...ads) / 10) * 10);
    return { xMin, xMax, yMin, yMax };
  }, [data]);

  useEffect(() => {
    setView(baseDomain);
  }, [baseDomain]);

  // observe container width
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) setWidth(e.contentRect.width);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const PAD = { l: 56, r: 28, t: 16, b: 44 };
  const plotW = Math.max(50, width - PAD.l - PAD.r);
  const plotH = Math.max(50, height - PAD.t - PAD.b);

  const clusters = useMemo(
    () =>
      buildClusters({
        points: data,
        width: plotW,
        height: plotH,
        xDomain: [view.xMin, view.xMax],
        yDomain: [view.yMin, view.yMax],
        cellPx: 36,
      }),
    [data, plotW, plotH, view],
  );

  const xTicks = useMemo(() => {
    const span = view.xMax - view.xMin;
    const targetCount = Math.max(4, Math.min(10, Math.floor(plotW / 90)));
    const step = niceStep(span, targetCount);
    const ticks: number[] = [];
    const start = Math.ceil(view.xMin / step) * step;
    const seen = new Set<number>();
    for (let t = start; t <= view.xMax + 0.001; t += step) {
      const rounded = Math.round(t * 100) / 100;
      if (!seen.has(rounded)) {
        seen.add(rounded);
        ticks.push(rounded);
      }
    }
    return ticks;
  }, [view, plotW]);
  const yTicks = useMemo(() => {
    const span = view.yMax - view.yMin;
    const targetCount = Math.max(4, Math.min(8, Math.floor(plotH / 50)));
    const step = niceStep(span, targetCount);
    const ticks: number[] = [];
    const start = Math.ceil(view.yMin / step) * step;
    const seen = new Set<number>();
    for (let t = start; t <= view.yMax + 0.001; t += step) {
      const rounded = span < 5 ? Math.round(t * 10) / 10 : Math.round(t);
      if (!seen.has(rounded)) {
        seen.add(rounded);
        ticks.push(rounded);
      }
    }
    return ticks;
  }, [view, plotH]);

  const xToPx = (x: number) => PAD.l + ((x - view.xMin) / (view.xMax - view.xMin)) * plotW;
  const yToPx = (y: number) => PAD.t + plotH - ((y - view.yMin) / (view.yMax - view.yMin)) * plotH;
  const pxToX = (px: number) => view.xMin + ((px - PAD.l) / plotW) * (view.xMax - view.xMin);
  const pxToY = (py: number) => view.yMin + ((PAD.t + plotH - py) / plotH) * (view.yMax - view.yMin);

  const MIN_X_SPAN = 4;   // %
  const MIN_Y_SPAN = 2;   // $
  const MAX_X_SPAN = (baseDomain.xMax - baseDomain.xMin) * 2;
  const MAX_Y_SPAN = (baseDomain.yMax - baseDomain.yMin) * 2;
  const applyZoom = (v: typeof view, factor: number, ax: number, ay: number) => {
    let xMin = ax - (ax - v.xMin) / factor;
    let xMax = ax + (v.xMax - ax) / factor;
    let yMin = Math.max(0, ay - (ay - v.yMin) / factor);
    let yMax = ay + (v.yMax - ay) / factor;
    const xSpan = xMax - xMin;
    const ySpan = yMax - yMin;
    if (xSpan < MIN_X_SPAN || xSpan > MAX_X_SPAN) { xMin = v.xMin; xMax = v.xMax; }
    if (ySpan < MIN_Y_SPAN || ySpan > MAX_Y_SPAN) { yMin = v.yMin; yMax = v.yMax; }
    setView({ xMin, xMax, yMin, yMax });
  };
  const zoom = (factor: number, cx?: number, cy?: number) => {
    const ax = cx == null ? (view.xMin + view.xMax) / 2 : pxToX(cx);
    const ay = cy == null ? (view.yMin + view.yMax) / 2 : pxToY(cy);
    applyZoom(view, factor, ax, ay);
  };

  // Native non-passive wheel listener to actually preventDefault (React onWheel is passive)
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const rect = svg.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const v = viewRef.current;
      const factor = e.deltaY < 0 ? 1.15 : 1 / 1.15;
      const ax = v.xMin + ((cx - PAD.l) / plotW) * (v.xMax - v.xMin);
      const ay = v.yMin + ((PAD.t + plotH - cy) / plotH) * (v.yMax - v.yMin);
      let xMin = ax - (ax - v.xMin) / factor;
      let xMax = ax + (v.xMax - ax) / factor;
      let yMin = Math.max(0, ay - (ay - v.yMin) / factor);
      let yMax = ay + (v.yMax - ay) / factor;
      const xSpan = xMax - xMin;
      const ySpan = yMax - yMin;
      if (xSpan < MIN_X_SPAN || xSpan > MAX_X_SPAN) { xMin = v.xMin; xMax = v.xMax; }
      if (ySpan < MIN_Y_SPAN || ySpan > MAX_Y_SPAN) { yMin = v.yMin; yMax = v.yMax; }
      setView({ xMin, xMax, yMin, yMax });
    };
    const prevent = (e: Event) => e.preventDefault();
    svg.addEventListener("wheel", handleWheel, { passive: false });
    svg.addEventListener("gesturestart", prevent as EventListener);
    svg.addEventListener("gesturechange", prevent as EventListener);
    svg.addEventListener("gestureend", prevent as EventListener);
    return () => {
      svg.removeEventListener("wheel", handleWheel);
      svg.removeEventListener("gesturestart", prevent as EventListener);
      svg.removeEventListener("gesturechange", prevent as EventListener);
      svg.removeEventListener("gestureend", prevent as EventListener);
    };
  }, [plotW, plotH, MAX_X_SPAN, MAX_Y_SPAN]);

  const handlePointerDown = (e: React.PointerEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest("[data-bubble]")) return;
    (e.currentTarget as SVGSVGElement).setPointerCapture(e.pointerId);
    dragRef.current = { sx: e.clientX, sy: e.clientY, view, moved: false };
  };
  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.sx;
    const dy = e.clientY - dragRef.current.sy;
    if (!dragRef.current.moved && Math.abs(dx) + Math.abs(dy) < 4) return;
    if (!dragRef.current.moved) {
      dragRef.current.moved = true;
      setIsDragging(true);
      cancelHoverClose();
      setHover(null);
    }
    const sxData = (dx / plotW) * (dragRef.current.view.xMax - dragRef.current.view.xMin);
    const syData = (dy / plotH) * (dragRef.current.view.yMax - dragRef.current.view.yMin);
    setView({
      xMin: dragRef.current.view.xMin - sxData,
      xMax: dragRef.current.view.xMax - sxData,
      yMin: Math.max(0, dragRef.current.view.yMin + syData),
      yMax: dragRef.current.view.yMax + syData,
    });
  };
  const handlePointerUp = (e: React.PointerEvent<SVGSVGElement>) => {
    if (dragRef.current) {
      try { (e.currentTarget as SVGSVGElement).releasePointerCapture(e.pointerId); } catch { /* noop */ }
    }
    dragRef.current = null;
    setIsDragging(false);
  };

  const handleBubble = (c: ClusterItem) => {
    if (c.count > 1) {
      // zoom into bbox with padding so cluster splits into individual dots
      const padX = Math.max(4, (c.bbox.x2 - c.bbox.x1) * 0.6);
      const padY = Math.max(6, (c.bbox.y2 - c.bbox.y1) * 0.6);
      setView({
        xMin: c.bbox.x1 - padX,
        xMax: c.bbox.x2 + padX,
        yMin: Math.max(0, c.bbox.y1 - padY),
        yMax: c.bbox.y2 + padY,
      });
      cancelHoverClose();
      setHover(null);
      return;
    }
    const p = c.points[0];
    if (onPointDetail) onPointDetail(p.id);
    else {
      onPointToggle?.(p.id);
      aan.setPendingPrompt(`Why is "${p.name}" (ID: ${p.id}) performing this way?`);
      aan.openCopilot();
    }
  };

  const askAan = (p: ScatterDataPoint) => {
    aan.setPendingPrompt(`Why is "${p.name}" (ID: ${p.id}) performing this way?`);
    aan.openCopilot();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height, overscrollBehavior: "contain", touchAction: "none" }}
      onMouseLeave={scheduleHoverClose}
    >
      <svg
        ref={svgRef}
        width={width}
        height={height}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ cursor: isDragging ? "grabbing" : "grab", touchAction: "none", display: "block" }}
      >
        <defs>
          <marker id="arrow-x" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--muted-foreground))" />
          </marker>
          <marker id="arrow-y" viewBox="0 0 10 10" refX="5" refY="2" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0,10 L5,0 L10,10 z" fill="hsl(var(--muted-foreground))" />
          </marker>
        </defs>

        {/* grid */}
        {xTicks.map((t) => (
          <line
            key={`gx-${t}`}
            x1={xToPx(t)} x2={xToPx(t)}
            y1={PAD.t} y2={PAD.t + plotH}
            stroke="hsl(var(--border))" strokeOpacity={0.5} strokeDasharray="3 4"
          />
        ))}
        {yTicks.map((t) => (
          <line
            key={`gy-${t}`}
            x1={PAD.l} x2={PAD.l + plotW}
            y1={yToPx(t)} y2={yToPx(t)}
            stroke="hsl(var(--border))" strokeOpacity={0.5} strokeDasharray="3 4"
          />
        ))}

        {/* zero reference */}
        {view.xMin <= 0 && view.xMax >= 0 && (
          <line
            x1={xToPx(0)} x2={xToPx(0)}
            y1={PAD.t} y2={PAD.t + plotH}
            stroke="hsl(var(--muted-foreground))" strokeOpacity={0.5} strokeDasharray="6 4"
          />
        )}

        {/* axes with arrows */}
        <line
          x1={PAD.l} y1={PAD.t + plotH}
          x2={PAD.l + plotW + 8} y2={PAD.t + plotH}
          stroke="hsl(var(--muted-foreground))" strokeWidth={1}
          markerEnd="url(#arrow-x)"
        />
        <line
          x1={PAD.l} y1={PAD.t + plotH}
          x2={PAD.l} y2={PAD.t - 8}
          stroke="hsl(var(--muted-foreground))" strokeWidth={1}
          markerEnd="url(#arrow-y)"
        />

        {/* tick labels */}
        {xTicks.map((t) => (
          <text
            key={`tx-${t}`} x={xToPx(t)} y={PAD.t + plotH + 16}
            textAnchor="middle" fontSize={11} fill="hsl(var(--muted-foreground))"
          >
            {t}
          </text>
        ))}
        {yTicks.map((t) => (
          <text
            key={`ty-${t}`} x={PAD.l - 8} y={yToPx(t) + 4}
            textAnchor="end" fontSize={11} fill="hsl(var(--muted-foreground))"
          >
            {t}
          </text>
        ))}

        {/* axis labels */}
        <text
          x={PAD.l + plotW / 2} y={height - 6}
          textAnchor="middle" fontSize={12} fill="hsl(var(--foreground))" fontWeight={500}
        >
          Profit Margin (%)
        </text>
        <text
          x={-(PAD.t + plotH / 2)} y={14}
          transform="rotate(-90)" textAnchor="middle"
          fontSize={12} fill="hsl(var(--foreground))" fontWeight={500}
        >
          Ad Spend ($)
        </text>

        {/* bubbles */}
        {clusters.map((c) => {
          const selected = selectedIds && c.points.some((p) => selectedIds.includes(p.id));
          const color = tierColor[c.tier];
          return (
            <g
              key={c.key}
              data-bubble
              style={{ cursor: "pointer" }}
              onMouseEnter={() => { cancelHoverClose(); setHover({ cluster: c, x: c.cx + PAD.l, y: c.cy + PAD.t }); }}
              onMouseLeave={scheduleHoverClose}
              onClick={(e) => { e.stopPropagation(); handleBubble(c); }}
            >
              <circle
                cx={c.cx + PAD.l}
                cy={c.cy + PAD.t}
                r={c.r}
                fill={color}
                fillOpacity={selected ? 1 : c.count > 1 ? 0.9 : 0.78}
                stroke={selected ? "hsl(var(--primary))" : "white"}
                strokeWidth={selected ? 2 : 1}
              />
              {c.count > 1 && (
                <text
                  x={c.cx + PAD.l}
                  y={c.cy + PAD.t + 4}
                  textAnchor="middle"
                  fontSize={c.count >= 100 ? 9 : 11}
                  fontWeight={600}
                  fill="white"
                  pointerEvents="none"
                >
                  {c.count}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* right-rail zoom controls */}
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-1 rounded-md border border-border bg-card/95 p-1 shadow-sm">
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => zoom(1.3)} title="Zoom in">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => zoom(1 / 1.3)} title="Zoom out">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setView(baseDomain)} title="Reset zoom">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
      </div>

      {hover && (
        <ScatterTooltipCard
          points={hover.cluster.points}
          tier={hover.cluster.tier}
          x={hover.x}
          y={hover.y}
          onAskAan={askAan}
          onViewDetails={onPointDetail ? (p) => onPointDetail(p.id) : undefined}
          onHoverIn={cancelHoverClose}
          onHoverOut={scheduleHoverClose}
        />
      )}
    </div>
  );
}

function niceStep(span: number, target: number) {
  const raw = span / target;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / pow;
  let nice = 1;
  if (norm >= 7.5) nice = 10;
  else if (norm >= 3.5) nice = 5;
  else if (norm >= 1.5) nice = 2;
  return nice * pow;
}

const quadrantColors = {
  winners: "hsl(142, 65%, 42%)",
  grow: "hsl(142, 65%, 65%)",
  optimize: "hsl(35, 92%, 55%)",
  review: "hsl(0, 72%, 58%)",
};
const quadrantLabels = {
  winners: { title: "Winners" },
  grow: { title: "Grow" },
  optimize: { title: "Optimize" },
  review: { title: "Review" },
};

export function ScatterPlotChart({ data, selectedIds, onPointToggle, onPointDetail }: ScatterPlotChartProps) {
  const [expanded, setExpanded] = useState(false);
  const [chartView, setChartView] = useState<ChartView>("scatter");

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
      <LineChart data={[...data].sort((a, b) => a.profitMargin - b.profitMargin)} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="profitMargin" tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => `${v.toFixed(0)}%`} />
        <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
        <Tooltip formatter={(value: number, name: string) => name === "totalSales" ? `$${value.toLocaleString()}` : `${value.toFixed(1)}%`} contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
        <Line type="monotone" dataKey="totalSales" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  const ViewIcon = viewIcons[chartView];

  const renderChart = (h: number) =>
    chartView === "bar" ? renderBar(h)
    : chartView === "line" ? renderLine(h)
    : <ScatterCanvas data={data} selectedIds={selectedIds} onPointToggle={onPointToggle} onPointDetail={onPointDetail} height={h} />;

  const tierLegend = [
    { tier: "loss" as const, label: "Loss (<0%)" },
    { tier: "mid" as const, label: "Mid (0–30%)" },
    { tier: "winner" as const, label: "Winner (≥30%)" },
  ];

  const controls = (
    <div className="flex items-center gap-1">
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
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => toast.success("Exporting chart...")} title="Export chart">
        <Download className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setExpanded(!expanded)} title="Expand">
        {expanded ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
      </Button>
    </div>
  );

  const legend =
    chartView === "scatter" ? (
      <div className="flex items-center gap-3">
        {tierLegend.map((t) => (
          <div key={t.tier} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: tierColor[t.tier] }} />
            <span className="text-xs text-muted-foreground">{t.label}</span>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex items-center gap-3">
        {Object.entries(quadrantLabels).map(([key, value]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: quadrantColors[key as keyof typeof quadrantColors] }} />
            <span className="text-xs text-muted-foreground">{value.title}</span>
          </div>
        ))}
      </div>
    );

  return (
    <>
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">Product Performance</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {chartView === "scatter"
                ? "Profit margin vs ad spend — click a cluster to zoom; click a dot for details"
                : `Aggregated by quadrant (${chartView} view)`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {legend}
            <div className="w-px h-5 bg-border" />
            {controls}
          </div>
        </div>
        <div className="h-[440px]">{renderChart(440)}</div>
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Product Performance</h3>
            <div className="flex items-center gap-3">
              {legend}
              <div className="w-px h-5 bg-border" />
              {controls}
            </div>
          </div>
          <div className="h-[70vh]">{renderChart(typeof window !== "undefined" ? Math.min(700, window.innerHeight * 0.7) : 600)}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
