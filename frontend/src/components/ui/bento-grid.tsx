import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4",
        "md:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: 1 | 2 | 3;
  rowSpan?: 1 | 2;
}

const colSpanClasses = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-2 lg:col-span-3",
};

const rowSpanClasses = {
  1: "",
  2: "row-span-2",
};

export function BentoCard({
  children,
  className,
  colSpan = 1,
  rowSpan = 1,
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card p-6",
        "transition-all duration-300 hover:shadow-lg hover:border-primary/30",
        colSpanClasses[colSpan],
        rowSpanClasses[rowSpan],
        className
      )}
    >
      {children}
    </div>
  );
}

interface BentoCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoCardHeader({ children, className }: BentoCardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface BentoCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoCardTitle({ children, className }: BentoCardTitleProps) {
  return (
    <h3 className={cn("text-lg font-heading font-semibold text-foreground", className)}>
      {children}
    </h3>
  );
}

interface BentoCardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoCardDescription({ children, className }: BentoCardDescriptionProps) {
  return (
    <p className={cn("text-sm text-muted-foreground mt-1", className)}>
      {children}
    </p>
  );
}

interface BentoCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function BentoCardContent({ children, className }: BentoCardContentProps) {
  return (
    <div className={cn("flex-1", className)}>
      {children}
    </div>
  );
}
