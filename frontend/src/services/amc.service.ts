import { api } from "@/lib/api-client";

export interface AMCQuery {
  id: string;
  name: string;
  status: "active" | "draft" | "archived";
  lastRun: string;
  createdBy: string;
  sqlPreview: string;
}

export interface AMCExecutedQuery {
  id: string;
  queryName: string;
  executionTime: string;
  status: "completed" | "failed" | "running";
  resultsCount: number;
  executedAt: string;
}

export interface AMCSchedule {
  id: string;
  name: string;
  queryName: string;
  frequency: "daily" | "weekly" | "monthly";
  nextRun: string;
  status: "active" | "paused";
}

export interface AMCAudience {
  id: string;
  name: string;
  size: number;
  createdAt: string;
  status: "ready" | "building" | "expired";
  source: string;
}

export interface AMCCreatedAudience {
  id: string;
  name: string;
  type: "lookalike" | "retargeting" | "custom";
  size: number;
  lastUpdated: string;
  status: "active" | "paused";
}

export interface AMCInstance {
  id: string;
  instanceId: string;
  region: string;
  status: "active" | "inactive" | "provisioning";
  createdAt: string;
  advertiserName: string;
}

export interface AMCService {
  getQueries: () => Promise<AMCQuery[]>;
  getExecutedQueries: () => Promise<AMCExecutedQuery[]>;
  getSchedules: () => Promise<AMCSchedule[]>;
  getAudiences: () => Promise<AMCAudience[]>;
  getCreatedAudiences: () => Promise<AMCCreatedAudience[]>;
  getInstances: () => Promise<AMCInstance[]>;
}

const realService: AMCService = {
  getQueries: () => api.get<AMCQuery[]>("/amc/query"),
  getExecutedQueries: () => api.get<AMCExecutedQuery[]>("/amc/workflow-execution/{instanceId}/workflows"),
  getSchedules: () => api.get<AMCSchedule[]>("/amc/schedule/{instanceId}"),
  getAudiences: () => api.get<AMCAudience[]>("/amc/audience/{instanceId}/default"),
  getCreatedAudiences: () => api.get<AMCCreatedAudience[]>("/amc/audience/{instanceId}/custom"),
  getInstances: () => api.get<AMCInstance[]>("/amc/instances"),
};

let currentService: AMCService = realService;

export function setAMCService(service: AMCService) {
  currentService = service;
}

export function getAMCService(): AMCService {
  return currentService;
}

export const getQueries = () => currentService.getQueries();
export const getExecutedQueries = () => currentService.getExecutedQueries();
export const getSchedules = () => currentService.getSchedules();
export const getAudiences = () => currentService.getAudiences();
export const getCreatedAudiences = () => currentService.getCreatedAudiences();
export const getInstances = () => currentService.getInstances();
