import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PanelLeft, Plus, FileText, Search, Palette, Bot } from "lucide-react";
import { AanGlyph } from "@/components/aan/AanGlyph";
import { AanConversation } from "@/components/aan/AanConversation";
import { AanInput } from "@/components/aan/AanInput";
import { AanArtifactViewer } from "@/components/aan/AanArtifactViewer";
import { AanPresenceProvider } from "@/components/aan/AanPresenceContext";
import { AanPresencePortal } from "@/components/aan/AanPresencePortal";
import { useAan, FilterType } from "@/components/aan/AanContext";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { cn } from "@/lib/utils";

const FILTERS: { id: FilterType; label: string; icon: any }[] = [
  { id: "reports", label: "Reports", icon: FileText },
  { id: "audit", label: "Audit", icon: Search },
  { id: "creative", label: "Creative", icon: Palette },
  { id: "agent", label: "Agent", icon: Bot },
];

/**
 * Mobile Aan workspace — full-screen, ChatGPT-style.
 * - Sticky top bar (back, glyph + "Aan", new chat).
 * - Slide-in left history drawer (filters + grouped conversations).
 * - Sticky input dock at bottom.
 */
export function MobileAanLayout() {
  const navigate = useNavigate();
  const {
    conversations, currentConversation, activeFilter, setActiveFilter,
    startNewConversation, selectConversation, viewingArtifact, closeArtifactView,
  } = useAan();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");

  const list = conversations.filter((c) => {
    if (activeFilter !== "all" && c.type !== activeFilter) return false;
    if (search && !c.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const groups: Record<string, typeof list> = { today: [], yesterday: [], thisWeek: [], older: [] };
  list.forEach((c) => {
    const d = new Date(c.updatedAt);
    if (isToday(d)) groups.today.push(c);
    else if (isYesterday(d)) groups.yesterday.push(c);
    else if (isThisWeek(d)) groups.thisWeek.push(c);
    else groups.older.push(c);
  });
  const labels: Record<string, string> = { today: "Today", yesterday: "Yesterday", thisWeek: "This Week", older: "Older" };

  return (
    <AanPresenceProvider>
      <div className="fixed inset-0 z-[60] flex flex-col bg-background">
        {/* Top bar */}
        <header className="h-14 shrink-0 sticky top-0 z-30 bg-background border-b border-border flex items-center px-2 gap-1">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="History"
            className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted"
          >
            <PanelLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 flex items-center justify-center gap-1.5 min-w-0">
            <AanGlyph className="h-5 w-5 aan-gradient-text" />
            <span className="font-aan text-2xl leading-none aan-gradient-text">Aan</span>
          </div>
          <button
            onClick={() => { startNewConversation(); setDrawerOpen(false); }}
            aria-label="New chat"
            className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted"
          >
            <Plus className="h-5 w-5" />
          </button>
        </header>

        {/* Conversation + input */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <AanConversation />
          </div>
          <div className="shrink-0 border-t border-border bg-background" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
            <AanInput />
          </div>
        </main>

        {/* History drawer */}
        <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
          <SheetContent side="left" className="w-[88vw] max-w-[340px] p-0 flex flex-col">
            <div className="h-14 shrink-0 px-3 flex items-center gap-2 border-b border-border">
              <AanGlyph className="h-5 w-5 aan-gradient-text" />
              <span className="font-aan text-2xl aan-gradient-text leading-none">Aan</span>
            </div>
            <div className="p-3 space-y-2 shrink-0">
              <button
                onClick={() => { startNewConversation(); setDrawerOpen(false); }}
                className="w-full h-10 rounded-md border border-border bg-card hover:bg-muted/60 inline-flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus className="h-4 w-4" /> New Chat
              </button>
              <div className="grid grid-cols-2 gap-1.5">
                {FILTERS.map((f) => {
                  const Icon = f.icon;
                  const active = activeFilter === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setActiveFilter(active ? "all" : f.id)}
                      className={cn(
                        "h-9 rounded-md inline-flex items-center justify-center gap-1.5 text-[12px] font-medium border",
                        active
                          ? "border-primary text-primary bg-primary/8"
                          : "border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search history…"
                className="h-9 text-[13px]"
              />
            </div>
            <ScrollArea className="flex-1 min-h-0">
              <div className="px-2 pb-4">
                {Object.entries(groups).map(([key, items]) => {
                  if (!items.length) return null;
                  return (
                    <div key={key} className="mt-3 first:mt-1">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 py-1">
                        {labels[key]}
                      </div>
                      {items.map((c) => {
                        const active = currentConversation?.id === c.id;
                        return (
                          <button
                            key={c.id}
                            onClick={() => { selectConversation(c.id); setDrawerOpen(false); }}
                            className={cn(
                              "w-full text-left rounded-md px-2 py-2.5 hover:bg-muted",
                              active && "bg-primary/8"
                            )}
                          >
                            <div className={cn("text-sm truncate", active ? "text-primary font-semibold" : "text-foreground")}>
                              {c.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground tabular-nums">
                              {format(new Date(c.updatedAt), "MMM d, h:mm a")}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>

        {viewingArtifact && (
          <AanArtifactViewer artifact={viewingArtifact} onClose={closeArtifactView} />
        )}
        <AanPresencePortal />
      </div>
    </AanPresenceProvider>
  );
}
