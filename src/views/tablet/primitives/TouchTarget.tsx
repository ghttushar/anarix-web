import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface TouchTargetProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary actions enforce 48x48, default 44x44 (WCAG). */
  priority?: "default" | "primary";
  asChild?: never;
}

/**
 * TouchTarget — wrapper that guarantees a tablet-friendly tap area.
 * Visuals are inherited from children/className; this only enforces hit-size.
 */
export const TouchTarget = forwardRef<HTMLButtonElement, TouchTargetProps>(
  ({ priority = "default", className, type = "button", children, ...rest }, ref) => {
    const sizeClass = priority === "primary" ? "min-h-12 min-w-12" : "min-h-11 min-w-11";
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex items-center justify-center select-none",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          sizeClass,
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
TouchTarget.displayName = "TouchTarget";
