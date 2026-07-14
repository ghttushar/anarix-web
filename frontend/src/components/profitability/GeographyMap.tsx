import { useState } from "react";
import { ZoomIn, ZoomOut, RotateCcw, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GeographyMapProps {
  selectedRegion?: string;
  onRegionSelect?: (regionId: string) => void;
}

const activeCountryData: Record<string, { name: string; sales: number; orders: number; opacity: number }> = {
  USA: { name: "United States", sales: 156789, orders: 12450, opacity: 0.7 },
  CAN: { name: "Canada", sales: 45678, orders: 3210, opacity: 0.45 },
  MEX: { name: "Mexico", sales: 23456, orders: 1890, opacity: 0.3 },
};

// Circle dot-matrix world map
// Each dot: [col, row, countryCode]
// Grid: ~80 cols, ~40 rows, spacing 8px, dot radius 2.2
type Dot = [number, number, string];

const dots: Dot[] = [
  // ===== NORTH AMERICA =====
  // Canada
  ...[
    [15,4],[16,4],[17,4],[18,4],[19,4],[20,4],[21,4],[22,4],[23,4],
    [14,5],[15,5],[16,5],[17,5],[18,5],[19,5],[20,5],[21,5],[22,5],[23,5],[24,5],
    [13,6],[14,6],[15,6],[16,6],[17,6],[18,6],[19,6],[20,6],[21,6],[22,6],[23,6],[24,6],
    [13,7],[14,7],[15,7],[16,7],[17,7],[18,7],[19,7],[20,7],[21,7],[22,7],[23,7],
    [14,8],[15,8],[16,8],[17,8],[18,8],[19,8],[20,8],[21,8],[22,8],
  ].map(([c,r]): Dot => [c, r, "CAN"]),

  // USA
  ...[
    [13,9],[14,9],[15,9],[16,9],[17,9],[18,9],[19,9],[20,9],[21,9],
    [13,10],[14,10],[15,10],[16,10],[17,10],[18,10],[19,10],[20,10],[21,10],
    [14,11],[15,11],[16,11],[17,11],[18,11],[19,11],[20,11],[21,11],
    [14,12],[15,12],[16,12],[17,12],[18,12],[19,12],[20,12],
    [15,13],[16,13],[17,13],[18,13],[19,13],[20,13],
    [16,14],[17,14],[18,14],[19,14],
  ].map(([c,r]): Dot => [c, r, "USA"]),

  // Mexico
  ...[
    [13,14],[14,14],[15,14],
    [12,15],[13,15],[14,15],[15,15],[16,15],
    [12,16],[13,16],[14,16],[15,16],
    [13,17],[14,17],
  ].map(([c,r]): Dot => [c, r, "MEX"]),

  // Central America
  ...[
    [15,17],[16,17],[17,17],
    [16,18],[17,18],
    [17,19],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),

  // ===== SOUTH AMERICA =====
  ...[
    [20,17],[21,17],[22,17],[23,17],
    [20,18],[21,18],[22,18],[23,18],[24,18],
    [20,19],[21,19],[22,19],[23,19],[24,19],[25,19],
    [21,20],[22,20],[23,20],[24,20],[25,20],
    [21,21],[22,21],[23,21],[24,21],[25,21],
    [22,22],[23,22],[24,22],[25,22],
    [22,23],[23,23],[24,23],
    [23,24],[24,24],
    [23,25],[24,25],
    [23,26],[24,26],
    [24,27],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),

  // ===== EUROPE =====
  ...[
    [37,4],[38,4],[39,4],[40,4],[41,4],
    [36,5],[37,5],[38,5],[39,5],[40,5],[41,5],[42,5],
    [36,6],[37,6],[38,6],[39,6],[40,6],[41,6],[42,6],[43,6],
    [37,7],[38,7],[39,7],[40,7],[41,7],[42,7],[43,7],
    [37,8],[38,8],[39,8],[40,8],[41,8],[42,8],
    [38,9],[39,9],[40,9],[41,9],[42,9],
    [38,10],[39,10],[40,10],[41,10],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),

  // ===== AFRICA =====
  ...[
    [38,11],[39,11],[40,11],[41,11],
    [37,12],[38,12],[39,12],[40,12],[41,12],[42,12],
    [37,13],[38,13],[39,13],[40,13],[41,13],[42,13],
    [38,14],[39,14],[40,14],[41,14],[42,14],
    [38,15],[39,15],[40,15],[41,15],[42,15],
    [39,16],[40,16],[41,16],[42,16],
    [39,17],[40,17],[41,17],
    [40,18],[41,18],
    [40,19],[41,19],
    [41,20],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),

  // ===== MIDDLE EAST =====
  ...[
    [43,8],[44,8],[45,8],
    [43,9],[44,9],[45,9],[46,9],
    [44,10],[45,10],[46,10],
    [44,11],[45,11],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),

  // ===== ASIA (Russia + Central + East) =====
  ...[
    [43,3],[44,3],[45,3],[46,3],[47,3],[48,3],[49,3],[50,3],[51,3],[52,3],[53,3],[54,3],[55,3],[56,3],
    [43,4],[44,4],[45,4],[46,4],[47,4],[48,4],[49,4],[50,4],[51,4],[52,4],[53,4],[54,4],[55,4],[56,4],[57,4],
    [44,5],[45,5],[46,5],[47,5],[48,5],[49,5],[50,5],[51,5],[52,5],[53,5],[54,5],[55,5],[56,5],
    [45,6],[46,6],[47,6],[48,6],[49,6],[50,6],[51,6],[52,6],[53,6],[54,6],[55,6],
    [46,7],[47,7],[48,7],[49,7],[50,7],[51,7],[52,7],[53,7],[54,7],
    [47,8],[48,8],[49,8],[50,8],[51,8],[52,8],[53,8],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),

  // ===== INDIA / SE ASIA =====
  ...[
    [48,9],[49,9],[50,9],[51,9],
    [48,10],[49,10],[50,10],[51,10],[52,10],
    [49,11],[50,11],[51,11],[52,11],
    [50,12],[51,12],[52,12],[53,12],
    [51,13],[52,13],[53,13],
    [52,14],[53,14],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),

  // ===== JAPAN / KOREA =====
  ...[
    [56,7],[57,7],
    [56,8],[57,8],
    [57,9],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),

  // ===== AUSTRALIA =====
  ...[
    [54,19],[55,19],[56,19],[57,19],
    [53,20],[54,20],[55,20],[56,20],[57,20],[58,20],
    [53,21],[54,21],[55,21],[56,21],[57,21],[58,21],
    [54,22],[55,22],[56,22],[57,22],[58,22],
    [55,23],[56,23],[57,23],
  ].map(([c,r]): Dot => [c, r, "OTHER"]),
];

const DOT_SPACING = 8;
const DOT_RADIUS = 2.2;
const SVG_WIDTH = 520;
const SVG_HEIGHT = 260;

export function GeographyMap({ selectedRegion, onRegionSelect }: GeographyMapProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  };
  const handleMouseUp = () => setIsPanning(false);

  const hoveredData = hoveredCountry ? activeCountryData[hoveredCountry] : null;

  return (
    <div className="h-full rounded-lg border border-border bg-card p-4 flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">Sales by Region</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={handleZoomIn} className="h-7 w-7" title="Zoom in">
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomOut} className="h-7 w-7" title="Zoom out">
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} className="h-7 w-7" title="Reset view">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div
        className="relative h-[400px] overflow-hidden rounded-lg bg-muted/5 border border-border select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isPanning ? "grabbing" : "grab" }}
      >
        <svg
          viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}
          className="h-full w-full"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transformOrigin: "center center",
            transition: isPanning ? "none" : "transform 0.2s ease",
          }}
          preserveAspectRatio="xMidYMid meet"
        >
          {dots.map(([col, row, country], i) => {
            const cx = col * DOT_SPACING + 10;
            const cy = row * DOT_SPACING + 10;
            const isActive = country in activeCountryData;
            const isSelected = selectedRegion === country;
            const isHovered = hoveredCountry === country;

            let fill: string;
            if (isActive) {
              const op = activeCountryData[country].opacity;
              fill = `hsl(var(--primary) / ${isHovered ? Math.min(op + 0.2, 1) : op})`;
            } else {
              fill = "hsl(var(--muted-foreground) / 0.1)";
            }

            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={isSelected ? DOT_RADIUS + 0.5 : DOT_RADIUS}
                fill={fill}
                stroke={isSelected ? "hsl(var(--primary))" : "none"}
                strokeWidth={isSelected ? 0.8 : 0}
                className="transition-colors duration-150"
                style={{ cursor: isActive ? "pointer" : "default" }}
                onMouseEnter={() => isActive && setHoveredCountry(country)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={(e) => {
                  if (!isActive) return;
                  e.stopPropagation();
                  onRegionSelect?.(country);
                }}
              />
            );
          })}
        </svg>

        {/* Floating callout cards */}
        {Object.entries(activeCountryData).map(([code, data]) => {
          const positions: Record<string, { left: string; top: string }> = {
            USA: { left: "22%", top: "38%" },
            CAN: { left: "25%", top: "14%" },
            MEX: { left: "14%", top: "52%" },
          };
          const pos = positions[code];
          if (!pos) return null;

          return (
            <div
              key={code}
              className={`absolute rounded-md border bg-popover/95 backdrop-blur-sm px-2.5 py-1.5 shadow-sm transition-all duration-150 ${
                selectedRegion === code ? "border-primary ring-1 ring-primary/20" : "border-border"
              } ${hoveredCountry === code ? "scale-105" : ""}`}
              style={{ left: pos.left, top: pos.top, pointerEvents: "none" }}
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-foreground">{data.name}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                ${data.sales.toLocaleString()}
              </p>
            </div>
          );
        })}

        {/* Hover tooltip */}
        {hoveredData && (
          <div className="absolute bottom-3 left-3 rounded-lg border border-border bg-popover px-3 py-2 shadow-lg z-10">
            <p className="font-medium text-foreground text-sm">{hoveredData.name}</p>
            <p className="text-xs text-muted-foreground">Sales: ${hoveredData.sales.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Orders: {hoveredData.orders.toLocaleString()}</p>
          </div>
        )}

        {/* Zoom indicator */}
        <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-popover/80 text-[10px] text-muted-foreground">
          {Math.round(zoom * 100)}%
        </div>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground">Low</span>
          <div className="flex rounded overflow-hidden">
            <div className="h-3 w-6" style={{ backgroundColor: "hsl(var(--primary) / 0.2)" }} />
            <div className="h-3 w-6" style={{ backgroundColor: "hsl(var(--primary) / 0.35)" }} />
            <div className="h-3 w-6" style={{ backgroundColor: "hsl(var(--primary) / 0.5)" }} />
            <div className="h-3 w-6" style={{ backgroundColor: "hsl(var(--primary) / 0.8)" }} />
          </div>
          <span className="text-[10px] text-muted-foreground">High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "hsl(var(--muted-foreground) / 0.1)" }} />
          <span className="text-[10px] text-muted-foreground">No data</span>
        </div>
      </div>
    </div>
  );
}
