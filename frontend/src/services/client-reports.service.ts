import { api } from "@/lib/api-client";

export interface ClientReport {
  id: string;
  title: string;
  client: string;
  dateRange: string;
  status: "draft" | "published" | "archived";
  lastModified: string;
  thumbnail?: string;
}

export interface ClientReportsService {
  getReports: () => Promise<ClientReport[]>;
}

const realService: ClientReportsService = {
  getReports: () => api.get<ClientReport[]>("/advertising/reports/embed/access-token"),
};

let currentService: ClientReportsService = realService;

export function setClientReportsService(service: ClientReportsService) {
  currentService = service;
}

export function getClientReportsService(): ClientReportsService {
  return currentService;
}

export const getClientReports = () => currentService.getReports();
