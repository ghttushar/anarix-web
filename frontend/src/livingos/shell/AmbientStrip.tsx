import { useMemo } from "react";
import { useActionsStore } from "@/livingos/state/actionsStore";
import { Search } from "lucide-react";

/**
 * Ambient Strip — Standing sentence + Aan presence + running-agent pulses.
 * No logo, no date picker, no account chrome.
 */
export function AmbientStrip({ onOpenCommand }: { onOpenCommand?: () => void }) {
  const { decisions, meetings } = useActionsStore();

  const { openCount, runningAgents } = useMemo(() => {
    const open = decisions.filter((d) => d.status === "open");
    const running = decisions.filter((d) => d.status === "with_aan" || d.status === "in_flight");

    // Build up to 6 running agent labels from live work + meetings being watched.
    const agents: { key: string; label: string }[] = [];
    for (const d of running.slice(0, 4)) {
      const short =
        d.domain === "campaign" ? "Watching campaigns" :
        d.domain === "inventory" ? "Watching inventory" :
        d.domain === "profitability" ? "Guarding margin" :
        d.domain === "retail" ? "Watching Buy Box" :
        d.domain === "cs" ? "Reading customer" :
        "Working";
      agents.push({ key: `d-${d.id}`, label: `${short} · ${d.insight.slice(0, 42)}${d.insight.length > 42 ? "…" : ""}` });
    }
    for (const m of meetings.slice(0, 2)) {
      agents.push({ key: `m-${m.id}`, label: `Reading ${m.title}` });
    }
    if (agents.length === 0) agents.push({ key: "idle", label: "Listening" });
    return { openCount: open.length, runningAgents: agents.slice(0, 6) };
  }, [decisions, meetings]);

  const now = new Date();
  const day = now.toLocaleDateString([], { weekday: "long" });
  const timeOfDay =
    now.getHours() < 5 ? "Late" :
    now.getHours() < 12 ? "This morning" :
    now.getHours() < 17 ? "This afternoon" :
    "This evening";

  const standing =
    openCount === 0
      ? "You're standing well. Nothing needs you."
      : openCount <= 2
      ? `${openCount === 1 ? "One item" : `${openCount} items`} for you. Everything else is holding.`
      : `${openCount} items for you. The rest is running.`;

  return (
    <header className="relative z-10 border-b border-[hsl(var(--los-hairline))]/70 px-8 py-4">
      <div className="mx-auto flex max-w-[1180px] items-center gap-5">
        <span className="los-mono shrink-0 text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--los-muted))]">
          {day} · {timeOfDay}
        </span>

        <p className="los-authored min-w-0 flex-1 truncate text-[15px] leading-tight text-[hsl(var(--los-ink))]">
          {standing}
        </p>

        {/* Running-agent pulse cluster */}
        <div className="hidden items-center gap-2 md:flex" aria-label="Aan is currently working on">
          {runningAgents.map((a) => (
            <span
              key={a.key}
              title={a.label}
              className="los-dot"
              aria-label={a.label}
            />
          ))}
          <span className="los-mono ml-1 text-[10.5px] tracking-[0.1em] text-[hsl(var(--los-muted))]">
            {runningAgents.length === 1 && runningAgents[0].key === "idle"
              ? "Aan is listening"
              : `Aan · ${runningAgents.length} active`}
          </span>
        </div>

        <button
          onClick={onOpenCommand}
          className="los-breathe flex items-center gap-2 rounded-sm border border-[hsl(var(--los-hairline))] px-2.5 py-1 text-[hsl(var(--los-muted))] hover:text-[hsl(var(--los-ink))] hover:border-[hsl(var(--los-line))]"
          title="Open command bar"
        >
          <Search className="h-3 w-3" />
          <span className="los-mono text-[10.5px] uppercase tracking-[0.14em]">⌘K</span>
        </button>
      </div>
    </header>
  );
}
