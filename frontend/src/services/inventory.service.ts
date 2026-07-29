import { api } from "@/lib/api-client";

export interface InventoryProduct {
  id: string;
  sku: string;
  title: string;
  asin: string;
  fnsku: string;
  condition: string;
  price: number;
  quantity: number;
  reserved: number;
  inbound: number;
  sellable: number;
  inboundQuantity: number;
  inboundWorking: number;
  inboundShipped: number;
  inboundReceiving: number;
  totalUnits: number;
  status: "sellable" | "inbound" | "unfulfillable";
}

export interface InventoryService {
  getProducts: () => Promise<InventoryProduct[]>;
}

const realService: InventoryService = {
  getProducts: () => api.post<InventoryProduct[]>("/amazon-ads/catalog", {}),
};

let currentService: InventoryService = realService;

export function setInventoryService(service: InventoryService) {
  currentService = service;
}

export function getInventoryService(): InventoryService {
  return currentService;
}

export const getInventoryProducts = () => currentService.getProducts();
