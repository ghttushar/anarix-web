import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ChipProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "success" | "warning" | "destructive";
  size?: "sm" | "md";
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantClasses = {
  default: "bg-muted text-muted-foreground hover:bg-muted/80",
  primary: "bg-primary/10 text-primary hover:bg-primary/20",
  success: "bg-success/10 text-success hover:bg-success/20",
  warning: "bg-warning/10 text-warning hover:bg-warning/20",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
};

export function Chip({
  children,
  variant = "default",
  size = "sm",
  removable = false,
  onRemove,
  className,
}: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium transition-colors",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 rounded-full p-0.5 hover:bg-foreground/10 transition-colors"
        >
          <X className={cn(size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
        </button>
      )}
    </span>
  );
}

interface ChipGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ChipGroup({ children, className }: ChipGroupProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {children}
    </div>
  );
}
