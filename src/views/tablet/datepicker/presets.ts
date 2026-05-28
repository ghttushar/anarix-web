export interface DatePreset {
  id: string;
  label: string;
  range: () => { from: Date; to: Date };
}

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

export const DATE_PRESETS: DatePreset[] = [
  { id: "today", label: "Today", range: () => ({ from: startOfDay(new Date()), to: endOfDay(new Date()) }) },
  { id: "yesterday", label: "Yesterday", range: () => ({ from: startOfDay(addDays(new Date(), -1)), to: endOfDay(addDays(new Date(), -1)) }) },
  { id: "7d", label: "Last 7 days", range: () => ({ from: startOfDay(addDays(new Date(), -6)), to: endOfDay(new Date()) }) },
  { id: "28d", label: "Last 28 days", range: () => ({ from: startOfDay(addDays(new Date(), -27)), to: endOfDay(new Date()) }) },
  { id: "mtd", label: "Month to date", range: () => { const n = new Date(); return { from: startOfDay(new Date(n.getFullYear(), n.getMonth(), 1)), to: endOfDay(n) }; } },
  { id: "qtd", label: "Quarter to date", range: () => { const n = new Date(); const q = Math.floor(n.getMonth() / 3) * 3; return { from: startOfDay(new Date(n.getFullYear(), q, 1)), to: endOfDay(n) }; } },
  { id: "ytd", label: "Year to date", range: () => { const n = new Date(); return { from: startOfDay(new Date(n.getFullYear(), 0, 1)), to: endOfDay(n) }; } },
];
