import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  return (
    <nav className={cn("flex items-center gap-0.5 text-xs", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <div key={index} className="flex items-center gap-0.5">
            {index > 0 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            )}
            {item.href && !isLast ? (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                isLast ? "font-medium text-foreground" : "text-muted-foreground"
              )}>
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
