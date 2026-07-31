import { api } from "@/lib/api-client";
import type { Invoice } from "@/types/marketplace";

export interface InvoicingService {
  getInvoices: () => Promise<Invoice[]>;
}

const realService: InvoicingService = {
  getInvoices: () => api.get<Invoice[]>("/amazon-ads/catalog"),
};

let currentService: InvoicingService = realService;

export function setInvoicingService(service: InvoicingService) {
  currentService = service;
}

export function getInvoicingService(): InvoicingService {
  return currentService;
}

export const getInvoices = () => currentService.getInvoices();
