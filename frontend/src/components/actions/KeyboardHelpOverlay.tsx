import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Keyboard } from "lucide-react";

const GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: "Move",
    items: [
      ["j / ↓", "Move focus down"],
      ["k / ↑", "Move focus up"],
      ["Enter", "Expand focused decision"],
    ],
  },
  {
    title: "Act (on focused decision)",
    items: [
      ["a", "Approve — Aan starts in 30s"],
      ["d", "You take care of it — hand to Aan"],
      ["r", "Reject — Aan stands down 24h"],
      ["s", "Snooze until tomorrow"],
    ],
  },
  {
    title: "Select",
    items: [
      ["x", "Toggle selection"],
      ["Shift+x", "Select from anchor to focused row"],
      ["Esc", "Clear selection"],
    ],
  },
  {
    title: "Meta",
    items: [
      ["?", "Toggle this help"],
      ["Cmd/Ctrl+z", "Undo the last committed action (30s window)"],
    ],
  },
];

export function KeyboardHelpOverlay() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.key === "?") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[15px]">
            <Keyboard className="h-4 w-4 text-primary" />
            Keyboard shortcuts
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {GROUPS.map((g) => (
            <section key={g.title}>
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                {g.title}
              </div>
              <ul className="space-y-1.5">
                {g.items.map(([keys, desc]) => (
                  <li key={keys} className="flex items-baseline gap-2 text-[12px]">
                    <kbd className="shrink-0 min-w-[52px] rounded border border-border bg-muted/60 px-1.5 py-0.5 text-[10.5px] font-mono text-foreground/85 text-center">
                      {keys}
                    </kbd>
                    <span className="text-foreground/85">{desc}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground italic mt-1">
          Shortcuts work anywhere on the Decide surface. Typing in inputs is ignored.
        </p>
      </DialogContent>
    </Dialog>
  );
}
