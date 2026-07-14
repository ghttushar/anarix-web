// Margin (y) vs Spend (x) scatter
const points = [
  { x: 12, y: 78, r: 7 }, { x: 22, y: 64, r: 9 }, { x: 35, y: 71, r: 6 },
  { x: 44, y: 52, r: 11 }, { x: 56, y: 38, r: 8 }, { x: 62, y: 60, r: 10 },
  { x: 70, y: 24, r: 14 }, { x: 78, y: 44, r: 7 }, { x: 85, y: 18, r: 6 },
  { x: 30, y: 84, r: 5 }, { x: 50, y: 30, r: 12 }, { x: 18, y: 48, r: 8 },
];

const EmbedScatterMargin = () => (
  <div className="p-5 bg-card">
    <div className="flex items-baseline justify-between mb-3">
      <div>
        <div className="text-sm font-semibold text-foreground">Margin vs Ad Spend</div>
        <div className="text-[11px] text-muted-foreground">Bubble size = unit volume</div>
      </div>
      <div className="text-[11px] text-muted-foreground">Last 30 days</div>
    </div>
    <svg viewBox="0 0 100 60" className="w-full h-48">
      {/* quadrant guides */}
      <line x1="50" y1="0" x2="50" y2="60" stroke="hsl(var(--border))" strokeWidth="0.2" strokeDasharray="1 1" />
      <line x1="0" y1="30" x2="100" y2="30" stroke="hsl(var(--border))" strokeWidth="0.2" strokeDasharray="1 1" />
      {/* axis labels */}
      <text x="2" y="6" fontSize="2.4" fill="hsl(var(--muted-foreground))">High margin</text>
      <text x="2" y="58" fontSize="2.4" fill="hsl(var(--muted-foreground))">Low margin</text>
      <text x="78" y="58" fontSize="2.4" fill="hsl(var(--muted-foreground))">High spend</text>
      {points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={60 - (p.y * 0.6)}
          r={p.r * 0.18}
          fill="hsl(var(--primary))"
          fillOpacity={p.y < 30 ? 0.85 : 0.45}
          stroke="hsl(var(--primary))"
          strokeWidth="0.15"
        />
      ))}
    </svg>
    <div className="flex gap-4 mt-3 text-[10px] text-muted-foreground">
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary opacity-85" /> Profit drag</span>
      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary opacity-45" /> Healthy</span>
    </div>
  </div>
);

export default EmbedScatterMargin;
