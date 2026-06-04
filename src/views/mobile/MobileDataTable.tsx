import { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Mobile data table primitive.
 *
 * Renders a horizontally scrollable shell with sticky first column. Callers
 * pass a normal <table> (or composed cells) as children. The scroll is
 * contained inside this frame so the page itself never overflows.
 *
 * Rules:
 *  - First <th>/<td> in every row is auto-sticky-left via the `mdt` class hook.
 *  - Numeric cells should use `tabular-nums` + `min-w-[9ch]` (do it at the
 *    cell level — primitive doesn't reach inside your markup).
 *  - Row height 40px. Header sticky.
 */
export function MobileDataTable({
  children,
  className,
  maxHeight = "70vh",
}: {
  children: ReactNode;
  className?: string;
  maxHeight?: string;
}) {
  return (
    <div
      data-mobile-data-table
      className={cn(
        "rounded-lg border border-border bg-card overflow-auto overscroll-contain w-full min-w-0",
        className
      )}
      style={{ maxHeight, WebkitOverflowScrolling: "touch" }}
    >
      {children}
    </div>
  );
}
