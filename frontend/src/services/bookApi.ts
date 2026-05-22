import axiosClient from "./axiosClient";
import type { Book } from "../features/product/types/Book";
import type { Category } from "../features/book-category/types/category";

const unwrap = (res: any) => res?.data?.result ?? res?.data?.data ?? res?.data;

const publicRequest = {
  skipAuth: true,
  skipAuthRedirect: true,
} as any;

const toBookArray = (data: any): Book[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.content)) return data.content;
  if (Array.isArray(data?.data)) return data.data;

  return [];
};

const getReviewCount = (book: Book) =>
  Number((book as Book & { reviewCount?: number }).reviewCount ?? 0);

type TopSellingBookStat = {
  bookId: number;
  totalQuantitySold?: number;
  rank?: number;
};

const byBookId = (book: Book) => book.bookId;

const getDefaultTopSellingRange = () => ({
  from: "2000-01-01",
  to: new Date().toISOString().slice(0, 10),
});

const uniqueBooks = (books: Book[]) => {
  const seen = new Set<number>();

  return books.filter((book) => {
    const id = byBookId(book);

    if (seen.has(id)) return false;

    seen.add(id);
    return true;
  });
};

const pickDistinct = (
  source: Book[],
  usedIds: Set<number>,
  limit: number,
) => {
  const picked: Book[] = [];

  for (const book of source) {
    const id = byBookId(book);

    if (usedIds.has(id)) continue;

    picked.push(book);
    usedIds.add(id);

    if (picked.length === limit) break;
  }

  return picked;
};

const mapTopSellingStatsToBooks = (
  stats: TopSellingBookStat[],
  books: Book[],
) => {
  const bookById = new Map(books.map((book) => [book.bookId, book]));

  return stats
    .map((item) => bookById.get(Number(item.bookId)))
    .filter((book): book is Book => Boolean(book));
};

export const bookApi = {

  // ================= GET BOOKS =================
  getBooks: async (params?: any): Promise<{ data: Book[]; total: number }> => {
    const res = await axiosClient.get("/books", {
      ...publicRequest,
      params: {
        ...params,
        size: params?.size ?? 1000,
      },
    });

    const data = unwrap(res);

    const books = toBookArray(data);

    return {
      data: books,
      total: data?.totalElements ?? data?.meta?.totalElements ?? books.length,
    };
  },

  // ================= GET BY ID =================
  getBookById: async (id: number): Promise<Book> => {
    const res = await axiosClient.get(`/books/${id}`, publicRequest);
    return unwrap(res);
  },

  // ================= CATEGORIES =================
  getCategories: async (): Promise<Category[]> => {
    const res = await axiosClient.get("/categories", publicRequest);
    return unwrap(res) ?? [];
  },

  // ================= HOME DATA =================
  getHomeData: async () => {
    const [booksRes, categoriesRes, topSellingRes] = await Promise.all([
      axiosClient.get("/books", {
        ...publicRequest,
        params: { size: 1000 },
      }),
      axiosClient.get("/categories", publicRequest),
      axiosClient
        .get("/orders/top-selling-books", {
          ...publicRequest,
          params: {
            ...getDefaultTopSellingRange(),
            limit: 30,
          },
        })
        .catch(() => null),
    ]);

    const booksData = unwrap(booksRes);
    const categoriesData = unwrap(categoriesRes);
    const topSellingData = topSellingRes ? unwrap(topSellingRes) : [];

    const books = uniqueBooks(toBookArray(booksData));
    const categories = categoriesData ?? [];
    const topSellingStats = toBookArray(
      topSellingData,
    ) as unknown as TopSellingBookStat[];
    const topSellingFromApi = uniqueBooks(
      mapTopSellingStatsToBooks(topSellingStats, books),
    );

    const byRating = [...books].sort(
      (a, b) =>
        (b.avgRating ?? 0) - (a.avgRating ?? 0) ||
        getReviewCount(b) - getReviewCount(a) ||
        b.bookId - a.bookId,
    );

    const byHotSearch = [...books].sort(
      (a, b) =>
        getReviewCount(b) - getReviewCount(a) ||
        (b.avgRating ?? 0) - (a.avgRating ?? 0) ||
        b.bookId - a.bookId,
    );

    const byTopSellingFallback = [...books].sort(
      (a, b) =>
        (b.salePercent ?? 0) - (a.salePercent ?? 0) ||
        getReviewCount(b) - getReviewCount(a) ||
        b.bookId - a.bookId,
    );

    const usedIds = new Set<number>();
    const suggestionBooks = pickDistinct(byRating, usedIds, 10);
    const hotSearchBooks = pickDistinct(byHotSearch, usedIds, 20);
    const topSellingCandidates = uniqueBooks([
      ...topSellingFromApi,
      ...byTopSellingFallback,
    ]);
    const topSellingBooks = pickDistinct(topSellingCandidates, usedIds, 20);

    return {
      suggestionBooks,
      hotSearchBooks:
        hotSearchBooks.length > 0 ? hotSearchBooks : books.slice(10, 30),
      topSellingBooks:
        topSellingBooks.length > 0 ? topSellingBooks : books.slice(30, 50),
      featuredBook: books[0] ?? null,
      categories,
    };
  },

  getTopSellingBooks: async (limit = 4): Promise<Book[]> => {
    const [topSellingRes, booksRes] = await Promise.all([
      axiosClient.get("/orders/top-selling-books", {
        ...publicRequest,
        params: {
          ...getDefaultTopSellingRange(),
          limit,
        },
      }),
      axiosClient.get("/books", {
        ...publicRequest,
        params: { size: 1000 },
      }),
    ]);

    const topSellingData = unwrap(topSellingRes);
    const booksData = unwrap(booksRes);
    const topSellingStats = toBookArray(
      topSellingData,
    ) as unknown as TopSellingBookStat[];
    const books = toBookArray(booksData);

    return mapTopSellingStatsToBooks(topSellingStats, books).slice(0, limit);
  },
};

