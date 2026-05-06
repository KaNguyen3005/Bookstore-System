import axiosClient from "./axiosClient";
import {
  MOCK_ALL_BOOKS,
  getHotSearchBooks,
  getTopSellingBooks,
  getFeaturedBook,
} from "../data/books";
import type { Book } from "../features/product/types/Book";

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

  getRelatedBooks: async (bookId: number): Promise<Book[]> => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_ALL_BOOKS
        .filter((b) => b.bookId !== bookId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 15);
    }

    const res: any = await axiosClient.get(`/books/${bookId}/related`);
    return res?.data?.result || res?.data || [];
  },

  getHomeData: async () => {
    if (IS_MOCK) {
      await delay(500);
      return {
        hotSearchBooks: getHotSearchBooks(),
        topSellingBooks: getTopSellingBooks(),
        featuredBook: getFeaturedBook(),
      };
    }

    const res: any = await axiosClient.get("/books");
    const books: Book[] = res?.data?.result?.content || [];

    return {
      hotSearchBooks: books.slice(0, 10),
      topSellingBooks: books.slice(10, 20),
      featuredBook: books[0],
    };
  },

  getTopSellingBooks: async (limit?: number): Promise<Book[]> => {
    if (IS_MOCK) {
      await delay(500);
      return getTopSellingBooks(limit);
    }

    const res: any = await axiosClient.get("/books/top-selling", {
      params: { limit },
    });

    return res?.data?.result || res?.data || [];
  },
};