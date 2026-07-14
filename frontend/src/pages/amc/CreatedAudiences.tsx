import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockCreatedAudiences } from "@/data/mockAMC";
import { toast } from "sonner";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-muted text-muted-foreground",
};

const typeColors: Record<string, string> = {
  lookalike: "bg-primary/10 text-primary",
  retargeting: "bg-warning/10 text-warning",
  custom: "bg-accent/20 text-accent-foreground",
};


const breadcrumbItems = [
  { label: "AMC", href: "/amc/created-audiences" },
  { label: "Created Audiences" },
];
export default function AMCCreatedAudiences() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockCreatedAudiences.filter((ca) =>
    ca.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader title="Created Audiences" subtitle="Audiences created for activation in DSP campaigns" />

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
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(ca => (
                <TableRow key={ca.id}>
                  <TableCell className="font-medium">{ca.name}</TableCell>
                  <TableCell><Badge className={typeColors[ca.type]}>{ca.type}</Badge></TableCell>
                  <TableCell>{ca.size.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{ca.lastUpdated}</TableCell>
                  <TableCell><Badge className={statusColors[ca.status]}>{ca.status}</Badge></TableCell>
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
