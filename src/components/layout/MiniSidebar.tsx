import { useRef, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTheme } from "@/contexts/ThemeContext";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { useAan } from "@/components/aan";
import { SidebarHoverPopup } from "./SidebarHoverPopup";
import { navigationGroups } from "./AppSidebar";
import { AnarixLogo } from "@/components/branding/AnarixLogo";

export function MiniSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const { resolvedTheme, setTheme } = useTheme();
  const { newFeaturesVisible } = useFeatureToggle();
  const { closeAan } = useAan();
  

  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [triggerRects, setTriggerRects] = useState<Record<string, DOMRect | null>>({});
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const filteredGroups = navigationGroups.map(group => {
    if (newFeaturesVisible) return group;
    return { ...group, items: group.items.filter(item => !item.isNewFeature) };
  }).filter(group => group.items.length > 0);

  const handleMouseEnter = useCallback((label: string) => {
    if (hoverTimeoutRef.current) { clearTimeout(hoverTimeoutRef.current); hoverTimeoutRef.current = null; }
    const trigger = triggerRefs.current[label];
    if (trigger) setTriggerRects(prev => ({ ...prev, [label]: trigger.getBoundingClientRect() }));
    setHoveredGroup(label);
  }, []);

  const handleMouseLeave = useCallback(() => {
    hoverTimeoutRef.current = setTimeout(() => setHoveredGroup(null), 200);
  }, []);

  useEffect(() => {
    return () => { if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current); };
  }, []);

  const handleNavClick = (url: string) => {
    closeAan();
    navigate(url);
  };

  return (
    <div className="w-14 h-full flex flex-col border-r border-border/30 bg-sidebar shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center h-12 border-b border-border/30 shrink-0">
        <AnarixLogo variant="symbol" className="h-6 w-6" />
      </div>

      {/* Nav icons */}
      <div className="flex-1 overflow-auto py-2 space-y-1">
        {filteredGroups.map(group => {
          const isGroupActive = group.items.some(item => currentPath.startsWith(item.url));
          return (
            <div key={group.label} className="flex justify-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    ref={el => { triggerRefs.current[group.label] = el; }}
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-md transition-colors",
                      isGroupActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                    )}
                    onMouseEnter={() => handleMouseEnter(group.label)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <group.icon className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">{group.label}</TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-border/30 py-2 flex flex-col items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">{resolvedTheme === "dark" ? "Light mode" : "Dark mode"}</TooltipContent>
        </Tooltip>
        <Avatar className="h-7 w-7">
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-semibold">JD</AvatarFallback>
        </Avatar>
      </div>

      {/* Hover popups */}
      {filteredGroups.map(group => (
        <SidebarHoverPopup
          key={group.label}
          items={group.items}
          isVisible={hoveredGroup === group.label}
          groupLabel={group.label}
          triggerRect={triggerRects[group.label] || null}
          currentPath={currentPath}
          onMouseEnter={() => handleMouseEnter(group.label)}
          onMouseLeave={handleMouseLeave}
          onNavigate={() => { closeAan(); }}
        />
      ))}
    </div>
  );
}
