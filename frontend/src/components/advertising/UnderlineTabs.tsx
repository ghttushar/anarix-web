import { cn } from "@/lib/utils";

interface Tab {
  value: string;
  label: string;
  count?: number;
}

interface UnderlineTabsProps {
  tabs: Tab[];
  value: string;
  onChange: (value: string) => void;
}

export function UnderlineTabs({ tabs, value, onChange }: UnderlineTabsProps) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "relative pb-2.5 px-3 text-sm font-medium transition-colors cursor-pointer rounded-t-md",
            value === tab.value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <span>{tab.label}</span>
          {value === tab.value && (
            <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
