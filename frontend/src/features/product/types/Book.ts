import type { Author } from "../types/Author";
import type { Category } from "../../book-category/types/category";
import type { Publisher } from "../../book-category/types/category";
export interface Book {
  bookId: number;

  title: string;

  authors: Author[];

  publisher: Publisher;

  isbn: string;

  language: string;

  description: string;

  pageCount: number;

  coverType: string;

  coverImgUrl: string;

  stockQuantity: number;

  price: number;

  avgRating: number;

  salePercent: number;

  categories: Category[];

  bookImgs: string[] | null;

  isActive: boolean;
}