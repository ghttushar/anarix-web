import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { LayoutDashboard, TrendingUp, FileText, MapPin, Megaphone, Target, Package, Brain, Search, Clock, Settings, Sparkles, Plus, RefreshCw, Download } from "lucide-react";
import { useAan } from "@/components/aan";

interface CommandPaletteContextType {
  open: () => void;
  close: () => void;
  isOpen: boolean;
}

const CommandPaletteContext = createContext<CommandPaletteContextType | null>(null);

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);
  if (!context) {
    throw new Error("useCommandPalette must be used within CommandPalette");
  }
  return context;
}

const pages = [
  { name: "Dashboard", url: "/profitability/dashboard", icon: LayoutDashboard, keywords: ["home", "overview"] },
  { name: "Trends", url: "/profitability/trends", icon: TrendingUp, keywords: ["analytics", "chart"] },
  { name: "Profit & Loss", url: "/profitability/pnl", icon: FileText, keywords: ["pnl", "finance"] },
  { name: "Geographical Data", url: "/profitability/geo", icon: MapPin, keywords: ["map", "region", "state"] },
  { name: "Campaign Manager", url: "/advertising/campaigns", icon: Megaphone, keywords: ["ads", "advertising"] },
  { name: "Impact Analysis", url: "/advertising/impact", icon: Target, keywords: ["performance"] },
  { name: "Products", url: "/catalog/products", icon: Package, keywords: ["catalog", "inventory"] },
  { name: "Brand SOV", url: "/bi/brand-sov", icon: Brain, keywords: ["share of voice", "intelligence"] },
  { name: "Keyword Tracker", url: "/bi/keyword-tracker", icon: Search, keywords: ["seo", "keywords"] },
  { name: "Day Parting", url: "/dayparting/hourly", icon: Clock, keywords: ["schedule", "time"] },
  { name: "Settings", url: "/settings/appearance", icon: Settings, keywords: ["preferences", "theme"] },
  { name: "Accounts", url: "/settings/accounts", icon: Settings, keywords: ["connect", "marketplace"] },
];

const quickActions = [
  { name: "New Campaign", action: "new-campaign", icon: Plus, keywords: ["create", "add"] },
  { name: "Sync Data", action: "sync", icon: RefreshCw, keywords: ["refresh", "update"] },
  { name: "Export Report", action: "export", icon: Download, keywords: ["download", "pdf"] },
  { name: "Ask Aan AI", action: "aan", icon: Sparkles, keywords: ["ai", "help", "question"] },
];

export function CommandPalette({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { openPanel } = useAan();

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // Listen for Cmd+K or Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelect = (value: string) => {
    // Check if it's a page
    const page = pages.find(p => p.url === value);
    if (page) {
      navigate(page.url);
      close();
      return;
    }

    // Check if it's an action
    const action = quickActions.find(a => a.action === value);
    if (action) {
      switch (action.action) {
        case "aan":
          openPanel();
          break;
        case "sync":
          // Trigger sync
          console.log("Syncing data...");
          break;
        case "export":
          // Trigger export
          console.log("Exporting report...");
          break;
        case "new-campaign":
          navigate("/advertising/campaigns?new=true");
          break;
      }
      close();
    }
  };

  return (
    <CommandPaletteContext.Provider value={{ open, close, isOpen }}>
      {children}
      
      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            
            <CommandGroup heading="Quick Actions">
              {quickActions.map((action) => (
                <CommandItem
                  key={action.action}
                  value={action.action}
                  onSelect={handleSelect}
                  className="gap-2"
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.name}</span>
                  {action.action === "aan" && (
                    <span className="ml-auto text-xs text-muted-foreground">AI Assistant</span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            
            <CommandSeparator />
            
            <CommandGroup heading="Pages">
              {pages.map((page) => (
                <CommandItem
                  key={page.url}
                  value={page.url}
                  onSelect={handleSelect}
                  keywords={page.keywords}
                  className="gap-2"
                >
                  <page.icon className="h-4 w-4" />
                  <span>{page.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          
          <div className="border-t border-border px-3 py-2 text-xs text-muted-foreground flex items-center justify-between">
            <span>Press <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">↵</kbd> to select</span>
            <span><kbd className="px-1.5 py-0.5 rounded bg-muted font-mono">esc</kbd> to close</span>
          </div>
        </Command>
      </CommandDialog>
    </CommandPaletteContext.Provider>
  );
}
