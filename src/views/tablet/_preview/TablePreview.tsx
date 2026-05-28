import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { TabletDataTable } from "../data/TabletDataTable";
import { TabletTableToolbar } from "../data/TabletTableToolbar";
import { TabletColumnMenu } from "../data/TabletColumnMenu";
import type { TabletColumn } from "../data/types";
import { TabletFilterBuilder } from "../filters/TabletFilterBuilder";
import { TabletFilterChips } from "../filters/TabletFilterChips";
import type { FilterState } from "../filters/types";
import { TabletDateRangePicker } from "../datepicker/TabletDateRangePicker";

interface Row {
  id: string;
  name: string;
  marketplace: string;
  spend: number;
  sales: number;
  acos: number;
}

const ROWS: Row[] = [
  { id: "r1", name: "Walmart — Home Decor SP", marketplace: "Walmart", spend: 12450, sales: 48210, acos: 25.8 },
  { id: "r2", name: "Amazon — Kitchen Auto", marketplace: "Amazon", spend: 9820, sales: 31040, acos: 31.6 },
  { id: "r3", name: "Amazon — Toys Manual", marketplace: "Amazon", spend: 5420, sales: 22180, acos: 24.4 },
  { id: "r4", name: "Walmart — Outdoor SP", marketplace: "Walmart", spend: 7310, sales: 19420, acos: 37.6 },
  { id: "r5", name: "Amazon — Beauty Sponsored", marketplace: "Amazon", spend: 14210, sales: 62110, acos: 22.9 },
  { id: "r6", name: "TikTok — Apparel Push", marketplace: "TikTok", spend: 3210, sales: 8900, acos: 36.1 },
];

const ALL_COLUMNS: { id: string; label: string }[] = [
  { id: "name", label: "Campaign" },
  { id: "marketplace", label: "Marketplace" },
  { id: "spend", label: "Spend" },
  { id: "sales", label: "Sales" },
  { id: "acos", label: "ACoS" },
];

const fmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function TablePreview() {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState<Set<string>>(new Set(ALL_COLUMNS.map((c) => c.id)));
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState<FilterState>({ combinator: "and", rules: [] });
  const [range, setRange] = useState<DateRange | undefined>();

  const columns: TabletColumn<Row>[] = useMemo(() => {
    const all: TabletColumn<Row>[] = [
      { id: "name", header: "Campaign", cell: (r) => <span className="font-medium">{r.name}</span>, sticky: true, sortable: true },
      { id: "marketplace", header: "Marketplace", cell: (r) => r.marketplace, sortable: true },
      { id: "spend", header: "Spend", cell: (r) => fmt.format(r.spend), align: "right", sortable: true },
      { id: "sales", header: "Sales", cell: (r) => fmt.format(r.sales), align: "right", sortable: true },
      { id: "acos", header: "ACoS", cell: (r) => `${r.acos.toFixed(1)}%`, align: "right", sortable: true },
    ];
    return all.filter((c) => visible.has(c.id));
  }, [visible]);

  const filteredRows = useMemo(() => {
    if (filter.rules.length === 0) return ROWS;
    const test = (row: Row) => {
      return filter.rules[filter.combinator === "and" ? "every" : "some"]((r) => {
        const cellRaw = (row as unknown as Record<string, unknown>)[r.columnId];
        const cell = String(cellRaw ?? "").toLowerCase();
        const v = r.value.toLowerCase();
        switch (r.operator) {
          case "eq": return cell === v;
          case "neq": return cell !== v;
          case "gt": return Number(cellRaw) > Number(r.value);
          case "lt": return Number(cellRaw) < Number(r.value);
          case "gte": return Number(cellRaw) >= Number(r.value);
          case "lte": return Number(cellRaw) <= Number(r.value);
          case "contains": return cell.includes(v);
        }
      });
    };
    return ROWS.filter(test);
  }, [filter]);

  const columnLabel = (id: string) => ALL_COLUMNS.find((c) => c.id === id)?.label ?? id;

  return (
    <div className="flex flex-col h-full p-3 gap-3">
      <div className="flex items-center gap-2">
        <TabletDateRangePicker value={range} onChange={setRange} />
      </div>
      <TabletDataTable
        rows={filteredRows}
        columns={columns}
        rowKey={(r) => r.id}
        selectable
        selected={selected}
        onSelectedChange={setSelected}
        toolbar={
          <TabletTableToolbar
            title="Campaigns"
            selectedCount={selected.size}
            onColumnsClick={() => setColumnsOpen(true)}
            onFilterClick={() => setFilterOpen(true)}
            chips={
              <TabletFilterChips
                rules={filter.rules}
                columnLabel={columnLabel}
                onRemove={(id) => setFilter((f) => ({ ...f, rules: f.rules.filter((r) => r.id !== id) }))}
              />
            }
          />
        }
      />

      <TabletColumnMenu
        open={columnsOpen}
        onClose={() => setColumnsOpen(false)}
        options={ALL_COLUMNS}
        visible={visible}
        onChange={setVisible}
      />
      <TabletFilterBuilder
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        columns={ALL_COLUMNS}
        initial={filter}
        onApply={setFilter}
      />
    </div>
  );
}
