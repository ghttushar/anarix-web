import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Clock, ChevronDown } from "lucide-react";
import type { SnoozeChoice } from "@/livingos/state/actionsStore";

interface Props {
  onSelect: (c: SnoozeChoice) => void;
  compact?: boolean;
}

const OPTS: { key: SnoozeChoice; label: string; hint: string }[] = [
  { key: "1h", label: "1 hour", hint: "back on your list at the top of the next hour" },
  { key: "tomorrow", label: "Tomorrow", hint: "back on your list at 8 AM tomorrow" },
  { key: "next_week", label: "Next week", hint: "back on your list Monday 8 AM" },
];

export function SnoozeMenu({ onSelect, compact = false }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <Button variant="ghost" size="icon" className="h-7 w-7" title="Snooze">
            <Clock className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-[11.5px]">
            <Clock className="h-3 w-3" /> Snooze <ChevronDown className="h-3 w-3 opacity-60" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {OPTS.map((o) => (
          <DropdownMenuItem key={o.key} onSelect={() => onSelect(o.key)} className="flex-col items-start gap-0">
            <span className="text-[12px] font-medium">{o.label}</span>
            <span className="text-[10.5px] text-muted-foreground">{o.hint}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
