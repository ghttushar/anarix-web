// Category section — always-expanded container. The category label lives in
// the left rail; showing it again here was redundant, so the header row is
// removed. Props kept for backward-compat with existing call sites.
import { forwardRef } from "react";

interface Props {
  label: string;
  count: number;
  defaultOpen?: boolean;
  open?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
  aggregate?: string;
}

export const CategorySection = forwardRef<HTMLElement, Props>(function CategorySection(
  { label, count, children },
  ref,
) {
  if (count === 0) return null;
  return (
    <section
      ref={ref}
      className="mb-4 rounded-lg border border-border/60 bg-card overflow-hidden"
      data-category-key={label}
    >
      {children}
    </section>
  );
});
