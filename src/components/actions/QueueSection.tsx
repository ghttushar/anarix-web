import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LIFECYCLE_LABEL, type Lifecycle } from "@/lib/decisions/lifecycle";

interface Props {
  lifecycle: Lifecycle;
  count: number;
  defaultOpen: boolean;
  children: React.ReactNode;
  actionsHint?: string;
}

const MAX_VISIBLE: Record<Lifecycle, number> = {
  needs_me: 999,
  needs_review: 999,
  watching: 5,
  aan_working: 5,
  completed_today: 5,
  history: 5,
};

export function QueueSection({ lifecycle, count, defaultOpen, children, actionsHint }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  if (count === 0) return null;
  return (
    <section className="mb-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-2 py-2 px-1 text-left transition-colors",
          "hover:text-foreground",
        )}
        aria-expanded={open}
      >
        {open ? <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" /> :
                <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
        <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
          {LIFECYCLE_LABEL[lifecycle]}
        </span>
        <span className="text-[11px] font-semibold text-foreground/70 tabular-nums">
          {count}
        </span>
        {actionsHint && (
          <span className="ml-2 text-[11.5px] text-muted-foreground truncate">{actionsHint}</span>
        )}
        <span className="ml-auto h-px flex-1 bg-border/60" />
      </button>
      {open && (
        <div className="mt-1 rounded-lg border border-border bg-card overflow-hidden animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </section>
  );
}

export { MAX_VISIBLE };
