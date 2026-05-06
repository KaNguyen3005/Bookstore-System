export interface Book {
  bookId: number;
  title: string;
  price: number;
  oldPrice: number;
  salePercent: number;
  coverImageUrl: string;
  coverImgUrl?: string; // For ProductCard compatibility
  categoryId: number;
  publisherId: number;
  avgRating?: number;
  reviewCount?: number;
}
