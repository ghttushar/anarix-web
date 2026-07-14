// Standing panel — a single quiet verdict + operational counts.
// Sits directly under the Ambient Strip. Replaces the "empty canvas" feel.
// Money-first, per the PDF: dollars protected / at risk lead the counts.

import { useMemo } from "react";
import { useActionsStore } from "@/livingos/state/actionsStore";
import { valueMagnitude } from "@/livingos/lib/decisions/valueFormat";
import { filterByTab } from "@/livingos/actions/tabs";

function formatDollars(cents: number): string {
  const d = Math.round(cents / 100);
  if (d < 1000) return `$${d}`;
  if (d < 100_000) return `$${(d / 1000).toFixed(1)}k`;
  if (d < 1_000_000) return `$${Math.round(d / 1000)}k`;
  return `$${(d / 1_000_000).toFixed(1)}M`;
}

export function StandingPanel() {
  const { decisions, meetings, openQuestionsCount } = useActionsStore();

  const stats = useMemo(() => {
    const judgment = filterByTab(decisions, "judgment").length;
    const aiAtWork = filterByTab(decisions, "ai_at_work").length;
    const settledToday = filterByTab(decisions, "settled").length;

    let atRisk = 0;
    let protectedC = 0;
    for (const d of decisions) {
      if (d.status !== "open") continue;
      const mag = valueMagnitude(d.valueKind, d.valueCents);
      if (d.valueKind === "at_risk" || d.valueKind === "cost") atRisk += mag;
      else if (d.valueKind === "gain") protectedC += mag;
    }
    return { judgment, aiAtWork, settledToday, atRisk, protectedC };
  }, [decisions]);

  const verdict = useMemo(() => {
    if (stats.judgment === 0 && stats.aiAtWork === 0) {
      return "You're standing well. Nothing wants your judgment right now.";
    }
    if (stats.judgment === 0) {
      return `You're clear. I'm running ${stats.aiAtWork} thing${stats.aiAtWork === 1 ? "" : "s"} on your behalf.`;
    }
    if (stats.judgment <= 2) {
      return `Quiet morning. ${stats.judgment} decision${stats.judgment === 1 ? "" : "s"} want${stats.judgment === 1 ? "s" : ""} your judgment.`;
    }
    return `${stats.judgment} decisions want your judgment. The rest of the shop is holding.`;
  }, [stats]);

  return (
    <section className="mb-10 pt-8">
      <p className="los-authored text-[26px] leading-[1.3] text-[hsl(var(--los-ink))] max-w-[68ch]">
        {verdict}
      </p>
      <dl className="mt-5 flex flex-wrap items-baseline gap-x-8 gap-y-2 los-mono text-[11.5px] uppercase tracking-[0.14em] text-[hsl(var(--los-muted))]">
        <StatItem label="Need judgment" value={String(stats.judgment)} />
        <StatItem label="Aan is running" value={String(stats.aiAtWork)} />
        <StatItem label="Settled 24h" value={String(stats.settledToday)} />
        <StatItem label="At risk" value={formatDollars(stats.atRisk)} tone={stats.atRisk > 0 ? "loss" : undefined} />
        <StatItem label="Protecting" value={formatDollars(stats.protectedC)} tone={stats.protectedC > 0 ? "gain" : undefined} />
        <StatItem label="Meetings watched" value={String(meetings.length)} />
        {openQuestionsCount > 0 && (
          <StatItem label="Aan asks" value={String(openQuestionsCount)} />
        )}
      </dl>
    </section>
  );
}

function StatItem({ label, value, tone }: { label: string; value: string; tone?: "loss" | "gain" }) {
  const color =
    tone === "loss" ? "text-[hsl(var(--los-loss))]" :
    tone === "gain" ? "text-[hsl(var(--los-gain))]" :
    "text-[hsl(var(--los-ink))]";
  return (
    <div className="flex items-baseline gap-2">
      <dt>{label}</dt>
      <dd className={`text-[15px] tracking-normal normal-case ${color}`}>{value}</dd>
    </div>
  );
}
