import type { Author } from "../types/Author";
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

  // backend trả string[]
  categories: string[];

  //backend trả object, không phải string[]
  bookImgs: {
    imgUrl: string;
    publicId?: string;
  }[] | null;

  isActive: boolean;
}