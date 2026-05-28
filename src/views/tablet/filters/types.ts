export type FilterOperator = "eq" | "neq" | "gt" | "lt" | "gte" | "lte" | "contains";

export interface FilterRule {
  id: string;
  columnId: string;
  operator: FilterOperator;
  value: string;
}

export type FilterCombinator = "and" | "or";

export interface FilterState {
  combinator: FilterCombinator;
  rules: FilterRule[];
}

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  eq: "equals",
  neq: "does not equal",
  gt: "greater than",
  lt: "less than",
  gte: "greater or equal",
  lte: "less or equal",
  contains: "contains",
};
