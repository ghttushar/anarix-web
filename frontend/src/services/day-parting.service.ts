import { api } from "@/lib/api-client";
import {
  HourlyDataPoint,
  DayPartingSchedule,
  ExecutionHistory,
  DayPartingCampaign,
  HourlyMetricsSummary,
} from "@/types/dayparting";

export interface DayPartingService {
  getHourlyData: () => Promise<HourlyDataPoint[]>;
  getHourlySummary: () => Promise<HourlyMetricsSummary>;
  getCampaigns: () => Promise<DayPartingCampaign[]>;
  getSchedules: () => Promise<DayPartingSchedule[]>;
  getExecutionHistory: () => Promise<ExecutionHistory[]>;
  createSchedule: (schedule: Omit<DayPartingSchedule, "id" | "createdAt" | "updatedAt">) => Promise<DayPartingSchedule>;
  updateSchedule: (id: string, schedule: Partial<DayPartingSchedule>) => Promise<void>;
  deleteSchedule: (id: string) => Promise<void>;
}

const realService: DayPartingService = {
  getHourlyData: () => api.post<HourlyDataPoint[]>("/day-parting/jobs/metrics", {}),
  getHourlySummary: () => api.post<HourlyMetricsSummary>("/day-parting/jobs/metrics", {}),
  getCampaigns: () => api.post<DayPartingCampaign[]>("/day-parting/jobs/campaigns/part-of-dayparting", {}),
  getSchedules: () => api.get<DayPartingSchedule[]>("/day-parting/jobs/jobs"),
  getExecutionHistory: () => api.post<ExecutionHistory[]>("/day-parting/jobs/history", {}),
  createSchedule: (schedule) =>
    api.post<DayPartingSchedule>("/day-parting/jobs/create", schedule),
  updateSchedule: (id, schedule) =>
    api.post<void>(`/day-parting/jobs/update/${id}`, schedule),
  deleteSchedule: (id) =>
    api.post<void>(`/day-parting/jobs/archive/${id}`, {}),
};

let currentService: DayPartingService = realService;

export function setDayPartingService(service: DayPartingService) {
  currentService = service;
}

export function getDayPartingService(): DayPartingService {
  return currentService;
}

export const getHourlyData = () => currentService.getHourlyData();
export const getHourlySummary = () => currentService.getHourlySummary();
export const getCampaigns = () => currentService.getCampaigns();
export const getSchedules = () => currentService.getSchedules();
export const getExecutionHistory = () => currentService.getExecutionHistory();
export const createSchedule = (s: Omit<DayPartingSchedule, "id" | "createdAt" | "updatedAt">) =>
  currentService.createSchedule(s);
export const updateSchedule = (id: string, s: Partial<DayPartingSchedule>) =>
  currentService.updateSchedule(id, s);
export const deleteSchedule = (id: string) => currentService.deleteSchedule(id);
