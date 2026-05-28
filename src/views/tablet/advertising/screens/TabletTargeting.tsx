import { useState } from "react";
import { mockTargetingActions } from "@/data/mockTargetingActions";
import type { TargetingAction } from "@/types/advertising";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { TabletDataTable } from "../../data/TabletDataTable";
import { TabletTableToolbar } from "../../data/TabletTableToolbar";
import type { TabletColumn } from "../../data/types";
import { TabletRightPanel } from "../../shell/TabletRightPanel";
import { TouchTarget } from "../../primitives/TouchTarget";
import { usd, num, pct, x } from "../format";

function MatchBadges({ row }: { row: TargetingAction }) {
  const items: { key: keyof TargetingAction["matchTypes"]; label: string }[] = [
    { key: "broad", label: "Broad" },
    { key: "phrase", label: "Phrase" },
    { key: "exact", label: "Exact" },
  ];
  return (
    <div className="flex gap-1">
      {items.map((it) => {
        const m = row.matchTypes[it.key];
        return (
          <span
            key={it.key}
            className={`text-xs rounded px-2 py-0.5 ${
              m.selected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
            }`}
          >
            {it.label}
            {m.selected ? ` $${m.bid.toFixed(2)}` : ""}
          </span>
        );
      })}
    </div>
  );
}

export function TabletTargetingActions() {
  const [addOpen, setAddOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [matches, setMatches] = useState({ broad: true, phrase: false, exact: true });

  const cols: TabletColumn<TargetingAction>[] = [
    { id: "term", header: "Search Term", sticky: true, sortable: true, cell: (r) => <span className="font-medium">{r.searchTerm}</span> },
    { id: "type", header: "Type", cell: (r) => r.termType },
    { id: "match", header: "Match", cell: (r) => <MatchBadges row={r} /> },
    { id: "spend", header: "Spend", align: "right", sortable: true, cell: (r) => usd(r.adSpend) },
    { id: "sales", header: "Sales", align: "right", sortable: true, cell: (r) => usd(r.adSales) },
    { id: "roas", header: "ROAS", align: "right", sortable: true, cell: (r) => x(r.roas) },
    { id: "impr", header: "Impressions", align: "right", sortable: true, cell: (r) => num(r.impressions) },
    { id: "clicks", header: "Clicks", align: "right", sortable: true, cell: (r) => num(r.clicks) },
    { id: "ctr", header: "CTR", align: "right", sortable: true, cell: (r) => pct(r.ctr) },
    { id: "cvr", header: "CVR", align: "right", sortable: true, cell: (r) => pct(r.cvr) },
  ];

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Targeting Actions</h1>
        <Button className="h-12" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Keyword
        </Button>
      </div>
      <TabletDataTable
        rows={mockTargetingActions.filter((t) => !t.archived)}
        columns={cols}
        rowKey={(r) => r.id}
        toolbar={<TabletTableToolbar title="Pending Actions" />}
      />
      <TabletRightPanel open={addOpen} onClose={() => setAddOpen(false)} title="Add Keyword Target" width={440}>
        <div className="flex flex-col h-full">
          <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Keyword</label>
              <Input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Enter keyword" className="h-12" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Match types</label>
              <div className="space-y-2">
                {(["broad", "phrase", "exact"] as const).map((m) => (
                  <label key={m} className="flex items-center gap-3 min-h-12 px-3 rounded-md border border-border">
                    <Checkbox
                      checked={matches[m]}
                      onCheckedChange={(v) => setMatches((s) => ({ ...s, [m]: !!v }))}
                      className="h-5 w-5"
                    />
                    <span className="capitalize text-sm">{m} match</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="p-4 border-t border-border flex gap-2">
            <Button variant="outline" className="flex-1 h-12" onClick={() => setAddOpen(false)}>Cancel</Button>
            <TouchTarget priority="primary" className="flex-1 rounded-md bg-primary text-primary-foreground" onClick={() => setAddOpen(false)}>
              Add
            </TouchTarget>
          </div>
        </div>
      </TabletRightPanel>
    </div>
  );
}
