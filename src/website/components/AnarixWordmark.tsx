import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export function AnarixWordmark({ className }: { className?: string }) {
  return (
    <Link to="/website" className={cn("inline-flex items-baseline font-[Satoshi] text-xl font-bold tracking-tight text-foreground", className)}>
      Anarix<span className="text-primary">.ai</span>
    </Link>
  );
}
