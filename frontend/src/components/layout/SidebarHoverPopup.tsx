import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface SidebarHoverPopupProps {
  items: NavItem[];
  isVisible: boolean;
  groupLabel: string;
  triggerRect: DOMRect | null;
  currentPath: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onNavigate?: () => void;
}

export function SidebarHoverPopup({
  items,
  isVisible,
  groupLabel,
  triggerRect,
  currentPath,
  onMouseEnter,
  onMouseLeave,
  onNavigate,
}: SidebarHoverPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && popupRef.current && triggerRect) {
      const popup = popupRef.current;
      const rect = popup.getBoundingClientRect();
      
      // Ensure popup stays within viewport
      if (rect.bottom > window.innerHeight) {
        popup.style.top = `${window.innerHeight - rect.height - 16}px`;
      }
    }
  }, [isVisible, triggerRect]);

  const isActive = (path: string) => currentPath.startsWith(path);

  if (!isVisible || !triggerRect) return null;

  const popupContent = (
    <div
      ref={popupRef}
      className={cn(
        "fixed z-[9999]",
        "min-w-[220px] rounded-lg border border-border bg-popover shadow-xl",
        "animate-in fade-in-0 slide-in-from-left-2 duration-150"
      )}
      style={{
        left: `${triggerRect.right + 8}px`,
        top: `${triggerRect.top - 4}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Invisible bridge to prevent hover gap issues */}
      <div
        className="absolute -left-3 top-0 h-full w-3"
        onMouseEnter={onMouseEnter}
      />

      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {groupLabel}
        </span>
      </div>

      {/* Menu items */}
      <div className="p-1.5">
        {items.map((item) => (
          <NavLink
            key={item.url}
            to={item.url}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(item.url)
                ? "bg-primary/10 text-primary"
                : "text-popover-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
            <span>{item.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );

  return createPortal(popupContent, document.body);
}
