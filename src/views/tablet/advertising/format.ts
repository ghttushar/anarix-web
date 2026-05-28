export const usd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
export const usd2 = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
export const num = (n: number) => new Intl.NumberFormat("en-US").format(n);
export const pct = (n: number) => `${n.toFixed(2)}%`;
export const x = (n: number) => `${n.toFixed(2)}x`;
