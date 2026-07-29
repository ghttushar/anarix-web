import { api } from "@/lib/api-client";
import { CatalogProduct } from "@/types/catalog";

export interface CatalogService {
  getProducts: () => Promise<CatalogProduct[]>;
  getProductById: (id: string) => Promise<CatalogProduct | undefined>;
}

const realService: CatalogService = {
  getProducts: () => api.post<CatalogProduct[]>("/amazon-ads/catalog", {}),
  getProductById: (id) => api.post<CatalogProduct | undefined>("/amazon-ads/catalog", { searchText: id }),
};

let currentService: CatalogService = realService;

export function setCatalogService(service: CatalogService) {
  currentService = service;
}

export function getCatalogService(): CatalogService {
  return currentService;
}

export const getProducts = () => currentService.getProducts();
export const getProductById = (id: string) => currentService.getProductById(id);
