import { ArrowDownAZ, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatValue } from "@/lib/decisions/valueFormat";

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
    <div className="rounded-md border border-amber-500/40 bg-amber-500/[0.05] px-3 py-2 flex items-center gap-3">
      <span className="text-[11.5px] text-amber-700 dark:text-amber-400 flex-1">
        <span className="font-semibold">{hiddenCount} more decision{hiddenCount === 1 ? "" : "s"}</span> below the fold
        {valueFmt && <> · <span className="font-mono">{valueFmt}</span> in total</>}
        {" · "}I capped this view at 25 to keep it scannable.
      </span>
      <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1" onClick={onSortByValue}>
        <ArrowDownAZ className="h-3 w-3" /> Sort by $
      </Button>
      <Button size="sm" variant="outline" className="h-7 text-[11px] gap-1" onClick={onOpenFilter}>
        <Filter className="h-3 w-3" /> Filter
      </Button>
    </div>
  );
}
