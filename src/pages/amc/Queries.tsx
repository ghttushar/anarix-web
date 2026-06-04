import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockQueries } from "@/data/mockAMC";
import { Plus, Play, MoreHorizontal, Calendar, Clock } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { format } from "date-fns";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileCard, MobileCardList } from "@/views/mobile/MobileCardList";

const statusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  draft: "bg-warning/10 text-warning",
  archived: "bg-muted text-muted-foreground",
};

type QueryTab = "default" | "custom";


const breadcrumbItems = [
  { label: "AMC", href: "/amc/queries" },
  { label: "Queries" },
];
export default function AMCQueries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<QueryTab>("default");
  const [queryTitle, setQueryTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [selectedTime, setSelectedTime] = useState(format(new Date(), "HH:mm"));
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [queryToDelete, setQueryToDelete] = useState<string | null>(null);
  const { view } = useViewport();
  const isMobile = view === "mobile";

  const filteredQueries = mockQueries.filter((q) =>
    q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    q.createdBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitRequest = () => {
    if (!queryTitle.trim() || !description.trim()) {
      toast.error("Query Title and Description are required.");
      return;
    }
    toast.success("Custom query request submitted successfully.");
    setQueryTitle("");
    setDescription("");
    setSelectedDate(format(new Date(), "yyyy-MM-dd"));
    setSelectedTime(format(new Date(), "HH:mm"));
  };

  const handleEdit = (queryId: string) => {
    toast.info("Opening query editor...");
  };

  const handleDuplicate = (queryId: string) => {
    toast.success("Query duplicated successfully");
  };

  const handleDeleteClick = (queryId: string) => {
    setQueryToDelete(queryId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (queryToDelete) {
      toast.success("Query deleted successfully");
      setQueryToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <div className="flex items-center justify-between">
          <PageHeader
            title="Queries"
            subtitle="Create and manage Amazon Marketing Cloud queries"
          />
          <div className="flex items-center gap-3">
            {activeTab === "default" && (
              <span className="text-sm text-muted-foreground">Looking for Custom Query?</span>
            )}
            <Button
              variant={activeTab === "custom" ? "default" : "outline"}
              onClick={() => setActiveTab(activeTab === "custom" ? "default" : "custom")}
            >
              {activeTab === "custom" ? "Back to Queries" : "Create"}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border">
          <button
            onClick={() => setActiveTab("default")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "default"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Default Queries
            {activeTab === "default" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            className={`pb-3 text-sm font-medium transition-colors relative ${
              activeTab === "custom"
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Custom Queries
            {activeTab === "custom" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
            )}
          </button>
        </div>

        {activeTab === "default" ? (
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border p-4">
              <DataTableToolbar
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
                searchPlaceholder="Search queries..."
                onDownload={() => toast.success("Exporting queries...")}
              />
            </div>
            {isMobile ? (
              <div className="p-3">
                <MobileCardList>
                  {filteredQueries.map((q) => (
                    <MobileCard
                      key={q.id}
                      title={q.name}
                      meta={`${q.createdBy} • ${q.lastRun}`}
                      kpis={[
                        { label: "Status", value: <Badge className={statusColors[q.status]}>{q.status}</Badge> },
                      ]}
                    />
                  ))}
                  {filteredQueries.length === 0 && (
                    <div className="text-center py-10 text-sm text-muted-foreground">No queries found</div>
                  )}
                </MobileCardList>
              </div>
            ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead>Query Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Run</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>SQL Preview</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQueries.map(q => (
                  <TableRow key={q.id}>
                    <TableCell className="font-medium">{q.name}</TableCell>
                    <TableCell><Badge className={statusColors[q.status]}>{q.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{q.lastRun}</TableCell>
                    <TableCell className="text-muted-foreground">{q.createdBy}</TableCell>
                    <TableCell className="text-muted-foreground text-xs font-mono max-w-[200px] truncate">{q.sqlPreview}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" title="Actions"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toast.info("Running query...")}><Play className="h-4 w-4 mr-2" />Run</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(q.id)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicate(q.id)}>Duplicate</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(q.id)} className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredQueries.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No queries found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border px-6 py-5">
              <h2 className="text-base font-semibold text-foreground">Custom Queries</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Provide custom query details, and the Anarix team will reach out to you shortly for assistance.
              </p>
            </div>

            <div className="px-6 py-5 space-y-6">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Email ID :</span>
                <span className="font-medium text-foreground">tech@anarix.ai</span>
              </div>

              <div className="border-t border-border pt-5">
                <h3 className="text-sm font-semibold text-foreground mb-5">Send Request</h3>

                <div className="space-y-4 max-w-xl">
                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">
                      Query Title <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="Name of the Query title"
                      value={queryTitle}
                      onChange={(e) => setQueryTitle(e.target.value)}
                      className="h-10"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">
                      Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      placeholder="Some Description about the request you're looking for..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-sm font-medium text-foreground">
                      Select Your Available Time and Date <span className="text-destructive">*</span>
                    </Label>
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          className="pl-10 h-10"
                        />
                      </div>
                      <div className="relative flex-1">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                        <Input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="pl-10 h-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button onClick={handleSubmitRequest} className="h-10">
                      Submit
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Query</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this query? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
</AppLayout>
  );
}
