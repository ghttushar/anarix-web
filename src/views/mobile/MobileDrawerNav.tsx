import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronRight, X, User, LogOut, Settings, Palette, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { navigationGroups } from "@/components/layout/AppSidebar";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { useViewport } from "@/contexts/ViewportContext";

// Routes that are write-only on desktop and therefore hidden on mobile.
const MOBILE_BLOCKED = new Set<string>([
  "/workspace",
  "/workspace/health-score",
  "/advertising/rules/agents",
  "/advertising/rules/applied",
]);

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawerNav({ open, onOpenChange }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setView } = useViewport();
  const { newFeaturesVisible } = useFeatureToggle();

  const filteredGroups = navigationGroups
    .map(g => ({
      ...g,
      items: g.items.filter(i => (newFeaturesVisible || !i.isNewFeature) && !MOBILE_BLOCKED.has(i.url)),
    }))
    .filter(g => g.items.length > 0);

  const [openSections, setOpenSections] = useState<Set<string>>(
    () => new Set(filteredGroups.filter(g => g.items.some(i => pathname.startsWith(i.url))).map(g => g.label))
  );

  const toggleSection = (label: string) =>
    setOpenSections(prev => {
      const n = new Set(prev);
      n.has(label) ? n.delete(label) : n.add(label);
      return n;
    });

  const handleNav = (url: string) => {
    onOpenChange(false);
    navigate(url);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[86vw] max-w-[340px] p-0 flex flex-col gap-0">
        <div className="flex items-center justify-between h-14 px-4 border-b border-border/40 shrink-0">
          <AnarixLogo variant="full" className="h-6 w-auto" />
          <button onClick={() => onOpenChange(false)} className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto py-2">
          {filteredGroups.map(group => {
            const isOpen = openSections.has(group.label);
            return (
              <div key={group.label} className="py-0.5">
                <button
                  onClick={() => toggleSection(group.label)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] font-semibold text-muted-foreground hover:text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <group.icon className="h-4 w-4" />
                    {group.label}
                  </span>
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5 opacity-60" /> : <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                </button>
                {isOpen && (
                  <div className="pb-1">
                    {group.items.map(item => {
                      const active = pathname.startsWith(item.url);
                      return (
                        <NavLink
                          key={item.url}
                          to={item.url}
                          onClick={() => handleNav(item.url)}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
                            active
                              ? "bg-primary/8 text-primary border-l-2 border-primary"
                              : "text-foreground hover:bg-muted"
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0 opacity-80" />
                          <span className="truncate">{item.title}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="shrink-0 border-t border-border/40 px-3 py-3 space-y-1">
          <button
            onClick={() => handleNav("/settings/appearance")}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted text-foreground"
          >
            <Settings className="h-4 w-4 opacity-80" /> Preferences
          </button>
          <button
            onClick={() => { setView("desktop"); onOpenChange(false); navigate("/profitability/dashboard"); }}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-sm hover:bg-muted text-foreground"
          >
            <Globe className="h-4 w-4 opacity-80" /> Switch to Desktop
          </button>
          <div className="flex items-center gap-2 px-2 pt-2 pb-1">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground truncate">John Doe</div>
              <div className="text-[11px] text-muted-foreground truncate">john@anarix.com</div>
            </div>
            <button className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-muted text-destructive">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
