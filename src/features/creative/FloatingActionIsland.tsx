import { useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { RefreshCw, Download, Camera, Lightbulb, GripVertical, Bell } from "lucide-react";
import { AanGlyph } from "@/components/aan/AanGlyph";
import { AanMascot } from "@/components/aan/AanMascot";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { useInsights } from "@/components/insights";
import { toast } from "sonner";
import { useActivePanel } from "@/contexts/ActivePanelContext";
import { useBranding } from "@/contexts/BrandingContext";
import { useAan } from "@/components/aan/AanContext";
import html2canvas from "html2canvas";

interface ActionItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  highlight?: boolean;
  badge?: number;
  alwaysShowLabel?: boolean;
}

const hiddenRoutes = ["/login", "/onboarding", "/settings"];

export function FloatingActionIsland() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { openCopilot } = useAan();
  const { openPanel: openInsights, criticalCount } = useInsights();
  const { newBranding } = useBranding();

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const rect = (e.currentTarget.closest("[data-island]") as HTMLElement)?.getBoundingClientRect();
    if (!rect) return;
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: rect.left + rect.width / 2, startPosY: rect.top };
    const handleMove = (ev: MouseEvent) => {
      if (!dragRef.current) return;
      setPosition({ x: dragRef.current.startPosX + (ev.clientX - dragRef.current.startX), y: dragRef.current.startPosY + (ev.clientY - dragRef.current.startY) });
    };
    const handleUp = () => {
      setIsDragging(false);
      dragRef.current = null;
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, []);

  const shouldHide = hiddenRoutes.some((route) => location.pathname.startsWith(route));
  if (shouldHide) return null;

  const handleMouseEnter = () => {
    if (collapseTimer.current) {
      clearTimeout(collapseTimer.current);
      collapseTimer.current = null;
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    collapseTimer.current = setTimeout(() => {
      setIsExpanded(false);
    }, 300);
  };

  const { setDataPanel } = useActivePanel();

  const actions: ActionItem[] = [
    { icon: Bell, label: criticalCount > 0 ? `Alerts (${criticalCount})` : "Alerts", onClick: () => setDataPanel("notifications"), highlight: criticalCount > 0, badge: criticalCount > 0 ? criticalCount : undefined },
    { icon: Lightbulb, label: "Insights", onClick: openInsights },
    { icon: RefreshCw, label: "Refresh", onClick: () => toast.info("Refreshing data...") },
    { icon: Download, label: "Export", onClick: () => toast.success("Export started") },
  ];

  const takeScreenshot = async () => {
    setIsCapturing(true);
    try {
      const canvas = await html2canvas(document.body, { useCORS: true, allowTaint: true, backgroundColor: null });
      const link = document.createElement("a");
      link.download = `anarix-screenshot-${Date.now()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      toast.success("Screenshot saved!");
    } catch {
      toast.error("Failed to capture screenshot");
    } finally {
      setIsCapturing(false);
    }
  };

  const style: React.CSSProperties = position
    ? { left: `${position.x}px`, top: `${position.y}px`, transform: "translateX(-50%)" }
    : { left: "50%", bottom: "24px", transform: "translateX(-50%)" };

  return (
    <div
      className="fixed z-50"
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Invisible expanded hit area */}
      <div className={cn("relative", isExpanded ? "p-4 -m-4" : "")}>
        <div
          data-island
          className={cn(
            "bg-card/95 backdrop-blur-md border border-primary/60 rounded-full shadow-lg transition-all duration-300 ease-out",
            isExpanded ? "px-2 py-2" : "px-3 py-2",
            isDragging && "cursor-grabbing"
          )}
        >
          <div className="flex items-center gap-1.5">
            <button
              onMouseDown={handleDragStart}
              className="h-7 w-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-grab active:cursor-grabbing shrink-0"
              title="Drag to reposition"
            >
              <GripVertical className="h-3.5 w-3.5" />
            </button>
            <div className="h-5 w-px bg-border" />
            {newBranding && (
              <button
                type="button"
                onClick={openCopilot}
                className="group flex items-center gap-2 h-12 pl-1.5 pr-3.5 rounded-full bg-card border border-border shadow-sm hover:shadow-md hover:border-primary/40 transition-all"
                title="Ask Aan"
              >
                <AanMascot size={44} state="idle" interactive floating />
                <span className="text-sm font-medium text-foreground whitespace-nowrap">Ask Aan</span>
              </button>
            )}
            <div className="flex items-center gap-0.5">
              {actions.map((action, index) => {
                return (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={action.onClick}
                  className={cn(
                    "rounded-full transition-all duration-200 relative h-8",
                    (isExpanded || action.alwaysShowLabel) ? "px-3 gap-1.5" : "px-2",
                    action.highlight && "text-destructive"
                  )}
                >
                  <action.icon className="h-3.5 w-3.5 shrink-0" />
                  {(isExpanded || action.alwaysShowLabel) && (
                    <span className="text-xs whitespace-nowrap animate-in fade-in duration-200">{action.label}</span>
                  )}
                  {action.badge && action.badge > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                      {action.badge}
                    </span>
                  )}
                </Button>
                );
              })}
              <Button
                variant="ghost"
                size="sm"
                onClick={takeScreenshot}
                disabled={isCapturing}
                className={cn("rounded-full transition-all duration-200 h-8", isExpanded ? "px-3 gap-1.5" : "px-2")}
              >
                <Camera className={cn("h-3.5 w-3.5 shrink-0", isCapturing && "animate-pulse")} />
                {isExpanded && <span className="text-xs whitespace-nowrap animate-in fade-in duration-200">{isCapturing ? "Capturing..." : "Screenshot"}</span>}
              </Button>
            </div>

            {isExpanded && (
              <div className="pl-1.5 border-l border-border">
                <span className="text-xs text-muted-foreground"><kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">⌘K</kbd></span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
