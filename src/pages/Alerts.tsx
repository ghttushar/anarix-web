import { useMemo, useState, useEffect } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AanMascot } from "@/components/aan/AanMascot";
import { ActionsProvider, useActionsStore } from "@/state/actionsStore";
import { SelectionProvider, useSelection } from "@/state/selectionStore";
import { DecisionRow } from "@/components/actions/DecisionRow";
import { DigestRow } from "@/components/actions/DigestRow";
import { EmptyState } from "@/components/actions/EmptyState";
import { SortMenu, type SortKey } from "@/components/actions/SortMenu";
import { FilterSheet, EMPTY_FILTER, countActiveFilters, type FilterState } from "@/components/actions/FilterSheet";
import { MeetingBundleRow } from "@/components/actions/MeetingBundleRow";
import { MeetingWorkspace } from "@/components/actions/MeetingWorkspace";
import { QuestionRow } from "@/components/actions/QuestionRow";
import { BulkActionBar } from "@/components/actions/BulkActionBar";
import { KeyboardHelpOverlay } from "@/components/actions/KeyboardHelpOverlay";
import { useDecideKeyboard } from "@/components/actions/useDecideKeyboard";
import { OverloadBanner } from "@/components/actions/OverloadBanner";
import { HandledFilters, type HandledResolution } from "@/components/actions/HandledFilters";
import { UndoToast } from "@/components/actions/UndoToast";
import { ViewModeToggle, type ViewMode } from "@/components/actions/ViewModeToggle";
import { DecisionCard } from "@/components/actions/DecisionCard";
import { MeetingBundleCard } from "@/components/actions/MeetingBundleCard";
import { QuestionCard } from "@/components/actions/QuestionCard";
import { valueMagnitude, formatValue } from "@/lib/decisions/valueFormat";
import { Button } from "@/components/ui/button";
import type { Decision } from "@/data/mockDecisions";

function useViewMode(): [ViewMode, (m: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "stack";
    return (sessionStorage.getItem("action-items:view-mode") as ViewMode) || "stack";
  });
  const persist = (m: ViewMode) => {
    setMode(m);
    sessionStorage.setItem("action-items:view-mode", m);
  };
  return [mode, persist];
}

type TabKey = "decide" | "meetings" | "questions" | "in_flight" | "handled";

const TAB_LABELS: Record<TabKey, string> = {
  decide: "Decide",
  meetings: "From meetings",
  questions: "Questions",
  in_flight: "In flight",
  handled: "Handled",
};

const DECIDE_CAP = 25;

const severityRank: Record<Decision["severity"], number> = { critical: 0, opportunity: 1, fyi: 2 };
const sourceRank: Record<Decision["source"], number> = { meeting: 0, email: 1, slack: 2, teams: 3, anarix: 4, aan: 5 };

function inWindow(ts: number, win: FilterState["window"]): boolean {
  if (win === "any") return true;
  const now = new Date();
  const d = new Date(ts);
  if (win === "today") return d.toDateString() === now.toDateString();
  if (win === "yesterday") {
    const y = new Date(now); y.setDate(now.getDate() - 1);
    return d.toDateString() === y.toDateString();
  }
  if (win === "week") return Date.now() - ts < 7 * 24 * 3600 * 1000;
  return true;
}

function bucketLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return "Earlier";
}

interface GroupedDecision {
  primary: Decision;
  duplicates: Decision[];
}
function groupDuplicates(items: Decision[]): GroupedDecision[] {
  const seen = new Map<string, GroupedDecision>();
  const out: GroupedDecision[] = [];
  for (const d of items) {
    if (!d.dupeKey) {
      out.push({ primary: d, duplicates: [] });
      continue;
    }
    const existing = seen.get(d.dupeKey);
    if (!existing) {
      const g: GroupedDecision = { primary: d, duplicates: [] };
      seen.set(d.dupeKey, g);
      out.push(g);
    } else {
      const cur = valueMagnitude(existing.primary.valueKind, existing.primary.valueCents);
      const inc = valueMagnitude(d.valueKind, d.valueCents);
      if (inc > cur) {
        existing.duplicates.push(existing.primary);
        existing.primary = d;
      } else {
        existing.duplicates.push(d);
      }
    }
  }
  return out;
}

/** Sort persistence per tab via sessionStorage. */
function useSortForTab(tab: TabKey): [SortKey, (k: SortKey) => void] {
  const [sort, setSort] = useState<SortKey>(() => {
    if (typeof window === "undefined") return "value";
    return (sessionStorage.getItem(`ai:sort:${tab}`) as SortKey) || "value";
  });
  useEffect(() => {
    const v = sessionStorage.getItem(`ai:sort:${tab}`) as SortKey | null;
    setSort(v ?? "value");
  }, [tab]);
  const persist = (k: SortKey) => {
    setSort(k);
    sessionStorage.setItem(`ai:sort:${tab}`, k);
  };
  return [sort, persist];
}

function AlertsInner() {
  const { decisions, aboveThreshold, belowThreshold, digestItems, meetings, openQuestionsCount } = useActionsStore();
  const { registerOrder, clear } = useSelection();
  const [tab, setTab] = useState<TabKey>("decide");
  const [sort, setSort] = useSortForTab(tab);
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [openBundleId, setOpenBundleId] = useState<string | null>(null);
  const [handledRes, setHandledRes] = useState<HandledResolution>("all");
  const [showAllOverflow, setShowAllOverflow] = useState(false);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [viewMode, setViewMode] = useViewMode();

  useDecideKeyboard(tab === "decide");
  useEffect(() => { if (tab !== "decide") clear(); }, [tab, clear]);

  const pool: Decision[] = useMemo(() => {
    if (tab === "decide")
      return aboveThreshold.filter((d) => d.status === "open" || d.status === "snoozed");
    if (tab === "in_flight")
      return decisions.filter((d) => d.status === "in_flight" || d.status === "with_aan");
    if (tab === "handled") {
      const base = decisions.filter((d) => ["completed", "rejected", "expired"].includes(d.status));
      return handledRes === "all" ? base : base.filter((d) => d.status === handledRes);
    }
    return [];
  }, [tab, decisions, aboveThreshold, handledRes]);

  const filtered = useMemo(() => pool.filter((d) => {
    if (filter.sources.size && !filter.sources.has(d.source)) return false;
    if (filter.domains.size && !filter.domains.has(d.domain)) return false;
    if (!inWindow(d.createdAt, filter.window)) return false;
    return true;
  }), [pool, filter]);

  const sorted = useMemo(() => {
    const s = [...filtered];
    s.sort((a, b) => {
      if (sort === "value") return valueMagnitude(b.valueKind, b.valueCents) - valueMagnitude(a.valueKind, a.valueCents);
      if (sort === "critical") {
        const r = severityRank[a.severity] - severityRank[b.severity];
        if (r !== 0) return r;
        return b.updatedAt - a.updatedAt;
      }
      if (sort === "source") return sourceRank[a.source] - sourceRank[b.source];
      return b.updatedAt - a.updatedAt;
    });
    return s;
  }, [filtered, sort]);

  const grouped: GroupedDecision[] = useMemo(
    () => (tab === "decide" ? groupDuplicates(sorted) : sorted.map((d) => ({ primary: d, duplicates: [] }))),
    [sorted, tab],
  );

  const visibleGroups = useMemo(
    () => (tab === "decide" && !showAllOverflow ? grouped.slice(0, DECIDE_CAP) : grouped),
    [grouped, tab, showAllOverflow],
  );
  const hiddenGroups = tab === "decide" && !showAllOverflow ? grouped.slice(DECIDE_CAP) : [];
  const hiddenValueCents = hiddenGroups.reduce((s, g) => s + valueMagnitude(g.primary.valueKind, g.primary.valueCents), 0);

  const bucketed = useMemo(() => {
    const m = new Map<string, GroupedDecision[]>();
    for (const g of visibleGroups) {
      const b = bucketLabel(g.primary.createdAt);
      if (!m.has(b)) m.set(b, []);
      m.get(b)!.push(g);
    }
    return Array.from(m.entries());
  }, [visibleGroups]);

  useEffect(() => {
    if (tab !== "decide") return;
    registerOrder(visibleGroups.map((g) => g.primary.id));
  }, [tab, visibleGroups, registerOrder]);

  const counts = useMemo(() => ({
    decide: aboveThreshold.filter((d) => d.status === "open").length,
    meetings: meetings.length,
    questions: openQuestionsCount,
    in_flight: decisions.filter((d) => d.status === "in_flight" || d.status === "with_aan").length,
    handled: decisions.filter((d) => ["completed", "rejected", "expired"].includes(d.status)).length,
  }), [aboveThreshold, decisions, meetings.length, openQuestionsCount]);

  const handledCounts = useMemo(() => {
    const base = decisions.filter((d) => ["completed", "rejected", "expired"].includes(d.status));
    return {
      all: base.length,
      completed: base.filter((d) => d.status === "completed").length,
      rejected: base.filter((d) => d.status === "rejected").length,
      expired: base.filter((d) => d.status === "expired").length,
    };
  }, [decisions]);

  const openTotalCents = aboveThreshold
    .filter((d) => d.status === "open")
    .reduce((sum, d) => sum + valueMagnitude(d.valueKind, d.valueCents), 0);
  const openCount = aboveThreshold.filter((d) => d.status === "open").length;
  const openTotalFmt = formatValue({ cents: openTotalCents, kind: "gain" }).text.replace("+ ", "");
  const criticalCount = aboveThreshold.filter((d) => d.status === "open" && d.severity === "critical").length;

  const digestTotal = digestItems.reduce((s, i) => s + valueMagnitude(i.valueKind, i.valueCents), 0);

  // Meetings navigation
  const bundleIndex = openBundleId ? meetings.findIndex((m) => m.id === openBundleId) : -1;
  const prevBundle = bundleIndex > 0 ? meetings[bundleIndex - 1].id : null;
  const nextBundle = bundleIndex >= 0 && bundleIndex < meetings.length - 1 ? meetings[bundleIndex + 1].id : null;

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Action Items" }]} />
      <div className="px-6 py-6 max-w-[1360px] mx-auto w-full">

        {/* Greeting */}
        <header className="mb-6 flex items-start gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
            <AanMascot size={30} state="idle" interactive={false} />
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">Action Items</div>
            <h1 className="font-heading text-2xl font-semibold text-foreground leading-tight">
              Hi Tushar — I have {openCount} decision{openCount === 1 ? "" : "s"} for you today worth <span className="text-primary">{openTotalFmt}</span>
              {criticalCount > 0 && <span className="text-muted-foreground text-base font-normal">, {criticalCount} critical</span>}
              .
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
              I'm watching your marketplaces, meetings, and inboxes in the background. These are the calls I need from you.
            </p>
          </div>
        </header>

        {/* Tabs + controls */}
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <nav className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {(Object.keys(TAB_LABELS) as TabKey[]).map((k) => {
              const active = tab === k;
              const c = counts[k];
              return (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={cn(
                    "text-[13px] px-3.5 py-1.5 rounded-md transition-colors flex items-center gap-1.5",
                    active
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {TAB_LABELS[k]}
                  {c > 0 && (
                    <span className={cn(
                      "text-[10.5px] font-semibold px-1.5 rounded-full leading-4",
                      active ? "bg-primary-foreground/20" : "bg-muted-foreground/15"
                    )}>
                      {c}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <ViewModeToggle value={viewMode} onChange={setViewMode} />
            {(tab === "decide" || tab === "handled" || tab === "in_flight") && (
              <>
                <FilterSheet
                  value={filter}
                  onChange={setFilter}
                  activeCount={countActiveFilters(filter)}
                  externalOpen={filterSheetOpen}
                  onExternalOpenChange={setFilterSheetOpen}
                />
                <SortMenu value={sort} onChange={setSort} />
              </>
            )}
          </div>
        </div>

        {tab === "handled" && counts.handled > 0 && (
          <div className="mb-3">
            <HandledFilters value={handledRes} onChange={setHandledRes} counts={handledCounts} />
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-280px)] pr-3">
          {tab === "decide" && (
            <DecideBody
              bucketed={bucketed}
              hiddenCount={hiddenGroups.length}
              hiddenValueCents={hiddenValueCents}
              onShowAll={() => setShowAllOverflow(true)}
              onSortByValue={() => setSort("value")}
              onOpenFilter={() => setFilterSheetOpen(true)}
              digestItems={digestItems}
              digestTotal={digestTotal}
              viewMode={viewMode}
            />
          )}

          {tab === "in_flight" && (
            bucketed.length === 0 ? (
              <EmptyState
                headline="Nothing running right now."
                body="When you approve or hand me something, it shows up here with live progress."
              />
            ) : <FlatList bucketed={bucketed} viewMode={viewMode} />
          )}

          {tab === "handled" && (
            bucketed.length === 0 ? (
              <EmptyState headline="Your handled ledger is empty." body="Everything you close in the last 14 days lives here." />
            ) : <FlatList bucketed={bucketed} viewMode={viewMode} />
          )}

          {tab === "meetings" && (
            <MeetingsBody onOpen={setOpenBundleId} viewMode={viewMode} />
          )}

          {tab === "questions" && (
            <QuestionsBody viewMode={viewMode} />
          )}
        </ScrollArea>
      </div>

      {/* Meeting workspace sheet */}
      <MeetingWorkspace
        bundleId={openBundleId}
        onClose={() => setOpenBundleId(null)}
        onPrev={() => prevBundle && setOpenBundleId(prevBundle)}
        onNext={() => nextBundle && setOpenBundleId(nextBundle)}
        hasPrev={!!prevBundle}
        hasNext={!!nextBundle}
      />

      <BulkActionBar />
      <KeyboardHelpOverlay />
      <UndoToast />
    </AppLayout>
  );
}

function DecisionList({ list, interactive, viewMode }: { list: GroupedDecision[]; interactive?: boolean; viewMode: ViewMode }) {
  if (viewMode === "card") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {list.map((g) => (
          <DecisionCard key={g.primary.id} decision={g.primary} duplicates={g.duplicates} interactive={interactive} />
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {list.map((g) => (
        <DecisionRow key={g.primary.id} decision={g.primary} duplicates={g.duplicates} interactive={interactive} />
      ))}
    </div>
  );
}

function DecideBody({
  bucketed, hiddenCount, hiddenValueCents,
  onShowAll, onSortByValue, onOpenFilter,
  digestItems, digestTotal, viewMode,
}: {
  bucketed: [string, GroupedDecision[]][];
  hiddenCount: number;
  hiddenValueCents: number;
  onShowAll: () => void;
  onSortByValue: () => void;
  onOpenFilter: () => void;
  digestItems: ReturnType<typeof useActionsStore>["digestItems"];
  digestTotal: number;
  viewMode: ViewMode;
}) {
  if (bucketed.length === 0 && digestItems.length === 0) {
    return <EmptyState headline="You're clear." body="I'll surface something the moment it matters." />;
  }
  return (
    <div className="space-y-6">
      {bucketed.map(([bucket, list]) => (
        <section key={bucket}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{bucket}</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
          <DecisionList list={list} interactive viewMode={viewMode} />
        </section>
      ))}

      {hiddenCount > 0 && (
        <div className="space-y-1.5">
          <OverloadBanner
            hiddenCount={hiddenCount}
            hiddenValueCents={hiddenValueCents}
            onSortByValue={onSortByValue}
            onOpenFilter={onOpenFilter}
          />
          <div className="text-center">
            <Button variant="ghost" size="sm" onClick={onShowAll} className="text-[11.5px] text-muted-foreground">
              Show all {hiddenCount} anyway
            </Button>
          </div>
        </div>
      )}

      {digestItems.length > 0 && (
        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Handled by me</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
          <DigestRow items={digestItems} totalCents={digestTotal} />
        </section>
      )}
    </div>
  );
}

function FlatList({ bucketed, viewMode }: { bucketed: [string, GroupedDecision[]][]; viewMode: ViewMode }) {
  return (
    <div className="space-y-8">
      {bucketed.map(([bucket, list]) => (
        <section key={bucket}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{bucket}</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
          <DecisionList list={list} viewMode={viewMode} />
        </section>
      ))}
    </div>
  );
}

function MeetingsBody({ onOpen, viewMode }: { onOpen: (id: string) => void; viewMode: ViewMode }) {
  const { meetings } = useActionsStore();
  if (meetings.length === 0) {
    return <EmptyState headline="No meeting bundles yet." body="When a meeting wraps, I bundle its action items and drop them here." />;
  }
  if (viewMode === "card") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {meetings.map((m) => (
          <MeetingBundleCard key={m.id} bundleId={m.id} onOpen={onOpen} />
        ))}
      </div>
    );
  }
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {meetings.map((m) => (
        <MeetingBundleRow key={m.id} bundleId={m.id} onOpen={onOpen} />
      ))}
    </div>
  );
}

function QuestionsBody({ viewMode }: { viewMode: ViewMode }) {
  const { questions } = useActionsStore();
  const open = questions.filter((q) => q.status === "open");
  const closed = questions.filter((q) => q.status !== "open");

  if (questions.length === 0) {
    return <EmptyState headline="No open questions." body="When I hit something I'd rather ask than guess, it lands here." />;
  }
  const renderList = (items: typeof questions) =>
    viewMode === "card" ? (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {items.map((q) => <QuestionCard key={q.id} question={q} />)}
      </div>
    ) : (
      <div className="space-y-2.5">
        {items.map((q) => <QuestionRow key={q.id} question={q} />)}
      </div>
    );

  return (
    <div className="space-y-6">
      <section>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Waiting on you</span>
          <span className="h-px flex-1 bg-border/60" />
        </div>
        {open.length === 0 ? (
          <div className="text-[12px] text-muted-foreground italic py-4 text-center">You're caught up. I'll only ask when it matters.</div>
        ) : (
          renderList(open)
        )}
      </section>

      {closed.length > 0 && (
        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Recently answered</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
          {renderList(closed)}
        </section>
      )}
    </div>
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
