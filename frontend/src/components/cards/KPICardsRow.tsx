import { KPICard } from "./KPICard";
import { KPIData } from "@/types/campaign";

interface KPICardsRowProps {
  data: KPIData[];
}

export function KPICardsRow({ data }: KPICardsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((kpi) => (
        <KPICard
          key={kpi.label}
          label={kpi.label}
          value={kpi.value}
          previousValue={kpi.previousValue}
          format={kpi.format}
        />
      ))}
    </div>
  );
}
