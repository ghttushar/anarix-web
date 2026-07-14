import { attendeeInitials, attendeeColor } from "@/livingos/lib/decisions/attendeeColor";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Props {
  name: string;
  role?: string;
  size?: number;
  className?: string;
}

export function AttendeePill({ name, role, size = 22, className }: Props) {
  const c = attendeeColor(name);
  const label = role ? `${name} — ${role}` : name;
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            className={cn(
              "inline-flex items-center justify-center rounded-full border border-card font-semibold shrink-0",
              className
            )}
            style={{
              width: size,
              height: size,
              background: c.bg,
              color: c.fg,
              fontSize: Math.round(size * 0.42),
              lineHeight: 1,
            }}
          >
            {attendeeInitials(name)}
          </span>
        </TooltipTrigger>
        <TooltipContent side="top" className="text-[11px]">{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
