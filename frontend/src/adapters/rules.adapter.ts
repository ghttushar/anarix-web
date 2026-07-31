// ============================================================
// API response interfaces (what the backend would return)
// ============================================================

export interface ApiRuleTemplate {
  id: string;
  name: string;
  description: string;
  category: "campaign" | "targeting";
  created_at: string;
  updated_at: string;
}

export interface ApiRuleCondition {
  id: string;
  rule_criteria_id: string;
  metric: string;
  operator: string;
  value_type: "absolute" | "percentage";
  value: number;
  max_value?: number;
  created_at: string;
}

export interface ApiRuleAction {
  id: string;
  rule_criteria_id: string;
  type: string;
  value: number;
  created_at: string;
}

export interface ApiRuleCriteria {
  id: string;
  rule_id: string;
  priority: number;
  name: string;
  conditions: ApiRuleCondition[];
  action: ApiRuleAction;
  created_at: string;
  updated_at: string;
}

export interface ApiAppliedRule {
  id: string;
  name: string;
  rule_type: string;
  entities_count: number;
  entity_label: string;
  frequency: string;
  last_run: string | null;
  status: "active" | "paused" | "draft" | "ended";
  criteria: ApiRuleCriteria[];
  created_at: string;
  updated_at: string;
}

export interface ApiAutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  metric: string;
  threshold: number;
  operator: ">" | "<" | ">=" | "<=" | "==";
  status: "active" | "draft" | "paused";
  created_at: string;
  backtest_result?: ApiBacktestResult;
}

export interface ApiBacktestResult {
  period: string;
  days_simulated: number;
  triggered_count: number;
  affected_campaigns: number;
  projected_savings: number;
  projected_revenue_loss: number;
  net_impact: number;
  daily_results: {
    date: string;
    triggered: boolean;
    savings: number;
    revenue_loss: number;
  }[];
}

// ============================================================
// UI types (what the components currently expect)
// Re-exported from mockRules.ts / mockRuleBuilder.ts for reference
// ============================================================

export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: "campaign" | "targeting";
}

export interface RuleCondition {
  id: string;
  metric: string;
  operator: string;
  valueType: "absolute" | "percentage";
  value: number;
  maxValue?: number;
}

export interface RuleAction {
  type: string;
  value: number;
}

export interface RuleCriteria {
  id: string;
  priority: number;
  name: string;
  conditions: RuleCondition[];
  action: RuleAction;
}

export interface AppliedRule {
  id: string;
  name: string;
  ruleType: string;
  entitiesCount: number;
  entityLabel: string;
  frequency: string;
  lastRun: string;
  status: "active" | "paused" | "draft" | "ended";
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  metric: string;
  threshold: number;
  operator: ">" | "<" | ">=" | "<=" | "==";
  status: "active" | "draft" | "paused";
  createdAt: string;
  backtestResult?: BacktestResult;
}

export interface BacktestResult {
  period: string;
  daysSimulated: number;
  triggeredCount: number;
  affectedCampaigns: number;
  projectedSavings: number;
  projectedRevenueLoss: number;
  netImpact: number;
  dailyResults: { date: string; triggered: boolean; savings: number; revenueLoss: number }[];
}

// ============================================================
// Adapter functions (API response → UI type)
// ============================================================

export function adaptRuleTemplate(api: ApiRuleTemplate): RuleTemplate {
  return {
    id: api.id,
    name: api.name,
    description: api.description,
    category: api.category,
  };
}

export function adaptRuleTemplates(apiList: ApiRuleTemplate[]): RuleTemplate[] {
  return apiList.map(adaptRuleTemplate);
}

export function adaptRuleCondition(api: ApiRuleCondition): RuleCondition {
  return {
    id: api.id,
    metric: api.metric,
    operator: api.operator,
    valueType: api.value_type,
    value: api.value,
    maxValue: api.max_value,
  };
}

export function adaptRuleConditions(apiList: ApiRuleCondition[]): RuleCondition[] {
  return apiList.map(adaptRuleCondition);
}

export function adaptRuleAction(api: ApiRuleAction): RuleAction {
  return {
    type: api.type,
    value: api.value,
  };
}

export function adaptRuleCriteria(api: ApiRuleCriteria): RuleCriteria {
  return {
    id: api.id,
    priority: api.priority,
    name: api.name,
    conditions: adaptRuleConditions(api.conditions),
    action: adaptRuleAction(api.action),
  };
}

export function adaptRuleCriteriaList(apiList: ApiRuleCriteria[]): RuleCriteria[] {
  return apiList.map(adaptRuleCriteria);
}

export function adaptAppliedRule(api: ApiAppliedRule): AppliedRule {
  return {
    id: api.id,
    name: api.name,
    ruleType: api.rule_type,
    entitiesCount: api.entities_count,
    entityLabel: api.entity_label,
    frequency: api.frequency,
    lastRun: api.last_run ?? "",
    status: api.status,
  };
}

export function adaptAppliedRules(apiList: ApiAppliedRule[]): AppliedRule[] {
  return apiList.map(adaptAppliedRule);
}

export function adaptAutomationRule(api: ApiAutomationRule): AutomationRule {
  return {
    id: api.id,
    name: api.name,
    condition: api.condition,
    action: api.action,
    metric: api.metric,
    threshold: api.threshold,
    operator: api.operator,
    status: api.status,
    createdAt: api.created_at,
    backtestResult: api.backtest_result ? adaptBacktestResult(api.backtest_result) : undefined,
  };
}

export function adaptAutomationRules(apiList: ApiAutomationRule[]): AutomationRule[] {
  return apiList.map(adaptAutomationRule);
}

export function adaptBacktestResult(api: ApiBacktestResult): BacktestResult {
  return {
    period: api.period,
    daysSimulated: api.days_simulated,
    triggeredCount: api.triggered_count,
    affectedCampaigns: api.affected_campaigns,
    projectedSavings: api.projected_savings,
    projectedRevenueLoss: api.projected_revenue_loss,
    netImpact: api.net_impact,
    dailyResults: api.daily_results.map((d) => ({
      date: d.date,
      triggered: d.triggered,
      savings: d.savings,
      revenueLoss: d.revenue_loss,
    })),
  };
}
