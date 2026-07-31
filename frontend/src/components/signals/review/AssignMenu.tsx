// Assign menu — Aan or a workspace member. Simple popover.
import { useState } from "react";
import { UserPlus, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MEMBERS = [
  { key: "aan", label: "Aan", role: "AI", icon: Bot },
  { key: "mike", label: "Mike", role: "Ops", icon: UserPlus },
  { key: "sarah", label: "Sarah", role: "Marketing", icon: UserPlus },
  { key: "dorothy", label: "Dorothy", role: "Buyer", icon: UserPlus },
  { key: "design", label: "Design", role: "Team", icon: UserPlus },
  { key: "me", label: "Myself", role: "You", icon: UserPlus },
];

interface Props {
  onAssign: (memberKey: string, memberLabel: string) => void;
  buttonSize?: "sm" | "default";
}

export function AssignMenu({ onAssign, buttonSize = "sm" }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size={buttonSize} variant="outline" className="h-8 text-[12.5px] gap-1.5">
          <UserPlus className="h-3.5 w-3.5" /> Assign
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-64 p-2">
        <div className="text-[10.5px] uppercase tracking-wider font-semibold text-muted-foreground mb-1 px-2">
          Assign to
        </div>
        <ul className="space-y-0.5">
          {MEMBERS.map((m) => (
            <li key={m.key}>
              <button
                onClick={() => { onAssign(m.key, m.label); setOpen(false); }}
                className="w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-muted/60 transition-colors"
              >
                <span className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center",
                  m.key === "aan" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                )}>
                  <m.icon className="h-3 w-3" />
                </span>
                <span className="flex-1 text-[13px] text-foreground">{m.label}</span>
                <span className="text-[10.5px] text-muted-foreground">{m.role}</span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
