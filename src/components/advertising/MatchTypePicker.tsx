import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/contexts/CurrencyContext";

type MatchType = "broad" | "exact" | "phrase";

export interface MatchTypeState {
  selected: boolean;
  bid: number;
}

export interface MatchTypesValue {
  broad: MatchTypeState;
  exact: MatchTypeState;
  phrase: MatchTypeState;
}

interface MatchTypePickerProps {
  value: MatchTypesValue;
  onChange?: (next: MatchTypesValue) => void;
}

const ORDER: MatchType[] = ["broad", "exact", "phrase"];

export function MatchTypePicker({ value, onChange }: MatchTypePickerProps) {
  const { currencyConfig } = useCurrency();
  const symbol = currencyConfig.symbol;

  const toggle = (mt: MatchType) => {
    if (!onChange) return;
    onChange({ ...value, [mt]: { ...value[mt], selected: !value[mt].selected } });
  };

  const setBid = (mt: MatchType, bid: number) => {
    if (!onChange) return;
    onChange({ ...value, [mt]: { ...value[mt], bid } });
  };

  const anySelected = ORDER.some((mt) => value[mt].selected);

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {ORDER.map((mt) => {
        const state = value[mt];
        return (
          <div key={mt} className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => toggle(mt)}
              className={cn(
                "h-6 px-2 rounded-md border text-[10px] uppercase tracking-wide font-medium transition-colors",
                state.selected
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30"
              )}
            >
              {mt}
            </button>
            {state.selected && (
              <div className="flex items-center gap-0.5">
                {symbol && <span className="text-[10px] text-muted-foreground">{symbol}</span>}
                <Input
                  type="number"
                  value={state.bid}
                  step={0.01}
                  onChange={(e) => setBid(mt, parseFloat(e.target.value) || 0)}
                  onClick={(e) => e.stopPropagation()}
                  className="h-6 w-14 text-center text-xs px-1 shadow-none"
                />
              </div>
            )}
          </div>
        );
      })}
      {!anySelected && (
        <span className="text-[11px] text-muted-foreground italic">Select match type</span>
      )}
    </div>
  );
}
