import { Menu, Sun, Moon, User, CreditCard, Settings, SlidersHorizontal, Users, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onOpenDrawer: () => void;
}

/**
 * Mobile top bar — hamburger + brand on the left, theme icon + profile
 * dropdown on the right. Matches desktop sidebar footer affordances.
 */
export function MobileTopBar({ onOpenDrawer }: Props) {
  const { resolvedTheme, setTheme } = useTheme();
  const navigate = useNavigate();
  const isDark = resolvedTheme === "dark";

  const go = (url: string) => navigate(url);

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

      <div className="ml-auto flex items-center gap-1 shrink-0">
        <button
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="h-9 w-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Open profile menu"
              className="h-9 w-9 rounded-md flex items-center justify-center hover:bg-muted"
            >
              <Avatar className="h-7 w-7">
                <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                  JD
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-foreground">John Doe</span>
              <span className="text-[11px] font-normal text-muted-foreground">john@anarix.com</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => go("/profile")}>
              <User className="h-4 w-4 mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => go("/settings/billing")}>
              <CreditCard className="h-4 w-4 mr-2" /> Billing
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => go("/settings")}>
              <Settings className="h-4 w-4 mr-2" /> Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => go("/settings/appearance")}>
              <SlidersHorizontal className="h-4 w-4 mr-2" /> Preferences
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => go("/settings/team")}>
              <Users className="h-4 w-4 mr-2" /> Team
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => go("/auth/login")}>
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
