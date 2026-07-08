// /alerts — final rebuild. Stack + Grid views share tabs, filters, sort,
// selection, bulk bar, and a single right-side detail panel.
//
// Store/data unchanged; multi-action options are synthesized per row.

import { useMemo, useState, useEffect, useCallback } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AanMascot } from "@/components/aan/AanMascot";
import { ActionsProvider, useActionsStore } from "@/state/actionsStore";
import { SelectionProvider } from "@/state/selectionStore";
import { EmptyState } from "@/components/actions/EmptyState";
import { EMPTY_FILTER, type FilterState } from "@/components/actions/FilterSheet";
import { type SortKey } from "@/components/actions/SortMenu";
import { KeyboardHelpOverlay } from "@/components/actions/KeyboardHelpOverlay";
import { UndoToast } from "@/components/actions/UndoToast";
import { AlertsToolbar } from "@/components/actions/AlertsToolbar";
import { BulkBar } from "@/components/actions/BulkBar";
import { StackRow } from "@/components/actions/StackRow";
import { GridCard } from "@/components/actions/GridCard";
import { AlertDetailPanel, CLOSED_PANEL, type PanelState, type PanelMode } from "@/components/actions/AlertDetailPanel";
import type { ViewMode } from "@/components/actions/ViewSwitcher";
import { filterByTab, computeTabCounts, type AlertTabKey } from "@/components/actions/tabs";
import { valueMagnitude, formatValue } from "@/lib/decisions/valueFormat";
import type { Decision } from "@/data/mockDecisions";

/* ---------- persistence hooks ---------- */

function useViewMode(): [ViewMode, (m: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "stack";
    return (sessionStorage.getItem("alerts:view-mode") as ViewMode) || "stack";
  });
  return [mode, (m) => { setMode(m); sessionStorage.setItem("alerts:view-mode", m); }];
}

function useTab(): [AlertTabKey, (t: AlertTabKey) => void] {
  const [tab, setTab] = useState<AlertTabKey>(() => {
    if (typeof window === "undefined") return "all";
    return (sessionStorage.getItem("alerts:tab") as AlertTabKey) || "all";
  });
  return [tab, (t) => { setTab(t); sessionStorage.setItem("alerts:tab", t); }];
}

/* ---------- date bucketing ---------- */

function bucketLabel(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return "Yesterday";
  return "Earlier";
}

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

/* ============================================================ */

function AlertsInner() {
  const { decisions } = useActionsStore();

  const [viewMode, setViewMode] = useViewMode();
  const [tab, setTab] = useTab();
  const [sort, setSort] = useState<SortKey>("value");
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [panel, setPanel] = useState<PanelState>(CLOSED_PANEL);

  // Grid state — expanded card ids + optional focused id
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [focusedId, setFocusedId] = useState<string | null>(null);

  const openDetail = useCallback((id: string, mode: PanelMode = "detail") => {
    setPanel({ decisionId: id, mode });
  }, []);

  const closePanel = useCallback(() => setPanel(CLOSED_PANEL), []);

  const counts = useMemo(() => computeTabCounts(decisions), [decisions]);

  const pool = useMemo(() => filterByTab(decisions, tab), [decisions, tab]);

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

  const bucketed = useMemo(() => {
    const m = new Map<string, Decision[]>();
    for (const d of sorted) {
      const b = bucketLabel(d.createdAt);
      if (!m.has(b)) m.set(b, []);
      m.get(b)!.push(d);
    }
    return Array.from(m.entries());
  }, [sorted]);

  // Hero summary counts
  const openCount = decisions.filter((d) => d.status === "open").length;
  const criticalCount = decisions.filter((d) => d.status === "open" && d.severity === "critical").length;
  const openValueCents = decisions
    .filter((d) => d.status === "open")
    .reduce((s, d) => s + valueMagnitude(d.valueKind, d.valueCents), 0);
  const totalValueFmt = openValueCents > 0
    ? formatValue({ cents: openValueCents, kind: "gain" }).text.replace("+ ", "")
    : null;

  const [helpOpen, setHelpOpen] = useState(false);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    if (focusedId && focusedId !== id) setFocusedId(null);
  }, [focusedId]);

  const toggleFocus = useCallback((id: string) => {
    setFocusedId((prev) => (prev === id ? null : id));
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  // ESC closes panel + focus
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (panel.decisionId) closePanel();
        else if (focusedId) setFocusedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel.decisionId, focusedId, closePanel]);

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Alerts" }]} />
      <div className="px-4 py-4 max-w-[1480px] mx-auto w-full">

        {/* Hero — compact, single line */}
        <header className="mb-4 flex items-center gap-3">
          <div className="h-9 w-9 rounded-md bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
            <AanMascot size={24} state="idle" interactive={false} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground">
              Anarix · Aan
            </div>
            <h1 className="font-heading text-[20px] font-semibold text-foreground leading-tight">
              Alerts
            </h1>
          </div>
          <div className="text-[12.5px] text-muted-foreground text-right leading-tight">
            <div>
              <span className="font-medium text-foreground tabular-nums">{openCount}</span> open
              {totalValueFmt && (
                <>
                  {" · "}
                  <span className="font-mono text-success tabular-nums">{totalValueFmt}</span> at stake
                </>
              )}
            </div>
            {criticalCount > 0 && (
              <div>
                <span className="font-medium text-destructive tabular-nums">{criticalCount}</span> critical
              </div>
            )}
          </div>
        </header>

        {/* Toolbar */}
        <AlertsToolbar
          tab={tab}
          onTabChange={setTab}
          counts={counts}
          viewMode={viewMode}
          onViewChange={setViewMode}
          filter={filter}
          onFilterChange={setFilter}
          sort={sort}
          onSortChange={setSort}
          filterSheetOpen={filterSheetOpen}
          onFilterSheetOpenChange={setFilterSheetOpen}
          onOpenShortcuts={() => setHelpOpen(true)}
          onClearCompleted={counts.done > 0 ? () => setTab("done") : undefined}
        />

        {/* Bulk bar */}
        <BulkBar />

        {/* Body */}
        <ScrollArea className="h-[calc(100vh-240px)] pr-2">
          {sorted.length === 0 ? (
            <EmptyState
              headline={tab === "all" ? "You're clear." : "Nothing in this view."}
              body={tab === "all"
                ? "Aan will surface something the moment it matters."
                : "Try a different tab — Aan is still watching."}
            />
          ) : viewMode === "stack" ? (
            <StackBody bucketed={bucketed} onOpenDetail={openDetail} />
          ) : (
            <GridBody
              bucketed={bucketed}
              expandedIds={expandedIds}
              focusedId={focusedId}
              onToggleExpand={toggleExpand}
              onToggleFocus={toggleFocus}
              onOpenDetail={openDetail}
            />
          )}
        </ScrollArea>
      </div>

      <AlertDetailPanel
        state={panel}
        onOpenChange={(o) => { if (!o) closePanel(); }}
        onModeChange={(m) => setPanel((p) => ({ ...p, mode: m }))}
      />

      <KeyboardHelpOverlay />
      <UndoToast />
    </AppLayout>
  );
}

/* ============================================================ */

function BucketHeader({ label }: { label: string }) {
  return (
    <div className="mb-2 mt-1 flex items-center gap-2">
      <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
        {label}
      </span>
      <span className="h-px flex-1 bg-border/60" />
    </div>
  );
}

function StackBody({
  bucketed, onOpenDetail,
}: {
  bucketed: [string, Decision[]][];
  onOpenDetail: (id: string, mode?: PanelMode) => void;
}) {
  return (
    <div className="space-y-5">
      {bucketed.map(([bucket, list]) => (
        <section key={bucket}>
          <BucketHeader label={bucket} />
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {list.map((d) => (
              <StackRow key={d.id} decision={d} onOpenDetail={onOpenDetail} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function GridBody({
  bucketed, expandedIds, focusedId, onToggleExpand, onToggleFocus, onOpenDetail,
}: {
  bucketed: [string, Decision[]][];
  expandedIds: Set<string>;
  focusedId: string | null;
  onToggleExpand: (id: string) => void;
  onToggleFocus: (id: string) => void;
  onOpenDetail: (id: string, mode?: PanelMode) => void;
}) {
  return (
    <div className="space-y-6">
      {bucketed.map(([bucket, list]) => {
        const focusedInBucket = focusedId && list.some((d) => d.id === focusedId);
        return (
          <section key={bucket}>
            <BucketHeader label={bucket} />
            <div
              className={
                focusedInBucket
                  ? "grid grid-cols-1 gap-3"
                  : "grid grid-cols-1 lg:grid-cols-2 gap-3"
              }
            >
              {list.map((d) => {
                const isFocused = focusedId === d.id;
                if (focusedInBucket && !isFocused) {
                  // Render dimmed compact placeholder for siblings when one is focused
                  return (
                    <div
                      key={d.id}
                      onClick={() => onToggleFocus(d.id)}
                      className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <GridCard
                        decision={d}
                        expanded={false}
                        focused={false}
                        onToggleExpand={() => onToggleExpand(d.id)}
                        onToggleFocus={() => onToggleFocus(d.id)}
                        onOpenDetail={onOpenDetail}
                      />
                    </div>
                  );
                }
                return (
                  <GridCard
                    key={d.id}
                    decision={d}
                    expanded={expandedIds.has(d.id) || isFocused}
                    focused={isFocused}
                    onToggleExpand={() => onToggleExpand(d.id)}
                    onToggleFocus={() => onToggleFocus(d.id)}
                    onOpenDetail={onOpenDetail}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ============================================================ */

export default function AlertsPage() {
  return (
    <ActionsProvider>
      <SelectionProvider>
        <AlertsInner />
      </SelectionProvider>
    </ActionsProvider>
  );
}
