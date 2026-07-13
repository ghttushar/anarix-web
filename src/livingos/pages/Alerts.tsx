// Living OS — Alerts as the supervisory surface.
// Same functionality as /alerts, re-authored: paper aesthetic, registers instead
// of tabs, no Anarix chrome. Wrapped by LivingOSShell.

import { useMemo, useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActionsProvider, useActionsStore } from "@/livingos/state/actionsStore";
import { SelectionProvider } from "@/state/selectionStore";
import { EmptyState } from "@/livingos/actions/EmptyState";
import { EMPTY_FILTER, type FilterState } from "@/livingos/actions/FilterSheet";
import { type SortKey } from "@/livingos/actions/SortMenu";
import { KeyboardHelpOverlay } from "@/livingos/actions/KeyboardHelpOverlay";
import { UndoToast } from "@/livingos/actions/UndoToast";
import { AlertsToolbar } from "@/livingos/actions/AlertsToolbar";
import { BulkBar } from "@/livingos/actions/BulkBar";
import { StackRow } from "@/livingos/actions/StackRow";
import { GridCard } from "@/livingos/actions/GridCard";
import { AlertDetailPanel, CLOSED_PANEL, type PanelState, type PanelMode } from "@/livingos/actions/AlertDetailPanel";
import type { ViewMode } from "@/livingos/actions/ViewSwitcher";
import { filterByTab, computeTabCounts, type AlertTabKey } from "@/livingos/actions/tabs";
import { valueMagnitude } from "@/livingos/lib/decisions/valueFormat";
import type { Decision } from "@/livingos/data/mockDecisions";

function useTab(): [AlertTabKey, (t: AlertTabKey) => void] {
  const [tab, setTab] = useState<AlertTabKey>(() => {
    if (typeof window === "undefined") return "all";
    return (sessionStorage.getItem("livingos:alerts:tab") as AlertTabKey) || "all";
  });
  return [tab, (t) => { setTab(t); sessionStorage.setItem("livingos:alerts:tab", t); }];
}

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

function AlertsInner() {
  const { decisions } = useActionsStore();
  const params = useParams<{ viewMode?: string }>();
  const navigate = useNavigate();
  const viewMode: ViewMode = params.viewMode === "grid" ? "grid" : "stack";
  const setViewMode = useCallback((m: ViewMode) => navigate(`/livingos/${m}`), [navigate]);

  const [tab, setTab] = useTab();
  const [sort, setSort] = useState<SortKey>("value");
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const [panel, setPanel] = useState<PanelState>(CLOSED_PANEL);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const openDetail = useCallback((id: string, mode: PanelMode = "custom") => {
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

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && panel.decisionId) closePanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panel.decisionId, closePanel]);

  return (
    <>
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
      />

      <BulkBar />

      <ScrollArea className="min-h-[60vh]">
        {sorted.length === 0 ? (
          <EmptyState
            headline={tab === "all" ? "You're clear." : "Nothing in this register."}
            body={tab === "all"
              ? "Aan will surface something the moment it matters."
              : "Try another register — Aan is still watching."}
          />
        ) : viewMode === "stack" ? (
          <StackBody bucketed={bucketed} onOpenDetail={openDetail} />
        ) : (
          <GridBody
            bucketed={bucketed}
            expandedIds={expandedIds}
            onToggleExpand={toggleExpand}
            onOpenDetail={openDetail}
          />
        )}
      </ScrollArea>

      <AlertDetailPanel
        state={panel}
        onOpenChange={(o) => { if (!o) closePanel(); }}
      />

      <KeyboardHelpOverlay />
      <UndoToast />
    </>
  );
}

function BucketHeader({ label }: { label: string }) {
  return (
    <div className="mb-3 mt-2 flex items-baseline gap-3">
      <span className="los-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--los-muted))]">
        {label}
      </span>
      <span className="h-px flex-1 bg-[hsl(var(--los-hairline))]" />
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
    <div className="space-y-8">
      {bucketed.map(([bucket, list]) => (
        <section key={bucket}>
          <BucketHeader label={bucket} />
          <div className="overflow-hidden rounded-sm border border-[hsl(var(--los-hairline))] bg-[hsl(var(--los-paper-raised))]">
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
  bucketed, expandedIds, onToggleExpand, onOpenDetail,
}: {
  bucketed: [string, Decision[]][];
  expandedIds: Set<string>;
  onToggleExpand: (id: string) => void;
  onOpenDetail: (id: string, mode?: PanelMode) => void;
}) {
  return (
    <div className="space-y-8">
      {bucketed.map(([bucket, list]) => {
        const left = list.filter((_, i) => i % 2 === 0);
        const right = list.filter((_, i) => i % 2 === 1);
        const renderCol = (col: Decision[]) => (
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {col.map((d) => (
              <GridCard
                key={d.id}
                decision={d}
                expanded={expandedIds.has(d.id)}
                onToggleExpand={() => onToggleExpand(d.id)}
                onOpenDetail={onOpenDetail}
              />
            ))}
          </div>
        );
        return (
          <section key={bucket}>
            <BucketHeader label={bucket} />
            <div className="flex items-start gap-3">
              {renderCol(left)}
              {renderCol(right)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default function LivingOSAlerts() {
  return <AlertsInner />;
}
