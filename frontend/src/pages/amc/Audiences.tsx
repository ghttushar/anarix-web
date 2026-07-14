import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockAudiences } from "@/data/mockAMC";
import { toast } from "sonner";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const statusColors: Record<string, string> = {
  ready: "bg-success/10 text-success",
  building: "bg-primary/10 text-primary",
  expired: "bg-muted text-muted-foreground",
};


const breadcrumbItems = [
  { label: "AMC", href: "/amc/audiences" },
  { label: "Audiences" },
];
export default function AMCAudiences() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockAudiences.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.source.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader title="AMC Audiences" subtitle="Audiences generated from AMC query results" />

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search audiences..."
              onDownload={() => toast.success("Exporting audiences...")}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Audience Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Source Query</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell>{a.size.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{a.source}</TableCell>
                  <TableCell className="text-muted-foreground">{a.createdAt}</TableCell>
                  <TableCell><Badge className={statusColors[a.status]}>{a.status}</Badge></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No audiences found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
</AppLayout>
  );
}
