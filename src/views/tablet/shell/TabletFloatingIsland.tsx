import { Bell, Search, Command } from "lucide-react";
import { TouchTarget } from "../primitives/TouchTarget";

/**
 * Tablet variant of the Floating Action Island.
 * Persistent, no hover-only affordances. Touch-sized targets.
 */
export function TabletFloatingIsland() {
  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 rounded-full border border-primary/60 bg-card px-2 py-1 shadow-sm"
      role="toolbar"
      aria-label="Quick actions"
    >
      <TouchTarget aria-label="Search" className="rounded-full">
        <Search className="h-5 w-5" />
      </TouchTarget>
      <TouchTarget aria-label="Command palette" className="rounded-full">
        <Command className="h-5 w-5" />
      </TouchTarget>
      <TouchTarget aria-label="Alerts" className="rounded-full">
        <Bell className="h-5 w-5" />
      </TouchTarget>
    </div>
  );
}
