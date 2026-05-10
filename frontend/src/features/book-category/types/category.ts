export interface Category {
  categoryId: number;
  categoryName: string;
  parentCategoryId?: number | null;
  children?: Category[];
}
export interface Publisher{
    publisherId: number;
    publisherName: string;
}
export interface PriceRange {
  label: string;

  minPrice: number;

  // optional
  maxPrice?: number;
}