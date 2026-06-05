import { Menu } from "lucide-react";
import { AnarixLogo } from "@/components/branding/AnarixLogo";

interface Props {
  onOpenDrawer: () => void;
}

/**
 * Mobile top bar — strictly [Hamburger] [Logo]. Profile and theme live
 * inside the drawer footer (single source of truth).
 */
export function MobileTopBar({ onOpenDrawer }: Props) {
  return (
    <header
      data-mobile-top-bar
      className="h-14 shrink-0 sticky top-0 z-40 bg-background border-b border-border flex items-center px-2 gap-2"
    >
      <button
        onClick={onOpenDrawer}
        aria-label="Open navigation"
        className="h-10 w-10 rounded-md flex items-center justify-center active:bg-muted shrink-0"
      >
        <Menu className="h-5 w-5" />
      </button>
      <AnarixLogo variant="full" className="h-5 w-auto shrink-0" />
    </header>
  );
}
