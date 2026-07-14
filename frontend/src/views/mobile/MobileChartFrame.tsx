import { ReactNode } from "react";

/**
 * Mobile chart frame — forces fit-to-width and a consistent aspect ratio,
 * neutralizes any inner min-widths and right-padding overflow.
 *
 * Use around recharts / any chart wrapper inside mobile-only branches:
 * <MobileChartFrame><ResponsiveContainer>…</ResponsiveContainer></MobileChartFrame>
 */
export function MobileChartFrame({
  children,
  aspect = "16 / 10",
  className,
}: {
  children: ReactNode;
  aspect?: string;
  className?: string;
}) {
  return (
    <div
      className={"w-full min-w-0 overflow-hidden " + (className ?? "")}
      style={{ aspectRatio: aspect }}
    >
      <div className="w-full h-full min-w-0">{children}</div>
    </div>
  );
}
