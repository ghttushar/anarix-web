import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TablePagination } from "@/components/tables/TablePagination";
import { useCurrency } from "@/contexts/CurrencyContext";
import type { CatalogProduct, AggregatedCatalogData } from "@/types/catalog";

interface CatalogProductsTableProps {
  products: CatalogProduct[];
  aggregated: AggregatedCatalogData | null;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const formatNumber = (value: number) => new Intl.NumberFormat("en-US").format(value);

const formatCompact = (value: number) => {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return formatNumber(value);
};

const formatPercent = (value: number | null | undefined) => {
  if (value === null || value === undefined) return "—";
  return `${value.toFixed(2)}%`;
};

const formatRoas = (value: number) => {
  if (value <= 0) return "—";
  return `${value.toFixed(2)}x`;
};

export function CatalogProductsTable({
  products,
  aggregated,
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
}: CatalogProductsTableProps) {
  const { formatCurrency } = useCurrency();

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="sticky left-0 z-10 bg-muted/50 min-w-[350px]">Product Details</TableHead>
              <TableHead colSpan={7} className="text-center text-xs uppercase tracking-wider text-muted-foreground">Revenue & Cost</TableHead>
              <TableHead colSpan={5} className="text-center text-xs uppercase tracking-wider text-muted-foreground">Ads</TableHead>
            </TableRow>
            <TableRow className="bg-muted hover:bg-muted">
              <TableHead className="sticky left-0 z-10 bg-muted min-w-[350px]">Product Details</TableHead>
              <TableHead className="text-right">List Price</TableHead>
              <TableHead className="text-center">Advertised</TableHead>
              <TableHead className="text-right">Ad Spend</TableHead>
              <TableHead className="text-right">Ad Sales</TableHead>
              <TableHead className="text-right">ROAS</TableHead>
              <TableHead className="text-right">ACOS</TableHead>
              <TableHead className="text-right">TACoS</TableHead>
              <TableHead className="text-right">Total Sales</TableHead>
              <TableHead className="text-right">Total Units</TableHead>
              <TableHead className="text-right">Impressions</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">CTR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={13} className="text-center text-muted-foreground py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.asin} className="hover:bg-muted/30 group">
                  <TableCell className="sticky left-0 z-10 bg-card group-hover:bg-muted/30 min-w-[350px] transition-colors">
                    <div className="flex items-center gap-3">
                      {product.imageUrl && (
                        <img src={product.imageUrl} alt={product.itemName} className="h-10 w-10 rounded-md border border-border object-cover shrink-0" />
                      )}
                      <div className="flex flex-col min-w-0">
                        <a
                          href={`https://www.amazon.com/dp/${product.asin}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:underline line-clamp-1"
                        >
                          {product.itemName}
                        </a>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground flex-wrap">
                          <span>ASIN: {product.asin}</span>
                          <span>•</span>
                          <span>SKU: {product.sellerSku}</span>
                          {product.upcCode && (
                            <>
                              <span>•</span>
                              <span>UPC: {product.upcCode}</span>
                            </>
                          )}
                          {product.fulfilledBy && (
                            <>
                              <span>•</span>
                              <span>{product.fulfilledBy}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(product.listPrice)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.advertised ? "default" : "secondary"} className="text-xs">
                      {product.advertised ? "Yes" : "No"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(product.adSpend)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(product.adSales)}</TableCell>
                  <TableCell className="text-right font-medium tabular-nums">{formatRoas(product.roas)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(product.acos)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(product.tacos)}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(product.totalSales)}</TableCell>
                  <TableCell className="text-right">{formatNumber(product.totalUnits)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCompact(product.impressions)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatCompact(product.clicks)}</TableCell>
                  <TableCell className="text-right tabular-nums">{formatPercent(product.ctr)}</TableCell>
                </TableRow>
              ))
            )}
            {aggregated && products.length > 0 && (
              <TableRow className="bg-muted font-medium hover:bg-muted">
                <TableCell className="sticky left-0 z-10 bg-muted font-semibold">
                  Total ({formatNumber(aggregated.totalProducts)} products)
                </TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(aggregated.listPrice)}</TableCell>
                <TableCell className="text-center text-muted-foreground">—</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(aggregated.adSpend)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(aggregated.adSales)}</TableCell>
                <TableCell className="text-right text-foreground tabular-nums">{formatRoas(aggregated.roas)}</TableCell>
                <TableCell className="text-right text-foreground tabular-nums">{formatPercent(aggregated.acos)}</TableCell>
                <TableCell className="text-right text-foreground tabular-nums">{formatPercent(aggregated.tacos)}</TableCell>
                <TableCell className="text-right text-foreground">{formatCurrency(aggregated.totalSales)}</TableCell>
                <TableCell className="text-right text-foreground">{formatNumber(aggregated.totalUnits)}</TableCell>
                <TableCell className="text-right text-foreground tabular-nums">{formatCompact(aggregated.impressions)}</TableCell>
                <TableCell className="text-right text-foreground tabular-nums">{formatCompact(aggregated.clicks)}</TableCell>
                <TableCell className="text-right text-foreground tabular-nums">{formatPercent(aggregated.ctr)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        page={page}
        pageSize={pageSize}
        totalItems={total}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
}
