import axiosClient from "../../../services/axiosClient";
import { MOCK_ALL_BOOKS } from "../../../data/books";
import { priceRangesData } from "../../../data/priceRangesData";
import { publishersData } from "../../../data/publishersData";
import type { Book } from "../types/book";
import type { BookFilters } from "../types/filter";

const IS_MOCK = true;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Map mock data -> camelCase Book
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToBook = (mockBook: any): Book => {
  const publisher = publishersData.find(
    (p) => p.name === mockBook.publisherName
  );

  return {
    bookId: mockBook.bookId,
    title: mockBook.title,
    price: mockBook.price,
    oldPrice: mockBook.oldPrice,
    salePercent: mockBook.salePercent || 0,
    coverImageUrl: mockBook.coverImgUrl,
    coverImgUrl: mockBook.coverImgUrl,
    categoryId: mockBook.categories?.[0]?.categoryId || 0,
    publisherId: publisher ? publisher.id : 0,
    avgRating: mockBook.avgRating || 0,
    reviewCount: mockBook.reviewCount || 0,
  };
};

export const searchBooks = async (
  filters: BookFilters
): Promise<{ data: Book[]; total: number }> => {
  if (IS_MOCK) {
    await delay(300);

    let filtered = MOCK_ALL_BOOKS;

    // category
    if (filters.categoryId) {
      filtered = filtered.filter(
        (b) => b.categories?.[0]?.categoryId === filters.categoryId
      );
    }

    // publisher
    if (filters.publisherId) {
      const publisher = publishersData.find(
        (p) => p.id === filters.publisherId
      );

      if (publisher) {
        filtered = filtered.filter(
          (b) => b.publisherName === publisher.name
        );
      }
    }

    // price range
    if (filters.priceRangeId) {
      const range = priceRangesData.find(
        (r) => r.id === filters.priceRangeId
      );

      if (range) {
        filtered = filtered.filter((book) => {
          const price = book.price;
          if (range.max !== undefined) {
            return price >= range.min && price <= range.max;
          }
          return price >= range.min;
        });
      }
    }

    // pagination
    const PAGE_SIZE = 12;
    const startIndex = filters.page * PAGE_SIZE;
    const paginated = filtered.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );

    return {
      data: paginated.map(mapToBook),
      total: filtered.length,
    };
  }

  const res: any = await axiosClient.get("/books/search", {
    params: filters,
  });

  return {
    data: res?.data?.result?.content || [],
    total: res?.data?.result?.total || 0,
  };
};

export const getTopSellingBooks = async (limit: number = 5): Promise<Book[]> => {
  if (IS_MOCK) {
    await delay(300);

    const sorted = [...MOCK_ALL_BOOKS]
      .sort(
        (a, b) =>
          (b.reviewCount || 0) - (a.reviewCount || 0)
      )
      .slice(0, limit);

    return sorted.map(mapToBook);
  }

  const res: any = await axiosClient.get("/books", {
    params: { limit },
  });

  return res?.data?.result || res?.data || [];
};