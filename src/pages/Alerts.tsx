import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AppTaskbar } from "@/components/layout/AppTaskbar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AanMascot } from "@/components/aan/AanMascot";
import { ActionsProvider, useActionsStore } from "@/state/actionsStore";
import { DecisionRow } from "@/components/actions/DecisionRow";
import { DigestRow } from "@/components/actions/DigestRow";
import { EmptyState } from "@/components/actions/EmptyState";
import { SortMenu, type SortKey } from "@/components/actions/SortMenu";
import { FilterSheet, EMPTY_FILTER, countActiveFilters, type FilterState } from "@/components/actions/FilterSheet";
import { MeetingBundleRow } from "@/components/actions/MeetingBundleRow";
import { MeetingWorkspace } from "@/components/actions/MeetingWorkspace";
import { QuestionRow } from "@/components/actions/QuestionRow";
import { valueMagnitude, formatValue } from "@/lib/decisions/valueFormat";
import type { Decision } from "@/data/mockDecisions";

type TabKey = "decide" | "meetings" | "questions" | "in_flight" | "handled" | "digest";

const TAB_LABELS: Record<TabKey, string> = {
  decide: "Decide",
  meetings: "From meetings",
  questions: "Questions",
  in_flight: "In flight",
  handled: "Handled",
  digest: "Digest",
};

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

function AlertsInner() {
  const { decisions, aboveThreshold, belowThreshold, digestItems, meetings, openQuestionsCount, questions } = useActionsStore();
  const [tab, setTab] = useState<TabKey>("decide");
  const [sort, setSort] = useState<SortKey>("value");
  const [filter, setFilter] = useState<FilterState>(EMPTY_FILTER);
  const [openBundleId, setOpenBundleId] = useState<string | null>(meetings[0]?.id ?? null);

  // ---- source pool per tab ----
  const pool: Decision[] = useMemo(() => {
    if (tab === "decide")
      return aboveThreshold.filter((d) => d.status === "open" || d.status === "snoozed");
    if (tab === "in_flight")
      return decisions.filter((d) => d.status === "in_flight" || d.status === "with_aan");
    if (tab === "handled")
      return decisions.filter((d) => ["completed", "rejected", "expired"].includes(d.status));
    return [];
  }, [tab, decisions, aboveThreshold]);

  // ---- filter ----
  const filtered = useMemo(() => pool.filter((d) => {
    if (filter.sources.size && !filter.sources.has(d.source)) return false;
    if (filter.domains.size && !filter.domains.has(d.domain)) return false;
    if (!inWindow(d.createdAt, filter.window)) return false;
    return true;
  }), [pool, filter]);

  // ---- sort ----
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

  // ---- group by day ----
  const grouped = useMemo(() => {
    const m = new Map<string, Decision[]>();
    for (const d of sorted) {
      const b = bucketLabel(d.createdAt);
      if (!m.has(b)) m.set(b, []);
      m.get(b)!.push(d);
    }
    return Array.from(m.entries());
  }, [sorted]);

  // ---- counts for tab badges ----
  const counts = useMemo(() => ({
    decide: aboveThreshold.filter((d) => d.status === "open").length,
    meetings: meetings.length,
    questions: openQuestionsCount,
    in_flight: decisions.filter((d) => d.status === "in_flight" || d.status === "with_aan").length,
    handled: decisions.filter((d) => ["completed", "rejected", "expired"].includes(d.status)).length,
    digest: digestItems.length + belowThreshold.length,
  }), [aboveThreshold, decisions, digestItems, belowThreshold, meetings.length, openQuestionsCount]);

  // ---- greeting numbers ----
  const openTotalCents = aboveThreshold
    .filter((d) => d.status === "open")
    .reduce((sum, d) => sum + valueMagnitude(d.valueKind, d.valueCents), 0);
  const openCount = aboveThreshold.filter((d) => d.status === "open").length;
  const openTotalFmt = formatValue({ cents: openTotalCents, kind: "gain" }).text.replace("+ ", "");

  const digestTotal = digestItems.reduce((s, i) => s + valueMagnitude(i.valueKind, i.valueCents), 0);

  return (
    <AppLayout>
      <AppTaskbar breadcrumbItems={[{ label: "Action Items" }]} />
      <div className="px-6 py-6 max-w-[1180px] mx-auto w-full">

        {/* Greeting */}
        <header className="mb-6 flex items-start gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary/15 to-accent/15 flex items-center justify-center shrink-0">
            <AanMascot size={30} state="idle" interactive={false} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-primary">Aan · Action Items</div>
            <h1 className="font-heading text-2xl font-semibold text-foreground leading-tight">
              Hi Tushar — {openCount} decision{openCount === 1 ? "" : "s"} today worth <span className="text-primary">{openTotalFmt}</span>.
            </h1>
            <p className="text-[13px] text-muted-foreground mt-1 max-w-2xl">
              I'm watching your marketplaces, meetings, and inboxes in the background. These need a call from you.
            </p>
          </div>
        </header>

        {/* Tabs + controls row */}
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
                    "text-[12px] px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5",
                    active
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {TAB_LABELS[k]}
                  {c > 0 && (
                    <span className={cn(
                      "text-[10px] font-semibold px-1.5 rounded-full leading-4",
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
            {(tab === "decide" || tab === "handled" || tab === "in_flight") && (
              <>
                <FilterSheet value={filter} onChange={setFilter} activeCount={countActiveFilters(filter)} />
                <SortMenu value={sort} onChange={setSort} />
              </>
            )}
          </div>
        </div>

        {/* Body */}
        <ScrollArea className="h-[calc(100vh-280px)] pr-3">
          {tab === "decide" && (
            <DecideBody grouped={grouped} digestItems={digestItems} digestTotal={digestTotal} />
          )}

          {tab === "in_flight" && (
            grouped.length === 0 ? (
              <EmptyState
                headline="Nothing running right now."
                body="When you approve or hand something to me, it shows up here with live progress."
              />
            ) : <FlatList grouped={grouped} />
          )}

          {tab === "handled" && (
            grouped.length === 0 ? (
              <EmptyState headline="Your handled ledger is empty." body="Everything you close in the last 14 days lives here." />
            ) : <FlatList grouped={grouped} />
          )}

          {tab === "digest" && (
            <div className="space-y-3">
              <DigestRow items={digestItems} totalCents={digestTotal} />
              {belowThreshold.length > 0 && (
                <div className="text-[11.5px] text-muted-foreground italic pt-2">
                  Below-threshold decisions ({belowThreshold.length}) also roll into this digest.
                </div>
              )}
            </div>
          )}

          {tab === "meetings" && (
            <MeetingsBody openBundleId={openBundleId} onOpen={setOpenBundleId} />
          )}

          {tab === "questions" && (
            <QuestionsBody />
          )}
        </ScrollArea>
      </div>
    </AppLayout>
  );
}

function DecideBody({
  grouped, digestItems, digestTotal,
}: {
  grouped: [string, Decision[]][];
  digestItems: ReturnType<typeof useActionsStore>["digestItems"];
  digestTotal: number;
}) {
  if (grouped.length === 0 && digestItems.length === 0) {
    return <EmptyState headline="You're clear." body="I'll surface something the moment it matters." />;
  }
  return (
    <div className="space-y-8">
      {grouped.map(([bucket, list]) => (
        <section key={bucket}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{bucket}</span>
            <span className="h-px flex-1 bg-border/60" />
            <span className="text-[10.5px] text-muted-foreground">{list.length} item{list.length === 1 ? "" : "s"}</span>
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {list.map((d) => <DecisionRow key={d.id} decision={d} />)}
          </div>
        </section>
      ))}

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

function FlatList({ grouped }: { grouped: [string, Decision[]][] }) {
  return (
    <div className="space-y-8">
      {grouped.map(([bucket, list]) => (
        <section key={bucket}>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">{bucket}</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            {list.map((d) => <DecisionRow key={d.id} decision={d} />)}
          </div>
        </section>
      ))}
    </div>
  );
}

function MeetingsBody({ openBundleId, onOpen }: { openBundleId: string | null; onOpen: (id: string) => void }) {
  const { meetings } = useActionsStore();
  if (meetings.length === 0) {
    return <EmptyState headline="No meeting bundles yet." body="When a meeting wraps, I'll bundle its action items and drop them here." />;
  }
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {meetings.map((m) => (
          <MeetingBundleRow
            key={m.id}
            bundleId={m.id}
            expanded={openBundleId === m.id}
            onOpen={(id) => onOpen(openBundleId === id ? "" : id)}
          />
        ))}
      </div>
      {openBundleId && <MeetingWorkspace bundleId={openBundleId} />}
    </div>
  );
}

function QuestionsBody() {
  const { questions } = useActionsStore();
  const open = questions.filter((q) => q.status === "open");
  const closed = questions.filter((q) => q.status !== "open");

  if (questions.length === 0) {
    return <EmptyState headline="No open questions." body="When I hit something I'd rather ask than guess, it lands here." />;
  }
  return (
    <div className="space-y-6">
      <section>
        <div className="mb-2 flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Waiting on you</span>
          <span className="h-px flex-1 bg-border/60" />
          <span className="text-[10.5px] text-muted-foreground">{open.length} open</span>
        </div>
        {open.length === 0 ? (
          <div className="text-[12px] text-muted-foreground italic py-4 text-center">You're caught up. I'll only ask when it matters.</div>
        ) : (
          <div className="space-y-2.5">
            {open.map((q) => <QuestionRow key={q.id} question={q} />)}
          </div>
        )}
      </section>

      {closed.length > 0 && (
        <section>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Recently answered</span>
            <span className="h-px flex-1 bg-border/60" />
          </div>
          <div className="space-y-2.5">
            {closed.map((q) => <QuestionRow key={q.id} question={q} />)}
          </div>
        </section>
      )}
    </div>
  );
}

export default function AlertsPage() {
  return (
    <ActionsProvider>
      <AlertsInner />
    </ActionsProvider>
  );
}
