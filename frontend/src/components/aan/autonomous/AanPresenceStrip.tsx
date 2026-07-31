import { AAN_PRESENCE_MESSAGES, useAanEvents } from "./AanEventsContext";
import { AanMascot } from "@/components/aan/AanMascot";
import { cn } from "@/lib/utils";

export function AanPresenceStrip() {
  const { presenceIndex, liveMode } = useAanEvents();
  const message = AAN_PRESENCE_MESSAGES[presenceIndex];
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-gradient-to-r from-primary/5 via-transparent to-transparent">
      <AanMascot size={18} state={liveMode ? "listening" : "idle"} interactive={false} />
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70">Aan</span>
      <span key={presenceIndex} className={cn("text-[11px] text-foreground/80 truncate transition-opacity duration-500", "animate-in fade-in")}>
        {message}
      </span>
      {liveMode && (
        <span className="ml-auto flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-primary">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
          </span>
          Live
        </span>
      )}
    </div>
  );
}
