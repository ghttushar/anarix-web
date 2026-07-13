import { useMemo } from "react";
import { useActionsStore } from "@/livingos/state/actionsStore";
import { formatValueShort } from "@/livingos/lib/decisions/valueFormat";

/**
 * Ambient Strip — carries the daily Standing sentence + Aan presence.
 * No logo, no account switcher, no date picker. Living OS has no chrome.
 */
export function AmbientStrip() {
  const { decisions } = useActionsStore();

  const { openCount, dollarsInPlay, aanCount } = useMemo(() => {
    const open = decisions.filter((d) => d.status === "pending");
    const dollars = open.reduce((sum, d) => {
      if (d.valueKind !== "dollar") return sum;
      return sum + Math.abs(d.valueCents ?? 0);
    }, 0);
    const aan = open.filter((d) => d.source === "aan").length;
    return {
      openCount: open.length,
      dollarsInPlay: dollars,
      aanCount: aan,
    };
  }, [decisions]);

  const now = new Date();
  const timeOfDay =
    now.getHours() < 5 ? "Late" :
    now.getHours() < 12 ? "This morning" :
    now.getHours() < 17 ? "This afternoon" :
    "This evening";

  return (
    <header className="relative z-10 border-b border-[hsl(var(--los-hairline))]/60 px-8 py-5">
      <div className="mx-auto flex max-w-[1180px] items-baseline gap-4">
        <span className="los-mono text-[10px] uppercase tracking-[0.18em] text-[hsl(var(--los-muted))]">
          Living OS
        </span>
        <span className="los-dot" aria-hidden />
        <p className="los-authored flex-1 text-[19px] leading-[1.35] text-[hsl(var(--los-ink))]">
          {timeOfDay}, {openCount} {openCount === 1 ? "item is" : "items are"} asking for judgment.{" "}
          <span className="text-[hsl(var(--los-muted))]">
            {formatValueShort("dollar", dollarsInPlay)} in play. Aan is watching {aanCount} of them.
          </span>
        </p>
        <span className="los-mono text-[11px] text-[hsl(var(--los-muted))]">
          {now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }).toLowerCase()}
        </span>
      </div>
    </header>
  );
}
