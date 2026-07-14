import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockSchedules } from "@/data/mockAMC";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-muted text-muted-foreground",
};


const breadcrumbItems = [
  { label: "AMC", href: "/amc/schedules" },
  { label: "Schedules" },
];
export default function AMCSchedules() {
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = mockSchedules.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.queryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="AMC Schedules"
          subtitle="Manage automated query execution schedules"
          actions={<Button><Plus className="h-4 w-4 mr-2" />New Schedule</Button>}
        />

        <div className="rounded-lg border border-border bg-card">
          <div className="border-b border-border p-4">
            <DataTableToolbar
              searchValue={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search schedules..."
              onDownload={() => toast.success("Exporting schedules...")}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Schedule Name</TableHead>
                <TableHead>Query</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(s => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell className="text-muted-foreground">{s.queryName}</TableCell>
                  <TableCell className="capitalize">{s.frequency}</TableCell>
                  <TableCell className="text-muted-foreground">{s.nextRun}</TableCell>
                  <TableCell><Badge className={statusColors[s.status]}>{s.status}</Badge></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No schedules found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
</AppLayout>
  );
}
