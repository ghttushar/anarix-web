import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export type SortKey = "value" | "latest" | "critical" | "source";

const LABELS: Record<SortKey, string> = {
  value: "Dollar impact",
  latest: "Most recent",
  critical: "Most critical",
  source: "By source",
};

interface Props {
  value: SortKey;
  onChange: (k: SortKey) => void;
}

export function SortMenu({ value, onChange }: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-[12px] gap-1.5">
          Sort: <span className="font-medium">{LABELS[value]}</span>
          <ChevronDown className="h-3 w-3 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-[10.5px] uppercase tracking-wider text-muted-foreground">Sort by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(LABELS) as SortKey[]).map((k) => (
          <DropdownMenuItem
            key={k}
            onSelect={() => onChange(k)}
            className={value === k ? "bg-primary/10 text-primary font-medium" : ""}
          >
            {LABELS[k]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
