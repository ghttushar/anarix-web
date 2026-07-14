import { useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { Brand } from "@/types/bi";
import { TablePagination } from "@/components/tables/TablePagination";
import { SortableTableHead, sortData, usePinning } from "@/components/tables/SortableTableHead";
import { cn } from "@/lib/utils";

interface BrandCoverageTableProps {
  brands: Brand[];
  onViewTrend?: (brandId: string) => void;
}

const PINNABLE = ["name", "productCount", "appearance", "organicSOV", "sponsoredSOV", "totalSOV"];

export function BrandCoverageTable({ brands, onViewTrend }: BrandCoverageTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const { pinnedColumns, handlePinToggle, ps, pc } = usePinning(PINNABLE, 60);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === "desc") { setSortField(null); setSortDirection("asc"); }
      else setSortDirection("desc");
    } else { setSortField(field); setSortDirection("asc"); }
  };

  const sorted = sortData(brands, sortField, sortDirection);
  const paginatedBrands = sorted.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const sp = { sortField, sortDirection, onSort: handleSort, pinnedColumns, onPinToggle: handlePinToggle };

  return (
    <div className="rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <SortableTableHead field="id" {...sp} isFixed className="w-[60px]">SI No</SortableTableHead>
            <SortableTableHead field="name" {...sp} className={cn(pc("name", true))} style={ps("name")}>Brand</SortableTableHead>
            <SortableTableHead field="productCount" {...sp} className={cn("text-right", pc("productCount", true))} style={ps("productCount")} align="right">Product Count</SortableTableHead>
            <SortableTableHead field="appearance" {...sp} className={cn("text-right", pc("appearance", true))} style={ps("appearance")} align="right">Appearance(%)</SortableTableHead>
            <SortableTableHead field="organicSOV" {...sp} className={cn("text-right", pc("organicSOV", true))} style={ps("organicSOV")} align="right">Organic SOV(%)</SortableTableHead>
            <SortableTableHead field="sponsoredSOV" {...sp} className={cn("text-right", pc("sponsoredSOV", true))} style={ps("sponsoredSOV")} align="right">Sponsored SOV(%)</SortableTableHead>
            <SortableTableHead field="totalSOV" {...sp} className={cn("text-right", pc("totalSOV", true))} style={ps("totalSOV")} align="right">Total SOV(%)</SortableTableHead>
            <SortableTableHead field="viewTrend" {...sp} isFixed className="text-center w-[100px]" align="center">View Trend</SortableTableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedBrands.map((brand, index) => (
            <TableRow key={brand.id} className="hover:bg-muted/30 group">
              <TableCell className="font-medium">{(currentPage - 1) * pageSize + index + 1}</TableCell>
              <TableCell style={ps("name")} className={cn("font-medium", pc("name"))}>{brand.name}</TableCell>
              <TableCell style={ps("productCount")} className={cn("text-right", pc("productCount"))}>{brand.productCount}</TableCell>
              <TableCell style={ps("appearance")} className={cn("text-right", pc("appearance"))}>{brand.appearance.toFixed(1)}%</TableCell>
              <TableCell style={ps("organicSOV")} className={cn("text-right", pc("organicSOV"))}>{brand.organicSOV.toFixed(1)}%</TableCell>
              <TableCell style={ps("sponsoredSOV")} className={cn("text-right", pc("sponsoredSOV"))}>{brand.sponsoredSOV.toFixed(1)}%</TableCell>
              <TableCell style={ps("totalSOV")} className={cn("text-right font-medium", pc("totalSOV"))}>{brand.totalSOV.toFixed(1)}%</TableCell>
              <TableCell className="text-center">
                <Button variant="ghost" size="sm" onClick={() => onViewTrend?.(brand.id)} className="h-8 text-primary hover:text-primary/80">
                  <TrendingUp className="h-4 w-4 mr-1" />View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination page={currentPage} pageSize={pageSize} totalItems={brands.length} onPageChange={setCurrentPage} onPageSizeChange={setPageSize} />
    </div>
  );
}
