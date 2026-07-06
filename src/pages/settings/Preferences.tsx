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
import { useVisualEffects } from "@/contexts/VisualEffectsContext";
import { cn } from "@/lib/utils";
import { Pencil, RotateCcw, Globe, Monitor, Tablet, Smartphone, Sparkles, Hand, Play, Keyboard, Bell, Shield, Zap, AlertTriangle, ChevronDown, ShoppingCart, AlertOctagon, Wallet, KeyRound, Target, Clock, Rocket, TrendingDown, Star, Calendar, Video, Sun, MessageSquare, Mail, Users } from "lucide-react";
import { toast } from "sonner";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { useViewport, AppView } from "@/contexts/ViewportContext";
import { useNavigate } from "react-router-dom";
import { ShortcutEditor } from "@/features/shortcuts/ShortcutEditor";
import { GestureMapper } from "@/components/gestures/GestureMapper";
import { useTutorial } from "@/features/tutorial/TutorialContext";
import { MobilePreferences } from "@/views/mobile/MobilePreferences";
import { POLICIES, Policy } from "@/data/mockAanPolicies";
import { CONNECTED_SYSTEMS } from "@/data/mockAanFeed";
import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";

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
  const { effects, toggle: toggleEffect } = useVisualEffects();
  const { state: tutorialState, setEnabled: setTutorialEnabled, restart: restartTutorial } = useTutorial();
  const navigate = useNavigate();
  const currencyList = Object.values(CURRENCIES);
  const [customShortcuts, setCustomShortcuts] = useState<Record<string, string[]>>(loadCustomShortcuts);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [policies, setPolicies] = useState<Policy[]>(POLICIES);
  const [howAanOpen, setHowAanOpen] = useState(false);
  const { liveMode, setLiveMode } = useAanEvents();

  // Alert categories — persisted mock toggles
  const ALERT_CATEGORIES = [
    { key: "buybox", icon: ShoppingCart, label: "Buy Box changes", description: "Losses, recovery, competitor undercuts on hero SKUs." },
    { key: "suppression", icon: AlertOctagon, label: "Listing suppressions & compliance", description: "Image/text policy violations, ASIN suppression, auto-fixes." },
    { key: "budget", icon: Wallet, label: "Budget pacing & spend", description: "Approaching caps, overspend, peak-hour top-ups." },
    { key: "keywords", icon: KeyRound, label: "Keyword promotion & harvesting", description: "Auto → Manual graduation, negative harvesting." },
    { key: "placement", icon: Target, label: "Placement optimization", description: "Top-of-search and product-page bid modifiers." },
    { key: "dayparting", icon: Clock, label: "Day parting & schedules", description: "Waste windows, overnight pauses, schedule drift." },
    { key: "launch", icon: Rocket, label: "Launch coverage", description: "New SKUs missing ad coverage from day one." },
    { key: "margin", icon: TrendingDown, label: "Loss-making SKUs & margin", description: "Sustained negative net margin, COGS swings." },
    { key: "reviews", icon: Star, label: "Reviews & rating trends", description: "Rating drops, clustered negative themes on hero SKUs." },
    { key: "events", icon: Calendar, label: "Event campaigns", description: "Prime Day, Black Friday, Big Deal Days scheduling." },
    { key: "meetings", icon: Video, label: "Meeting-derived action items", description: "Decisions and owners captured during meetings." },
    { key: "morning", icon: Sun, label: "Morning briefing (overnight)", description: "Overnight roll-up of critical detections and opportunities." },
  ] as const;
  const [categoryPrefs, setCategoryPrefs] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("anarix-alert-categories");
      if (stored) return JSON.parse(stored);
    } catch { /* noop */ }
    return Object.fromEntries(ALERT_CATEGORIES.map((c) => [c.key, true]));
  });
  const toggleCategory = (key: string) => {
    setCategoryPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      try { localStorage.setItem("anarix-alert-categories", JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  };

  // Workspace connections — mock connect/disconnect
  const WORKSPACE_CONNECTORS = [
    { key: "google-workspace", icon: Sparkles, name: "Google Workspace" },
    { key: "gmail", icon: Mail, name: "Gmail" },
    { key: "gcal", icon: Calendar, name: "Google Calendar" },
    { key: "teams", icon: Video, name: "Microsoft Teams" },
    { key: "outlook", icon: Mail, name: "Outlook" },
    { key: "slack", icon: MessageSquare, name: "Slack" },
    { key: "zoom", icon: Video, name: "Zoom" },
    { key: "notion", icon: FileTextIconStub, name: "Notion" },
    { key: "linear", icon: Users, name: "Linear" },
    { key: "seventh-gear", icon: Video, name: "7thGear" },
  ] as const;
  const [connectedWorkspaces, setConnectedWorkspaces] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem("anarix-connected-workspaces");
      if (stored) return JSON.parse(stored);
    } catch { /* noop */ }
    return { slack: true, gmail: true, gcal: true };
  });
  const toggleWorkspace = (key: string, name: string) => {
    setConnectedWorkspaces((prev) => {
      const isNowConnected = !prev[key];
      const next = { ...prev, [key]: isNowConnected };
      try { localStorage.setItem("anarix-connected-workspaces", JSON.stringify(next)); } catch { /* noop */ }
      toast.success(isNowConnected ? `Connected ${name} (mock)` : `Disconnected ${name}`);
      return next;
    });
  };

  const togglePolicy = (id: string) =>
    setPolicies((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));



  // Deep-link support: scroll to #edit-alerts on mount if the hash matches.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash === "#edit-alerts") {
      requestAnimationFrame(() => {
        document.getElementById("edit-alerts")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, []);

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

  if (view === "mobile") {
    return (
      <AppLayout>
        <MobilePreferences />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <AppTaskbar breadcrumbItems={breadcrumbItems} />
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Preferences</h1>
          <p className="text-sm text-muted-foreground">Customize how Anarix looks and behaves</p>
        </div>

        <Separator />

        {/* App View */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">App View</h2>
            <p className="text-sm text-muted-foreground">
              Choose how Anarix renders. Desktop is the current build. Tablet is touch-optimized
              (same features and layout, redesigned for finger and stylus input). Mobile is reserved.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {([
              { id: "desktop" as AppView, icon: Monitor, label: "Desktop", note: "Current build", enabled: true },
              { id: "tablet" as AppView, icon: Tablet, label: "Tab", note: "Touch-optimized", enabled: true },
              { id: "mobile" as AppView, icon: Smartphone, label: "Mobile", note: "Coming later", enabled: true },
            ]).map(({ id, icon: Icon, label, note }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleViewChange(id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
                    active
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:bg-muted/40"
                  )}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
                    <span className={cn("text-sm font-medium", active ? "text-primary" : "text-foreground")}>{label}</span>
                    {active && (
                      <span className="ml-auto text-[10px] font-medium uppercase tracking-wider text-primary">Active</span>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{note}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground">
            Your choice persists across sessions. Tablet and Mobile each have a dedicated route
            prefix (<code className="px-1 py-0.5 rounded bg-muted">/tablet</code>,{" "}
            <code className="px-1 py-0.5 rounded bg-muted">/mobile</code>) so Figma links resolve to
            the correct variant.
          </p>
        </section>

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

        {/* Floating Action Island */}
        <section className="space-y-4">
          <div>
            <h2 className="font-heading text-lg font-medium text-foreground">Floating Action Island</h2>
            <p className="text-sm text-muted-foreground">
              Persistent action hub at the bottom of every screen. When off, all island actions
              (Insights, Notifications, Aan, Refresh, Export, Screenshot, Theme) move into the App Taskbar.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-card">
            <label className="flex items-center justify-between cursor-pointer p-4">
              <div>
                <p className="font-medium text-foreground">Show Floating Action Island</p>
                <p className="text-xs text-muted-foreground">Toggle off for a quieter chrome with all actions in the taskbar.</p>
              </div>
              <Switch checked={effects.floatingIsland} onCheckedChange={() => toggleEffect("floatingIsland")} />
            </label>
          </div>
        </section>

        <Separator />

        {/* Gestures */}
        <section className="space-y-4" id="gestures">
          <div className="flex items-center gap-2">
            <Hand className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading text-lg font-medium text-foreground">Gestures</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Hard swipes navigate back/forward. Two- and three-finger gestures trigger any action you map below.
            Vertical 2-finger gestures only fire when the page is at the very top or bottom — normal scrolling is untouched.
          </p>
          <GestureMapper />
        </section>

        <Separator />

        {/* Tutorial */}
        <section className="space-y-4" id="tutorial">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading text-lg font-medium text-foreground">Tutorial</h2>
          </div>
          <div className="rounded-lg border border-border bg-card divide-y divide-border">
            <label className="flex items-center justify-between cursor-pointer p-4">
              <div>
                <p className="font-medium text-foreground">Show product tutorial after sign-in</p>
                <p className="text-xs text-muted-foreground">
                  A guided tour highlights every primary surface — sidebar, taskbar, KPIs, panels, Aan, and shortcuts.
                </p>
              </div>
              <Switch checked={tutorialState.enabled} onCheckedChange={setTutorialEnabled} />
            </label>
            <div className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Replay tutorial now</p>
                <p className="text-xs text-muted-foreground">
                  {tutorialState.completed && tutorialState.lastSeen
                    ? `Last completed ${new Date(tutorialState.lastSeen).toLocaleDateString()}`
                    : "Not completed yet"}
                </p>
              </div>
              <Button size="sm" onClick={restartTutorial}>
                <Play className="h-3.5 w-3.5 mr-1.5" />
                Start tour
              </Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Edit Alerts — Aan automation policies, connected systems, and how Aan decides. */}
        <section className="space-y-4" id="edit-alerts">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <h2 className="font-heading text-lg font-medium text-foreground">Edit Alerts</h2>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Decide what Aan can act on without asking, and what still needs your approval. Every policy is
                a decision pattern you approved once — turn any off and Aan falls back to asking.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 flex items-start gap-2">
            <AlertTriangle className="h-3.5 w-3.5 text-warning mt-0.5 shrink-0" />
            <div className="text-[12px] text-foreground/80">
              <span className="font-medium">Autonomy is opt-in.</span> Aan only auto-executes scenarios covered by an
              enabled policy. Everything else lands in Alerts for your approval.
            </div>
          </div>

          {/* Live mode toggle — controls the Alerts stream */}
          <div className="rounded-lg border border-border bg-card p-4 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm font-semibold text-foreground">Live mode</h3>
                <span className={cn(
                  "text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded",
                  liveMode ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                )}>
                  {liveMode ? "On" : "Off"}
                </span>
              </div>
              <p className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">
                Stream new alerts into the Alerts page in real time. Turn off to review at your own pace.
              </p>
            </div>
            <Switch checked={liveMode} onCheckedChange={setLiveMode} />
          </div>

          <ul className="space-y-3">

            {policies.map((p) => (
              <li key={p.id} className={cn("rounded-lg border bg-card p-4 transition-colors", p.enabled ? "border-primary/30" : "border-border")}>
                <div className="flex items-start gap-3">
                  <div className={cn("mt-0.5 h-8 w-8 rounded-md flex items-center justify-center shrink-0", p.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    <Zap className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-heading text-sm font-semibold text-foreground">{p.name}</h3>
                      <span className={cn("text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded", p.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                        {p.enabled ? "Active" : "Off"}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-muted-foreground mt-1 leading-relaxed">{p.description}</p>
                    <div className="mt-2">
                      <div className="text-[9.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1">Guardrails</div>
                      <ul className="flex flex-wrap gap-1.5">
                        {p.guardrails.map((g, i) => (
                          <li key={i} className="text-[10.5px] rounded bg-muted px-2 py-0.5 text-foreground/70">
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-2 text-[10.5px] text-muted-foreground">
                      Triggered {p.timesTriggered} times{p.lastTriggered ? ` · last: ${p.lastTriggered}` : ""}
                    </div>
                  </div>
                  <Switch checked={p.enabled} onCheckedChange={() => togglePolicy(p.id)} />
                </div>
              </li>
            ))}
          </ul>

          {/* Connected systems + How Aan decides — collapsed by default */}
          <div className="rounded-lg border border-border bg-card">
            <button
              type="button"
              onClick={() => setHowAanOpen((v) => !v)}
              className="w-full flex items-center gap-2 px-4 py-3 text-left hover:bg-muted/30 rounded-lg"
            >
              <Shield className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground">How Aan decides</div>
                <div className="text-[11px] text-muted-foreground">Connected systems and decision model</div>
              </div>
              <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform", howAanOpen && "rotate-180")} />
            </button>
            {howAanOpen && (
              <div className="border-t border-border/60 px-4 py-4 space-y-4">
                <p className="text-[12px] text-muted-foreground leading-relaxed">
                  Aan is an autonomous coworker, not a chatbot. It watches your channels, correlates that context
                  with your live business data, and never acts without your approval unless a policy above allows it.
                </p>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Connected systems</div>
                  <ul className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                    {CONNECTED_SYSTEMS.map((sys) => (
                      <li key={sys.id} className="flex items-center gap-2 text-[12px]">
                        <span className="relative flex h-2 w-2 shrink-0">
                          {sys.pulse && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />}
                          <span className={cn("relative inline-flex h-2 w-2 rounded-full", sys.status === "active" ? "bg-success" : "bg-muted-foreground/40")} />
                        </span>
                        <span className="text-foreground/80 flex-1 truncate">{sys.name}</span>
                        <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{sys.status}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </section>

        <Separator />



        {/* Keyboard Shortcuts */}
        <section className="space-y-4" id="shortcuts">
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-heading text-lg font-medium text-foreground">Keyboard Shortcuts</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Click <Pencil className="inline h-3 w-3" /> to rebind. Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">?</kbd> anywhere — or click the <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">⌘K</kbd> chip on the Floating Action Island — to see all shortcuts.
          </p>
          <ShortcutEditor />
        </section>

      </div>
</AppLayout>
  );
}
