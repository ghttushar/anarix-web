// Aan Events — self-contained in-memory event store for the autonomous
// operations mockup. Manages lifecycle transitions
// (detected → analyzing → awaiting_approval → executing → fulfilled | rejected)
// and a Live-mode timer that periodically fires seeded events.
//
// Everything is client-only. No Supabase. No real API calls.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { SCENARIOS, ScenarioTemplate, getScenario } from "@/data/mockAanScenarios";
import { toast } from "sonner";

export type Lifecycle =
  | "detected"
  | "analyzing"
  | "awaiting_approval"
  | "executing"
  | "fulfilled"
  | "rejected";

export interface AanEvent {
  eventId: string;
  scenarioId: string;
  scenario: ScenarioTemplate;
  lifecycle: Lifecycle;
  createdAt: number;
  updatedAt: number;
  autoApproved?: boolean;
  policyId?: string;
  executionProgress?: number; // 0..steps.length
  overrides?: Record<string, string>; // user-edited values
}

interface AanEventsContextType {
  events: AanEvent[];
  pendingCount: number;
  criticalCount: number;
  fireScenario: (scenarioId: string, opts?: { autoApproved?: boolean }) => void;
  approve: (eventId: string, overrides?: Record<string, string>) => void;
  reject: (eventId: string) => void;
  modifyValue: (eventId: string, field: string, value: string) => void;
  liveMode: boolean;
  setLiveMode: (on: boolean) => void;
  presenceIndex: number;
  autonomyLevel: "advisory" | "assisted" | "autonomous";
  clearFulfilled: () => void;
}

const AanEventsContext = createContext<AanEventsContextType | undefined>(undefined);

// ---- Seeded events so the demo has a story on first load ----
function seedEvents(): AanEvent[] {
  const now = Date.now();
  const seed: Array<{ id: string; life: Lifecycle; ago: number; auto?: boolean }> = [
    { id: "buybox", life: "awaiting_approval", ago: 3400 * 1000 },
    { id: "suppression", life: "awaiting_approval", ago: 2100 * 1000 },
    { id: "budget-optimization", life: "fulfilled", ago: 1700 * 1000, auto: true },
    { id: "keyword-promotion", life: "awaiting_approval", ago: 1200 * 1000 },
    { id: "launch-coverage", life: "awaiting_approval", ago: 900 * 1000 },
    { id: "loss-making", life: "awaiting_approval", ago: 600 * 1000 },
    { id: "daypart", life: "fulfilled", ago: 26 * 60 * 60 * 1000, auto: true },
    { id: "placement-opt", life: "fulfilled", ago: 4 * 60 * 60 * 1000 },
  ];
  return seed
    .map(({ id, life, ago, auto }) => {
      const s = getScenario(id);
      if (!s) return null;
      return {
        eventId: `evt-${id}-seed`,
        scenarioId: id,
        scenario: s,
        lifecycle: life,
        createdAt: now - ago,
        updatedAt: now - ago + 60 * 1000,
        autoApproved: auto,
        policyId: auto ? (id === "budget-optimization" ? "p1" : id === "daypart" ? "p3" : undefined) : undefined,
      };
    })
    .filter(Boolean) as AanEvent[];
}

const PRESENCE_MESSAGES = [
  "In Staples Review meeting — capturing decisions",
  "Listening to #ops-mount-it (3 new messages)",
  "Scanning 4,231 SKUs for pricing anomalies",
  "Reviewing 6 unread client emails",
  "Watching Buy Box on 47 hero SKUs",
  "Correlating Slack decisions with campaign data",
  "Preparing 10:45 AM meeting summary",
];

export function AanEventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<AanEvent[]>(() => seedEvents());
  const [liveMode, setLiveMode] = useState(false);
  const [presenceIndex, setPresenceIndex] = useState(0);
  const liveTickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const presenceTickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fireScenario = useCallback((scenarioId: string, opts?: { autoApproved?: boolean }) => {
    const s = getScenario(scenarioId);
    if (!s) {
      toast.error(`Unknown scenario: ${scenarioId}`);
      return;
    }
    const eventId = `evt-${scenarioId}-${Date.now()}`;
    const auto = opts?.autoApproved ?? false;
    const now = Date.now();
    const newEvent: AanEvent = {
      eventId,
      scenarioId,
      scenario: s,
      lifecycle: auto ? "executing" : "detected",
      createdAt: now,
      updatedAt: now,
      autoApproved: auto,
      executionProgress: 0,
    };
    setEvents((prev) => [newEvent, ...prev]);
    toast.info(`Aan detected: ${s.title}`, {
      description: auto ? "Auto-approved under policy. Executing now." : "Awaiting your approval in the Aan Inbox.",
    });

    // Advance to analyzing → awaiting_approval (or execute if auto)
    if (!auto) {
      setTimeout(() => {
        setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, lifecycle: "analyzing", updatedAt: Date.now() } : e)));
      }, 700);
      setTimeout(() => {
        setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, lifecycle: "awaiting_approval", updatedAt: Date.now() } : e)));
      }, 1600);
    } else {
      // Run through execution timeline immediately
      runExecution(eventId, s);
    }
  }, []);

  const runExecution = useCallback((eventId: string, s: ScenarioTemplate) => {
    let cumulativeDelay = 0;
    s.steps.forEach((step, i) => {
      cumulativeDelay += step.durationMs;
      setTimeout(() => {
        setEvents((prev) =>
          prev.map((e) =>
            e.eventId === eventId ? { ...e, executionProgress: i + 1, updatedAt: Date.now() } : e
          )
        );
      }, cumulativeDelay);
    });
    setTimeout(() => {
      setEvents((prev) =>
        prev.map((e) =>
          e.eventId === eventId ? { ...e, lifecycle: "fulfilled", updatedAt: Date.now() } : e
        )
      );
      toast.success(`Aan completed: ${s.title}`, { description: s.fulfillmentNote });
    }, cumulativeDelay + 300);
  }, []);

  const approve = useCallback(
    (eventId: string, overrides?: Record<string, string>) => {
      setEvents((prev) => {
        const target = prev.find((e) => e.eventId === eventId);
        if (target) runExecution(eventId, target.scenario);
        return prev.map((e) =>
          e.eventId === eventId
            ? { ...e, lifecycle: "executing", executionProgress: 0, overrides: { ...(e.overrides || {}), ...(overrides || {}) }, updatedAt: Date.now() }
            : e
        );
      });
    },
    [runExecution]
  );

  const reject = useCallback((eventId: string) => {
    setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, lifecycle: "rejected", updatedAt: Date.now() } : e)));
    toast.info("Rejected. Aan will not repeat this recommendation for 24h.");
  }, []);

  const modifyValue = useCallback((eventId: string, field: string, value: string) => {
    setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, overrides: { ...(e.overrides || {}), [field]: value } } : e)));
  }, []);

  const clearFulfilled = useCallback(() => {
    setEvents((prev) => prev.filter((e) => e.lifecycle !== "fulfilled" && e.lifecycle !== "rejected"));
  }, []);

  // Live-mode timer — fires a random unused scenario every ~30s
  useEffect(() => {
    if (!liveMode) {
      if (liveTickRef.current) clearInterval(liveTickRef.current);
      return;
    }
    liveTickRef.current = setInterval(() => {
      const activeIds = new Set(events.filter((e) => e.lifecycle !== "fulfilled" && e.lifecycle !== "rejected").map((e) => e.scenarioId));
      const available = SCENARIOS.filter((s) => !activeIds.has(s.id));
      if (available.length === 0) return;
      const pick = available[Math.floor(Math.random() * available.length)];
      fireScenario(pick.id);
    }, 30_000);
    return () => {
      if (liveTickRef.current) clearInterval(liveTickRef.current);
    };
  }, [liveMode, events, fireScenario]);

  // Presence strip rotator — always on, cheap
  useEffect(() => {
    presenceTickRef.current = setInterval(() => {
      setPresenceIndex((i) => (i + 1) % PRESENCE_MESSAGES.length);
    }, 6000);
    return () => {
      if (presenceTickRef.current) clearInterval(presenceTickRef.current);
    };
  }, []);

  const pendingCount = useMemo(() => events.filter((e) => e.lifecycle === "awaiting_approval" || e.lifecycle === "detected" || e.lifecycle === "analyzing").length, [events]);
  const criticalCount = useMemo(() => events.filter((e) => (e.lifecycle === "awaiting_approval" || e.lifecycle === "detected") && e.scenario.severity === "critical").length, [events]);
  const autonomyLevel: "advisory" | "assisted" | "autonomous" = useMemo(() => {
    // Static for mockup; will be driven by real policy count in the future.
    return "assisted";
  }, []);

  const value: AanEventsContextType = {
    events,
    pendingCount,
    criticalCount,
    fireScenario,
    approve,
    reject,
    modifyValue,
    liveMode,
    setLiveMode,
    presenceIndex,
    autonomyLevel,
    clearFulfilled,
  };

  return <AanEventsContext.Provider value={value}>{children}</AanEventsContext.Provider>;
}

export function useAanEvents() {
  const ctx = useContext(AanEventsContext);
  if (!ctx) throw new Error("useAanEvents must be used within AanEventsProvider");
  return ctx;
}

export const AAN_PRESENCE_MESSAGES = PRESENCE_MESSAGES;
