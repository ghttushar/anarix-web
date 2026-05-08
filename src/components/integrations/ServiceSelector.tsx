import { TrendingUp, Megaphone, ShieldCheck, Package, BarChart3, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ServiceKey, SERVICE_META } from "@/contexts/IntegrationsContext";

const ICONS: Record<ServiceKey, React.ComponentType<{ className?: string }>> = {
  profitability: TrendingUp,
  advertising: Megaphone,
  rules: ShieldCheck,
  catalog: Package,
  bi: BarChart3,
  dayparting: Clock,
};

interface Props {
  selected: ServiceKey[];
  onChange: (next: ServiceKey[]) => void;
}

export function ServiceSelector({ selected, onChange }: Props) {
  const toggle = (k: ServiceKey) =>
    onChange(selected.includes(k) ? selected.filter((s) => s !== k) : [...selected, k]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {(Object.keys(SERVICE_META) as ServiceKey[]).map((key) => {
        const Icon = ICONS[key];
        const meta = SERVICE_META[key];
        const isOn = selected.includes(key);
        return (
          <button
            key={key}
            type="button"
            onClick={() => toggle(key)}
            className={cn(
              "text-left flex items-start gap-3 p-3 rounded-lg border transition-colors",
              isOn
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-primary/40"
            )}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-md flex items-center justify-center shrink-0",
                isOn ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{meta.label}</p>
              <p className="text-xs text-muted-foreground">{meta.description}</p>
            </div>
            <div
              className={cn(
                "h-4 w-4 rounded border shrink-0 mt-0.5 flex items-center justify-center",
                isOn ? "bg-primary border-primary" : "border-border"
              )}
            >
              {isOn && (
                <svg viewBox="0 0 16 16" className="h-3 w-3 text-primary-foreground" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M3 8l3 3 7-7" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
