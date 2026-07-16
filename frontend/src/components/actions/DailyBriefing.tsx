// Daily briefing card — shown on the default landing (nothing selected).
// Copy adapts to time of day and derives numbers from the decision corpus.
import { Sun, Sunset, Moon, Sunrise, Sparkles, type LucideIcon } from "lucide-react";
import { useActionsStore } from "@/state/actionsStore";
import { briefingFor, type BriefingSlot } from "@/lib/decisions/briefing";

const ICON: Record<BriefingSlot, LucideIcon> = {
  morning: Sunrise,
  afternoon: Sun,
  evening: Sunset,
  end_of_day: Moon,
};

export function DailyBriefing() {
  const { decisions } = useActionsStore();
  const b = briefingFor(decisions);
  const Icon = ICON[b.slot];

  return (
    <div className="relative h-full flex flex-col justify-center overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-card via-card to-primary/[0.04]">
      {/* Ambient soft glow */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/[0.09] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-emerald-400/[0.07] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 [background-image:radial-gradient(hsl(var(--foreground)/0.05)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />

      <div className="relative px-8 py-8 max-w-[560px]">
        <div className="inline-flex items-center gap-2 h-6 px-2 rounded-full bg-primary/8 border border-primary/20 text-[11px] text-primary">
          <Icon size={12} /> Daily briefing
        </div>
        <h2 className="mt-4 font-heading text-[30px] leading-[1.1] font-semibold text-foreground tracking-tight">
          {b.greeting}
        </h2>
        <p className="mt-1 text-[14px] text-muted-foreground">{b.dateline}</p>

        <ul className="mt-5 space-y-2.5">
          {b.bullets.map((line, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[13.5px] text-foreground/90 leading-relaxed">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary/60" />
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {b.actionText && (
          <p className="mt-6 inline-flex items-center gap-1.5 text-[12.5px] text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            {b.actionText}
          </p>
        )}
      </div>
    </div>
  );
}
