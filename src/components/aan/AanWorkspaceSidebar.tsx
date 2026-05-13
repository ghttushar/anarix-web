import { useState, useMemo } from "react";
import { FileText, Search, Palette, Bot, Plus, ChevronDown, ChevronRight, PanelLeft } from "lucide-react";
import { AanGlyph } from "./AanGlyph";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAan, FilterType } from "./AanContext";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";

interface FilterSection {
  id: FilterType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const filterSections: FilterSection[] = [
  { id: "reports", label: "Reports", icon: FileText },
  { id: "audit", label: "Audit", icon: Search },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "agent", label: "Agent", icon: Bot },
];

export function AanWorkspaceSidebar() {
  const {
    conversations, currentConversation, activeFilter, setActiveFilter,
    startNewConversation, selectConversation,
  } = useAan();
  const [searchQuery, setSearchQuery] = useState("");
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredConversations = useMemo(() => {
    let filtered = conversations;
    if (activeFilter !== "all") filtered = filtered.filter(c => c.type === activeFilter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => c.title.toLowerCase().includes(query));
    }
    return filtered;
  }, [conversations, activeFilter, searchQuery]);

  const groupedConversations = useMemo(() => {
    const groups: Record<string, typeof filteredConversations> = {
      today: [], yesterday: [], thisWeek: [], thisMonth: [], older: [],
    };
    filteredConversations.forEach(conv => {
      const date = new Date(conv.updatedAt);
      if (isToday(date)) groups.today.push(conv);
      else if (isYesterday(date)) groups.yesterday.push(conv);
      else if (isThisWeek(date)) groups.thisWeek.push(conv);
      else if (isThisMonth(date)) groups.thisMonth.push(conv);
      else groups.older.push(conv);
    });
    return groups;
  }, [filteredConversations]);

  const dateGroupLabels: Record<string, string> = {
    today: "Today", yesterday: "Yesterday", thisWeek: "This Week", thisMonth: "This Month", older: "Older",
  };

  if (isCollapsed) {
    return (
      <aside className="w-14 border-r border-border bg-card flex flex-col h-full shrink-0">
        {/* Collapsed header - centered symbol logo */}
        <div className="flex items-center justify-center h-12 border-b border-border/30 shrink-0">
          <AanGlyph className="h-6 w-6 aan-gradient-text" staticEyes />
        </div>

        {/* Expand button */}
        <div className="flex justify-center py-2">
          <button
            onClick={() => setIsCollapsed(false)}
            className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="Expand sidebar"
          >
            <PanelLeft className="h-4 w-4" />
          </button>
        </div>

        {/* New chat icon */}
        <div className="flex justify-center py-1">
          <button
            onClick={startNewConversation}
            className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
            title="New Chat"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Filter icons */}
        <div className="flex-1 py-2 space-y-1">
          {filterSections.map(section => {
            const Icon = section.icon;
            const isActive = activeFilter === section.id;
            return (
              <div key={section.id} className="flex justify-center">
                <button
                  onClick={() => setActiveFilter(isActive ? "all" : section.id)}
                  className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-md transition-colors cursor-pointer",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  title={section.label}
                >
                  <Icon className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-full shrink-0">
      {/* Header - Logo left, collapse right (matches AppSidebar) */}
      <div className="flex items-center justify-between h-12 px-3 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-2">
          <AanGlyph className="h-6 w-6 aan-gradient-text" staticEyes />
          <span className="font-aan text-aan aan-gradient-text font-bold">Aan</span>
        </div>
        <button
          onClick={() => setIsCollapsed(true)}
          className="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Collapse sidebar"
        >
          <PanelLeft className="h-4 w-4" />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <Button onClick={startNewConversation} variant="outline" className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Filter Sections */}
      <div className="px-3 pb-3 space-y-1">
        {filterSections.map(section => {
          const Icon = section.icon;
          const isActive = activeFilter === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveFilter(isActive ? "all" : section.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all cursor-pointer",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="h-px bg-border mx-3" />

      {/* Chat History Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <button
          onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
          className="flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <span>Chat History</span>
          {isHistoryExpanded ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>

        {isHistoryExpanded && (
          <>
            <div className="px-3 pb-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input placeholder="Search history..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-8 h-8 text-sm" />
              </div>
            </div>

            <ScrollArea className="flex-1 px-2">
              <div className="space-y-4 pb-4">
                {Object.entries(groupedConversations).map(([groupKey, convs]) => {
                  if (convs.length === 0) return null;
                  return (
                    <div key={groupKey}>
                      <p className="text-xs font-medium text-muted-foreground px-2 mb-1">
                        {dateGroupLabels[groupKey]}
                      </p>
                      <div className="space-y-0.5">
                        {convs.map(conv => (
                          <button
                            key={conv.id}
                            onClick={() => selectConversation(conv.id)}
                            className={cn(
                              "flex flex-col w-full text-left rounded-md px-2 py-2 transition-colors cursor-pointer",
                              currentConversation?.id === conv.id
                                ? "bg-primary/10 text-foreground"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                          >
                            <span className="text-sm font-medium truncate">{conv.title}</span>
                            <span className="text-xs opacity-70">
                              {format(new Date(conv.updatedAt), "MMM d, h:mm a")}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {filteredConversations.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {searchQuery ? "No matching conversations" : "No conversations yet"}
                  </p>
                )}
              </div>
            </ScrollArea>
          </>
        )}
      </div>
    </aside>
  );
}
