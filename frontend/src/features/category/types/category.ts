export interface Category {
  categoryId: number;
  name: string;
  parentId: number | null;
}

export interface Publisher {
  publisherId: number;
  publisherName: string;
}

export interface PriceRange {
  id: number;
  label: string;
  minPrice: number;
  maxPrice: number;
}

export interface Book {
  bookId: number;
  book_id?: number; // Compatibility for ProductCard
  title: string;
  price: number;
  categoryId: number;
  publisherId: number;
  salePercent?: number;
  oldPrice?: number;
  avgRating?: number;
  reviewCount?: number;
  coverImageUrl?: string;
}
