import { useState } from "react";
import { ChevronDown, ChevronRight, Video, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const MEETING = {
  title: "Staples Review — 10:00 AM",
  when: "Ended 47m ago",
  items: [
    { owner: "Mike", due: "Fri", task: "Relist SKU X on Staples portal" },
    { owner: "You", due: "Today", task: "Approve Q4 pricing memo shared in thread" },
    { owner: "Aan", due: "Auto", task: "Prepare Prime Day draft (12 SKUs) for review", done: true },
    { owner: "Dorothy", due: "Mon", task: "Send updated forecast to Staples buyer" },
  ],
};

export function MeetingActionsCard({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border bg-background">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 px-3 py-2.5 text-left hover:bg-muted/30 rounded-lg"
      >
        <Video className="h-3.5 w-3.5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-foreground truncate">Action items from your last meeting</div>
          <div className="text-[11px] text-muted-foreground truncate">{MEETING.title} · {MEETING.when}</div>
        </div>
        <span className="text-[10px] rounded-full bg-muted px-1.5 py-0.5 text-muted-foreground shrink-0">
          {MEETING.items.length}
        </span>
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
      </button>
      {open && (
        <ul className="border-t border-border/60 px-3 py-2 space-y-1.5">
          {MEETING.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px]">
              <span className={cn("mt-1 h-3.5 w-3.5 rounded-full border shrink-0 flex items-center justify-center", item.done ? "bg-success/15 border-success" : "border-muted-foreground/40")}>
                {item.done && <Check className="h-2.5 w-2.5 text-success" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className={cn("leading-snug", item.done && "text-muted-foreground line-through")}>{item.task}</div>
                <div className="text-[10.5px] text-muted-foreground mt-0.5">{item.owner} · due {item.due}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
