import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { DataTableToolbar } from "@/components/advertising/DataTableToolbar";
import { KeywordTrackerTable } from "@/components/bi/KeywordTrackerTable";
import { AddKeywordModal } from "@/components/bi/AddKeywordModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { trackedKeywords as initialKeywords } from "@/data/mockBrandSOV";
import { TrackedKeyword } from "@/types/bi";
import { toast } from "sonner";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { useViewport } from "@/contexts/ViewportContext";
import { MobileCard, MobileCardList } from "@/views/mobile/MobileCardList";
import { Badge } from "@/components/ui/badge";



const breadcrumbItems = [
  { label: "Business Intelligence", href: "/bi/keyword-tracker" },
  { label: "Keyword Tracker" },
];
export default function KeywordTracker() {
  const [keywords, setKeywords] = useState<TrackedKeyword[]>(initialKeywords);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [showDeltas, setShowDeltas] = useState(false);
  const { view } = useViewport();
  const isMobile = view === "mobile";

  const activeKeywords = keywords.filter((k) => k.status === "active");
  const inactiveKeywords = keywords.filter((k) => k.status === "inactive");
  const filteredKeywords = (activeTab === "active" ? activeKeywords : inactiveKeywords).filter(
    (k) => k.keyword.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStatusChange = (id: string, status: "active" | "inactive") => {
    setKeywords((prev) => prev.map((k) => (k.id === id ? { ...k, status, updatedAt: new Date().toISOString() } : k)));
  };
  const handleDelete = (id: string) => { setKeywords((prev) => prev.filter((k) => k.id !== id)); };
  const handleAddKeyword = (newKeyword: { keyword: string; region: string; channels: ("organic" | "sponsored")[] }) => {
    const now = new Date().toISOString();
    const regionFlags: Record<string, string> = { US: "🇺🇸", CA: "🇨🇦", UK: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷" };
    setKeywords((prev) => [{ id: `new-${Date.now()}`, keyword: newKeyword.keyword, addedAt: now, updatedAt: now, region: newKeyword.region, regionFlag: regionFlags[newKeyword.region] || "🌍", channels: newKeyword.channels, status: "active" }, ...prev]);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Keyword Tracker"
          subtitle="Manage keywords for share of voice tracking"
        />

        <DataTableToolbar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search by keyword..."
          onDownload={() => toast.success("Exporting keywords...")}
          showDeltas={showDeltas}
          onShowDeltasChange={setShowDeltas}
          leftContent={
            <Button data-write-action size="sm" className="gap-1.5 text-xs h-8" onClick={() => setIsAddModalOpen(true)}>
              <Plus className="h-3.5 w-3.5" />Add Keyword
            </Button>
          }
        />

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Active ({activeKeywords.length})</TabsTrigger>
            <TabsTrigger value="inactive">Inactive ({inactiveKeywords.length})</TabsTrigger>
          </TabsList>
          {(["active", "inactive"] as const).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-4">
              {isMobile ? (
                <MobileCardList>
                  {filteredKeywords.map((k) => (
                    <MobileCard
                      key={k.id}
                      title={<span className="flex items-center gap-2"><span>{k.regionFlag}</span>{k.keyword}</span>}
                      meta={`${k.region} • ${k.channels.join(", ")}`}
                      kpis={[
                        { label: "Status", value: <Badge variant="outline" className="capitalize">{k.status}</Badge> },
                        { label: "Updated", value: new Date(k.updatedAt).toLocaleDateString() },
                      ]}
                    />
                  ))}
                </MobileCardList>
              ) : (
                <KeywordTrackerTable keywords={filteredKeywords} onStatusChange={handleStatusChange} onDelete={handleDelete} />
              )}
            </TabsContent>
          ))}
        </Tabs>


        {filteredKeywords.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No keywords found</p>
            {searchQuery && <p className="text-sm mt-1">Try adjusting your search query</p>}
          </div>
        )}
      </div>
      <AddKeywordModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddKeyword} />
</AppLayout>
  );
}
