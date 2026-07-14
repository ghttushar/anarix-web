import { defineMcp } from "@lovable.dev/mcp-js";
import echoTool from "./tools/echo";
import listAppliedRulesTool from "./tools/list-applied-rules";
import getAccountSummaryTool from "./tools/get-account-summary";

export default defineMcp({
  name: "anarix-mcp",
  title: "Anarix MCP",
  version: "0.1.0",
  instructions:
    "Read-only tools for the Anarix advertising intelligence platform. Use `list_applied_rules` to inspect automation rules, `get_account_summary` for headline marketplace KPIs, and `echo` to verify connectivity.",
  tools: [echoTool, listAppliedRulesTool, getAccountSummaryTool],
});
