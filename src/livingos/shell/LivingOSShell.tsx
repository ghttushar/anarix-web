import { useEffect, type ReactNode } from "react";
import "@/livingos/tokens.css";
import { AmbientStrip } from "./AmbientStrip";

/**
 * Living OS shell. No sidebar, no taskbar, no breadcrumbs.
 * Three regions only: Ambient Strip, Workspace, (Context Dock — reserved).
 * Applies data-livingos so scoped tokens.css takes over.
 */
export function LivingOSShell({ children }: { children: ReactNode }) {
  // Hide any bleed-through app chrome that might still mount above us.
  useEffect(() => {
    document.body.setAttribute("data-livingos-active", "true");
    return () => document.body.removeAttribute("data-livingos-active");
  }, []);

  return (
    <div
      data-livingos
      className="los-grain fixed inset-0 z-[100] overflow-y-auto bg-[hsl(var(--los-paper))]"
    >
      <div className="relative z-[1]">
        <AmbientStrip />
        <main className="mx-auto max-w-[1180px] px-8 pb-24 pt-8">{children}</main>
      </div>
    </div>
  );
}
