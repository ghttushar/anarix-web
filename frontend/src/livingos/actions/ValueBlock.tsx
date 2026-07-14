import { cn } from "@/lib/utils";
import type { ValueKind, Cadence } from "@/livingos/lib/decisions/valueFormat";

interface Props {
  cents: number;
  kind: ValueKind;
  /** Kept for API compatibility, no longer rendered. */
  cadence?: Cadence;
  caption?: string;
  size?: "sm" | "md" | "lg";
  align?: "left" | "right";
  className?: string;
}

const KIND_COLOR: Record<ValueKind, string> = {
  gain: "text-success",
  cost: "text-foreground",
  at_risk: "text-destructive",
  info: "text-muted-foreground",
};

const SIZE: Record<NonNullable<Props["size"]>, { num: string; cap: string }> = {
  sm: { num: "text-[15px]", cap: "text-[11.5px]" },
  md: { num: "text-[18px]", cap: "text-[12px]" },
  lg: { num: "text-[22px]", cap: "text-[12.5px]" },
};

function formatMoney(absCents: number): string {
  const dollars = Math.round(absCents / 100);
  if (dollars < 1000) return `$${dollars.toLocaleString()}`;
  if (dollars < 100_000) {
    const k = dollars / 1000;
    return `$${k >= 10 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  if (dollars < 1_000_000) return `$${Math.round(dollars / 1000)}k`;
  const m = dollars / 1_000_000;
  return `$${m >= 10 ? m.toFixed(0) : m.toFixed(1)}M`;
}

/**
 * Canonical value renderer. Pure dollar amount only — no prefix, no cadence.
 * Color still driven by `kind`.
 */
export function ValueBlock({
  cents, kind, caption, size = "md", align = "left", className,
}: Props) {
  const text = kind === "info" ? "Info" : formatMoney(Math.abs(cents));
  const sz = SIZE[size];
  return (
    <div
      className={cn("flex flex-col leading-tight", align === "right" && "items-end text-right", className)}
      aria-label={caption ? `${text}, ${caption}` : text}
    >
      <span className={cn("font-mono font-semibold tabular-nums whitespace-nowrap", sz.num, KIND_COLOR[kind])}>
        {text}
      </span>
      {caption && (
        <span className={cn("mt-0.5 text-muted-foreground", sz.cap)}>
          {caption}
        </span>
      )}
    </div>
  );
}
