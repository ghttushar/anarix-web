import { Menu, ArrowLeft, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { resolvePageTitle } from "./pageTitleByRoute";

interface Props {
  onOpenDrawer: () => void;
  onOpenAccount: () => void;
}

/**
 * Mobile global top bar — [☰] Page Name (centered) [👤].
 * 56px sticky. Drill-down routes prefix the title with a back arrow that
 * pops one history entry.
 */
export function MobileTopBar({ onOpenDrawer, onOpenAccount }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { title, isDrillDown } = resolvePageTitle(pathname);

  return (
    <header
      data-mobile-top-bar
      className="h-14 shrink-0 sticky top-0 z-40 bg-background border-b border-border flex items-center px-1 gap-1"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <button
        type="button"
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className="h-11 w-11 rounded-md flex items-center justify-center active:bg-muted shrink-0 text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-1">
        {isDrillDown && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="h-8 w-8 rounded-md flex items-center justify-center active:bg-muted text-foreground shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
        )}
        <h1 className="text-[15px] font-semibold text-foreground truncate text-center">
          {title}
        </h1>
      </div>

      <button
        type="button"
        onClick={onOpenAccount}
        aria-label="Account settings"
        className="h-11 w-11 rounded-md flex items-center justify-center active:bg-muted shrink-0 text-foreground"
      >
        <User className="h-5 w-5" />
      </button>
    </header>
  );
}
