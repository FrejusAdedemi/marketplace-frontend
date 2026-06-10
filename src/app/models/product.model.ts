export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  attributes?: Record<string, unknown>;
  images: string[];
  is_active: boolean;
  is_sponsored: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type ProductSort = 'price_asc' | 'price_desc' | 'created_at_desc';

export interface ProductFilters {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: ProductSort;
}

export interface ProductListResult {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Rôles autorisés à créer/modifier/supprimer un produit. */
export const PRODUCT_MANAGER_ROLES = ['store_manager', 'admin'];

export function canManageProducts(role?: string | null): boolean {
  return !!role && PRODUCT_MANAGER_ROLES.includes(role);
}
