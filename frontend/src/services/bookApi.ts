import axiosClient from "./axiosClient";
import type { Book } from "../features/product/types/Book";
import type { Category } from "../features/book-category/types/category";

const unwrap = (res: any) => res?.data?.result ?? res?.data?.data ?? res?.data;

export const bookApi = {
  // ================= GET BOOKS =================
  getBooks: async (params?: any): Promise<{ data: Book[]; total: number }> => {
    const res = await axiosClient.get("/books", {
      params: {
        ...params,
        size: params?.size ?? 1000,
      },
    });

    const data = unwrap(res);

    const books = Array.isArray(data)
      ? data
      : Array.isArray(data?.content)
      ? data.content
      : Array.isArray(data?.data)
      ? data.data
      : [];

    return {
      data: books,
      total: data?.totalElements ?? data?.meta?.totalElements ?? books.length,
    };
  },

  // ================= GET BY ID =================
  getBookById: async (id: number): Promise<Book> => {
    const res = await axiosClient.get(`/books/${id}`);
    return unwrap(res);
  },

  // ================= CATEGORIES =================
  getCategories: async (): Promise<Category[]> => {
    const res = await axiosClient.get("/categories");
    return unwrap(res) ?? [];
  },

  // ================= HOME DATA =================
  getHomeData: async () => {
    const [booksRes, categoriesRes] = await Promise.all([
      axiosClient.get("/books", { params: { size: 1000 } }),
      axiosClient.get("/categories"),
    ]);

    const booksData = unwrap(booksRes);
    const categoriesData = unwrap(categoriesRes);

    const books = Array.isArray(booksData)
      ? booksData
      : booksData?.content ?? booksData?.data ?? [];
    const categories = categoriesData ?? [];

    return {
      suggestionBooks: books.slice(0, 10),
      hotSearchBooks: books,
      topSellingBooks: books,
      featuredBook: books[0] ?? null,
      categories,
    };
  },
};
