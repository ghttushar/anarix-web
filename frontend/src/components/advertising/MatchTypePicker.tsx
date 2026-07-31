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

  return (
    <div className="flex flex-col gap-1">
      {ORDER.map((mt) => {
        const state = value[mt];
        const disabled = !state.selected;
        return (
          <div key={mt} className="grid grid-cols-[72px_1fr] items-center gap-2">
            <button
              type="button"
              onClick={() => toggle(mt)}
              className={cn(
                "h-7 w-full rounded-md border text-[10px] uppercase tracking-wide font-semibold transition-colors cursor-pointer",
                state.selected
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:text-foreground hover:border-foreground/30"
              )}
            >
              {mt}
            </button>
            <div
              className={cn(
                "flex items-center gap-1 h-7 rounded-md border px-1.5 transition-colors",
                disabled
                  ? "border-border/60 bg-muted/30 opacity-60"
                  : "border-border bg-background"
              )}
            >
              <span className="text-[11px] text-muted-foreground select-none">{symbol}</span>
              <Input
                type="number"
                value={state.bid}
                step={0.01}
                disabled={disabled}
                onChange={(e) => setBid(mt, parseFloat(e.target.value) || 0)}
                onClick={(e) => e.stopPropagation()}
                className="h-6 w-full text-xs px-1 shadow-none border-0 bg-transparent focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-100"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
