import axiosClient from "./axiosClient";
import { mockCategoryBooks } from "../data/mockCategoryBooks";
import { HOT_SEARCH_BOOKS, TOP_SELLING_BOOKS, FEATURED_BOOK } from "../data/homeBooks";
import type { Book } from "../features/product/types/Book";

const IS_MOCK = true;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ALL_BOOKS: Book[] = [
  ...mockCategoryBooks,
  ...HOT_SEARCH_BOOKS,
  ...TOP_SELLING_BOOKS,
  FEATURED_BOOK,
];

export const bookApi = {
  getBooks: async (params?: any): Promise<Book[]> => {
    if (IS_MOCK) {
      await delay(500);
      return mockCategoryBooks;
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
      return mockCategoryBooks
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
        hotSearchBooks: HOT_SEARCH_BOOKS,
        topSellingBooks: TOP_SELLING_BOOKS,
        featuredBook: FEATURED_BOOK,
      };
    }
    return axiosClient.get("/home/books");
  },
};
