import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Sun,
  Moon,
  User,
  CreditCard,
  Settings,
  SlidersHorizontal,
  Users,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnarixLogo } from "@/components/branding/AnarixLogo";
import { navigationGroups } from "@/components/layout/AppSidebar";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { useViewport } from "@/contexts/ViewportContext";
import { useTheme } from "@/contexts/ThemeContext";

// Routes write-only on desktop, hidden on mobile drawer.
const MOBILE_BLOCKED = new Set<string>([
  "/workspace",
  "/workspace/health-score",
  "/advertising/rules/agents",
  "/advertising/rules/applied",
]);

// Super-section regrouping for a more navigable mobile drawer.
const SUPER_SECTIONS: { label: string; groupLabels: string[] }[] = [
  { label: "Analyze", groupLabels: ["Profitability"] },
  { label: "Operate", groupLabels: ["Advertising", "Day Parting", "AMC"] },
  { label: "Discover", groupLabels: ["Business Intelligence", "Catalog", "Reports"] },
];

const PROFILE_ITEMS = [
  { label: "Profile", icon: User, url: "/profile" },
  { label: "Billing", icon: CreditCard, url: "/settings/billing" },
  { label: "Settings", icon: Settings, url: "/settings" },
  { label: "Preferences", icon: SlidersHorizontal, url: "/settings/appearance" },
  { label: "Team", icon: Users, url: "/settings/team" },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileDrawerNav({ open, onOpenChange }: Props) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { setView } = useViewport();
  const { newFeaturesVisible } = useFeatureToggle();
  const { theme, setTheme } = useTheme();

  const filteredGroups = navigationGroups
    .map((g) => ({
      ...g,
      items: g.items.filter(
        (i) => (newFeaturesVisible || !i.isNewFeature) && !MOBILE_BLOCKED.has(i.url)
      ),
    }))
    .filter((g) => g.items.length > 0);

  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () =>
      new Set(
        filteredGroups
          .filter((g) => g.items.some((i) => pathname.startsWith(i.url)))
          .map((g) => g.label)
      )
  );
  const [profileOpen, setProfileOpen] = useState(false);

  const toggleGroup = (label: string) =>
    setOpenGroups((prev) => {
      const n = new Set(prev);
      n.has(label) ? n.delete(label) : n.add(label);
      return n;
    });

  const handleNav = (url: string) => {
    onOpenChange(false);
    navigate(url);
  };

  const isDark = theme === "dark";
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[88vw] max-w-[360px] p-0 flex flex-col gap-0 bg-background"
      >
        {/* Header band — 96px, brand mark + org + plan */}
        <div className="h-24 shrink-0 px-4 flex items-center gap-3 border-b border-border bg-card">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <AnarixLogo variant="icon" className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[15px] font-semibold text-foreground truncate font-display">
              Anarix
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[12px] text-muted-foreground truncate">
                Acme Brands
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-px rounded bg-primary/10 text-primary">
                Pro
              </span>
            </div>
          </div>
        </div>

        {/* Body — sectioned navigation */}
        <div className="flex-1 overflow-auto py-3 px-2">
          {SUPER_SECTIONS.map((section) => {
            const sectionGroups = filteredGroups.filter((g) =>
              section.groupLabels.includes(g.label)
            );
            if (sectionGroups.length === 0) return null;
            return (
              <div key={section.label} className="mb-4">
                <div className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  {section.label}
                </div>
                {sectionGroups.map((group) => {
                  const isOpen = openGroups.has(group.label);
                  const groupActive = group.items.some((i) =>
                    pathname.startsWith(i.url)
                  );
                  // Flatten single-item groups directly as nav rows.
                  if (group.items.length === 1) {
                    const item = group.items[0];
                    const active = pathname.startsWith(item.url);
                    return (
                      <NavRow
                        key={item.url}
                        icon={item.icon}
                        label={item.title}
                        active={active}
                        onClick={() => handleNav(item.url)}
                      />
                    );
                  }
                  return (
                    <div key={group.label} className="mb-1">
                      <button
                        onClick={() => toggleGroup(group.label)}
                        className={cn(
                          "w-full h-11 px-3 flex items-center gap-3 rounded-md text-[13px] font-medium",
                          groupActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        )}
                      >
                        <group.icon className="h-4 w-4 opacity-80" />
                        <span className="flex-1 text-left">{group.label}</span>
                        {isOpen ? (
                          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="pl-2 pt-0.5 space-y-0.5">
                          {group.items.map((item) => {
                            const active = pathname.startsWith(item.url);
                            return (
                              <NavRow
                                key={item.url}
                                icon={item.icon}
                                label={item.title}
                                active={active}
                                onClick={() => handleNav(item.url)}
                                indent
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer — profile tile + actions */}
        <div className="shrink-0 border-t border-border bg-card px-2 py-2">
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="w-full h-16 px-2 flex items-center gap-3 rounded-lg hover:bg-muted/60 text-left"
          >
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary text-[12px] font-semibold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-semibold text-foreground truncate">
                John Doe
              </div>
              <div className="text-[12px] text-muted-foreground truncate">
                john@anarix.com
              </div>
            </div>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-muted-foreground transition-transform",
                profileOpen && "rotate-180"
              )}
            />
          </button>

          {profileOpen && (
            <div className="mt-1 mb-1 grid grid-cols-1 gap-0.5">
              {PROFILE_ITEMS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => handleNav(p.url)}
                  className="h-10 px-3 flex items-center gap-3 rounded-md text-[13px] text-foreground hover:bg-muted/60"
                >
                  <p.icon className="h-4 w-4 opacity-80" />
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => handleNav("/auth/login")}
                className="h-10 px-3 flex items-center gap-3 rounded-md text-[13px] text-foreground hover:bg-muted/60"
              >
                <LogOut className="h-4 w-4 opacity-80" />
                Sign out
              </button>
            </div>
          )}

          <div className="mt-1 flex items-center gap-1">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="h-9 flex-1 inline-flex items-center justify-center gap-2 rounded-md border border-border text-[12px] font-medium text-foreground hover:bg-muted/60"
            >
              {isDark ? (
                <>
                  <Sun className="h-3.5 w-3.5" /> Light
                </>
              ) : (
                <>
                  <Moon className="h-3.5 w-3.5" /> Dark
                </>
              )}
            </button>
            <button
              onClick={() => {
                setView("desktop");
                onOpenChange(false);
                navigate("/profitability/dashboard");
              }}
              aria-label="Switch to desktop"
              className="h-9 px-3 inline-flex items-center justify-center gap-1.5 rounded-md border border-border text-[12px] font-medium text-foreground hover:bg-muted/60"
            >
              <Globe className="h-3.5 w-3.5" /> Desktop
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NavRow({
  icon: Icon,
  label,
  active,
  onClick,
  indent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  indent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full h-11 flex items-center gap-3 rounded-md text-[14px] transition-colors min-h-[44px] relative",
        indent ? "pl-6 pr-3" : "px-3",
        active
          ? "bg-primary/10 text-primary font-semibold"
          : "text-foreground hover:bg-muted/60"
      )}
    >
      {active && (
        <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-primary" />
      )}
      <Icon className="h-4 w-4 shrink-0 opacity-90" />
      <span className="truncate">{label}</span>
    </button>
  );
}
