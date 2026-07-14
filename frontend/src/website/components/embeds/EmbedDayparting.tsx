const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// 7x24 deterministic-ish heatmap intensities
const data = days.map((_, d) =>
  Array.from({ length: 24 }, (_, h) => {
    const peak = Math.exp(-Math.pow(h - (12 + (d % 3)), 2) / 24);
    const w = d >= 5 ? 0.75 : 1;
    return Math.min(1, peak * w + (((d * 31 + h * 7) % 13) / 80));
  })
);

const EmbedDayparting = () => (
  <div className="p-5 bg-card">
    <div className="flex items-baseline justify-between mb-3">
      <div>
        <div className="text-sm font-semibold text-foreground">Hourly Performance</div>
        <div className="text-[11px] text-muted-foreground">ROAS heatmap by day × hour</div>
      </div>
      <div className="text-[11px] text-muted-foreground">UTC−5</div>
    </div>
    <div className="flex gap-2">
      <div className="flex flex-col justify-around text-[10px] text-muted-foreground py-0.5">
        {days.map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="flex-1 grid gap-0.5" style={{ gridTemplateRows: "repeat(7, 1fr)" }}>
        {data.map((row, di) => (
          <div key={di} className="grid gap-0.5" style={{ gridTemplateColumns: "repeat(24, 1fr)" }}>
            {row.map((v, hi) => (
              <div
                key={hi}
                className="h-3.5 rounded-sm"
                style={{ backgroundColor: `hsl(var(--primary) / ${0.08 + v * 0.85})` }}
                title={`${days[di]} ${hi}:00 - ${(v * 6).toFixed(1)}x`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
    <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
      <span>00:00</span>
      <div className="flex items-center gap-1">
        <span>Low</span>
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((v) => (
          <div key={v} className="w-3 h-2 rounded-sm" style={{ backgroundColor: `hsl(var(--primary) / ${v})` }} />
        ))}
        <span>High</span>
      </div>
      <span>23:00</span>
    </div>
  </div>
);

export default EmbedDayparting;
