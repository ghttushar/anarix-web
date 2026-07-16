import { cn } from "@/lib/utils";

/**
 * Monochrome Anarix mark for use as a source glyph.
 * Forces the SVG to render in currentColor so it inherits row text color.
 */
export function AnarixMark({ className, size = 14 }: { className?: string; size?: string | number }) {
  return (
    <svg
      viewBox="0 0 693.98 427.16"
      width={size}
      height={size}
      className={cn("shrink-0", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="348.89,192.42 414.99,116.99 348.23,42.59 282.13,118.01" />
      <path d="M448.41,154.23l-99.08,113.05L249.16,155.64L48.54,384.57h155.4c27.16,0,53-11.71,70.9-32.14l74.71-85.25l77.23,86.07c17.88,19.93,43.39,31.31,70.16,31.31h158.14L448.41,154.23z" />
    </svg>
  );
}
