import { cn } from "@/lib/utils";

interface TimeSelectorProps {
  selectedHours: number[];
  onHoursChange: (hours: number[]) => void;
  disabled?: boolean;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

export function TimeSelector({ selectedHours, onHoursChange, disabled }: TimeSelectorProps) {
  const toggleHour = (hour: number) => {
    if (disabled) return;
    
    if (selectedHours.includes(hour)) {
      onHoursChange(selectedHours.filter((h) => h !== hour));
    } else {
      onHoursChange([...selectedHours, hour].sort((a, b) => a - b));
    }
  };

  const selectAll = () => {
    if (disabled) return;
    onHoursChange(HOURS);
  };

  const clearAll = () => {
    if (disabled) return;
    onHoursChange([]);
  };

  const selectRange = (start: number, end: number) => {
    if (disabled) return;
    const range = [];
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    onHoursChange(range);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Select Hours</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Select All
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Quick select buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => selectRange(0, 5)}
          disabled={disabled}
          className="text-xs px-2 py-1 rounded border border-border hover:bg-muted disabled:opacity-50"
        >
          Night (12AM-5AM)
        </button>
        <button
          type="button"
          onClick={() => selectRange(6, 11)}
          disabled={disabled}
          className="text-xs px-2 py-1 rounded border border-border hover:bg-muted disabled:opacity-50"
        >
          Morning (6AM-11AM)
        </button>
        <button
          type="button"
          onClick={() => selectRange(12, 17)}
          disabled={disabled}
          className="text-xs px-2 py-1 rounded border border-border hover:bg-muted disabled:opacity-50"
        >
          Afternoon (12PM-5PM)
        </button>
        <button
          type="button"
          onClick={() => selectRange(18, 23)}
          disabled={disabled}
          className="text-xs px-2 py-1 rounded border border-border hover:bg-muted disabled:opacity-50"
        >
          Evening (6PM-11PM)
        </button>
      </div>

      {/* Hour grid */}
      <div className="grid grid-cols-12 gap-1">
        {HOURS.map((hour) => {
          const isSelected = selectedHours.includes(hour);
          const label = hour.toString().padStart(2, "0");

          return (
            <button
              key={hour}
              type="button"
              onClick={() => toggleHour(hour)}
              disabled={disabled}
              className={cn(
                "h-10 rounded-md text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedHours.length} hour{selectedHours.length !== 1 ? "s" : ""} selected
      </p>
    </div>
  );
}
