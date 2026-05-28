import { ReactNode } from "react";
import { Columns3, Filter, Download, SlidersHorizontal } from "lucide-react";
import { TouchTarget } from "../primitives/TouchTarget";
import { LongPressTooltip } from "../primitives/LongPressTooltip";

interface TabletTableToolbarProps {
  title?: string;
  selectedCount?: number;
  onColumnsClick?: () => void;
  onFilterClick?: () => void;
  onDensityClick?: () => void;
  onExportClick?: () => void;
  chips?: ReactNode;
}

export function TabletTableToolbar({
  title,
  selectedCount = 0,
  onColumnsClick,
  onFilterClick,
  onDensityClick,
  onExportClick,
  chips,
}: TabletTableToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-card min-h-14">
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {title && <h2 className="text-sm font-medium truncate">{title}</h2>}
        {selectedCount > 0 && (
          <span className="text-xs rounded-full bg-primary/10 text-primary px-2 py-0.5">
            {selectedCount} selected
          </span>
        )}
        <div className="flex items-center gap-1 flex-wrap min-w-0">{chips}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <LongPressTooltip label="Columns">
          <TouchTarget aria-label="Columns" onClick={onColumnsClick} className="rounded-md">
            <Columns3 className="h-5 w-5" />
          </TouchTarget>
        </LongPressTooltip>
        <LongPressTooltip label="Filter">
          <TouchTarget aria-label="Filter" onClick={onFilterClick} className="rounded-md">
            <Filter className="h-5 w-5" />
          </TouchTarget>
        </LongPressTooltip>
        <LongPressTooltip label="Density">
          <TouchTarget aria-label="Density" onClick={onDensityClick} className="rounded-md">
            <SlidersHorizontal className="h-5 w-5" />
          </TouchTarget>
        </LongPressTooltip>
        <LongPressTooltip label="Export">
          <TouchTarget aria-label="Export" onClick={onExportClick} className="rounded-md">
            <Download className="h-5 w-5" />
          </TouchTarget>
        </LongPressTooltip>
      </div>
    </div>
  );
}
