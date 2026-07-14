import { cn } from "@/lib/utils";

/**
 * Monochrome Aan mark — small diamond silhouette that echoes the AanMascot
 * brand shape. Renders in currentColor so it inherits row text color.
 */
export function AanMark({ className, size = 14 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* Diamond body */}
      <path d="M12 2.5L21.5 12L12 21.5L2.5 12L12 2.5Z" opacity="0.9" />
      {/* Inner highlight to hint the mascot's inner shape */}
      <path d="M12 7L16.5 12L12 17L7.5 12L12 7Z" fill="hsl(var(--background))" opacity="0.55" />
    </svg>
  );
}
