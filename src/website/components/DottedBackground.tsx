export function DottedBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 opacity-[0.55] dark:opacity-[0.35]"
      style={{
        backgroundImage:
          "radial-gradient(hsl(var(--border)) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        maskImage:
          "radial-gradient(ellipse 90% 70% at 50% 30%, black 50%, transparent 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse 90% 70% at 50% 30%, black 50%, transparent 100%)",
      }}
    />
  );
}
