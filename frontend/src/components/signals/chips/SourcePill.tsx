import { cn } from "@/lib/utils";
import type { Decision } from "@/types/signals";
import { sourcePillFor, PILL_TONE_CLASS } from "@/lib/decisions/sourcePill";

interface Props {
  decision: Decision;
  size?: "sm" | "md";
  className?: string;
}

export function SourcePill({ decision, size = "sm", className }: Props) {
  const p = sourcePillFor(decision);
  const Icon = p.Icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        PILL_TONE_CLASS[p.tone],
        size === "sm" ? "h-6 px-2 text-[11.5px]" : "h-7 px-2.5 text-[12.5px]",
        className,
      )}
      title={decision.sourceRef.label}
    >
      <Icon size={size === "sm" ? 12 : 13} className="opacity-90" />
      {p.label}
    </span>
  );
}
