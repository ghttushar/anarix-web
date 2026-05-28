import { useState, useEffect, useRef, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeSwitcher } from "@/components/settings/ThemeSwitcher";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import { useFeatureToggle } from "@/contexts/FeatureToggleContext";
import { useBranding } from "@/contexts/BrandingContext";
import { useBillingFlow } from "@/contexts/BillingFlowContext";
import { useTrial } from "@/contexts/TrialContext";
import { cn } from "@/lib/utils";
import { Pencil, RotateCcw, Globe, Monitor, Tablet, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { PageBreadcrumb } from "@/components/layout/PageBreadcrumb";
import { useViewport, AppView } from "@/contexts/ViewportContext";
import { useNavigate } from "react-router-dom";

const CUSTOM_SHORTCUTS_KEY = "anarix-custom-shortcuts";

interface ShortcutDef {
  keys: string[];
  description: string;
}

interface ShortcutCategory {
  category: string;
  shortcuts: ShortcutDef[];
}

const defaultShortcuts: ShortcutCategory[] = [
  { category: "Navigation", shortcuts: [
    { keys: ["⌘", "K"], description: "Open command palette" },
    { keys: ["?"], description: "Show all keyboard shortcuts" },
    { keys: ["G", "D"], description: "Go to Dashboard" },
    { keys: ["G", "A"], description: "Go to Advertising" },
    { keys: ["G", "S"], description: "Go to Settings" },
  ]},
  { category: "Tables", shortcuts: [
    { keys: ["J"], description: "Move down in table" },
    { keys: ["K"], description: "Move up in table" },
    { keys: ["Enter"], description: "Select/open row" },
    { keys: ["Esc"], description: "Deselect/close" },
    { keys: ["⌘", "A"], description: "Select all rows" },
  ]},
  { category: "Actions", shortcuts: [
    { keys: ["⌘", "S"], description: "Save changes" },
    { keys: ["⌘", "E"], description: "Export data" },
    { keys: ["⌘", "F"], description: "Search/filter" },
    { keys: ["⌘", "N"], description: "Create new item" },
    { keys: ["⌘", "\\"], description: "Toggle sidebar" },
  ]},
  { category: "AI (Aan)", shortcuts: [
    { keys: ["⌘", "J"], description: "Open Aan AI panel" },
    { keys: ["⌘", "Enter"], description: "Send message" },
    { keys: ["Esc"], description: "Close AI panel" },
  ]},
];

function loadCustomShortcuts(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(CUSTOM_SHORTCUTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveCustomShortcuts(custom: Record<string, string[]>) {
  localStorage.setItem(CUSTOM_SHORTCUTS_KEY, JSON.stringify(custom));
}

function ShortcutRow({ shortcut, customKeys, onEdit, isEditing, onCaptured }: {
  shortcut: ShortcutDef;
  customKeys?: string[];
  onEdit: () => void;
  isEditing: boolean;
  onCaptured: (keys: string[]) => void;
}) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [captured, setCaptured] = useState<string[]>([]);

  useEffect(() => {
    if (!isEditing) return;
    setCaptured([]);

    const handler = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const parts: string[] = [];
      if (e.metaKey || e.ctrlKey) parts.push("⌘");
      if (e.shiftKey) parts.push("Shift");
      if (e.altKey) parts.push("Alt");
      const key = e.key;
      if (!["Meta", "Control", "Shift", "Alt"].includes(key)) {
        parts.push(key.length === 1 ? key.toUpperCase() : key);
      }
      if (parts.length > 0 && !["Meta", "Control", "Shift", "Alt"].includes(e.key)) {
        setCaptured(parts);
        onCaptured(parts);
      }
    };

    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [isEditing, onCaptured]);

  const displayKeys = customKeys || shortcut.keys;

  return (
    <div className="flex items-center justify-between px-4 py-2.5 group">
      <span className="text-sm text-muted-foreground">{shortcut.description}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <div ref={captureRef} className="flex items-center gap-1 px-2 py-1 rounded border-2 border-primary bg-primary/5 animate-pulse">
            {captured.length > 0 ? captured.map((k, i) => (
              <kbd key={i} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-mono font-medium">{k}</kbd>
            )) : (
              <span className="text-xs text-primary">Press keys...</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1">
            {displayKeys.map((key, i) => (
              <span key={i}>
                <kbd className={cn(
                  "px-2 py-1 rounded bg-muted text-xs font-mono font-medium",
                  customKeys && "bg-primary/10 text-primary"
                )}>{key}</kbd>
                {i < displayKeys.length - 1 && <span className="text-muted-foreground mx-0.5">+</span>}
              </span>
            ))}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={onEdit}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}


const breadcrumbItems = [
  { label: "Settings", href: "/settings/appearance" },
  { label: "Preferences" },
];
export default function Preferences() {
  const { displayCurrency, setDisplayCurrency, exchangeRate, lastUpdated } = useCurrency();
  const { newFeaturesVisible, toggleNewFeatures } = useFeatureToggle();
  const { newBranding, toggleNewBranding } = useBranding();
  const { billingFlowEnabled, toggleBillingFlow } = useBillingFlow();
  const { trial, startSync, forceExpire, reset: resetTrial } = useTrial();
  const { view, setView, entryPath } = useViewport();
  const navigate = useNavigate();
  const currencyList = Object.values(CURRENCIES);
  const [customShortcuts, setCustomShortcuts] = useState<Record<string, string[]>>(loadCustomShortcuts);
  const [editingKey, setEditingKey] = useState<string | null>(null);

  const handleViewChange = (next: AppView) => {
    if (next === view) return;
    setView(next);
    toast.success(`Switched to ${next.charAt(0).toUpperCase() + next.slice(1)} view`);
    navigate(entryPath(next));
  };

  const handleCaptured = useCallback((desc: string, keys: string[]) => {
    const next = { ...customShortcuts, [desc]: keys };
    setCustomShortcuts(next);
    saveCustomShortcuts(next);
    setEditingKey(null);
    toast.success(`Shortcut updated for "${desc}"`);
  }, [customShortcuts]);

  const resetCategory = (category: string) => {
    const section = defaultShortcuts.find(s => s.category === category);
    if (!section) return;
    const next = { ...customShortcuts };
    section.shortcuts.forEach(s => delete next[s.description]);
    setCustomShortcuts(next);
    saveCustomShortcuts(next);
    toast.success(`${category} shortcuts reset to defaults`);
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <PageBreadcrumb items={breadcrumbItems} />
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Preferences</h1>
          <p className="text-sm text-muted-foreground">Customize how Anarix looks and behaves</p>
        </div>

        <Separator />

        {/* Theme */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">Theme</h2>
            <p className="text-sm text-muted-foreground">Select your preferred color scheme</p>
          </div>
          <ThemeSwitcher />
        </section>

        <Separator />


        {/* Currency Display */}
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading text-lg font-medium text-foreground">Currency Display</h2>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Display Currency</p>
                <p className="text-xs text-muted-foreground">All monetary values will be converted to this currency</p>
              </div>
              <Select value={displayCurrency} onValueChange={setDisplayCurrency}>
                <SelectTrigger className="w-[200px]">
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
            </div>

            {displayCurrency !== "USD" && (
              <>
                <Separator />
                <div className="rounded-md bg-muted/50 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground font-medium">Current Rate</span>
                    <span className="text-sm font-mono text-foreground">
                      1 USD = {exchangeRate.toFixed(2)} {displayCurrency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Last Updated</span>
                    <span className="text-xs text-muted-foreground">
                      {lastUpdated.toLocaleDateString()} {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </>
            )}

            <Separator />
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Exchange rates are calculated according to international market rates in realtime.
                All underlying data is stored in the marketplace's base currency (USD).
                The conversion is for display purposes only and does not affect actual billing or reporting values.
              </p>
            </div>
          </div>
        </section>

        <Separator />

        {/* New Feature Pages Toggle */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">New Feature Pages</h2>
            <p className="text-sm text-muted-foreground">Show or hide recently added feature pages in the sidebar navigation</p>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <label className="flex items-center justify-between cursor-pointer p-4">
              <div>
                <p className="font-medium text-foreground">Show New Feature Pages</p>
                <p className="text-xs text-muted-foreground">Includes Workspace, Health Score, Budget Pacing, Search Harvesting, Anomaly Alerts, Creative Analyzer, Rule Builder, Inventory & Ads, Competitor Pricing, Client Portal, Unified P&L</p>
              </div>
              <Switch checked={newFeaturesVisible} onCheckedChange={toggleNewFeatures} />
            </label>
          </div>
        </section>

        <Separator />

        {/* New Branding */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">New Branding</h2>
            <p className="text-sm text-muted-foreground">Enable the new Anarix logo system and Aan mascot across the app. Rolls out progressively.</p>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <label className="flex items-center justify-between cursor-pointer p-4">
              <div>
                <p className="font-medium text-foreground">Use New Branding</p>
                <p className="text-xs text-muted-foreground">Swaps the Anarix logo with the new mark. Phase 0 covers the sidebars; later phases extend to Aan mascot, chat, and app chrome.</p>
              </div>
              <Switch checked={newBranding} onCheckedChange={toggleNewBranding} />
            </label>
          </div>
        </section>

        <Separator />

        {/* Billing Flow */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">Billing Flow</h2>
            <p className="text-sm text-muted-foreground">Enable the new trial, pricing, and in-app billing experience. When off, the app behaves exactly as today.</p>
          </div>
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            <label className="flex items-center justify-between cursor-pointer p-4">
              <div>
                <p className="font-medium text-foreground">Enable Billing Flow</p>
                <p className="text-xs text-muted-foreground">Adds the trial overlay on Dashboard, the upgrade banner, the Billing settings page, and rewires Pricing CTAs.</p>
              </div>
              <Switch checked={billingFlowEnabled} onCheckedChange={toggleBillingFlow} />
            </label>
            {billingFlowEnabled && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">Trial state</p>
                    <p className="text-xs text-muted-foreground">Current: <span className="font-mono">{trial}</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => startSync()}>Start sync</Button>
                    <Button size="sm" variant="outline" onClick={() => forceExpire()}>Force expired</Button>
                    <Button size="sm" variant="ghost" onClick={() => resetTrial()}>Reset</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <Separator />

        {/* Keyboard Shortcuts */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">Keyboard Shortcuts</h2>
            <p className="text-sm text-muted-foreground">
              Click <Pencil className="inline h-3 w-3" /> to rebind. Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">?</kbd> anywhere to see all shortcuts.
            </p>
          </div>
          <div className="space-y-6">
            {defaultShortcuts.map(section => (
              <div key={section.category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-foreground">{section.category}</h3>
                  {section.shortcuts.some(s => customShortcuts[s.description]) && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => resetCategory(section.category)}>
                      <RotateCcw className="h-3 w-3 mr-1" />Reset
                    </Button>
                  )}
                </div>
                <div className="rounded-lg border border-border bg-card overflow-hidden divide-y divide-border">
                  {section.shortcuts.map(shortcut => (
                    <ShortcutRow
                      key={shortcut.description}
                      shortcut={shortcut}
                      customKeys={customShortcuts[shortcut.description]}
                      isEditing={editingKey === shortcut.description}
                      onEdit={() => setEditingKey(editingKey === shortcut.description ? null : shortcut.description)}
                      onCaptured={(keys) => handleCaptured(shortcut.description, keys)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
</AppLayout>
  );
}
