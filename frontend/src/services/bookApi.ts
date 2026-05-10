import axiosClient from "./axiosClient";
import type { Book } from "../features/product/types/Book";
import type { Category } from "../features/book-category/types/category";

export const bookApi = {
  // ================= GET ALL BOOKS (FULL FIX) =================
  getBooks: async (params?: any): Promise<{
    data: Book[];
    total: number;
  }> => {
    const res: any = await axiosClient.get("/books", {
      params: {
        ...params,
        size: params?.size ?? 1000, //lấy full or tăng limit
      },
    });

    return {
      data:
        res?.data?.result?.content ??
        res?.data?.content ??
        [],
      total:
        res?.data?.result?.totalElements ??
        res?.data?.totalElements ??
        0,
    };
  },

  // ================= GET BOOK BY ID =================
  getBookById: async (id: number): Promise<Book> => {
    const res: any = await axiosClient.get(`/books/${id}`);

    return res?.data?.result ?? res?.data;
  },

  // ================= CATEGORIES =================
  getCategories: async (): Promise<Category[]> => {
    const res: any = await axiosClient.get("/categories");

    return res?.data?.result ?? [];
  },

  // ================= HOME DATA =================
    getHomeData: async () => {
      const [booksRes, categoriesRes] = await Promise.all([
        axiosClient.get("/books", {
          params: { size: 1000 },
        }),
        axiosClient.get("/categories"),
      ]);

      console.log("BOOK RESPONSE:", booksRes);

      const books =
        booksRes?.data?.result?.content ??
        booksRes?.data?.content ??
        [];

      const categories =
        categoriesRes?.data?.result ??
        categoriesRes?.data ??
        [];

      return {
        hotSearchBooks: books,
        topSellingBooks: books,
        featuredBook: books[0],
        categories,
      };
    },
};