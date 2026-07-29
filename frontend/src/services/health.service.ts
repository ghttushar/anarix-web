import { api } from "@/lib/api-client";

export interface HealthDimension {
  id: string;
  label: string;
  score: number;
  trend: "up" | "down" | "stable";
  description: string;
}

export interface HealthService {
  getHealthScore: () => Promise<{ overall: number; dimensions: HealthDimension[] }>;
}

const realService: HealthService = {
  getHealthScore: () => api.get<{ overall: number; dimensions: HealthDimension[] }>("/monitoring/data"),
};

let currentService: HealthService = realService;

export function setHealthService(service: HealthService) {
  currentService = service;
}

export function getHealthService(): HealthService {
  return currentService;
}

export const getHealthScore = () => currentService.getHealthScore();
