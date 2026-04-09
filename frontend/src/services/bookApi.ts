import axiosClient from "./axiosClient";
import {
  MOCK_ALL_BOOKS,
  getHotSearchBooks,
  getTopSellingBooks,
  getFeaturedBook
} from "../data/books";
import type { Book } from "../features/product/types/Book";

const IS_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ALL_BOOKS: Book[] = MOCK_ALL_BOOKS;

export const bookApi = {
  getBooks: async (params?: any): Promise<Book[]> => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_ALL_BOOKS;
    }
    return axiosClient.get("/books", { params });
  },

  getBookById: async (id: number): Promise<Book> => {
    if (IS_MOCK) {
      await delay(500);
      const book = ALL_BOOKS.find((b) => b.book_id === id);
      if (!book) throw new Error("Book not found");
      return book;
    }
    return axiosClient.get(`/books/${id}`);
  },

  getRelatedBooks: async (bookId: number): Promise<Book[]> => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_ALL_BOOKS
        .filter((b) => b.book_id !== bookId)
        .sort(() => 0.5 - Math.random())
        .slice(0, 15);
    }
    return axiosClient.get(`/books/${bookId}/related`);
  },

  getHomeData: async (): Promise<{
    hotSearchBooks: Book[];
    topSellingBooks: Book[];
    featuredBook: Book;
  }> => {
    if (IS_MOCK) {
      await delay(500);
      return {
        hotSearchBooks: getHotSearchBooks(),
        topSellingBooks: getTopSellingBooks(),
        featuredBook: getFeaturedBook(),
      };
    }
    return axiosClient.get("/books");
  },
  getTopSellingBooks: async (limit?: number): Promise<Book[]> => {
    if (IS_MOCK) {
      await delay(500);
      return getTopSellingBooks(limit);
    }
    return axiosClient.get("/books/top-selling", { params: { limit } });
  },
};
