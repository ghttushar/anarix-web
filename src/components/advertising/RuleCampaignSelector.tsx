import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, Plus, Trash2, ArrowLeft, ArrowRight, X } from "lucide-react";
import { mockCampaigns } from "@/data/mockCampaigns";
import { Campaign } from "@/types/campaign";
import { cn } from "@/lib/utils";

interface RuleCampaignSelectorProps {
  onBack: () => void;
  onSaveDraft: () => void;
  onApplyRule: () => void;
  ruleName: string;
  isEdit?: boolean;
}

export function RuleCampaignSelector({ onBack, onSaveDraft: _onSaveDraft, onApplyRule, ruleName, isEdit = false }: RuleCampaignSelectorProps) {
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<Set<string>>(new Set());
  const [selectedRight, setSelectedRight] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<"active" | "all">("active");

  const availableCampaigns = useMemo(() => {
    return mockCampaigns.filter(
      (c) =>
        !addedIds.has(c.id) &&
        (statusFilter === "all" || c.status === "live") &&
        (c.name.toLowerCase().includes(leftSearch.toLowerCase()) ||
          c.id.toLowerCase().includes(leftSearch.toLowerCase()))
    );
  }, [leftSearch, addedIds, statusFilter]);

  const addedCampaigns = useMemo(() => {
    return mockCampaigns.filter(
      (c) =>
        addedIds.has(c.id) &&
        (c.name.toLowerCase().includes(rightSearch.toLowerCase()) ||
          c.id.toLowerCase().includes(rightSearch.toLowerCase()))
    );
  }, [rightSearch, addedIds]);

  const toggleLeftSelect = (id: string) => {
    setSelectedLeft((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleRightSelect = (id: string) => {
    setSelectedRight((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAllLeft = () => {
    if (selectedLeft.size === availableCampaigns.length) {
      setSelectedLeft(new Set());
    } else {
      setSelectedLeft(new Set(availableCampaigns.map((c) => c.id)));
    }
  };

  const toggleAllRight = () => {
    if (selectedRight.size === addedCampaigns.length) {
      setSelectedRight(new Set());
    } else {
      setSelectedRight(new Set(addedCampaigns.map((c) => c.id)));
    }
  };

  const addSelected = () => {
    setAddedIds((prev) => {
      const next = new Set(prev);
      selectedLeft.forEach((id) => next.add(id));
      return next;
    });
    setSelectedLeft(new Set());
  };

  const removeSelected = () => {
    setAddedIds((prev) => {
      const next = new Set(prev);
      selectedRight.forEach((id) => next.delete(id));
      return next;
    });
    setSelectedRight(new Set());
  };

  const typeBadge = (type: Campaign["type"]) => (
    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-medium">
      {type === "auto" ? "Auto" : "Manual"}
    </Badge>
  );

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Rule
        </Button>
        <span className="text-xs text-muted-foreground">
          Applying rule: <span className="font-medium text-foreground">{ruleName || "Untitled Rule"}</span>
        </span>
      </div>

      {/* Dual pane */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left: All Campaigns */}
        <div className="rounded-lg border border-border bg-card flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-semibold text-foreground">All Campaigns</h3>
              <Badge variant="secondary" className="text-xs">{availableCampaigns.length}</Badge>
            </div>
            <Button
              variant="default"
              size="sm"
              className="h-7 text-xs gap-1"
              onClick={addSelected}
              disabled={selectedLeft.size === 0}
            >
              <Plus className="h-3 w-3" />
              Add ({selectedLeft.size})
            </Button>
          </div>

          <div className="px-4 pb-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by Campaign name / ID"
                value={leftSearch}
                onChange={(e) => setLeftSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
            <div className="inline-flex items-center rounded-md border border-border p-0.5 text-[11px]">
              {(["active", "all"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setStatusFilter(opt)}
                  className={cn(
                    "px-2.5 py-1 rounded-sm capitalize transition-colors",
                    statusFilter === opt
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt === "active" ? "Active" : "All"}
                </button>
              ))}
            </div>
          </div>


          {/* Column header */}
          <div className="flex items-center gap-3 px-4 py-2 border-y border-border bg-muted/30">
            <Checkbox
              checked={availableCampaigns.length > 0 && selectedLeft.size === availableCampaigns.length}
              onCheckedChange={toggleAllLeft}
              className="h-3.5 w-3.5"
            />
            <span className="text-xs font-medium text-muted-foreground flex-1">Campaigns</span>
            <span className="text-xs font-medium text-muted-foreground">Type</span>
          </div>

          <ScrollArea className="flex-1 max-h-[400px]">
            {availableCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Search className="h-5 w-5 mb-2" />
                <p className="text-xs">No campaigns found</p>
              </div>
            ) : (
              availableCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 border-b border-border/50 cursor-pointer hover:bg-muted/20 transition-colors",
                    selectedLeft.has(campaign.id) && "bg-primary/5"
                  )}
                  onClick={() => toggleLeftSelect(campaign.id)}
                >
                  <Checkbox
                    checked={selectedLeft.has(campaign.id)}
                    onCheckedChange={() => toggleLeftSelect(campaign.id)}
                    className="h-3.5 w-3.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{campaign.name}</p>
                    <p className="text-[10px] text-muted-foreground">Campaign ID: {campaign.id}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-medium">SP</Badge>
                    {typeBadge(campaign.type)}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Right: Added Campaigns */}
        <div className="rounded-lg border border-border bg-card flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-sm font-semibold text-foreground">Added Campaigns</h3>
              <Badge variant="secondary" className="text-xs">{addedIds.size}</Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
              onClick={removeSelected}
              disabled={selectedRight.size === 0}
            >
              <Trash2 className="h-3 w-3" />
              Remove ({selectedRight.size})
            </Button>
          </div>

          <div className="px-4 pb-2 space-y-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by Campaign name / ID"
                value={rightSearch}
                onChange={(e) => setRightSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>
          </div>

          {/* Column header */}
          <div className="flex items-center gap-3 px-4 py-2 border-y border-border bg-muted/30">
            <Checkbox
              checked={addedCampaigns.length > 0 && selectedRight.size === addedCampaigns.length}
              onCheckedChange={toggleAllRight}
              className="h-3.5 w-3.5"
            />
            <span className="text-xs font-medium text-muted-foreground flex-1">Campaigns</span>
          </div>

          <ScrollArea className="flex-1 max-h-[400px]">
            {addedCampaigns.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center mb-2">
                  <Filter className="h-4 w-4" />
                </div>
                <p className="text-xs">No campaigns added yet</p>
                <p className="text-[10px] mt-0.5">Select campaigns from the left to add them</p>
              </div>
            ) : (
              addedCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 border-b border-border/50 cursor-pointer hover:bg-muted/20 transition-colors",
                    selectedRight.has(campaign.id) && "bg-destructive/5"
                  )}
                  onClick={() => toggleRightSelect(campaign.id)}
                >
                  <Checkbox
                    checked={selectedRight.has(campaign.id)}
                    onCheckedChange={() => toggleRightSelect(campaign.id)}
                    className="h-3.5 w-3.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{campaign.name}</p>
                    <p className="text-[10px] text-muted-foreground">Campaign ID: {campaign.id}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddedIds((prev) => {
                        const next = new Set(prev);
                        next.delete(campaign.id);
                        return next;
                      });
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-3 rounded-lg border border-border bg-card px-5 py-3">
        <Button size="sm" onClick={onApplyRule} disabled={addedIds.size === 0}>
          {isEdit ? "Update Campaigns" : "Apply Rule"}
          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
