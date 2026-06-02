export type StepSide = "top" | "bottom" | "left" | "right" | "center";

export interface TutorialStep {
  id: string;
  title: string;
  body: string;
  /** CSS selector OR null for an intro/finale card centered on screen. */
  target: string | null;
  side?: StepSide;
  /** Open this panel before showing (handled by tutorial controller). */
  panel?: "insights" | "notifications" | "aan";
  /** Navigate to this route before showing. */
  navigateTo?: string;
}

export const tutorialSteps: TutorialStep[] = [
  {
    id: "welcome",
    title: "Welcome to Anarix",
    body:
      "A 90-second tour of the analytics surfaces you'll use every day. Use → to advance, ← to go back, Esc to skip.",
    target: null,
    side: "center",
    navigateTo: "/profitability/dashboard",
  },
  {
    id: "sidebar-logo",
    title: "Home base",
    body: "The Anarix logo always returns you to Profitability Dashboard without resetting filters.",
    target: "[data-tour-id='sidebar-logo']",
    side: "right",
  },
  {
    id: "sidebar-nav",
    title: "Modules",
    body:
      "Each group — Profitability, Advertising, Catalog, BI, AMC, Day Parting — is a complete workspace. Hover any item to see sub-pages.",
    target: "[data-tour-id='sidebar-nav']",
    side: "right",
  },
  {
    id: "marketplace",
    title: "Marketplace switcher",
    body: "Pick Amazon, Walmart, Shopify, or TikTok. Selection persists across every page.",
    target: "[data-tour-id='marketplace-selector']",
    side: "right",
  },
  {
    id: "taskbar-date",
    title: "Global date range",
    body: "All KPIs, tables, and charts respect this range. Use presets or pick a custom span.",
    target: "[data-tour-id='taskbar']",
    side: "bottom",
  },
  {
    id: "kpis",
    title: "KPI hero",
    body:
      "Top-line metrics with morphing numbers and trend chips. Click any card to drill into its dedicated tab.",
    target: "main",
    side: "center",
  },
  {
    id: "insights",
    title: "Insights",
    body:
      "Prioritized findings Aan surfaces from your data. Each one links straight to the rule or panel that can act on it.",
    target: "[data-tour-id='island']",
    side: "top",
    panel: "insights",
  },
  {
    id: "notifications",
    title: "Alerts",
    body:
      "System events and rule activations land here. Critical alerts also pulse the bell on the action island.",
    target: "[data-tour-id='island']",
    side: "top",
    panel: "notifications",
  },
  {
    id: "aan",
    title: "Ask Aan",
    body:
      "Your AI analyst. Ask anything about your numbers — Aan returns drafts you confirm before they execute.",
    target: "[data-tour-id='island']",
    side: "top",
    panel: "aan",
  },
  {
    id: "island",
    title: "Floating Action Island",
    body:
      "Persistent hub for insights, alerts, refresh, export, and theme. You can turn it off in Preferences — all actions then move to the App Taskbar.",
    target: "[data-tour-id='island']",
    side: "top",
  },
  {
    id: "shortcuts",
    title: "Keyboard shortcuts",
    body:
      "Click the ⌘K chip on the island to rebind any shortcut. Press ? anywhere to see the full list.",
    target: "[data-tour-id='island-shortcuts']",
    side: "top",
  },
  {
    id: "finale",
    title: "You're set",
    body:
      "Replay this tour anytime from Preferences → Tutorial. Gestures, theme, and shortcuts are all customizable from there.",
    target: null,
    side: "center",
  },
];
