import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { useActivePanel } from "./ActivePanelContext";
import { useAan } from "@/components/aan/AanContext";
import { useInsights } from "@/components/insights";

/* ── Action registry ───────────────────────────────────────── */

export type GestureActionId =
  | "none"
  | "history-back"
  | "history-forward"
  | "scroll-top"
  | "scroll-bottom"
  | "open-notifications"
  | "open-insights"
  | "toggle-aan"
  | "refresh"
  | "next-tab"
  | "prev-tab";

export interface GestureActionDef {
  id: GestureActionId;
  label: string;
  description: string;
}

export const GESTURE_ACTIONS: GestureActionDef[] = [
  { id: "none", label: "Disabled", description: "Do nothing" },
  { id: "history-back", label: "Go back", description: "Browser history back" },
  { id: "history-forward", label: "Go forward", description: "Browser history forward" },
  { id: "scroll-top", label: "Scroll to top", description: "Jump to top of page" },
  { id: "scroll-bottom", label: "Scroll to bottom", description: "Jump to bottom of page" },
  { id: "open-notifications", label: "Open Notifications", description: "Open alerts panel" },
  { id: "open-insights", label: "Open Insights", description: "Open insights panel" },
  { id: "toggle-aan", label: "Toggle Aan AI", description: "Open or close Aan Copilot" },
  { id: "refresh", label: "Refresh data", description: "Reload current view" },
  { id: "next-tab", label: "Next tab", description: "Move to next sub-tab" },
  { id: "prev-tab", label: "Previous tab", description: "Move to previous sub-tab" },
];

/* ── Bindings ──────────────────────────────────────────────── */

export type GestureKey =
  | "swipe-left"
  | "swipe-right"
  | "two-up"
  | "two-down"
  | "two-left"
  | "two-right"
  | "three-up"
  | "three-down"
  | "three-left"
  | "three-right";

export interface GestureDef {
  key: GestureKey;
  label: string;
  hint: string;
  fingers: 1 | 2 | 3;
  direction: "up" | "down" | "left" | "right";
}

export const GESTURES: GestureDef[] = [
  { key: "swipe-left", label: "Edge swipe left", hint: "Touch screen: swipe from right edge", fingers: 1, direction: "left" },
  { key: "swipe-right", label: "Edge swipe right", hint: "Touch screen: swipe from left edge", fingers: 1, direction: "right" },
  { key: "two-up", label: "Two-finger up", hint: "Touchpad: 2-finger scroll up (hard)", fingers: 2, direction: "up" },
  { key: "two-down", label: "Two-finger down", hint: "Touchpad: 2-finger scroll down (hard)", fingers: 2, direction: "down" },
  { key: "two-left", label: "Two-finger left", hint: "Touchpad: 2-finger swipe left", fingers: 2, direction: "left" },
  { key: "two-right", label: "Two-finger right", hint: "Touchpad: 2-finger swipe right", fingers: 2, direction: "right" },
  { key: "three-up", label: "Three-finger up", hint: "Touch screen: 3 fingers up", fingers: 3, direction: "up" },
  { key: "three-down", label: "Three-finger down", hint: "Touch screen: 3 fingers down", fingers: 3, direction: "down" },
  { key: "three-left", label: "Three-finger left", hint: "Touch screen: 3 fingers left", fingers: 3, direction: "left" },
  { key: "three-right", label: "Three-finger right", hint: "Touch screen: 3 fingers right", fingers: 3, direction: "right" },
];

const DEFAULT_BINDINGS: Record<GestureKey, GestureActionId> = {
  "swipe-left": "history-forward",
  "swipe-right": "history-back",
  "two-up": "scroll-top",
  "two-down": "open-notifications",
  "two-left": "history-back",
  "two-right": "history-forward",
  "three-up": "toggle-aan",
  "three-down": "open-insights",
  "three-left": "prev-tab",
  "three-right": "next-tab",
};

const BINDINGS_KEY = "anarix-gesture-bindings";
const ENABLED_KEY = "anarix-gestures-enabled";

function loadBindings(): Record<GestureKey, GestureActionId> {
  try {
    const stored = localStorage.getItem(BINDINGS_KEY);
    if (stored) return { ...DEFAULT_BINDINGS, ...JSON.parse(stored) };
  } catch {}
  return { ...DEFAULT_BINDINGS };
}

function loadEnabled(): boolean {
  try {
    const stored = localStorage.getItem(ENABLED_KEY);
    return stored === null ? true : stored === "true";
  } catch {
    return true;
  }
}

/* ── Context ───────────────────────────────────────────────── */

interface GestureContextValue {
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  bindings: Record<GestureKey, GestureActionId>;
  setBinding: (key: GestureKey, action: GestureActionId) => void;
  resetBindings: () => void;
  lastTriggered: { key: GestureKey; action: GestureActionId; at: number } | null;
}

const GestureContext = createContext<GestureContextValue | null>(null);

export function useGestures() {
  const ctx = useContext(GestureContext);
  if (!ctx) throw new Error("useGestures must be used inside GestureProvider");
  return ctx;
}

/* ── Provider ──────────────────────────────────────────────── */

export function GestureProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { setDataPanel, closeDataPanel, dataPanel } = useActivePanel();
  const { openCopilot, closePanel, mode } = useAan();
  const { openPanel: openInsights } = useInsights();

  const [enabled, setEnabledState] = useState<boolean>(loadEnabled);
  const [bindings, setBindings] = useState<Record<GestureKey, GestureActionId>>(loadBindings);
  const [lastTriggered, setLastTriggered] = useState<
    GestureContextValue["lastTriggered"]
  >(null);
  const cooldownRef = useRef<number>(0);

  const setEnabled = useCallback((v: boolean) => {
    setEnabledState(v);
    localStorage.setItem(ENABLED_KEY, String(v));
  }, []);

  const setBinding = useCallback(
    (key: GestureKey, action: GestureActionId) => {
      setBindings((prev) => {
        const next = { ...prev, [key]: action };
        localStorage.setItem(BINDINGS_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const resetBindings = useCallback(() => {
    setBindings({ ...DEFAULT_BINDINGS });
    localStorage.setItem(BINDINGS_KEY, JSON.stringify(DEFAULT_BINDINGS));
  }, []);

  const runAction = useCallback(
    (key: GestureKey, action: GestureActionId) => {
      const now = Date.now();
      if (now - cooldownRef.current < 500) return;
      cooldownRef.current = now;
      setLastTriggered({ key, action, at: now });
      switch (action) {
        case "history-back":
          window.history.back();
          break;
        case "history-forward":
          window.history.forward();
          break;
        case "scroll-top":
          window.scrollTo({ top: 0, behavior: "smooth" });
          document.querySelector("main")?.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "scroll-bottom": {
          const main = document.querySelector("main");
          if (main) main.scrollTo({ top: main.scrollHeight, behavior: "smooth" });
          else window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
          break;
        }
        case "open-notifications":
          if (dataPanel === "notifications") closeDataPanel();
          else setDataPanel("notifications");
          break;
        case "open-insights":
          openInsights();
          break;
        case "toggle-aan":
          if (mode === "copilot") closePanel();
          else openCopilot();
          break;
        case "refresh":
          window.dispatchEvent(new CustomEvent("anarix-refresh"));
          break;
        case "next-tab":
        case "prev-tab":
          window.dispatchEvent(
            new CustomEvent("anarix-tab-nav", { detail: { direction: action === "next-tab" ? 1 : -1 } })
          );
          break;
        default:
          break;
      }
    },
    [closePanel, closeDataPanel, dataPanel, mode, openCopilot, openInsights, setDataPanel]
  );

  /* Edge swipe (touchscreen, single finger) */
  useEffect(() => {
    if (!enabled || window.innerWidth < 1024) return;
    let startX = 0;
    let startY = 0;
    let startTime = 0;
    let active = false;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        active = false;
        return;
      }
      const t = e.touches[0];
      const fromLeft = t.clientX <= 24;
      const fromRight = t.clientX >= window.innerWidth - 24;
      if (!fromLeft && !fromRight) return;
      const target = e.target as HTMLElement;
      if (target.closest("input,textarea,[contenteditable=true]")) return;
      startX = t.clientX;
      startY = t.clientY;
      startTime = Date.now();
      active = true;
    };
    const onEnd = (e: TouchEvent) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const dt = Date.now() - startTime;
      if (Math.abs(dy) > 80 || dt > 600) return;
      if (Math.abs(dx) < 80) return;
      const velocity = Math.abs(dx) / dt;
      if (velocity < 0.4) return;
      const key: GestureKey = dx > 0 ? "swipe-right" : "swipe-left";
      const action = bindings[key];
      if (action && action !== "none") runAction(key, action);
    };

    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [enabled, bindings, runAction]);

  /* Two-finger trackpad swipes (wheel deltaX/Y bursts) */
  useEffect(() => {
    if (!enabled || window.innerWidth < 1024) return;
    let accX = 0;
    let accY = 0;
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const onWheel = (e: WheelEvent) => {
      // Trackpad swipes typically have small deltas without ctrlKey.
      // Hard swipes accumulate quickly. We treat |delta| > 120 within 250ms as gesture.
      const target = e.target as HTMLElement;
      if (target.closest("input,textarea,[contenteditable=true]")) return;
      accX += e.deltaX;
      accY += e.deltaY;
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => {
        accX = 0;
        accY = 0;
      }, 250);

      const THRESH = 240;
      let key: GestureKey | null = null;
      if (Math.abs(accX) > THRESH && Math.abs(accX) > Math.abs(accY) * 1.5) {
        key = accX > 0 ? "two-right" : "two-left";
        accX = 0;
        accY = 0;
      } else if (Math.abs(accY) > THRESH * 2 && Math.abs(accY) > Math.abs(accX) * 1.5) {
        // Vertical gestures only fire when at document edges (avoids normal scroll).
        const main = document.querySelector("main");
        const atTop = (main?.scrollTop ?? window.scrollY) <= 4;
        const atBottom = main
          ? main.scrollTop + main.clientHeight >= main.scrollHeight - 4
          : window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
        if (accY < 0 && atTop) key = "two-up";
        else if (accY > 0 && atBottom) key = "two-down";
        if (key) {
          accX = 0;
          accY = 0;
        }
      }
      if (key) {
        const action = bindings[key];
        if (action && action !== "none") runAction(key, action);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: true });
    return () => window.removeEventListener("wheel", onWheel);
  }, [enabled, bindings, runAction]);

  /* Multi-touch (2 and 3 finger) on touchscreens */
  useEffect(() => {
    if (!enabled || window.innerWidth < 1024) return;
    let startTouches: { x: number; y: number }[] = [];
    let startTime = 0;
    let fingers = 0;

    const onStart = (e: TouchEvent) => {
      if (e.touches.length < 2) return;
      fingers = e.touches.length;
      startTouches = Array.from(e.touches).map((t) => ({ x: t.clientX, y: t.clientY }));
      startTime = Date.now();
    };
    const onEnd = (e: TouchEvent) => {
      if (fingers < 2) return;
      const dt = Date.now() - startTime;
      const target = e.target as HTMLElement;
      if (target.closest("input,textarea,[contenteditable=true]")) {
        fingers = 0;
        return;
      }
      const endTouches = Array.from(e.changedTouches).map((t) => ({ x: t.clientX, y: t.clientY }));
      const n = Math.min(startTouches.length, endTouches.length);
      let dx = 0;
      let dy = 0;
      for (let i = 0; i < n; i++) {
        dx += endTouches[i].x - startTouches[i].x;
        dy += endTouches[i].y - startTouches[i].y;
      }
      dx /= n;
      dy /= n;
      const f = fingers;
      fingers = 0;
      if (dt > 700) return;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 60) return;
      const isHorizontal = Math.abs(dx) > Math.abs(dy);
      let dir: "up" | "down" | "left" | "right";
      if (isHorizontal) dir = dx > 0 ? "right" : "left";
      else dir = dy > 0 ? "down" : "up";
      const prefix = f === 2 ? "two" : f >= 3 ? "three" : null;
      if (!prefix) return;
      const key = `${prefix}-${dir}` as GestureKey;
      const action = bindings[key];
      if (action && action !== "none") runAction(key, action);
    };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchend", onEnd);
    };
  }, [enabled, bindings, runAction]);

  return (
    <GestureContext.Provider
      value={{ enabled, setEnabled, bindings, setBinding, resetBindings, lastTriggered }}
    >
      {children}
    </GestureContext.Provider>
  );
}
