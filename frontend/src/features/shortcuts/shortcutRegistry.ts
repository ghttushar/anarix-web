export const CUSTOM_SHORTCUTS_KEY = "anarix-custom-shortcuts";

export interface ShortcutDef {
  id: string;
  keys: string[];
  description: string;
}

export interface ShortcutCategory {
  category: string;
  shortcuts: ShortcutDef[];
}

export const defaultShortcuts: ShortcutCategory[] = [
  {
    category: "Navigation",
    shortcuts: [
      { id: "cmd-k", keys: ["⌘", "K"], description: "Open command palette" },
      { id: "help", keys: ["?"], description: "Show all keyboard shortcuts" },
      { id: "go-dashboard", keys: ["G", "D"], description: "Go to Dashboard" },
      { id: "go-advertising", keys: ["G", "A"], description: "Go to Advertising" },
      { id: "go-settings", keys: ["G", "S"], description: "Go to Settings" },
    ],
  },
  {
    category: "Tables",
    shortcuts: [
      { id: "row-down", keys: ["J"], description: "Move down in table" },
      { id: "row-up", keys: ["K"], description: "Move up in table" },
      { id: "row-open", keys: ["Enter"], description: "Select/open row" },
      { id: "row-close", keys: ["Esc"], description: "Deselect/close" },
      { id: "row-select-all", keys: ["⌘", "A"], description: "Select all rows" },
    ],
  },
  {
    category: "Actions",
    shortcuts: [
      { id: "save", keys: ["⌘", "S"], description: "Save changes" },
      { id: "export", keys: ["⌘", "E"], description: "Export data" },
      { id: "filter", keys: ["⌘", "F"], description: "Search/filter" },
      { id: "new", keys: ["⌘", "N"], description: "Create new item" },
      { id: "toggle-sidebar", keys: ["⌘", "\\"], description: "Toggle sidebar" },
    ],
  },
  {
    category: "AI (Aan)",
    shortcuts: [
      { id: "aan-open", keys: ["⌘", "J"], description: "Open Aan AI panel" },
      { id: "aan-send", keys: ["⌘", "Enter"], description: "Send message" },
      { id: "aan-close", keys: ["Esc"], description: "Close AI panel" },
    ],
  },
];

export function loadCustomShortcuts(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(CUSTOM_SHORTCUTS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

export function saveCustomShortcuts(custom: Record<string, string[]>) {
  localStorage.setItem(CUSTOM_SHORTCUTS_KEY, JSON.stringify(custom));
  // Broadcast for same-tab listeners (storage event only fires cross-tab).
  window.dispatchEvent(new CustomEvent("anarix-shortcuts-changed"));
}

export function formatKeyCombo(e: KeyboardEvent): string[] {
  const parts: string[] = [];
  if (e.metaKey || e.ctrlKey) parts.push("⌘");
  if (e.shiftKey) parts.push("Shift");
  if (e.altKey) parts.push("Alt");
  const key = e.key;
  if (!["Meta", "Control", "Shift", "Alt"].includes(key)) {
    parts.push(key.length === 1 ? key.toUpperCase() : key);
  }
  return parts;
}
