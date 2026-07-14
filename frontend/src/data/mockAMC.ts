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

export const mockQueries: AMCQuery[] = [
  { id: "q1", name: "New-to-Brand Customers", status: "active", lastRun: "2025-12-01 14:30", createdBy: "admin@anarix.com", sqlPreview: "SELECT customer_id, first_purchase_date..." },
  { id: "q2", name: "Cross-Channel Attribution", status: "active", lastRun: "2025-12-01 12:00", createdBy: "admin@anarix.com", sqlPreview: "SELECT campaign_id, channel, conversions..." },
  { id: "q3", name: "Path to Purchase Analysis", status: "draft", lastRun: "—", createdBy: "analyst@company.com", sqlPreview: "SELECT touchpoint_sequence, conversion_rate..." },
  { id: "q4", name: "Audience Overlap Report", status: "active", lastRun: "2025-11-30 09:15", createdBy: "admin@anarix.com", sqlPreview: "SELECT audience_a, audience_b, overlap_pct..." },
  { id: "q5", name: "Frequency Cap Analysis", status: "archived", lastRun: "2025-11-15 10:00", createdBy: "analyst@company.com", sqlPreview: "SELECT frequency_bucket, conversion_rate..." },
];

export const mockExecutedQueries: AMCExecutedQuery[] = [
  { id: "eq1", queryName: "New-to-Brand Customers", executionTime: "2m 34s", status: "completed", resultsCount: 15420, executedAt: "2025-12-01 14:30" },
  { id: "eq2", queryName: "Cross-Channel Attribution", executionTime: "5m 12s", status: "completed", resultsCount: 8930, executedAt: "2025-12-01 12:00" },
  { id: "eq3", queryName: "Audience Overlap Report", executionTime: "1m 48s", status: "completed", resultsCount: 3200, executedAt: "2025-11-30 09:15" },
  { id: "eq4", queryName: "New-to-Brand Customers", executionTime: "—", status: "running", resultsCount: 0, executedAt: "2025-12-02 08:00" },
  { id: "eq5", queryName: "Frequency Cap Analysis", executionTime: "0m 45s", status: "failed", resultsCount: 0, executedAt: "2025-11-28 16:20" },
];

export const mockSchedules: AMCSchedule[] = [
  { id: "s1", name: "Daily NTB Report", queryName: "New-to-Brand Customers", frequency: "daily", nextRun: "2025-12-03 06:00", status: "active" },
  { id: "s2", name: "Weekly Attribution", queryName: "Cross-Channel Attribution", frequency: "weekly", nextRun: "2025-12-08 06:00", status: "active" },
  { id: "s3", name: "Monthly Overlap", queryName: "Audience Overlap Report", frequency: "monthly", nextRun: "2026-01-01 06:00", status: "paused" },
];

export const mockAudiences: AMCAudience[] = [
  { id: "a1", name: "High-Value Shoppers", size: 245000, createdAt: "2025-11-15", status: "ready", source: "New-to-Brand Customers" },
  { id: "a2", name: "Cross-Channel Converters", size: 89000, createdAt: "2025-11-20", status: "ready", source: "Cross-Channel Attribution" },
  { id: "a3", name: "Lapsed Customers 90d", size: 156000, createdAt: "2025-12-01", status: "building", source: "Custom Query" },
  { id: "a4", name: "Brand Loyalists", size: 42000, createdAt: "2025-10-01", status: "expired", source: "Frequency Cap Analysis" },
];

export const mockCreatedAudiences: AMCCreatedAudience[] = [
  { id: "ca1", name: "Lookalike - High Value", type: "lookalike", size: 500000, lastUpdated: "2025-12-01", status: "active" },
  { id: "ca2", name: "Retarget - Cart Abandoners", type: "retargeting", size: 120000, lastUpdated: "2025-11-28", status: "active" },
  { id: "ca3", name: "Custom - Holiday Shoppers", type: "custom", size: 340000, lastUpdated: "2025-11-25", status: "paused" },
];

export const mockInstances: AMCInstance[] = [
  { id: "i1", instanceId: "amci-us-east-001", region: "US East (N. Virginia)", status: "active", createdAt: "2025-06-15", advertiserName: "Brand Corp US" },
  { id: "i2", instanceId: "amci-eu-west-001", region: "EU West (Ireland)", status: "active", createdAt: "2025-08-20", advertiserName: "Brand Corp EU" },
  { id: "i3", instanceId: "amci-us-west-001", region: "US West (Oregon)", status: "provisioning", createdAt: "2025-12-01", advertiserName: "Brand Corp West" },
];
