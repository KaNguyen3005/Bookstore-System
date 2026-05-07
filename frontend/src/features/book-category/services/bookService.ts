import axiosClient from "../../../services/axiosClient";

import { MOCK_ALL_BOOKS } from "../../../data/books";
import { categoriesData } from "../../../data/categoriesData";

import type { Book } from "../../product/types/Book";
import type { BookFilters } from "../types/bookFilter";

const IS_MOCK = false;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 📚 Search books
 */
export const searchBooks = async (
  filters: BookFilters
): Promise<{
  data: Book[];
  total: number;
}> => {
  // ================= MOCK =================
  if (IS_MOCK) {
    await delay(300);

    let filtered = MOCK_ALL_BOOKS;

    // ================= CATEGORY FILTER =================
    if (filters.categoryId) {
      let targetCategoryIds = [
        filters.categoryId,
      ];

      const parentCategory =
        categoriesData.find(
          (c) =>
            c.categoryId ===
            filters.categoryId
        );

      // 📌 include children categories
      if (parentCategory?.children) {
        targetCategoryIds = [
          ...targetCategoryIds,
          ...parentCategory.children.map(
            (child) =>
              child.categoryId
          ),
        ];
      }

      filtered = filtered.filter((book) =>
        book.categories?.some((category) =>
          targetCategoryIds.includes(
            category.categoryId
          )
        )
      );
    }

    // ================= PUBLISHER FILTER =================
    if (filters.publisherId) {
      filtered = filtered.filter(
        (book) =>
          book.publishers?.publisherId ===
          filters.publisherId
      );
    }

    // ================= PRICE FILTER =================
    if (
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined
    ) {
      filtered = filtered.filter((book) => {
        const matchMin =
          filters.minPrice !== undefined
            ? book.price >= filters.minPrice
            : true;

        const matchMax =
          filters.maxPrice !== undefined
            ? book.price <= filters.maxPrice
            : true;

        return matchMin && matchMax;
      });
    }

    // ================= PAGINATION =================
    const PAGE_SIZE = 12;

    const currentPage =
      filters.page || 0;

    const startIndex =
      currentPage * PAGE_SIZE;

    const paginated = filtered.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );

    return {
      data: paginated,
      total: filtered.length,
    };
  }

  // ================= REAL API =================
  try {
    const token =
      localStorage.getItem(
        "accessToken"
      );

    // 📌 remove undefined values
    const apiFilters: any = {
      ...filters,
    };
    console.log(apiFilters)
    Object.keys(apiFilters).forEach(
      (key) => {
        if (
          apiFilters[key] === undefined
        ) {
          delete apiFilters[key];
        }
      }
    );

    const res: any =
      await axiosClient.get(
        "/books/search",
        {
          params: apiFilters,

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    console.log(
      "BOOK SEARCH RESPONSE:",
      res
    );

    // 📌 backend structure:
    // data.result.content
    const result =
      res?.data?.result;

    const data: Book[] =
      result?.content || [];

    const total =
      result?.totalElements ||
      result?.total ||
      data.length;

    return {
      data,
      total,
    };
  } catch (error: any) {
    console.error(
      "SEARCH BOOKS ERROR:",
      error?.response || error
    );

    throw new Error(
      error?.response?.data?.message ||
        "Failed to search books"
    );
  }
};

/**
 * 🔥 Top selling books
 */
export const getTopSellingBooks =
  async (
    limit: number = 5
  ): Promise<Book[]> => {
    // ================= MOCK =================
    if (IS_MOCK) {
      await delay(300);

      return [...MOCK_ALL_BOOKS]
        .sort(
          (a, b) =>
            (b.reviewCount || 0) -
            (a.reviewCount || 0)
        )
        .slice(0, limit);
    }

    // ================= API =================
    try {
      const token =
        localStorage.getItem(
          "accessToken"
        );

      const res: any =
        await axiosClient.get(
          "/books",
          {
            params: { limit },

            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      const result =
        res?.data?.result;

      return (
        result?.content ||
        result ||
        []
      );
    } catch (error: any) {
      console.error(
        "TOP SELLING BOOKS ERROR:",
        error?.response || error
      );

      return [];
    }
  };