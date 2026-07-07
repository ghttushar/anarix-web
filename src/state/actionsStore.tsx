// New actions store — self-contained, scoped to the Action Items v2 surface.
// Independent of AanEventsContext (which still powers the FloatingActionIsland
// mini-inbox and PanelRoute in Phase 1; those migrate later).
//
// Responsibilities:
//  - Hold Decisions + DigestItems + MeetingBundles + Questions.
//  - Approve / Reject / Delegate-to-Aan / Snooze — with 30s undo window.
//  - Meeting tasks: mark completed / not completed / delegate to Aan.
//  - Questions: answer / skip.
//  - Digest threshold (routes items above → Decide, below → Digest).
//  - Bulk ops (approve N, complete bundle).

import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { MOCK_DECISIONS, MOCK_DIGEST_ITEMS, type Decision, type DigestItem, type DecisionStatus } from "@/data/mockDecisions";
import { MOCK_MEETING_BUNDLES, MOCK_MEETING_TASKS, type MeetingBundle, type MeetingTask, type MeetingTaskStatus } from "@/data/mockMeetings";
import { MOCK_QUESTIONS, type AanQuestion, type QuestionStatus } from "@/data/mockQuestions";
import { valueMagnitude } from "@/lib/decisions/valueFormat";

const UNDO_MS = 30_000;
const DEFAULT_DIGEST_THRESHOLD_CENTS = 25_000; // $250

export type SnoozeChoice = "1h" | "tomorrow" | "next_week";

const SNOOZE_MS: Record<SnoozeChoice, number> = {
  "1h": 60 * 60 * 1000,
  tomorrow: 20 * 60 * 60 * 1000,
  next_week: 7 * 24 * 60 * 60 * 1000,
};

interface ActionsStore {
  decisions: Decision[];
  digestItems: DigestItem[];
  digestThresholdCents: number;
  setDigestThresholdCents: (c: number) => void;

  approve: (id: string) => void;
  reject: (id: string) => void;
  delegateToAan: (id: string) => void;
  snooze: (id: string, choice: SnoozeChoice) => void;
  bulkApprove: (ids: string[]) => void;

  /** Decisions above digest threshold — belong on Decide. */
  aboveThreshold: Decision[];
  /** Decisions below threshold — routed into digest. */
  belowThreshold: Decision[];

  // ---- Meetings (Flow B) ----
  meetings: MeetingBundle[];
  meetingTasks: MeetingTask[];
  tasksForBundle: (bundleId: string) => MeetingTask[];
  bundleValueCents: (bundleId: string) => number;
  bundleOpenCount: (bundleId: string) => number;
  markTaskCompleted: (taskId: string) => void;
  markTaskNotCompleted: (taskId: string) => void;
  delegateTaskToAan: (taskId: string) => void;
  bulkCompleteBundle: (bundleId: string) => void;

  // ---- Questions ----
  questions: AanQuestion[];
  openQuestionsCount: number;
  answerQuestion: (id: string, choiceId: string) => void;
  skipQuestion: (id: string) => void;
}

const Ctx = createContext<ActionsStore | undefined>(undefined);

export function ActionsProvider({ children }: { children: ReactNode }) {
  const [decisions, setDecisions] = useState<Decision[]>(MOCK_DECISIONS);
  const [digestItems] = useState<DigestItem[]>(MOCK_DIGEST_ITEMS);
  const [digestThresholdCents, setDigestThresholdCents] = useState<number>(DEFAULT_DIGEST_THRESHOLD_CENTS);
  const [meetings] = useState<MeetingBundle[]>(MOCK_MEETING_BUNDLES);
  const [meetingTasks, setMeetingTasks] = useState<MeetingTask[]>(MOCK_MEETING_TASKS);
  const [questions, setQuestions] = useState<AanQuestion[]>(MOCK_QUESTIONS);

  // Undo bookkeeping — remembers previous status so we can roll back within 30s.
  const undoTimersRef = useRef<Map<string, { timer: ReturnType<typeof setTimeout>; prev: DecisionStatus }>>(new Map());
  const taskUndoRef = useRef<Map<string, { timer: ReturnType<typeof setTimeout>; prev: MeetingTaskStatus }>>(new Map());
  const qUndoRef = useRef<Map<string, { timer: ReturnType<typeof setTimeout>; prev: QuestionStatus; prevChoice?: string }>>(new Map());

  const rollback = useCallback((id: string) => {
    const entry = undoTimersRef.current.get(id);
    if (!entry) return;
    clearTimeout(entry.timer);
    undoTimersRef.current.delete(id);
    setDecisions((prev) => prev.map((d) => (d.id === id ? { ...d, status: entry.prev, updatedAt: Date.now() } : d)));
    toast.message("Undone. Back to your queue.");
  }, []);

  const setStatus = useCallback((id: string, status: DecisionStatus, extras?: Partial<Decision>) => {
    setDecisions((prev) => {
      const target = prev.find((d) => d.id === id);
      if (!target) return prev;
      if (["with_aan", "in_flight", "rejected", "completed", "snoozed"].includes(status)) {
        const existing = undoTimersRef.current.get(id);
        if (existing) clearTimeout(existing.timer);
        const timer = setTimeout(() => undoTimersRef.current.delete(id), UNDO_MS);
        undoTimersRef.current.set(id, { timer, prev: target.status });
      }
      return prev.map((d) => (d.id === id ? { ...d, status, updatedAt: Date.now(), ...extras } : d));
    });
  }, []);

  const approve = useCallback((id: string) => {
    setStatus(id, "in_flight");
    toast.success("Approved. I'll get to work in 30 seconds.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollback(id) },
    });
  }, [rollback, setStatus]);

  const reject = useCallback((id: string) => {
    setStatus(id, "rejected");
    toast.message("Rejected. I'll stand down for 24h.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollback(id) },
    });
  }, [rollback, setStatus]);

  const delegateToAan = useCallback((id: string) => {
    setStatus(id, "with_aan");
    toast.success("On it. I'll draft, execute, and report back.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollback(id) },
    });
  }, [rollback, setStatus]);

  const snooze = useCallback((id: string, choice: SnoozeChoice) => {
    const until = Date.now() + SNOOZE_MS[choice];
    setStatus(id, "snoozed", { snoozedUntil: until });
    const label = choice === "1h" ? "1 hour" : choice === "tomorrow" ? "tomorrow" : "next week";
    toast.message(`Snoozed until ${label}.`, {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollback(id) },
    });
  }, [rollback, setStatus]);

  const bulkApprove = useCallback((ids: string[]) => {
    ids.forEach((id) => setStatus(id, "in_flight"));
    toast.success(`Approved ${ids.length} items. I'll execute in 30 seconds.`, {
      duration: UNDO_MS,
      action: { label: "Undo all", onClick: () => ids.forEach(rollback) },
    });
  }, [rollback, setStatus]);

  // ---- Meeting task lifecycle ----

  const rollbackTask = useCallback((taskId: string) => {
    const entry = taskUndoRef.current.get(taskId);
    if (!entry) return;
    clearTimeout(entry.timer);
    taskUndoRef.current.delete(taskId);
    setMeetingTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status: entry.prev, updatedAt: Date.now() } : t)));
    toast.message("Undone.");
  }, []);

  const setTaskStatus = useCallback((taskId: string, status: MeetingTaskStatus) => {
    setMeetingTasks((prev) => {
      const target = prev.find((t) => t.id === taskId);
      if (!target) return prev;
      const existing = taskUndoRef.current.get(taskId);
      if (existing) clearTimeout(existing.timer);
      const timer = setTimeout(() => taskUndoRef.current.delete(taskId), UNDO_MS);
      taskUndoRef.current.set(taskId, { timer, prev: target.status });
      return prev.map((t) => (t.id === taskId ? { ...t, status, updatedAt: Date.now() } : t));
    });
  }, []);

  const markTaskCompleted = useCallback((taskId: string) => {
    setTaskStatus(taskId, "completed");
    toast.success("Marked completed.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollbackTask(taskId) },
    });
  }, [rollbackTask, setTaskStatus]);

  const markTaskNotCompleted = useCallback((taskId: string) => {
    setTaskStatus(taskId, "not_completed");
    toast.message("Marked not completed.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollbackTask(taskId) },
    });
  }, [rollbackTask, setTaskStatus]);

  const delegateTaskToAan = useCallback((taskId: string) => {
    setTaskStatus(taskId, "with_aan");
    toast.success("On it. I'll take this from here.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollbackTask(taskId) },
    });
  }, [rollbackTask, setTaskStatus]);

  const bulkCompleteBundle = useCallback((bundleId: string) => {
    const ids: string[] = [];
    setMeetingTasks((prev) => prev.map((t) => {
      if (t.bundleId !== bundleId || t.status !== "open") return t;
      const existing = taskUndoRef.current.get(t.id);
      if (existing) clearTimeout(existing.timer);
      const timer = setTimeout(() => taskUndoRef.current.delete(t.id), UNDO_MS);
      taskUndoRef.current.set(t.id, { timer, prev: t.status });
      ids.push(t.id);
      return { ...t, status: "completed", updatedAt: Date.now() };
    }));
    if (ids.length === 0) {
      toast.message("Nothing left to complete in this bundle.");
      return;
    }
    toast.success(`Marked ${ids.length} task${ids.length === 1 ? "" : "s"} completed.`, {
      duration: UNDO_MS,
      action: { label: "Undo all", onClick: () => ids.forEach(rollbackTask) },
    });
  }, [rollbackTask]);

  const tasksForBundle = useCallback((bundleId: string) =>
    meetingTasks.filter((t) => t.bundleId === bundleId), [meetingTasks]);

  const bundleValueCents = useCallback((bundleId: string) =>
    meetingTasks
      .filter((t) => t.bundleId === bundleId)
      .reduce((sum, t) => sum + valueMagnitude(t.valueKind, t.valueCents), 0), [meetingTasks]);

  const bundleOpenCount = useCallback((bundleId: string) =>
    meetingTasks.filter((t) => t.bundleId === bundleId && t.status === "open").length, [meetingTasks]);

  // ---- Questions ----

  const rollbackQuestion = useCallback((id: string) => {
    const entry = qUndoRef.current.get(id);
    if (!entry) return;
    clearTimeout(entry.timer);
    qUndoRef.current.delete(id);
    setQuestions((prev) => prev.map((q) =>
      q.id === id ? { ...q, status: entry.prev, chosenId: entry.prevChoice } : q));
    toast.message("Undone.");
  }, []);

  const answerQuestion = useCallback((id: string, choiceId: string) => {
    setQuestions((prev) => {
      const target = prev.find((q) => q.id === id);
      if (!target) return prev;
      const existing = qUndoRef.current.get(id);
      if (existing) clearTimeout(existing.timer);
      const timer = setTimeout(() => qUndoRef.current.delete(id), UNDO_MS);
      qUndoRef.current.set(id, { timer, prev: target.status, prevChoice: target.chosenId });
      return prev.map((q) => (q.id === id ? { ...q, status: "answered", chosenId: choiceId } : q));
    });
    toast.success("Answer recorded. I'll remember for next time.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollbackQuestion(id) },
    });
  }, [rollbackQuestion]);

  const skipQuestion = useCallback((id: string) => {
    setQuestions((prev) => {
      const target = prev.find((q) => q.id === id);
      if (!target) return prev;
      const existing = qUndoRef.current.get(id);
      if (existing) clearTimeout(existing.timer);
      const timer = setTimeout(() => qUndoRef.current.delete(id), UNDO_MS);
      qUndoRef.current.set(id, { timer, prev: target.status, prevChoice: target.chosenId });
      return prev.map((q) => (q.id === id ? { ...q, status: "skipped" } : q));
    });
    toast.message("Skipped. I'll guess safely and note it in Handled.", {
      duration: UNDO_MS,
      action: { label: "Undo", onClick: () => rollbackQuestion(id) },
    });
  }, [rollbackQuestion]);

  const openQuestionsCount = useMemo(
    () => questions.filter((q) => q.status === "open").length,
    [questions],
  );

  const { aboveThreshold, belowThreshold } = useMemo(() => {
    const above: Decision[] = [];
    const below: Decision[] = [];
    for (const d of decisions) {
      const mag = valueMagnitude(d.valueKind, d.valueCents);
      if (d.valueKind === "info" || mag >= digestThresholdCents) above.push(d);
      else below.push(d);
    }
    return { aboveThreshold: above, belowThreshold: below };
  }, [decisions, digestThresholdCents]);

  const value = useMemo<ActionsStore>(() => ({
    decisions, digestItems, digestThresholdCents, setDigestThresholdCents,
    approve, reject, delegateToAan, snooze, bulkApprove,
    aboveThreshold, belowThreshold,
    meetings, meetingTasks, tasksForBundle, bundleValueCents, bundleOpenCount,
    markTaskCompleted, markTaskNotCompleted, delegateTaskToAan, bulkCompleteBundle,
    questions, openQuestionsCount, answerQuestion, skipQuestion,
  }), [
    decisions, digestItems, digestThresholdCents,
    approve, reject, delegateToAan, snooze, bulkApprove,
    aboveThreshold, belowThreshold,
    meetings, meetingTasks, tasksForBundle, bundleValueCents, bundleOpenCount,
    markTaskCompleted, markTaskNotCompleted, delegateTaskToAan, bulkCompleteBundle,
    questions, openQuestionsCount, answerQuestion, skipQuestion,
  ]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useActionsStore(): ActionsStore {
  const v = useContext(Ctx);
  if (!v) throw new Error("useActionsStore must be used inside <ActionsProvider>");
  return v;
}
