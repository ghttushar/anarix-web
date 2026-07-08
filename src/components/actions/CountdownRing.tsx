import { cn } from "@/lib/utils";

interface Props {
  /** 0..1 remaining */
  pct: number;
  /** whole seconds remaining, shown in the centre */
  secs: number;
  size?: number;
  className?: string;
}

/**
 * Shared countdown ring used by the on-screen undo pill and the inline
 * confirmation strips on rows / cards / detail panel. Kept purely visual —
 * timing lives in the caller.
 */
export function CountdownRing({ pct, secs, size = 28, className }: Props) {
  const r = size / 2 - 2;
  const c = 2 * Math.PI * r;
  return (
    <div className={cn("relative shrink-0", className)} style={{ height: size, width: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="-rotate-90" style={{ height: size, width: size }}>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth="2" className="fill-none stroke-muted" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth="2"
          strokeDasharray={c}
          strokeDashoffset={(1 - Math.max(0, Math.min(1, pct))) * c}
          className="fill-none stroke-success transition-[stroke-dashoffset] duration-200"
          strokeLinecap="round"
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-mono font-semibold text-foreground tabular-nums"
        style={{ fontSize: Math.round(size * 0.36) }}
      >
        {secs}
      </span>
    </div>
  );
}
