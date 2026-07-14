import { useState } from "react";
import { ExternalLink, TrendingUp, ChevronDown, ChevronRight } from "lucide-react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { DeltaBadge } from "@/components/ui/delta-badge";
import { getDelta } from "@/lib/utils/deltaGenerator";
import { ProfitabilityProduct, ProfitabilityOrder } from "@/types/profitability";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData, usePinning } from "@/components/tables/SortableTableHead";

interface ProductsPnLTableProps {
  products: ProfitabilityProduct[];
  orders?: ProfitabilityOrder[];
  mode?: "products" | "orders";
  visibleColumns?: string[];
  showDeltas?: boolean;
  onCogsClick?: (product: ProfitabilityProduct) => void;
  onTrendsClick?: (product: ProfitabilityProduct) => void;
  onMoreClick?: (product: ProfitabilityProduct) => void;
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const STATUS_STYLES: Record<string, string> = {
  delivered: "bg-success/10 text-success border-success/30",
  shipped: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processing: "bg-warning/10 text-warning border-warning/30",
  cancelled: "bg-destructive/10 text-destructive border-destructive/30",
  returned: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

export function ProductsPnLTable({ products, orders = [], mode = "products", visibleColumns, showDeltas = false, onCogsClick, onTrendsClick, onMoreClick }: ProductsPnLTableProps) {
  const { formatCurrency } = useCurrency();
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const ALL_COLUMNS = [
    { id: "units", label: "Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.units), isUnit: true },
    { id: "refundUnits", label: "Refund Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.refundUnits), isUnit: true },
    { id: "cancelledUnits", label: "Cancelled Units", getValue: (p: ProfitabilityProduct) => formatNumber(p.cancelledUnits), isUnit: true },
    { id: "gmv", label: "GMV", getValue: (p: ProfitabilityProduct) => formatCurrency(p.gmv), isUnit: false },
    { id: "authSales", label: "Auth Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.authSales), isUnit: false },
    { id: "refundSales", label: "Refund Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.refundSales), isUnit: false },
    { id: "cancelledSales", label: "Cancelled Sales", getValue: (p: ProfitabilityProduct) => formatCurrency(p.cancelledSales), isUnit: false },
    { id: "adSpend", label: "Ad Spend", getValue: (p: ProfitabilityProduct) => formatCurrency(p.adSpend), isUnit: false },
    { id: "commissionProduct", label: "Comm. Product", getValue: (p: ProfitabilityProduct) => formatCurrency(p.commissionProduct), isUnit: false },
    { id: "commissionShipping", label: "Comm. Shipping", getValue: (p: ProfitabilityProduct) => formatCurrency(p.commissionShipping), isUnit: false },
    { id: "wfsFulfillmentFee", label: "WFS Fee", getValue: (p: ProfitabilityProduct) => formatCurrency(p.wfsFulfillmentFee), isUnit: false },
    { id: "shippingFees", label: "Shipping Fees", getValue: (p: ProfitabilityProduct) => formatCurrency(p.shippingFees), isUnit: false },
    { id: "cogs", label: "COGS", getValue: (p: ProfitabilityProduct) => formatCurrency(p.cogs), isUnit: false },
    { id: "netProfit", label: "Net Profit", getValue: (p: ProfitabilityProduct) => formatCurrency(p.netProfit), isUnit: false },
    { id: "additionalFee", label: "Additional Fee", getValue: (p: ProfitabilityProduct) => formatCurrency(p.additionalFee), isUnit: false },
  ];

  const cols = visibleColumns ? ALL_COLUMNS.filter((c) => visibleColumns.includes(c.id)) : ALL_COLUMNS;

  const PINNABLE_FIELDS = cols.map(c => c.id);
  const FIXED_OFFSET = 280;
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE_FIELDS, FIXED_OFFSET);

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  const toggleOrderExpand = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const TotalCell = ({ value, metric }: { value: string; metric: string }) => (
    <div className="flex flex-col items-end">
      <span className="text-foreground">{value}</span>
      {showDeltas && <DeltaBadge value={getDelta("total", metric)} />}
    </div>
  );

  // Parent/Child expand state for category rows
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const toggleCategory = (key: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Derive a category key + ASIN from the first 3 words of the product name
  const getCategoryKey = (p: ProfitabilityProduct) =>
    p.name.split(" ").slice(0, 3).join(" ");

  // Products mode — grouped parent/child
  if (mode === "products") {
    const sortedProducts = sortData(products, sortField, sortDirection);

    // Group by category
    const grouped = new Map<string, ProfitabilityProduct[]>();
    sortedProducts.forEach((p) => {
      const k = getCategoryKey(p);
      const arr = grouped.get(k) ?? [];
      arr.push(p);
      grouped.set(k, arr);
    });

    // Build a stable list of categories for pagination at the category level
    const categories = Array.from(grouped.entries()).map(([key, items]) => {
      // Aggregate metrics across children for the parent row
      const agg = items.reduce((acc, p) => {
        ALL_COLUMNS.forEach((col) => {
          (acc as any)[col.id] = ((acc as any)[col.id] || 0) + ((p as any)[col.id] || 0);
        });
        return acc;
      }, {} as Record<string, number>);
      // Parent ASIN: prefix from first child's itemId
      const parentAsin = items[0]?.itemId?.replace(/-\d+$/, "") ?? key;
      return { key, parentAsin, items, agg, image: items[0]?.image };
    });

    const paginatedCategories = categories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const totals = products.reduce((acc, p) => {
      ALL_COLUMNS.forEach((col) => {
        const key = col.id as keyof typeof acc;
        acc[key] = (acc[key] || 0) + ((p as any)[col.id] || 0);
      });
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="rounded-lg border border-border bg-card">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted hover:bg-muted">
                <SortableTableHead field="name" {...sp} isFixed className="sticky left-0 z-20 bg-muted min-w-[280px] border-r border-border">Product / Category</SortableTableHead>
                {cols.map((col) => (
                  <SortableTableHead key={col.id} field={col.id} {...sp} className={cn("text-right", pc(col.id, true))} style={ps(col.id)} align="right">{col.label}</SortableTableHead>
                ))}
                <TableHead data-info-col className="text-center w-[80px]">Info</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.map((cat) => {
                const isExpanded = expandedCategories.has(cat.key);
                const childCount = cat.items.length;
                return (
                  <>
                    {/* Parent / category row */}
                    <TableRow
                      key={`cat-${cat.key}`}
                      className="hover:bg-muted/40 group cursor-pointer"
                      onClick={(e) => {
                        const isTablet = typeof document !== "undefined" && document.documentElement.getAttribute("data-view") === "tablet";
                        if (isTablet && !(e.target as HTMLElement).closest("[data-cat-toggle]")) return;
                        toggleCategory(cat.key);
                      }}
                    >
                      <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-muted transition-colors border-r border-border/20">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            data-cat-toggle
                            onClick={(e) => { e.stopPropagation(); toggleCategory(cat.key); }}
                            className="flex items-center justify-center h-8 w-8 rounded border border-border bg-muted flex-shrink-0 hover:bg-muted/70"
                            aria-label={isExpanded ? "Collapse category" : "Expand category"}
                          >
                            {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                          </button>
                          {cat.image && (
                            <img src={cat.image} alt={cat.key} className="h-9 w-9 rounded-md border border-border object-cover flex-shrink-0" />
                          )}
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium text-foreground text-sm line-clamp-1">{cat.key}</span>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                              <span className="font-medium">{cat.parentAsin}</span>
                              <span>·</span>
                              <span>{childCount} {childCount === 1 ? "product" : "products"}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {cols.map((col) => {
                        const val = (cat.agg as any)[col.id] || 0;
                        return (
                          <TableCell key={col.id} className={cn("text-right", pc(col.id))} style={ps(col.id)}>
                            <span className="text-foreground text-sm font-medium">
                              {col.isUnit ? formatNumber(val) : formatCurrency(val)}
                            </span>
                          </TableCell>
                        );
                      })}
                      <TableCell data-info-col className="text-center">
                        <span className="text-[10px] text-muted-foreground">{isExpanded ? "Open" : "Tap to expand"}</span>
                      </TableCell>
                    </TableRow>

                    {/* Child rows */}
                    {isExpanded && cat.items.map((product) => (
                      <TableRow key={product.id} className="bg-card hover:bg-muted group">
                        <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-muted transition-colors border-r border-border/20 pl-14">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="h-7 w-7 rounded border border-border object-cover flex-shrink-0" />
                            <div className="flex flex-col min-w-0">
                              <span className="text-xs font-medium text-foreground line-clamp-1">{product.name}</span>
                              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                                <span>ASIN: {product.itemId}</span>
                                <span>·</span>
                                <span>SKU: {product.sku}</span>
                                <span>·</span>
                                <span>Price: {formatCurrency(product.price)}</span>
                                <span>·</span>
                                <span>COG: {formatCurrency(product.cogs)}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                {onCogsClick && (
                                  <button onClick={(e) => { e.stopPropagation(); onCogsClick(product); }} className="text-[11px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer">
                                    <ExternalLink className="h-2.5 w-2.5" />Edit COGS
                                  </button>
                                )}
                                {onTrendsClick && (
                                  <button onClick={(e) => { e.stopPropagation(); onTrendsClick(product); }} className="text-[11px] text-primary hover:underline flex items-center gap-0.5 cursor-pointer">
                                    <TrendingUp className="h-2.5 w-2.5" />Trends
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        {cols.map((col) => (
                          <TableCell key={col.id} className={cn("text-right", pc(col.id))} style={ps(col.id)}>
                            <div className="flex flex-col items-end">
                              <span className="text-foreground text-sm">{col.getValue(product)}</span>
                              {showDeltas && <DeltaBadge value={getDelta(product.id, col.id)} />}
                            </div>
                          </TableCell>
                        ))}
                        <TableCell data-info-col className="text-center">
                          {onMoreClick ? (
                            <button onClick={(e) => { e.stopPropagation(); onMoreClick(product); }} className="text-xs text-primary hover:underline cursor-pointer">More</button>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                );
              })}

              <TableRow className="bg-muted font-medium hover:bg-muted">
                <TableCell className="sticky left-0 z-10 bg-muted border-r border-border/20 font-semibold">Total ({products.length} products · {categories.length} categories)</TableCell>
                {cols.map((col) => {
                  const val = totals[col.id] || 0;
                  return (
                    <TableCell key={col.id} className={cn("text-right", pc(col.id))} style={ps(col.id)}>
                      <TotalCell value={col.isUnit ? formatNumber(val) : formatCurrency(val)} metric={col.id} />
                    </TableCell>
                  );
                })}
                <TableCell data-info-col />
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <TablePagination
          page={currentPage}
          pageSize={pageSize}
          totalItems={categories.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    );
  }

  const sortedOrders = sortData(orders, sortField, sortDirection);
  const paginatedOrders = sortedOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const orderTotals = orders.reduce(
    (acc, o) => {
      acc.units += o.units; acc.refundUnits += o.refundUnits; acc.cancelledUnits += o.cancelledUnits;
      acc.gmv += o.gmv; acc.authSales += o.authSales; acc.refundSales += o.refundSales;
      acc.cancelledSales += o.cancelledSales; acc.adSpend += o.adSpend; acc.commissionProduct += o.commissionProduct;
      acc.commissionShipping += o.commissionShipping; acc.wfsFulfillmentFee += o.wfsFulfillmentFee;
      acc.shippingFees += o.shippingFees; acc.cogs += o.cogs; acc.netProfit += o.netProfit; acc.additionalFee += o.additionalFee;
      return acc;
    },
    { units: 0, refundUnits: 0, cancelledUnits: 0, gmv: 0, authSales: 0, refundSales: 0, cancelledSales: 0, adSpend: 0, commissionProduct: 0, commissionShipping: 0, wfsFulfillmentFee: 0, shippingFees: 0, cogs: 0, netProfit: 0, additionalFee: 0 }
  );

  const getOrderColumnValue = (order: ProfitabilityOrder, colId: string) => {
    const val = (order as any)[colId];
    if (val === undefined) return "-";
    const colDef = ALL_COLUMNS.find((c) => c.id === colId);
    if (colDef?.isUnit) return formatNumber(val);
    return formatCurrency(val);
  };

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted">
              <SortableTableHead field="orderId" {...sp} isFixed className="sticky left-0 z-20 bg-muted min-w-[300px] border-r border-border">Order Details</SortableTableHead>
              {cols.map((col) => (
                <SortableTableHead key={col.id} field={col.id} {...sp} className={cn("text-right", pc(col.id, true))} style={ps(col.id)} align="right">{col.label}</SortableTableHead>
              ))}
              <TableHead data-info-col className="text-center w-[80px]">Info</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => {
              const isExpanded = expandedOrders.has(order.id);
              return (
                <>
                  <TableRow
                    key={order.id}
                    className="hover:bg-muted/30 group cursor-pointer"
                    onClick={(e) => {
                      // On tablet, require explicit chevron tap so finger
                      // scrolling on the row doesn't toggle expand.
                      const isTablet = typeof document !== "undefined" && document.documentElement.getAttribute("data-view") === "tablet";
                      if (isTablet && !(e.target as HTMLElement).closest("[data-row-toggle]")) return;
                      toggleOrderExpand(order.id);
                    }}
                  >
                    <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-muted transition-colors border-r border-border/20">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          data-row-toggle
                          onClick={(e) => { e.stopPropagation(); toggleOrderExpand(order.id); }}
                          className="flex items-center justify-center h-8 w-8 rounded border border-border bg-muted flex-shrink-0 hover:bg-muted/70"
                          aria-label={isExpanded ? "Collapse order" : "Expand order"}
                        >
                          {isExpanded ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                        </button>
                        <div className="flex flex-col min-w-0">
                          <span className="font-medium text-foreground text-sm">{order.orderId}</span>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span>{order.flag} {order.country}</span>
                            <span>·</span>
                            <span>{order.date}</span>
                            <span>·</span>
                            <span>{order.time}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 h-4 capitalize", STATUS_STYLES[order.status])}>
                              {order.status}
                            </Badge>
                            <span className="text-xs font-medium text-foreground">{formatCurrency(order.price)}</span>
                            <span className="text-[10px] text-muted-foreground">{order.products.length} item{order.products.length !== 1 ? "s" : ""}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    {cols.map((col) => (
                      <TableCell key={col.id} className={cn("text-right", pc(col.id))} style={ps(col.id)}>
                        <div className="flex flex-col items-end">
                          <span className="text-sm">{getOrderColumnValue(order, col.id)}</span>
                          {showDeltas && <DeltaBadge value={getDelta(order.id, col.id)} />}
                        </div>
                      </TableCell>
                    ))}
                    <TableCell data-info-col className="text-center">
                      <span className="text-xs text-muted-foreground">-</span>
                    </TableCell>
                  </TableRow>

                  {isExpanded && order.products.map((product, idx) => (
                    <TableRow key={`${order.id}-${product.id}-${idx}`} className="bg-card hover:bg-muted">
                      <TableCell className="sticky left-0 z-10 bg-card pl-14 border-r border-border/20">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="h-7 w-7 rounded border border-border object-cover flex-shrink-0" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-medium text-foreground line-clamp-1">{product.name}</span>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                              <span>{product.itemId}</span>
                              <span>·</span>
                              <span>{product.sku}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      {cols.map((col) => {
                        const colDef = ALL_COLUMNS.find((c) => c.id === col.id);
                        return (
                          <TableCell key={col.id} className={cn("text-right text-xs", pc(col.id))} style={ps(col.id)}>
                            {colDef ? colDef.getValue(product) : "-"}
                          </TableCell>
                        );
                      })}
                      <TableCell data-info-col />
                    </TableRow>
                  ))}
                </>
              );
            })}

            <TableRow className="bg-muted font-medium hover:bg-muted">
              <TableCell className="sticky left-0 z-10 bg-muted border-r border-border/20 font-semibold">Total ({orders.length} orders)</TableCell>
              {cols.map((col) => {
                const val = (orderTotals as any)[col.id] || 0;
                const colDef = ALL_COLUMNS.find((c) => c.id === col.id);
                return (
                  <TableCell key={col.id} className={cn("text-right", pc(col.id))} style={ps(col.id)}>
                    <TotalCell value={colDef?.isUnit ? formatNumber(val) : formatCurrency(val)} metric={col.id} />
                  </TableCell>
                );
              })}
              <TableCell data-info-col />
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={currentPage}
        pageSize={pageSize}
        totalItems={orders.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}
