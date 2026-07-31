// ============================================================
// API response interfaces
// ============================================================

export interface ApiAMCQuery {
  id: string;
  name: string;
  status: "active" | "draft" | "archived";
  last_run: string;
  created_by: string;
  sql_preview: string;
  created_at: string;
  updated_at: string;
}

export interface ApiAMCExecutedQuery {
  id: string;
  query_name: string;
  execution_time: string;
  status: "completed" | "failed" | "running";
  results_count: number;
  executed_at: string;
}

export interface ApiAMCSchedule {
  id: string;
  name: string;
  query_name: string;
  frequency: "daily" | "weekly" | "monthly";
  next_run: string;
  status: "active" | "paused";
  created_at: string;
  updated_at: string;
}

export interface ApiAMCAudience {
  id: string;
  name: string;
  size: number;
  created_at: string;
  status: "ready" | "building" | "expired";
  source: string;
}

export interface ApiAMCCreatedAudience {
  id: string;
  name: string;
  type: "lookalike" | "retargeting" | "custom";
  size: number;
  last_updated: string;
  status: "active" | "paused";
}

export interface ApiAMCInstance {
  id: string;
  instance_id: string;
  region: string;
  status: "active" | "inactive" | "provisioning";
  created_at: string;
  advertiser_name: string;
}

// ============================================================
// UI types (what components expect from mockAMC.ts)
// ============================================================

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

// ============================================================
// Adapter functions
// ============================================================

export function adaptAMCQuery(api: ApiAMCQuery): AMCQuery {
  return {
    id: api.id,
    name: api.name,
    status: api.status,
    lastRun: api.last_run,
    createdBy: api.created_by,
    sqlPreview: api.sql_preview,
  };
}

export function adaptAMCQueries(apiList: ApiAMCQuery[]): AMCQuery[] {
  return apiList.map(adaptAMCQuery);
}

export function adaptAMCExecutedQuery(api: ApiAMCExecutedQuery): AMCExecutedQuery {
  return {
    id: api.id,
    queryName: api.query_name,
    executionTime: api.execution_time,
    status: api.status,
    resultsCount: api.results_count,
    executedAt: api.executed_at,
  };
}

export function adaptAMCExecutedQueries(apiList: ApiAMCExecutedQuery[]): AMCExecutedQuery[] {
  return apiList.map(adaptAMCExecutedQuery);
}

export function adaptAMCSchedule(api: ApiAMCSchedule): AMCSchedule {
  return {
    id: api.id,
    name: api.name,
    queryName: api.query_name,
    frequency: api.frequency,
    nextRun: api.next_run,
    status: api.status,
  };
}

export function adaptAMCSchedules(apiList: ApiAMCSchedule[]): AMCSchedule[] {
  return apiList.map(adaptAMCSchedule);
}

export function adaptAMCAudience(api: ApiAMCAudience): AMCAudience {
  return {
    id: api.id,
    name: api.name,
    size: api.size,
    createdAt: api.created_at,
    status: api.status,
    source: api.source,
  };
}

export function adaptAMCAudiences(apiList: ApiAMCAudience[]): AMCAudience[] {
  return apiList.map(adaptAMCAudience);
}

export function adaptAMCCreatedAudience(api: ApiAMCCreatedAudience): AMCCreatedAudience {
  return {
    id: api.id,
    name: api.name,
    type: api.type,
    size: api.size,
    lastUpdated: api.last_updated,
    status: api.status,
  };
}

export function adaptAMCCreatedAudiences(apiList: ApiAMCCreatedAudience[]): AMCCreatedAudience[] {
  return apiList.map(adaptAMCCreatedAudience);
}

export function adaptAMCInstance(api: ApiAMCInstance): AMCInstance {
  return {
    id: api.id,
    instanceId: api.instance_id,
    region: api.region,
    status: api.status,
    createdAt: api.created_at,
    advertiserName: api.advertiser_name,
  };
}

export function adaptAMCInstances(apiList: ApiAMCInstance[]): AMCInstance[] {
  return apiList.map(adaptAMCInstance);
}
