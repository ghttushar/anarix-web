import { Menu } from "lucide-react";
import { AnarixLogo } from "@/components/branding/AnarixLogo";

interface Props {
  onOpenDrawer: () => void;
}

/**
 * Mobile top bar — just hamburger + brand. Marketplace, account, alerts,
 * date, home and Aan all live in the AppLevelBar (MobileTaskbar) below.
 */
export function MobileTopBar({ onOpenDrawer }: Props) {
  return (
    <header className="h-14 shrink-0 sticky top-0 z-30 bg-background border-b border-border flex items-center px-2 gap-2">
      <button
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className="h-10 w-10 rounded-md flex items-center justify-center hover:bg-muted active:bg-muted/80 shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>
      <AnarixLogo variant="full" className="h-5 w-auto shrink-0" />
    </header>
  );
}
