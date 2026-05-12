import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("w-full px-6 py-20 md:py-28", className)}>
      <div className="mx-auto w-full max-w-7xl">{children}</div>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

export function H1({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h1
      className={cn(
        "font-[Satoshi] text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl",
        className
      )}
    >
      {children}
    </h1>
  );
}

export function H2({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={cn(
        "font-[Satoshi] text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function Lead({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("max-w-2xl text-lg leading-relaxed text-muted-foreground", className)}>
      {children}
    </p>
  );
}

export function FeatureCard({
  icon,
  title,
  body,
}: {
  icon?: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/40">
      {icon && (
        <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      )}
      <h3 className="font-[Satoshi] text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}

/** Stylized mock-up of an Anarix screen — uses real tokens & fonts. */
export function MockScreen({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_-40px_hsl(var(--primary)/0.35)]",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border bg-background/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs font-medium text-foreground">{title}</span>
          {subtitle && <span className="text-[10px] text-muted-foreground">{subtitle}</span>}
        </div>
        <div className="w-10" />
      </div>
      <div className="bg-background">{children}</div>
    </div>
  );
}
