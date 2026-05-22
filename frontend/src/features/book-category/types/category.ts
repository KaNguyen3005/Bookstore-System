export interface Category {
  categoryId: number | string;
  categoryName: string;
  parentCategoryId?: number | string | null;
  children?: Category[];
  createdAt?: string | null;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isDeleted?: boolean;
  deleted?: boolean;
}
export type PublisherId = string;

export interface Publisher {
  publisherId: PublisherId;
  publisherName: string;
}
export interface PriceRange {
  label: string;

  minPrice: number;

  // optional
  maxPrice?: number;
}
