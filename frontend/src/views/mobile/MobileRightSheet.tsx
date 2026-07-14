import { ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

/**
 * Mobile right-side sheet primitive — slides in from the right edge,
 * matches the hamburger drawer pattern. Used for Filters, Columns,
 * P&L breakdown, edit forms, etc.
 *
 * Pure presentational shell — callers manage their own state.
 */
export function MobileRightSheet({ open, onClose, title, children, footer, className }: Props) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/30" onClick={onClose} aria-hidden />
      <aside
        className={cn(
          "fixed top-0 right-0 bottom-0 z-50 w-[92vw] max-w-[420px] bg-background border-l border-border flex flex-col animate-in slide-in-from-right duration-200",
          className
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-3 h-12 shrink-0">
          <span className="text-sm font-semibold text-foreground truncate">{title}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 min-h-0 overflow-auto">{children}</div>
        {footer && (
          <div className="shrink-0 border-t border-border p-3" style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
            {footer}
          </div>
        )}
      </aside>
    </>
  );
}
