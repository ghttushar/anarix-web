// /alerts — Signals workspace.
// Left rail (category jump) · center (queue) · right (review workspace).
// No accordion — sections are always open; the rail scrolls into view.
// When Aan Live mode is off, only the ASIN B0CSH8TCC6 critical alert is shown.

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ActionsProvider, useActionsStore } from "@/state/actionsStore";
import { SelectionProvider, useSelection } from "@/state/selectionStore";
import { EmptyState } from "@/components/actions/EmptyState";
import { EMPTY_FILTER, type FilterState } from "@/components/actions/FilterSheet";

import { AlertsToolbar } from "@/components/actions/AlertsToolbar";
import { BulkBar } from "@/components/actions/BulkBar";
import { GreetingHeader } from "@/components/actions/GreetingHeader";
import { DailyBriefing } from "@/components/actions/DailyBriefing";
import { CategorySection } from "@/components/actions/CategorySection";
import { CategoryRail } from "@/components/actions/CategoryRail";
import { DecisionValueCard } from "@/components/actions/DecisionValueCard";
import { MeetingCard } from "@/components/actions/MeetingCard";
import { ReviewWorkspace } from "@/components/actions/ReviewWorkspace";
import { MeetingReviewView } from "@/components/actions/review/MeetingReviewView";
import { filterByTab, computeTabCounts, type AlertTabKey } from "@/components/actions/tabs";
import { categorize } from "@/lib/decisions/categories";
import { importanceScore } from "@/lib/decisions/lifecycle";
import { useAanEvents } from "@/components/aan/autonomous/AanEventsContext";
import { CRITICAL_ONLY_DECISION } from "@/data/criticalOnlyDecision";
import type { Decision } from "@/data/mockDecisions";

function usePersistedState<T>(key: string, initial: T): [T, (v: T) => void] {
  const [v, setV] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = sessionStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  return [
    v,
    (n) => {
      setV(n);
      try { sessionStorage.setItem(key, JSON.stringify(n)); } catch { /* noop */ }
    },
  ];
}

interface MeetingGroup {
  bundleId: string;
  title: string;
  signals: Decision[];
}

function groupByMeeting(list: Decision[]): MeetingGroup[] {
  const map = new Map<string, MeetingGroup>();
  for (const d of list) {
    const ref = d.meetingRef;
    if (!ref) continue;
    let g = map.get(ref.bundleId);
    if (!g) {
      g = { bundleId: ref.bundleId, title: ref.title, signals: [] };
      map.set(ref.bundleId, g);
    }
    g.signals.push(d);
  }
  return [...map.values()].sort((a, b) => b.signals.length - a.signals.length);
}

function AlertsInner() {
  const { decisions } = useActionsStore();
  const { clear, selected } = useSelection();
  const { liveMode } = useAanEvents();

  // When Live/Assisted mode is off, restrict the feed to the single critical alert.
  const activeDecisions = useMemo<Decision[]>(
    () => (liveMode ? decisions : [CRITICAL_ONLY_DECISION]),
    [liveMode, decisions],
  );

  const [tab, setTab] = usePersistedState<AlertTabKey>("alerts:tab", "all");
  const [query, setQuery] = usePersistedState<string>("alerts:query", "");
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [activeRailKey, setActiveRailKey] = useState<string | null>(null);

  const counts = useMemo(() => computeTabCounts(activeDecisions), [activeDecisions]);
  const pool = useMemo(() => filterByTab(activeDecisions, tab), [activeDecisions, tab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return pool
      .filter((d) => {
        if (filter.sources.size && !filter.sources.has(d.source)) return false;
        if (filter.domains.size && !filter.domains.has(d.domain)) return false;
        if (
          q &&
          !`${d.insight} ${d.sourceRef.label} ${d.domain}`
            .toLowerCase()
            .includes(q)
        )
          return false;
        return true;
      })
      .sort((a, b) => importanceScore(b) - importanceScore(a));
  }, [pool, filter, query]);

  const allCategoryGroups = useMemo(() => categorize(tab, filtered), [tab, filtered]);
  const categoryGroups = useMemo(() => {
    if (!activeRailKey || activeRailKey === "__all__") return allCategoryGroups;
    const only = allCategoryGroups.find((c) => c.key === activeRailKey);
    return only ? [only] : allCategoryGroups;
  }, [allCategoryGroups, activeRailKey]);
  const meetingGroups = useMemo(() => groupByMeeting(filtered), [filtered]);
  const isMeetingsTab = tab === "meetings";

  const railItems = useMemo(
    () => allCategoryGroups.map((c) => ({ key: c.key, label: c.label, count: c.items.length })),
    [allCategoryGroups],
  );

  // Auto-select the single alert when running in restricted mode so the user
  // lands directly on the ReviewWorkspace.
  useEffect(() => {
    if (!liveMode && !selectedId) setSelectedId(CRITICAL_ONLY_DECISION.id);
    if (liveMode && selectedId === CRITICAL_ONLY_DECISION.id) setSelectedId(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveMode]);

  const handleRailSelect = useCallback((key: string) => {
    setActiveRailKey((prev) => (prev === key ? null : key));
  }, []);

  const selectedDecision = useMemo(
    () => activeDecisions.find((d) => d.id === selectedId) ?? null,
    [activeDecisions, selectedId],
  );

  const selectedMeetingBundle = useMemo(() => {
    if (!selectedMeetingId) return null;
    const first = activeDecisions.find((d) => d.meetingRef?.bundleId === selectedMeetingId);
    return first
      ? { bundleId: selectedMeetingId, title: first.meetingRef!.title }
      : null;
  }, [activeDecisions, selectedMeetingId]);

  const onSelectDecision = useCallback((id: string) => {
    setSelectedId(id);
    setSelectedMeetingId(null);
  }, []);

  const onSelectMeeting = useCallback((bundleId: string) => {
    setSelectedMeetingId(bundleId);
    setSelectedId(null);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selected.size > 0) clear();
        else if (selectedId) setSelectedId(null);
        else if (selectedMeetingId) setSelectedMeetingId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [clear, selected.size, selectedId, selectedMeetingId]);

  const total = isMeetingsTab ? meetingGroups.length : filtered.length;
  const isSearchEmpty = query.trim().length > 0 && total === 0;
  const isEmpty = total === 0;

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Signals" }]} hideUtilityCluster />

      <div className="px-4 pt-4 w-full">
        <GreetingHeader name="Tushar" />

        <AlertsToolbar
          tab={tab}
          onTabChange={setTab}
          counts={counts}
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
          filterSheetOpen={filterSheetOpen}
          onFilterSheetOpenChange={setFilterSheetOpen}
        />

        <BulkBar />

        <div className="grid gap-4 grid-cols-1 xl:grid-cols-[176px_minmax(340px,1fr)_minmax(520px,1.35fr)] items-start">
          {/* Category rail */}
          <div className="hidden xl:block">
            {!isMeetingsTab && (
              <CategoryRail
                items={railItems}
                activeKey={activeRailKey}
                onSelect={handleRailSelect}
              />
            )}
          </div>

          {/* Center: queue */}
          <ScrollArea className="h-[calc(100vh-190px)] pr-2" ref={scrollAreaRef as never}>
            {isEmpty ? (
              <EmptyState
                variant={
                  isSearchEmpty ? "search"
                  : tab === "done" ? "none"
                  : "needs_me"
                }
              />
            ) : isMeetingsTab ? (
              <div className="rounded-lg border border-border/60 bg-card overflow-hidden">
                {meetingGroups.map((m) => (
                  <MeetingCard
                    key={m.bundleId}
                    bundleId={m.bundleId}
                    title={m.title}
                    signals={m.signals}
                    selected={selectedMeetingId === m.bundleId}
                    onSelect={() => onSelectMeeting(m.bundleId)}
                  />
                ))}
              </div>
            ) : (
              categoryGroups.map((cat) => (
                <CategorySection
                  key={cat.key}
                  label={cat.label}
                  count={cat.items.length}
                  ref={(el) => {
                    if (el) sectionRefs.current.set(cat.key, el);
                    else sectionRefs.current.delete(cat.key);
                  }}
                >
                  {cat.items.map((d: Decision) => (
                    <DecisionValueCard
                      key={d.id}
                      decision={d}
                      selected={selectedId === d.id || (d.meetingRef?.bundleId === selectedMeetingId)}
                      onSelect={() => onSelectDecision(d.id)}
                    />
                  ))}
                </CategorySection>
              ))
            )}
          </ScrollArea>

          {/* Right: workspace */}
          <div className="hidden xl:flex flex-col h-[calc(100vh-190px)] min-h-0 sticky top-4">
            {selectedDecision ? (
              <ReviewWorkspace
                decision={selectedDecision}
                onClose={() => setSelectedId(null)}
                onOpenDecision={(id) => onSelectDecision(id)}
              />
            ) : selectedMeetingBundle ? (
              <div className="flex-1 min-h-0 overflow-auto rounded-xl border border-border/70 bg-card p-5">
                <MeetingReviewView
                  bundleId={selectedMeetingBundle.bundleId}
                  bundleTitle={selectedMeetingBundle.title}
                  all={activeDecisions}
                  onOpen={onSelectDecision}
                />
              </div>
            ) : (
              <DailyBriefing />
            )}
          </div>
        </div>
      </div>

      {/* Below xl: modal review sheet */}
      {(selectedDecision || selectedMeetingBundle) && (
        <div className="xl:hidden fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col p-3 animate-in fade-in duration-150 overflow-auto">
          {selectedDecision ? (
            <ReviewWorkspace
              decision={selectedDecision}
              onClose={() => setSelectedId(null)}
              onOpenDecision={(id) => onSelectDecision(id)}
            />
          ) : selectedMeetingBundle ? (
            <div className="rounded-xl border border-border/70 bg-card p-5">
              <MeetingReviewView
                bundleId={selectedMeetingBundle.bundleId}
                bundleTitle={selectedMeetingBundle.title}
                all={activeDecisions}
                onOpen={onSelectDecision}
              />
              <div className="mt-4">
                <Button size="sm" variant="outline" onClick={() => setSelectedMeetingId(null)}>Close</Button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      
    </AppLayout>
  );
}

export default function AlertsPage() {
  return (
    <ActionsProvider>
      <SelectionProvider>
        <AlertsInner />
      </SelectionProvider>
    </ActionsProvider>
  );
}
