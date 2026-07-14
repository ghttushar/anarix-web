// Context Dock — bottom-fixed dock of recent + running work.
// PDF: "Recently inhabited Domains · Running Agents · Bookmarks. Hover magnifies."
// Notifications become state changes here, not toasts.

import { useEffect, useMemo, useState } from "react";
import { useActionsStore } from "@/livingos/state/actionsStore";
import { cn } from "@/lib/utils";

const RECENT_KEY = "livingos:dock:recent";
const PIN_KEY = "livingos:dock:pinned";

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(sessionStorage.getItem(key) || "[]"); } catch { return []; }
}

export function pushRecent(id: string) {
  if (typeof window === "undefined") return;
  const list = readIds(RECENT_KEY).filter((x) => x !== id);
  list.unshift(id);
  sessionStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, 8)));
  window.dispatchEvent(new CustomEvent("livingos:dock:update"));
}

export function togglePin(id: string) {
  if (typeof window === "undefined") return;
  const list = readIds(PIN_KEY);
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  localStorage.setItem(PIN_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("livingos:dock:update"));
}

function useDockIds() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const h = () => setTick((t) => t + 1);
    window.addEventListener("livingos:dock:update", h);
    return () => window.removeEventListener("livingos:dock:update", h);
  }, []);
  return useMemo(() => ({
    recent: readIds(RECENT_KEY),
    pinned: (typeof window !== "undefined" ? JSON.parse(localStorage.getItem(PIN_KEY) || "[]") : []) as string[],
    _tick: tick,
  }), [tick]);
}

export function ContextDock() {
  const { decisions, meetings } = useActionsStore();
  const { recent, pinned } = useDockIds();

  const running = useMemo(
    () => decisions.filter((d) => d.status === "in_flight" || d.status === "with_aan").slice(0, 3),
    [decisions],
  );

  const recentDecisions = useMemo(
    () => recent
      .map((id) => decisions.find((d) => d.id === id))
      .filter((d): d is NonNullable<typeof d> => !!d)
      .slice(0, 5),
    [recent, decisions],
  );

  const pinnedDecisions = useMemo(
    () => pinned
      .map((id) => decisions.find((d) => d.id === id))
      .filter((d): d is NonNullable<typeof d> => !!d),
    [pinned, decisions],
  );

  if (recentDecisions.length === 0 && pinnedDecisions.length === 0 && running.length === 0 && meetings.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4">
      <div className="pointer-events-auto flex max-w-[1120px] items-center gap-5 rounded-sm border border-[hsl(var(--los-hairline))] bg-[hsl(var(--los-paper-raised))] px-4 py-2 shadow-[0_1px_0_hsl(var(--los-ink)/0.04)]">
        {pinnedDecisions.length > 0 && (
          <DockSection label="Pinned">
            {pinnedDecisions.map((d) => (
              <DockChip key={d.id} label={d.insight} onClick={() => scrollToRow(d.id)} />
            ))}
          </DockSection>
        )}
        {running.length > 0 && (
          <DockSection label="Running">
            {running.map((d) => (
              <DockChip
                key={d.id}
                label={d.insight}
                onClick={() => scrollToRow(d.id)}
                dot
              />
            ))}
          </DockSection>
        )}
        {recentDecisions.length > 0 && (
          <DockSection label="Recent">
            {recentDecisions.map((d) => (
              <DockChip key={d.id} label={d.insight} onClick={() => scrollToRow(d.id)} />
            ))}
          </DockSection>
        )}
      </div>
    </div>
  );
}

function DockSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="los-mono text-[9.5px] uppercase tracking-[0.16em] text-[hsl(var(--los-muted))]">
        {label}
      </span>
      <div className="flex items-center gap-1.5">{children}</div>
    </div>
  );
}

function DockChip({ label, onClick, dot }: { label: string; onClick: () => void; dot?: boolean }) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={cn(
        "los-breathe group flex max-w-[180px] items-center gap-1.5 rounded-sm border border-transparent px-2 py-1 text-[12px] text-[hsl(var(--los-muted))]",
        "hover:border-[hsl(var(--los-hairline))] hover:text-[hsl(var(--los-ink))] hover:scale-[1.02]",
      )}
    >
      {dot && <span className="los-dot h-1.5 w-1.5" aria-hidden />}
      <span className="truncate">{label}</span>
    </button>
  );
}

export function scrollToRow(id: string) {
  const el = document.querySelector(`[data-decision-id="${id}"]`);
  if (el) {
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.classList.add("los-flash");
    setTimeout(() => el.classList.remove("los-flash"), 1400);
  }
}
