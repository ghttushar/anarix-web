import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  profitabilityProducts,
  profitabilityOrders,
  profitabilitySummaries,
  geographicalData,
  pnlData,
  trendDataByPeriod,
} from "@/data/mockProfitability";
import { mockUnifiedPnL } from "@/data/mockUnifiedPnL";
import type {
  ProfitabilityProduct,
  ProfitabilityOrder,
  GeographicalData,
  PnLRow,
} from "@/types/profitability";
import { TabletDataTable } from "../../data/TabletDataTable";
import { TabletTableToolbar } from "../../data/TabletTableToolbar";
import type { TabletColumn } from "../../data/types";
import { TabletKpiBand } from "../../advertising/kpi/TabletKpiBand";
import { usd, num, pct } from "../../advertising/format";
import { cn } from "@/lib/utils";

// ---------- Dashboard ----------

export function TabletProfitabilityDashboard() {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const mode: "products" | "orders" = tab === "orders" ? "orders" : "products";
  const [period, setPeriod] = useState<"today" | "yesterday" | "this_month" | "last_month">("today");

  const summary = profitabilitySummaries.find((s) => s.period === period) ?? profitabilitySummaries[0];

  const chips = [
    { label: "GMV", value: usd(summary.gmv) },
    { label: "Auth Sales", value: usd(summary.authSales) },
    { label: "Orders", value: num(summary.orders) },
    { label: "Units", value: num(summary.units) },
    { label: "Ad Cost", value: usd(summary.adCost) },
    { label: "Net Profit", value: usd(summary.netProfit) },
    { label: "TACoS", value: pct(summary.breakdown.tacos) },
    { label: "ROAS", value: `${summary.breakdown.roas.toFixed(2)}x` },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 pt-3">
        <TabletKpiBand chips={chips} />
        <div className="mt-2 flex items-center gap-1 rounded-md border border-border bg-card p-1 w-fit">
          {(["products", "orders"] as const).map((t) => (
            <button
              key={t}
              onClick={() => navigate(`/tablet/profitability/dashboard/${t}`, { replace: true })}
              className={cn(
                "min-h-9 px-3 rounded text-sm capitalize",
                mode === t ? "bg-muted text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {t}
            </button>
          ))}
          <div className="mx-2 h-6 w-px bg-border" />
          {(["today", "yesterday", "this_month", "last_month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "min-h-9 px-3 rounded text-xs whitespace-nowrap",
                period === p ? "bg-muted text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {p.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      <TabletTableToolbar title={mode === "products" ? "Products P&L" : "Orders P&L"} />
      <div className="flex-1 min-h-0">
        {mode === "products" ? <ProductsTable /> : <OrdersTable />}
      </div>
    </div>
  );
}

function ProductsTable() {
  const cols: TabletColumn<ProfitabilityProduct>[] = useMemo(
    () => [
      { id: "name", header: "Product", sticky: true, widthClass: "w-64", cell: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm text-foreground">{r.name}</div>
          <div className="truncate text-xs text-muted-foreground">{r.sku}</div>
        </div>
      )},
      { id: "units", header: "Units", align: "right", cell: (r) => num(r.units) },
      { id: "gmv", header: "GMV", align: "right", cell: (r) => usd(r.gmv) },
      { id: "authSales", header: "Auth Sales", align: "right", cell: (r) => usd(r.authSales) },
      { id: "adSpend", header: "Ad Spend", align: "right", cell: (r) => usd(r.adSpend) },
      { id: "cogs", header: "COGS", align: "right", cell: (r) => usd(r.cogs) },
      { id: "wfs", header: "WFS Fee", align: "right", cell: (r) => usd(r.wfsFulfillmentFee) },
      { id: "comm", header: "Comm.", align: "right", cell: (r) => usd(r.commissionProduct) },
      { id: "net", header: "Net Profit", align: "right", cell: (r) => (
        <span className={r.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}>{usd(r.netProfit)}</span>
      )},
    ],
    [],
  );
  return <TabletDataTable rows={profitabilityProducts} columns={cols} rowKey={(r) => r.id} />;
}

function OrdersTable() {
  const cols: TabletColumn<ProfitabilityOrder>[] = useMemo(
    () => [
      { id: "orderId", header: "Order", sticky: true, widthClass: "w-56", cell: (r) => (
        <div className="min-w-0">
          <div className="truncate text-sm">{r.orderId}</div>
          <div className="truncate text-xs text-muted-foreground">{r.date} · {r.time}</div>
        </div>
      )},
      { id: "status", header: "Status", cell: (r) => <span className="text-xs capitalize">{r.status}</span> },
      { id: "country", header: "Country", cell: (r) => <span className="whitespace-nowrap">{r.flag} {r.country}</span> },
      { id: "units", header: "Units", align: "right", cell: (r) => num(r.units) },
      { id: "gmv", header: "GMV", align: "right", cell: (r) => usd(r.gmv) },
      { id: "adSpend", header: "Ad Spend", align: "right", cell: (r) => usd(r.adSpend) },
      { id: "cogs", header: "COGS", align: "right", cell: (r) => usd(r.cogs) },
      { id: "net", header: "Net Profit", align: "right", cell: (r) => (
        <span className={r.netProfit >= 0 ? "text-emerald-600" : "text-red-600"}>{usd(r.netProfit)}</span>
      )},
    ],
    [],
  );
  return <TabletDataTable rows={profitabilityOrders} columns={cols} rowKey={(r) => r.id} />;
}

// ---------- Trends ----------

export function TabletProfitabilityTrends() {
  const [period, setPeriod] = useState<"today" | "yesterday" | "this_month" | "last_month">("this_month");
  const rows = trendDataByPeriod[period] ?? [];
  const totalOrders = rows.reduce((a, r) => a + r.orders, 0);
  const totalUnits = rows.reduce((a, r) => a + r.units, 0);

  const cols: TabletColumn<(typeof rows)[number]>[] = [
    { id: "week", header: "Bucket", sticky: true, widthClass: "w-40", cell: (r) => r.week },
    { id: "orders", header: "Orders", align: "right", cell: (r) => num(r.orders) },
    { id: "units", header: "Units", align: "right", cell: (r) => num(r.units) },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 pt-3">
        <TabletKpiBand
          chips={[
            { label: "Total Orders", value: num(totalOrders) },
            { label: "Total Units", value: num(totalUnits) },
            { label: "Avg Units / Bucket", value: rows.length ? (totalUnits / rows.length).toFixed(1) : "0" },
          ]}
        />
        <div className="mt-2 flex items-center gap-1 rounded-md border border-border bg-card p-1 w-fit">
          {(["today", "yesterday", "this_month", "last_month"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={cn(
                "min-h-9 px-3 rounded text-xs whitespace-nowrap",
                period === p ? "bg-muted text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {p.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>
      <TabletTableToolbar title="Trends" />
      <div className="flex-1 min-h-0">
        <TabletDataTable rows={rows} columns={cols} rowKey={(r) => r.week} />
      </div>
    </div>
  );
}

// ---------- Profit & Loss ----------

function flattenPnL(rows: PnLRow[]): PnLRow[] {
  const out: PnLRow[] = [];
  for (const r of rows) {
    out.push(r);
    if (r.children) out.push(...flattenPnL(r.children));
  }
  return out;
}

export function TabletProfitLoss() {
  const flat = useMemo(() => flattenPnL(pnlData), []);
  const weeks = ["Week-05", "Week-04", "Week-02", "Week-01"];

  const cols: TabletColumn<PnLRow>[] = [
    {
      id: "parameter",
      header: "Parameter",
      sticky: true,
      widthClass: "w-64",
      cell: (r) => (
        <span
          className={cn(
            "block truncate",
            r.isParent && "font-medium text-foreground",
            !r.isParent && "text-muted-foreground",
          )}
          style={{ paddingLeft: r.indent * 16 }}
        >
          {r.parameter}
        </span>
      ),
    },
    ...weeks.map<TabletColumn<PnLRow>>((w) => ({
      id: w,
      header: w,
      align: "right",
      cell: (r) => {
        const v = r.weeklyValues[w];
        return v == null ? <span className="text-muted-foreground">—</span> : usd(v);
      },
    })),
    {
      id: "total",
      header: "Total",
      align: "right",
      cell: (r) => (r.total == null ? "—" : <span className="font-medium">{usd(r.total)}</span>),
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <TabletTableToolbar title="Profit & Loss — Weekly" />
      <div className="flex-1 min-h-0">
        <TabletDataTable rows={flat} columns={cols} rowKey={(r) => r.id} />
      </div>
    </div>
  );
}

// ---------- Geographical ----------

function flattenGeo(rows: GeographicalData[]): GeographicalData[] {
  const out: GeographicalData[] = [];
  for (const r of rows) {
    out.push(r);
    if (r.children) out.push(...r.children);
  }
  return out;
}

export function TabletGeographical() {
  const flat = useMemo(() => flattenGeo(geographicalData), []);
  const totalSales = flat.filter((r) => !r.countryCode.includes("-")).reduce((a, r) => a + r.sales, 0);
  const totalOrders = flat.filter((r) => !r.countryCode.includes("-")).reduce((a, r) => a + r.orders, 0);
  const totalUnits = flat.filter((r) => !r.countryCode.includes("-")).reduce((a, r) => a + r.unitsSold, 0);

  const cols: TabletColumn<GeographicalData>[] = [
    {
      id: "region",
      header: "Region",
      sticky: true,
      widthClass: "w-56",
      cell: (r) => (
        <span
          className={cn("block truncate", r.countryCode.includes("-") && "pl-4 text-muted-foreground")}
        >
          {r.flag} {r.region}
        </span>
      ),
    },
    { id: "stocks", header: "Stocks", align: "right", cell: (r) => num(r.stocks) },
    { id: "orders", header: "Orders", align: "right", cell: (r) => num(r.orders) },
    { id: "units", header: "Units Sold", align: "right", cell: (r) => num(r.unitsSold) },
    { id: "refunds", header: "Refunds", align: "right", cell: (r) => num(r.refunds) },
    { id: "sales", header: "Sales", align: "right", cell: (r) => usd(r.sales) },
    { id: "fees", header: "Fees", align: "right", cell: (r) => usd(r.amazonFees) },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 pt-3">
        <TabletKpiBand
          chips={[
            { label: "Total Sales", value: usd(totalSales) },
            { label: "Total Orders", value: num(totalOrders) },
            { label: "Total Units", value: num(totalUnits) },
            { label: "Regions", value: String(geographicalData.length) },
          ]}
        />
      </div>
      <TabletTableToolbar title="Geographical Distribution" />
      <div className="flex-1 min-h-0">
        <TabletDataTable rows={flat} columns={cols} rowKey={(r) => r.id} />
      </div>
    </div>
  );
}

// ---------- Unified P&L ----------

export function TabletUnifiedPnL() {
  const grossRevenue = mockUnifiedPnL.find((r) => r.label === "Gross Revenue");
  const grossProfit = mockUnifiedPnL.find((r) => r.label === "Gross Profit");
  const adSpend = mockUnifiedPnL.find((r) => r.label === "Advertising Spend");
  const netProfit = mockUnifiedPnL.find((r) => r.label === "Net Profit");

  const cols: TabletColumn<(typeof mockUnifiedPnL)[number]>[] = [
    {
      id: "label",
      header: "Line Item",
      sticky: true,
      widthClass: "w-72",
      cell: (r) => (
        <span
          className={cn(
            "block truncate",
            r.isHeader && "font-medium text-foreground",
            r.isTotal && "font-semibold text-foreground",
            !r.isHeader && !r.isTotal && "text-muted-foreground",
          )}
          style={{ paddingLeft: (r.indent ?? 0) * 16 }}
        >
          {r.label}
        </span>
      ),
    },
    { id: "amazon", header: "Amazon", align: "right", cell: (r) => usd(r.amazon) },
    { id: "walmart", header: "Walmart", align: "right", cell: (r) => usd(r.walmart) },
    {
      id: "combined",
      header: "Combined",
      align: "right",
      cell: (r) => <span className="font-medium">{usd(r.combined)}</span>,
    },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="px-3 pt-3">
        <TabletKpiBand
          chips={[
            { label: "Combined Revenue", value: usd(grossRevenue?.combined ?? 0) },
            { label: "Combined Gross Profit", value: usd(grossProfit?.combined ?? 0) },
            { label: "Combined Ad Spend", value: usd(adSpend?.combined ?? 0) },
            { label: "Combined Net Profit", value: usd(netProfit?.combined ?? 0) },
          ]}
        />
      </div>
      <TabletTableToolbar title="Cross-Marketplace Unified P&L" />
      <div className="flex-1 min-h-0">
        <TabletDataTable rows={mockUnifiedPnL} columns={cols} rowKey={(r) => r.label} />
      </div>
    </div>
  );
}
