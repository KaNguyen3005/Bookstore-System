export interface Category {
  categoryId: number;
  name: string;
}

export interface Book {
  bookId: number;
  title: string;
  price: number;
  authorName: string;
  description: string;
  coverImgUrl: string;
  stockQuantity: number;
  publisherName: string;
  isbn: string;
  publicationDate: string;
  dimensions: string;
  coverType: string;
  numPages: number;
  isActive: boolean;
  avgRating: number;
  reviewCount: number;
  oldPrice?: number;
  salePercent?: number;
  categories: Category[];
}