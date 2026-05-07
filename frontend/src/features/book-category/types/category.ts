export interface Category {
  categoryId: number;
  categoryName: string;
  children?: Category[];
}

export interface Publisher {
  publisherId: number;
  publisherName: string;
}

export interface PriceRange {
  id: number;
  label: string;
  min: number;
  max?: number;
}