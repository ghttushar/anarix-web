import { cn } from "@/lib/utils";

interface DaySelectorProps {
  selectedDays: number[];
  onDaysChange: (days: number[]) => void;
  disabled?: boolean;
}

const DAYS = [
  { value: 0, label: "Sun", short: "S" },
  { value: 1, label: "Mon", short: "M" },
  { value: 2, label: "Tue", short: "T" },
  { value: 3, label: "Wed", short: "W" },
  { value: 4, label: "Thu", short: "T" },
  { value: 5, label: "Fri", short: "F" },
  { value: 6, label: "Sat", short: "S" },
];

export function DaySelector({ selectedDays, onDaysChange, disabled }: DaySelectorProps) {
  const toggleDay = (day: number) => {
    if (disabled) return;
    
    if (selectedDays.includes(day)) {
      onDaysChange(selectedDays.filter((d) => d !== day));
    } else {
      onDaysChange([...selectedDays, day].sort((a, b) => a - b));
    }
  };

  const selectWeekdays = () => {
    if (disabled) return;
    onDaysChange([1, 2, 3, 4, 5]);
  };

  const selectWeekends = () => {
    if (disabled) return;
    onDaysChange([0, 6]);
  };

  const selectAll = () => {
    if (disabled) return;
    onDaysChange([0, 1, 2, 3, 4, 5, 6]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Select Days</span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectWeekdays}
            disabled={disabled}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Weekdays
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            type="button"
            onClick={selectWeekends}
            disabled={disabled}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            Weekends
          </button>
          <span className="text-muted-foreground">|</span>
          <button
            type="button"
            onClick={selectAll}
            disabled={disabled}
            className="text-xs text-primary hover:underline disabled:opacity-50"
          >
            All
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        {DAYS.map((day) => {
          const isSelected = selectedDays.includes(day.value);

          return (
            <button
              key={day.value}
              type="button"
              onClick={() => toggleDay(day.value)}
              disabled={disabled}
              className={cn(
                "flex-1 h-10 rounded-md text-sm font-medium transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              {day.label}
            </button>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {selectedDays.length} day{selectedDays.length !== 1 ? "s" : ""} selected
      </p>
    </div>
  );
}
