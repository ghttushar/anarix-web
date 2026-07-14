import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { mockInstances } from "@/data/mockAMC";
import { toast } from "sonner";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  inactive: "bg-muted text-muted-foreground",
  provisioning: "bg-warning/10 text-warning",
};


const breadcrumbItems = [
  { label: "AMC", href: "/amc/instances" },
  { label: "Instances" },
];
export default function AMCInstances() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockInstances.filter((i) =>
    i.advertiserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.instanceId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader title="AMC Instances" subtitle="Manage your Amazon Marketing Cloud instances" />

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search instances..."
              onDownload={() => toast.success("Exporting instances...")}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Instance ID</TableHead>
                <TableHead>Advertiser</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(i => (
                <TableRow key={i.id}>
                  <TableCell className="font-mono text-sm">{i.instanceId}</TableCell>
                  <TableCell className="font-medium">{i.advertiserName}</TableCell>
                  <TableCell className="text-muted-foreground">{i.region}</TableCell>
                  <TableCell className="text-muted-foreground">{i.createdAt}</TableCell>
                  <TableCell><Badge className={statusColors[i.status]}>{i.status}</Badge></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No instances found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
</AppLayout>
  );
}
