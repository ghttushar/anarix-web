const ROWS = [
  { label: "Revenue", value: "$2.4M" },
  { label: "Ad Spend", value: "$680K" },
  { label: "Fees", value: "$210K" },
  { label: "Margin", value: "$1.5M", highlight: true },
];

export function MiniPnLCard() {
  return (
    <div className="mt-5 rounded-xl border border-border bg-background/60 p-4">
      <div className="space-y-2">
        {ROWS.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{r.label}</span>
            <span
              className={
                r.highlight
                  ? "font-[Satoshi] font-semibold text-primary tabular-nums"
                  : "font-[Satoshi] font-medium text-foreground tabular-nums"
              }
            >
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
