import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { useBranding } from "@/contexts/BrandingContext";
import { useViewport, AppView } from "@/contexts/ViewportContext";
import { useNavigate } from "react-router-dom";
import { Monitor, Tablet, Smartphone, Globe, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * Mobile-only Preferences page.
 * Slimmed down to: View switcher, Theme, Currency, Feature toggles, Branding, Profile link.
 * No shortcuts, gestures, tutorial, billing flow, floating island (irrelevant on mobile).
 */
export function MobilePreferences() {
  const navigate = useNavigate();
  const { displayCurrency, setDisplayCurrency } = useCurrency();
  const { newFeaturesVisible, toggleNewFeatures } = useFeatureToggle();
  const { newBranding, toggleNewBranding } = useBranding();
  const { view, setView, entryPath } = useViewport();
  const currencyList = Object.values(CURRENCIES);

  const handleViewChange = (next: AppView) => {
    if (next === view) return;
    setView(next);
    toast.success(`Switched to ${next.charAt(0).toUpperCase() + next.slice(1)} view`);
    navigate(entryPath(next));
  };

  return (
    <div className="px-4 py-4 space-y-6 pb-24">
      <div>
        <h1 className="font-heading text-xl font-semibold text-foreground">Preferences</h1>
        <p className="text-sm text-muted-foreground">Theme, currency, and view settings.</p>
      </div>

      {/* Profile shortcut */}
      <button
        onClick={() => navigate("/profile")}
        className="w-full flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:bg-muted/40"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Profile</p>
            <p className="text-xs text-muted-foreground">View your account</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </button>

      <Separator />

      {/* App View */}
      <section className="space-y-3">
        <div>
          <h2 className="font-heading text-base font-medium text-foreground">App View</h2>
          <p className="text-xs text-muted-foreground">Switch between Desktop, Tablet, and Mobile.</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {([
            { id: "desktop" as AppView, icon: Monitor, label: "Desktop" },
            { id: "tablet" as AppView, icon: Tablet, label: "Tab" },
            { id: "mobile" as AppView, icon: Smartphone, label: "Mobile" },
          ]).map(({ id, icon: Icon, label }) => {
            const active = view === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => handleViewChange(id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border p-3 min-h-[64px] transition-colors",
                  active ? "border-primary bg-primary/5" : "border-border bg-card"
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-xs font-medium", active ? "text-primary" : "text-foreground")}>{label}</span>
              </button>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* Theme */}
      <section className="space-y-3">
        <div>
          <h2 className="font-heading text-base font-medium text-foreground">Theme</h2>
          <p className="text-xs text-muted-foreground">Pick your color scheme.</p>
        </div>
        <ThemeSwitcher />
      </section>

      <Separator />

      {/* Currency */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <h2 className="font-heading text-base font-medium text-foreground">Display Currency</h2>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
            <SelectTrigger className="w-full min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyList.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.symbol} {c.code} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Conversion is display-only. Underlying data stays in USD.
          </p>
        </div>
      </section>

      <Separator />

      {/* Feature toggles */}
      <section className="space-y-3">
        <h2 className="font-heading text-base font-medium text-foreground">Visibility</h2>
        <div className="rounded-lg border border-border bg-card divide-y divide-border">
          <label className="flex items-center justify-between p-4 min-h-[56px]">
            <div className="pr-4">
              <p className="text-sm font-medium text-foreground">New Feature Pages</p>
              <p className="text-[11px] text-muted-foreground">Show recently added pages in the menu.</p>
            </div>
            <Switch checked={newFeaturesVisible} onCheckedChange={toggleNewFeatures} />
          </label>
          <label className="flex items-center justify-between p-4 min-h-[56px]">
            <div className="pr-4">
              <p className="text-sm font-medium text-foreground">New Branding</p>
              <p className="text-[11px] text-muted-foreground">Use the new Anarix logo system.</p>
            </div>
            <Switch checked={newBranding} onCheckedChange={toggleNewBranding} />
          </label>
        </div>
      </section>

      <p className="pt-2 text-[11px] text-muted-foreground text-center">
        Advanced preferences (shortcuts, gestures, billing) are available on desktop.
      </p>
    </div>
  );
}

export default MobilePreferences;
