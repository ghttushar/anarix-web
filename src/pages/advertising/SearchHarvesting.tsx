import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Plus, X, Search, Download } from "lucide-react";
import { mockHarvestCandidates, type HarvestCandidate } from "@/data/mockSearchHarvesting";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AppTaskbar } from "@/components/layout/AppTaskbar";

const matchColors: Record<string, string> = {
  exact: "bg-primary/10 text-primary border-primary/20",
  phrase: "bg-warning/10 text-warning border-warning/20",
  broad: "bg-muted text-muted-foreground border-muted",
};


const breadcrumbItems = [
  { label: "Advertising", href: "/advertising/search-harvesting" },
  { label: "Search Harvesting" },
];
export default function SearchHarvesting() {
  const { formatCurrency } = useCurrency();
  const [candidates, setCandidates] = useState(mockHarvestCandidates);
  const [searchQuery, setSearchQuery] = useState("");

  const pending = candidates.filter((c) => c.status === "pending" && c.searchTerm.toLowerCase().includes(searchQuery.toLowerCase()));

  const addAsKeyword = (id: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status: "added" as const } : c)));
    toast.success("Keyword added to target campaign");
  };

  const dismiss = (id: string) => {
    setCandidates((prev) => prev.map((c) => (c.id === id ? { ...c, status: "dismissed" as const } : c)));
    toast.info("Term dismissed");
  };

  const addedCount = candidates.filter((c) => c.status === "added").length;
  const avgConfidence = pending.length > 0 ? Math.round(pending.reduce((s, c) => s + c.confidence, 0) / pending.length) : 0;

  return (
    <AppLayout>
      <div className="space-y-6">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <PageHeader
          title="Search Term Harvesting"
          subtitle="High-performing search terms surfaced for keyword targeting with Aan AI recommendations"
          actions={
            <Button variant="outline" size="sm" onClick={() => toast.success("Exporting harvest data...")}><Download className="mr-2 h-4 w-4" />Export</Button>
          }
        />

        {/* Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Pending Review</p>
            <p className="text-xl font-semibold text-foreground">{pending.length}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Added This Session</p>
            <p className="text-xl font-semibold text-foreground">{addedCount}</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Avg Confidence</p>
            <p className="text-xl font-semibold text-foreground">{avgConfidence}%</p>
          </CardContent></Card>
          <Card><CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground mb-1">Potential Revenue</p>
            <p className="text-xl font-semibold text-foreground">${pending.reduce((s, c) => s + c.adSales, 0).toLocaleString()}</p>
          </CardContent></Card>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search terms..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
        </div>

        {/* Candidate Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {pending.map((c) => (
            <Card key={c.id}>
              <CardContent className="pt-4 pb-3 px-4 space-y-3">
                <div className="flex items-start justify-between">
                  <span className="font-medium text-foreground">{c.searchTerm}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={matchColors[c.suggestedMatchType]}>
                      {c.suggestedMatchType}
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                      {c.confidence}% match
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-3 text-xs">
                  <div><span className="text-muted-foreground block">Impressions</span><span className="font-medium text-foreground">{c.impressions.toLocaleString()}</span></div>
                  <div><span className="text-muted-foreground block">Orders</span><span className="font-medium text-foreground">{c.orders}</span></div>
                  <div><span className="text-muted-foreground block">ROAS</span><span className="font-medium text-foreground">{c.roas.toFixed(2)}x</span></div>
                  <div><span className="text-muted-foreground block">Suggested Bid</span><span className="font-medium text-foreground">{formatCurrency(c.suggestedBid)}</span></div>
                </div>

                {/* Aan Explanation */}
                <div className="rounded-md bg-primary/5 border border-primary/10 p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    <span className="text-xs font-medium text-primary">Aan Analysis</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.aanExplanation}</p>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">From: {c.sourceCampaign}</span>
                  <div data-write-action className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => dismiss(c.id)}><X className="mr-1 h-3 w-3" />Dismiss</Button>
                    <Button size="sm" onClick={() => addAsKeyword(c.id)}><Plus className="mr-1 h-3 w-3" />Add Keyword</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {pending.length === 0 && (
            <div className="col-span-2 text-center py-16 text-muted-foreground">
              <p className="font-medium">All terms reviewed</p>
              <p className="text-sm mt-1">No more pending harvest candidates. Check back later for new suggestions.</p>
            </div>
          )}
        </div>
      </div>
</AppLayout>
  );
}