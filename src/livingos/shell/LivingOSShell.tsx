import { useEffect, useState, type ReactNode } from "react";
import "@/livingos/tokens.css";
import { AmbientStrip } from "./AmbientStrip";
import { ContextDock } from "./ContextDock";
import { CommandPalette } from "./CommandPalette";
import type { AlertTabKey } from "@/livingos/actions/tabs";

/**
 * Living OS shell.
 * Three regions only: Ambient Strip, Workspace, Context Dock.
 * ⌘K opens the universal command bar. No sidebar, no taskbar, no breadcrumbs.
 */
export function LivingOSShell({ children }: { children: ReactNode }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute("data-livingos-active", "true");
    return () => document.body.removeAttribute("data-livingos-active");
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  const setRegister = (k: AlertTabKey) => {
    sessionStorage.setItem("livingos:alerts:tab", k);
    window.dispatchEvent(new CustomEvent("livingos:register:set", { detail: k }));
  };

  return (
    <div
      data-livingos
      className="los-grain fixed inset-0 z-[100] overflow-y-auto bg-[hsl(var(--los-paper))]"
    >
      <div className="relative z-[1]">
        <AmbientStrip onOpenCommand={() => setCmdOpen(true)} />
        <main className="mx-auto max-w-[1180px] px-8 pb-32 pt-2">{children}</main>
      </div>
      <ContextDock />
      <CommandPalette
        open={cmdOpen}
        onOpenChange={setCmdOpen}
        onSetRegister={setRegister}
      />
    </div>
  );
}
