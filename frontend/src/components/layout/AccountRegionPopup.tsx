import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { AccountGroup, AccountRegion, AMAZON_REGIONS } from "@/contexts/AccountContext";

interface AccountRegionPopupProps {
  group: AccountGroup;
  regions: AccountRegion[];
  isVisible: boolean;
  triggerRect: DOMRect | null;
  currentRegionId?: string;
  onSelectRegion: (regionId: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

function StatusDot({ status }: { status: AccountRegion["status"] }) {
  const colors = { connected: "bg-emerald-500", syncing: "bg-amber-500", error: "bg-red-500" };
  return <div className={cn("h-2 w-2 rounded-full shrink-0", colors[status])} />;
}

function getRegionLabel(regionCode: string): string {
  const found = AMAZON_REGIONS.find((r) => r.value === regionCode);
  return found ? `${found.label} (${regionCode})` : regionCode;
}

export function AccountRegionPopup({
  group,
  regions,
  isVisible,
  triggerRect,
  currentRegionId,
  onSelectRegion,
  onMouseEnter,
  onMouseLeave,
}: AccountRegionPopupProps) {
  if (!isVisible || !triggerRect) return null;

  return createPortal(
    <div
      data-region-popup
      className={cn(
        "fixed z-[9999]",
        "min-w-[200px] rounded-lg border border-border bg-popover shadow-xl",
        "animate-in fade-in-0 slide-in-from-left-2 duration-150"
      )}
      style={{
        left: `${triggerRect.right + 8}px`,
        top: `${triggerRect.top - 4}px`,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="absolute -left-3 top-0 h-full w-3" onMouseEnter={onMouseEnter} />

      <div className="px-3 py-2.5 border-b border-border">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group.name}
        </span>
        <p className="text-[11px] text-muted-foreground mt-0.5 capitalize">{group.accountType} account</p>
      </div>

      <div className="p-1.5 max-h-[60vh] overflow-auto">
        {regions.length > 0 ? (
          regions.map((r) => (
            <button
              key={r.id}
              onClick={() => onSelectRegion(r.id)}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2.5 min-h-11 text-sm w-full text-left transition-colors",
                currentRegionId === r.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-popover-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <StatusDot status={r.status} />
              <span className="truncate">{getRegionLabel(r.region)}</span>
            </button>
          ))
        ) : (
          <div className="px-3 py-3 text-xs text-muted-foreground text-center">
            No regions configured
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
