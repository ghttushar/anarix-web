import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

const marketplaces = ["amazon-us", "amazon-uk", "walmart-us"] as const;

export default defineTool({
  name: "get_account_summary",
  title: "Get account summary",
  description:
    "Return a headline performance summary (spend, sales, ACoS, TACoS) for a marketplace over a lookback window.",
  inputSchema: {
    marketplace: z.enum(marketplaces).describe("Marketplace identifier."),
    lookbackDays: z
      .number()
      .int()
      .describe("Lookback window in days (e.g. 7, 30, 90). Clamped to 1-90 in code."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ marketplace, lookbackDays }) => {
    const days = Math.min(90, Math.max(1, Math.floor(lookbackDays)));
    // Deterministic mock so results are stable across calls.
    const seed = marketplace.length + days;
    const spend = 1250 * days + seed * 17;
    const sales = spend * 4.2;
    const summary = {
      marketplace,
      lookbackDays: days,
      spend: Number(spend.toFixed(2)),
      sales: Number(sales.toFixed(2)),
      acos: Number(((spend / sales) * 100).toFixed(2)),
      tacos: Number(((spend / (sales * 3.1)) * 100).toFixed(2)),
      orders: Math.round(sales / 42),
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
