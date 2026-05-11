import { cn } from "@/lib/utils";
import { AanGlyph } from "./AanGlyph";

interface AanLogoProps {
  className?: string;
  showByAnarix?: boolean;
}

export function AanLogo({ className, showByAnarix = true }: AanLogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <AanGlyph className="h-5 w-5 aan-gradient-text" staticEyes />
      <span className="font-aan text-aan aan-gradient-text font-bold">Aan</span>
      {showByAnarix && (
        <span className="text-sm text-muted-foreground">by Anarix</span>
      )}
    </div>
  );
}
