export type WidgetType = "metric" | "chart" | "table" | "annotation" | "task";

export interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  config: Record<string, unknown>;
  colSpan: number;
  rowSpan: number;
}
