import { ArrowDownAZ, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatValue } from "@/livingos/lib/decisions/valueFormat";

interface Props {
  hiddenCount: number;
  hiddenValueCents: number;
  onSortByValue: () => void;
  onOpenFilter: () => void;
}

export function OverloadBanner({ hiddenCount, hiddenValueCents, onSortByValue, onOpenFilter }: Props) {
  if (hiddenCount <= 0) return null;
  const valueFmt = hiddenValueCents > 0 ? formatValue({ cents: hiddenValueCents, kind: "gain" }).text.replace("+ ", "") : null;
  return (
    <div className="rounded-lg border border-border bg-muted/30 px-3 py-2.5 flex items-center gap-3">
      <span className="text-[12.5px] text-muted-foreground flex-1">
        I'm holding <span className="font-semibold text-foreground">{hiddenCount} more small item{hiddenCount === 1 ? "" : "s"}</span>
        {valueFmt && <> worth <span className="font-mono text-foreground">{valueFmt}</span> combined</>}
        {" · "}sort or filter to promote what matters most.
      </span>
      <Button size="sm" variant="outline" className="h-7 text-[11.5px] gap-1" onClick={onSortByValue}>
        <ArrowDownAZ className="h-3 w-3" /> Sort by $
      </Button>
      <Button size="sm" variant="outline" className="h-7 text-[11.5px] gap-1" onClick={onOpenFilter}>
        <Filter className="h-3 w-3" /> Filter
      </Button>
    </div>
  );
}
