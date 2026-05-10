import type { Book } from "../../../product/types/Book";
export type ProductItem = Book;

export interface ProductFilters {
  category: string;
  status: string;
  search: string;
}

export interface ProductSummary {
  total: number;
  inStock: number;
  outOfStock: number;
}

export interface ProductsResponse {
  content: Book[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
}
