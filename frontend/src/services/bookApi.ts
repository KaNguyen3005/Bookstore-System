import axiosClient from "./axiosClient";
import {
  MOCK_ALL_BOOKS,
  getHotSearchBooks,
  getTopSellingBooks,
  getFeaturedBook,
} from "../data/books";
import type { Book } from "../features/product/types/Book";
import { categoriesData } from "../data/categoriesData";
import type { Category } from "../features/book-category/types/category";

const IS_MOCK = false;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const ALL_BOOKS: Book[] = MOCK_ALL_BOOKS;

export const bookApi = {
  getBooks: async (params?: any): Promise<Book[]> => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_ALL_BOOKS;
    }

    const res: any = await axiosClient.get("/books", { params });
    return res?.data?.result?.content || [];
  },

  getBookById: async (id: number): Promise<Book> => {
    if (IS_MOCK) {
      await delay(500);
      const book = ALL_BOOKS.find((b) => b.bookId === id);
      if (!book) throw new Error("Book not found");
      return book;
    }

    const res: any = await axiosClient.get(`/books/${id}`);
    return res?.data?.result || res?.data;
  },

  // getRelatedBooks: async (bookId: number): Promise<Book[]> => {
  //   if (IS_MOCK) {
  //     await delay(500);
  //     return MOCK_ALL_BOOKS
  //       .filter((b) => b.bookId !== bookId)
  //       .sort(() => 0.5 - Math.random())
  //       .slice(0, 15);
  //   }

  //   const res: any = await axiosClient.get(`/books/${bookId}/related`);
  //   return res?.data?.result || res?.data || [];
  // },

   // ================= CATEGORIES =================

  getCategories: async (): Promise<Category[]> => {
    if (IS_MOCK) {
      await delay(300);

      return categoriesData;
    }

    const res: any = await axiosClient.get("/categories");

    return res?.data?.result || [];
  },

  // ================= HOME DATA =================

  getHomeData: async () => {
    if (IS_MOCK) {
      await delay(500);

      return {
        hotSearchBooks: getHotSearchBooks(),
        topSellingBooks: getTopSellingBooks(),
        featuredBook: getFeaturedBook(),
        categories: categoriesData,
      };
    }

    const [booksRes, categoriesRes] = await Promise.all([
      axiosClient.get("/books"),
      axiosClient.get("/categories"),
    ]);

    const books: Book[] =
      booksRes?.data?.result?.content || [];

    const categories: Category[] =
      categoriesRes?.data?.result || [];

    return {
      hotSearchBooks: books.slice(0, 10),
      topSellingBooks: books.slice(0, 10),
      featuredBook: books[0],
      categories,
    };
  },
  getTopSellingBooks: async (limit?: number): Promise<Book[]> => {
    if (IS_MOCK) {
      await delay(500);
      return getTopSellingBooks(limit);
    }

    const res: any = await axiosClient.get("/books", {
      params: { limit },
    });

    return res?.data?.result || res?.data || [];
  },
};