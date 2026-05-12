export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </div>
  );
}
