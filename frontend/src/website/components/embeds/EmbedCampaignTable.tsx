const rows = [
  { name: "SP - Brand Defense", status: "Active", spend: "$4,820", roas: "5.8x", acos: "17.2%" },
  { name: "SP - Auto Discovery", status: "Active", spend: "$3,210", roas: "3.1x", acos: "32.4%" },
  { name: "SB - Hero Product", status: "Paused", spend: "$1,940", roas: "2.4x", acos: "41.6%" },
  { name: "SD - Retargeting", status: "Active", spend: "$2,108", roas: "6.2x", acos: "16.1%" },
  { name: "SP - Long Tail KW", status: "Active", spend: "$1,560", roas: "4.4x", acos: "22.7%" },
  { name: "SP - Competitor ASIN", status: "Active", spend: "$2,740", roas: "3.8x", acos: "26.3%" },
];

const Spark = ({ trend = "up" }: { trend?: "up" | "down" }) => {
  const path = trend === "up" ? "M0 18 L10 14 L20 16 L30 8 L40 10 L50 4" : "M0 4 L10 8 L20 6 L30 14 L40 12 L50 18";
  return (
    <svg viewBox="0 0 50 22" className="w-12 h-5">
      <path d={path} fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

const EmbedCampaignTable = () => (
  <div className="text-xs">
    <table className="w-full">
      <thead>
        <tr className="text-left text-muted-foreground border-b border-border bg-muted/20">
          <th className="px-4 py-2.5 font-medium">Campaign</th>
          <th className="px-3 py-2.5 font-medium">Status</th>
          <th className="px-3 py-2.5 font-medium text-right">Spend</th>
          <th className="px-3 py-2.5 font-medium text-right">ROAS</th>
          <th className="px-3 py-2.5 font-medium text-right">ACoS</th>
          <th className="px-3 py-2.5 font-medium">Trend</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.name} className="border-b border-border/60 last:border-0 hover:bg-muted/20">
            <td className="px-4 py-2.5 font-medium text-foreground whitespace-nowrap">{r.name}</td>
            <td className="px-3 py-2.5">
              <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ${r.status === "Active" ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${r.status === "Active" ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                {r.status}
              </span>
            </td>
            <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{r.spend}</td>
            <td className="px-3 py-2.5 text-right tabular-nums text-foreground font-medium">{r.roas}</td>
            <td className="px-3 py-2.5 text-right tabular-nums text-foreground">{r.acos}</td>
            <td className="px-3 py-2.5"><Spark trend={i % 3 === 2 ? "down" : "up"} /></td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default EmbedCampaignTable;
