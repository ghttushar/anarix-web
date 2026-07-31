import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

// Static demo data mirroring the app's mockRules shape. Keep import-safe:
// no env reads, no I/O at module top level.
const appliedRules = [
  { id: "r_001", name: "Pause high-ACoS keywords", status: "running", campaigns: 12, lastRun: "2026-07-05" },
  { id: "r_002", name: "Increase bid on low-ACoS SKUs", status: "running", campaigns: 8, lastRun: "2026-07-05" },
  { id: "r_003", name: "Weekend budget boost", status: "paused", campaigns: 4, lastRun: "2026-06-28" },
  { id: "r_004", name: "Harvest converting search terms", status: "draft", campaigns: 0, lastRun: null },
  { id: "r_005", name: "Q1 holiday launch bids", status: "ended", campaigns: 6, lastRun: "2026-01-05" },
];

export default defineTool({
  name: "list_applied_rules",
  title: "List applied rules",
  description:
    "List Anarix advertising automation rules, optionally filtered by status (running, paused, draft, ended).",
  inputSchema: {
    status: z
      .enum(["running", "paused", "draft", "ended"])
      .optional()
      .describe("Optional status filter. Omit to return all rules."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ status }) => {
    const rows = status ? appliedRules.filter((r) => r.status === status) : appliedRules;
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { rules: rows, count: rows.length },
    };
  },
});
