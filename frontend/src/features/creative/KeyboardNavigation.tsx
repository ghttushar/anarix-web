import { createContext, useContext, useEffect, useCallback, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface ShortcutHandler {
  key: string;
  handler: () => void;
  description: string;
  category: string;
}

interface KeyboardNavigationContextType {
  registerShortcut: (key: string, handler: () => void, description: string, category?: string) => void;
  unregisterShortcut: (key: string) => void;
  showOverlay: () => void;
  hideOverlay: () => void;
  isOverlayVisible: boolean;
  shortcuts: ShortcutHandler[];
}

const KeyboardNavigationContext = createContext<KeyboardNavigationContextType | null>(null);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardNavigationContext);
  if (!context) {
    throw new Error("useKeyboardShortcuts must be used within KeyboardNavigationProvider");
  }
  return context;
}

// All default shortcuts with descriptions
const defaultShortcuts = [
  { key: "g h", category: "Navigation", description: "Go to Dashboard (home)" },
  { key: "g c", category: "Navigation", description: "Go to Campaigns" },
  { key: "g d", category: "Navigation", description: "Go to Day Parting" },
  { key: "g s", category: "Navigation", description: "Go to Settings" },
  { key: "g a", category: "Navigation", description: "Go to Accounts" },
  { key: "j", category: "Tables", description: "Move down one row" },
  { key: "k", category: "Tables", description: "Move up one row" },
  { key: "Enter", category: "Tables", description: "Open selected row" },
  { key: "Space", category: "Tables", description: "Toggle row selection" },
  { key: "g g", category: "Tables", description: "Jump to first row" },
  { key: "G", category: "Tables", description: "Jump to last row" },
  { key: "n", category: "Actions", description: "New item (context-aware)" },
  { key: "e", category: "Actions", description: "Edit selected item" },
  { key: "r", category: "Actions", description: "Refresh data" },
  { key: "/", category: "Actions", description: "Focus search" },
  { key: "?", category: "Global", description: "Show keyboard shortcuts" },
  { key: "Escape", category: "Global", description: "Close modals/overlays" },
  { key: "⌘ K", category: "Global", description: "Open command palette" },
];

export function KeyboardNavigationProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [shortcuts, setShortcuts] = useState<ShortcutHandler[]>([]);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const keySequence = useRef<string>("");
  const sequenceTimeout = useRef<NodeJS.Timeout | null>(null);

  const showOverlay = useCallback(() => setIsOverlayVisible(true), []);
  const hideOverlay = useCallback(() => setIsOverlayVisible(false), []);

  const registerShortcut = useCallback((key: string, handler: () => void, description: string, category = "Custom") => {
    setShortcuts(prev => {
      const existing = prev.findIndex(s => s.key === key);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { key, handler, description, category };
        return updated;
      }
      return [...prev, { key, handler, description, category }];
    });
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key));
  }, []);

  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
        return;
      }

      // Handle ? for overlay
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsOverlayVisible(prev => !prev);
        return;
      }

      // Handle Escape
      if (e.key === "Escape") {
        setIsOverlayVisible(false);
        keySequence.current = "";
        return;
      }

      // Build key sequence for multi-key shortcuts
      const key = e.key.toLowerCase();
      
      // Clear timeout and add to sequence
      if (sequenceTimeout.current) {
        clearTimeout(sequenceTimeout.current);
      }
      
      keySequence.current += key + " ";
      
      // Check for matching shortcuts
      const sequence = keySequence.current.trim();
      
      // Navigation shortcuts
      if (sequence === "g h") {
        e.preventDefault();
        navigate("/profitability/dashboard");
        keySequence.current = "";
        return;
      }
      if (sequence === "g c") {
        e.preventDefault();
        navigate("/advertising/campaigns");
        keySequence.current = "";
        return;
      }
      if (sequence === "g d") {
        e.preventDefault();
        navigate("/dayparting/hourly");
        keySequence.current = "";
        return;
      }
      if (sequence === "g s") {
        e.preventDefault();
        navigate("/settings/appearance");
        keySequence.current = "";
        return;
      }
      if (sequence === "g a") {
        e.preventDefault();
        navigate("/settings/accounts");
        keySequence.current = "";
        return;
      }
      if (sequence === "g g") {
        e.preventDefault();
        // Dispatch custom event for table navigation
        window.dispatchEvent(new CustomEvent("keyboard-nav", { detail: { action: "first" } }));
        keySequence.current = "";
        return;
      }

      // Single key shortcuts
      if (key === "j") {
        window.dispatchEvent(new CustomEvent("keyboard-nav", { detail: { action: "down" } }));
      }
      if (key === "k") {
        window.dispatchEvent(new CustomEvent("keyboard-nav", { detail: { action: "up" } }));
      }
      if (key === "g" && e.shiftKey) {
        window.dispatchEvent(new CustomEvent("keyboard-nav", { detail: { action: "last" } }));
        keySequence.current = "";
      }
      if (key === "r" && !e.metaKey && !e.ctrlKey) {
        window.dispatchEvent(new CustomEvent("keyboard-nav", { detail: { action: "refresh" } }));
      }
      if (key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"], input[placeholder*="Search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }

      // Check custom registered shortcuts
      const customShortcut = shortcuts.find(s => s.key.toLowerCase() === key);
      if (customShortcut) {
        e.preventDefault();
        customShortcut.handler();
      }

      // Reset sequence after delay
      sequenceTimeout.current = setTimeout(() => {
        keySequence.current = "";
      }, 1000);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [navigate, shortcuts]);

  return (
    <KeyboardNavigationContext.Provider value={{
      registerShortcut,
      unregisterShortcut,
      showOverlay,
      hideOverlay,
      isOverlayVisible,
      shortcuts,
    }}>
      {children}
      
      {/* Shortcuts Overlay */}
      {isOverlayVisible && (
        <div 
          className="fixed inset-0 z-[9999] bg-background/80 backdrop-blur-sm flex items-center justify-center"
          onClick={hideOverlay}
        >
          <div 
            className="bg-card border border-border rounded-xl shadow-2xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-heading font-semibold">Keyboard Shortcuts</h2>
              <kbd className="px-2 py-1 rounded bg-muted text-muted-foreground text-sm">
                Press ? or Esc to close
              </kbd>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              {["Navigation", "Tables", "Actions", "Global"].map(category => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 uppercase tracking-wider">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {defaultShortcuts
                      .filter(s => s.category === category)
                      .map(shortcut => (
                        <div key={shortcut.key} className="flex items-center justify-between">
                          <span className="text-sm">{shortcut.description}</span>
                          <kbd className={cn(
                            "px-2 py-1 rounded bg-muted text-xs font-mono",
                            "min-w-[2rem] text-center"
                          )}>
                            {shortcut.key}
                          </kbd>
                        </div>
                      ))
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </KeyboardNavigationContext.Provider>
  );
}
