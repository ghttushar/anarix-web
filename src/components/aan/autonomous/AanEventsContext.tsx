// Aan Events — self-contained in-memory event store for the autonomous
// operations mockup. Manages lifecycle transitions
// (detected → analyzing → awaiting_approval → executing → fulfilled | rejected)
// and a Live-mode timer that periodically fires seeded events.
//
// Everything is client-only. No Supabase. No real API calls.

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { SCENARIOS, ScenarioTemplate, getScenario } from "@/data/mockAanScenarios";
import { MEETING_TASK_BUNDLES, MeetingTaskBundle, MeetingItemStatus } from "@/data/mockMeetingTasks";
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
  // Meeting-originated action bundles (Flow B)
  meetingBundles: MeetingTaskBundle[];
  meetingPendingCount: number;
  approveMeetingItem: (bundleId: string, itemId: string) => void;
  rejectMeetingItem: (bundleId: string, itemId: string) => void;
  approveAllMeetingItems: (bundleId: string) => void;
  rejectAllMeetingItems: (bundleId: string) => void;
}

const AanEventsContext = createContext<AanEventsContextType | undefined>(undefined);

// ---- Seeded events so the demo has a story on first load ----
// Note: no meeting-hash seeding here. Meeting-originated tasks live in a
// separate `meetingBundles` stream (Flow B). These events (Flow A) may
// reference a meeting via `scenario.meetingRef` but appear in All/Live/Overnight.
function seedEvents(): AanEvent[] {
  const now = Date.now();
  const HOUR = 60 * 60 * 1000;
  const seed: Array<{ id: string; life: Lifecycle; ago: number; auto?: boolean; eventId?: string }> = [
    // Overnight (created before 8am or > 10h ago)
    { id: "buybox", life: "awaiting_approval", ago: 13 * HOUR },              // overnight · critical
    { id: "suppression", life: "awaiting_approval", ago: 11 * HOUR },         // overnight · critical
    { id: "daypart", life: "fulfilled", ago: 14 * HOUR, auto: true },         // overnight · fyi (done)
    // E-commerce alerts that also reference a past meeting (meetingRef chip)
    { id: "launch-coverage", life: "awaiting_approval", ago: 2 * HOUR },
    { id: "event-campaign", life: "awaiting_approval", ago: 3 * HOUR },
    { id: "reviews", life: "awaiting_approval", ago: 4 * HOUR },
    { id: "loss-making", life: "executing", ago: 1 * HOUR },
    // Live
    { id: "keyword-promotion", life: "awaiting_approval", ago: 20 * 60 * 1000 },
    { id: "placement-opt", life: "awaiting_approval", ago: 45 * 60 * 1000 },
    { id: "budget-optimization", life: "fulfilled", ago: 90 * 60 * 1000, auto: true },
  ];
  return seed
    .map(({ id, life, ago, auto, eventId }) => {
      const s = getScenario(id);
      if (!s) return null;
      return {
        eventId: eventId ?? `evt-${id}-seed`,
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
  const [meetingBundles, setMeetingBundles] = useState<MeetingTaskBundle[]>(() => MEETING_TASK_BUNDLES);
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
    toast.info(`I spotted something: ${s.title}`, {
      description: auto ? "I auto-approved this under your policy. Executing now." : "I've added it to your Action Items — waiting on you.",
    });

    if (!auto) {
      setTimeout(() => {
        setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, lifecycle: "analyzing", updatedAt: Date.now() } : e)));
      }, 700);
      setTimeout(() => {
        setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, lifecycle: "awaiting_approval", updatedAt: Date.now() } : e)));
      }, 1600);
    } else {
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
      toast.success(`I finished: ${s.title}`, { description: s.fulfillmentNote });
    }, cumulativeDelay + 300);
  }, []);

  // 30s undo tracker for event approve/reject
  const undoTimersRef = useRef<Map<string, { timer: ReturnType<typeof setTimeout>; prev: Lifecycle }>>(new Map());

  const undoEventAction = useCallback((eventId: string) => {
    const entry = undoTimersRef.current.get(eventId);
    if (!entry) return;
    clearTimeout(entry.timer);
    undoTimersRef.current.delete(eventId);
    setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, lifecycle: entry.prev, updatedAt: Date.now() } : e)));
    toast.info("Undone. I'll wait for your call.");
  }, []);

  const approve = useCallback(
    (eventId: string, overrides?: Record<string, string>) => {
      setEvents((prev) => {
        const target = prev.find((e) => e.eventId === eventId);
        const prevLifecycle: Lifecycle = target?.lifecycle ?? "awaiting_approval";
        const timer = setTimeout(() => {
          undoTimersRef.current.delete(eventId);
          setEvents((prev2) => {
            const t = prev2.find((e) => e.eventId === eventId);
            if (t) runExecution(eventId, t.scenario);
            return prev2;
          });
        }, 30_000);
        undoTimersRef.current.set(eventId, { timer, prev: prevLifecycle });
        toast.success("Approved. I'll get to work in 30s.", {
          duration: 30_000,
          action: { label: "Undo", onClick: () => undoEventAction(eventId) },
        });
        return prev.map((e) =>
          e.eventId === eventId
            ? { ...e, lifecycle: "executing", executionProgress: 0, overrides: { ...(e.overrides || {}), ...(overrides || {}) }, updatedAt: Date.now() }
            : e
        );
      });
    },
    [runExecution, undoEventAction]
  );

  const reject = useCallback((eventId: string) => {
    setEvents((prev) => {
      const target = prev.find((e) => e.eventId === eventId);
      const prevLifecycle: Lifecycle = target?.lifecycle ?? "awaiting_approval";
      const timer = setTimeout(() => {
        undoTimersRef.current.delete(eventId);
      }, 30_000);
      undoTimersRef.current.set(eventId, { timer, prev: prevLifecycle });
      toast.info("Rejected. I won't repeat this for 24h.", {
        duration: 30_000,
        action: { label: "Undo", onClick: () => undoEventAction(eventId) },
      });
      return prev.map((e) => (e.eventId === eventId ? { ...e, lifecycle: "rejected", updatedAt: Date.now() } : e));
    });
  }, [undoEventAction]);

  const modifyValue = useCallback((eventId: string, field: string, value: string) => {
    setEvents((prev) => prev.map((e) => (e.eventId === eventId ? { ...e, overrides: { ...(e.overrides || {}), [field]: value } } : e)));
  }, []);

  const clearFulfilled = useCallback(() => {
    setEvents((prev) => prev.filter((e) => e.lifecycle !== "fulfilled" && e.lifecycle !== "rejected"));
  }, []);

  // --- Meeting bundle handlers ---
  const setItemStatus = useCallback((bundleId: string, itemId: string, status: MeetingItemStatus) => {
    setMeetingBundles((prev) =>
      prev.map((b) =>
        b.bundleId !== bundleId
          ? b
          : { ...b, actionItems: b.actionItems.map((it) => (it.id === itemId ? { ...it, status } : it)) }
      )
    );
  }, []);
  const approveMeetingItem = useCallback((bundleId: string, itemId: string) => {
    setItemStatus(bundleId, itemId, "approved");
    toast.success("Action approved. Aan will execute and report back.");
  }, [setItemStatus]);
  const rejectMeetingItem = useCallback((bundleId: string, itemId: string) => {
    setItemStatus(bundleId, itemId, "rejected");
    toast.info("Action rejected.");
  }, [setItemStatus]);
  const approveAllMeetingItems = useCallback((bundleId: string) => {
    setMeetingBundles((prev) =>
      prev.map((b) =>
        b.bundleId !== bundleId
          ? b
          : { ...b, actionItems: b.actionItems.map((it) => (it.status === "pending" ? { ...it, status: "approved" } : it)) }
      )
    );
    toast.success("All pending actions approved.");
  }, []);
  const rejectAllMeetingItems = useCallback((bundleId: string) => {
    setMeetingBundles((prev) =>
      prev.map((b) =>
        b.bundleId !== bundleId
          ? b
          : { ...b, actionItems: b.actionItems.map((it) => (it.status === "pending" ? { ...it, status: "rejected" } : it)) }
      )
    );
    toast.info("All pending actions rejected.");
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
  const meetingPendingCount = useMemo(
    () => meetingBundles.filter((b) => b.actionItems.some((it) => it.status === "pending")).length,
    [meetingBundles]
  );
  const autonomyLevel: "advisory" | "assisted" | "autonomous" = useMemo(() => {
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
    meetingBundles,
    meetingPendingCount,
    approveMeetingItem,
    rejectMeetingItem,
    approveAllMeetingItems,
    rejectAllMeetingItems,
  };

  return <AanEventsContext.Provider value={value}>{children}</AanEventsContext.Provider>;
}

export function useAanEvents() {
  const ctx = useContext(AanEventsContext);
  if (!ctx) throw new Error("useAanEvents must be used within AanEventsProvider");
  return ctx;
}

export const AAN_PRESENCE_MESSAGES = PRESENCE_MESSAGES;
