import { api } from "@/lib/api-client";

export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: "campaign" | "targeting";
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

export interface MetricsMeta {
  metricOptions: { value: string; label: string }[];
  operatorOptions: { value: string; label: string }[];
  actionOptions: { value: string; label: string }[];
  lookbackOptions: { value: string; label: string }[];
  frequencyOptions: { value: string; label: string }[];
  dateRangeOptions: { value: string; label: string }[];
}

export interface RulesService {
  getTemplates: () => Promise<RuleTemplate[]>;
  getAppliedRules: () => Promise<AppliedRule[]>;
  getMetricsMeta: () => Promise<MetricsMeta>;
}

const realService: RulesService = {
  getTemplates: () => api.get<RuleTemplate[]>("/rules/templates/{ruleType}"),
  getAppliedRules: () => api.post<AppliedRule[]>("/rules/applied-rules", {}),
  getMetricsMeta: () => api.get<MetricsMeta>("/rules/constraints/{ruleType}"),
};

let currentService: RulesService = realService;

export function setRulesService(service: RulesService) {
  currentService = service;
}

export function getRulesService(): RulesService {
  return currentService;
}

export const getTemplates = () => currentService.getTemplates();
export const getAppliedRules = () => currentService.getAppliedRules();
export const getMetricsMeta = () => currentService.getMetricsMeta();
