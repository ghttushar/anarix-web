import { useState } from "react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { cn } from "@/lib/utils";

const mockData = [
  { date: "Mon", sales: 4200, spend: 1200, roas: 3.5 },
  { date: "Tue", sales: 5100, spend: 1450, roas: 3.52 },
  { date: "Wed", sales: 4800, spend: 1300, roas: 3.69 },
  { date: "Thu", sales: 6200, spend: 1600, roas: 3.88 },
  { date: "Fri", sales: 5500, spend: 1500, roas: 3.67 },
  { date: "Sat", sales: 5900, spend: 1550, roas: 3.81 },
  { date: "Sun", sales: 5255, spend: 1373, roas: 3.83 },
];

const pieData = [
  { name: "Sponsored Products", value: 60 },
  { name: "Sponsored Brands", value: 25 },
  { name: "Sponsored Display", value: 15 },
];

const COLORS = ["hsl(229 65% 57%)", "hsl(231 74% 81%)", "hsl(234 30% 24%)"];

type ChartType = "line" | "bar" | "area" | "pie";

interface ChartWidgetProps {
  config: Record<string, unknown>;
  onConfigChange: (config: Record<string, unknown>) => void;
}

export function ChartWidget({ config, onConfigChange }: ChartWidgetProps) {
  const chartType = (config.chartType as ChartType) || "line";

  const types: { value: ChartType; label: string }[] = [
    { value: "line", label: "Line" },
    { value: "bar", label: "Bar" },
    { value: "area", label: "Area" },
    { value: "pie", label: "Pie" },
  ];

  return (
    <div className="flex flex-col h-full gap-2">
      {/* Chart type switcher */}
      <div className="flex items-center gap-1 shrink-0">
        {types.map((t) => (
          <button
            key={t.value}
            onClick={() => onConfigChange({ ...config, chartType: t.value })}
            className={cn(
              "px-2 py-1 rounded text-xs font-medium transition-colors",
              chartType === t.value
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" ? (
            <LineChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="spend" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spend" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : chartType === "area" ? (
            <AreaChart data={mockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip />
              <Area type="monotone" dataKey="sales" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" strokeWidth={2} />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius="40%" outerRadius="70%" dataKey="value" label={({ name }) => name}>
                {pieData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
