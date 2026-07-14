import { Button } from "@/components/ui/button";
import { AanMark } from "@/components/branding/AanMark";
import { cn } from "@/lib/utils";

interface Props {
  onClick: () => void;
  variant?: "ghost" | "outline";
  label?: string;
  className?: string;
}

/** Restored "Ask Aan" affordance — opens the right-side panel in chat mode. */
export function AskAanButton({ onClick, variant = "ghost", label = "Ask Aan", className }: Props) {
  return (
    <Button
      size="sm"
      variant={variant}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={cn(
        "h-8 gap-1.5 text-[12.5px] text-primary hover:text-primary hover:bg-primary/10",
        className,
      )}
    >
      <AanMark size={13} className="text-primary" />
      {label}
    </Button>
  );
}
