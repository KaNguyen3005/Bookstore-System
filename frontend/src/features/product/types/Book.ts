import type { Category } from "../../book-category/types/category";
import type { Publisher } from "../../book-category/types/category";
export interface Book {
  bookId: number;
  title: string;
  price: number;
  authorName: string;
  description: string;
  coverImgUrl: string;
  stockQuantity: number;
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
  publishers: Publisher;
}