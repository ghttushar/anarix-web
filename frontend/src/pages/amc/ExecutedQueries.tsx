import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockExecutedQueries } from "@/data/mockAMC";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const statusColors: Record<string, string> = {
  completed: "bg-success/10 text-success",
  failed: "bg-destructive/10 text-destructive",
  running: "bg-primary/10 text-primary",
};


const breadcrumbItems = [
  { label: "AMC", href: "/amc/executed" },
  { label: "Executed Queries" },
];
export default function AMCExecutedQueries() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockExecutedQueries.filter((eq) =>
    eq.queryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader title="Executed Queries" subtitle="View query execution history and results" />

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search executed queries..."
              onDownload={() => toast.success("Exporting executed queries...")}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Query Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Execution Time</TableHead>
                <TableHead>Results</TableHead>
                <TableHead>Executed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(eq => (
                <TableRow key={eq.id}>
                  <TableCell className="font-medium">{eq.queryName}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[eq.status]}>
                      {eq.status === "running" && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                      {eq.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{eq.executionTime}</TableCell>
                  <TableCell>{eq.resultsCount > 0 ? eq.resultsCount.toLocaleString() : "—"}</TableCell>
                  <TableCell className="text-muted-foreground">{eq.executedAt}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No executed queries found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
</AppLayout>
  );
}
