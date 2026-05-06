import { MOCK_ALL_BOOKS } from "../../../data/books";
import { priceRangesData } from "../../../data/priceRangesData";
import { publishersData } from "../../../data/publishersData";
import type { Book } from "../types/book";
import type { BookFilters } from "../types/filter";

export const IS_MOCK = true;

/**
 * Simulates a network delay.
 * @param ms Milliseconds to delay
 */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Maps snake_case mock book data to the camelCase Book interface.
 * @param mockBook The raw mock book from data
 * @returns Mapped Book object in camelCase
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapToBook = (mockBook: any): Book => {
  // Find publisher ID from publisher name
  const publisher = publishersData.find(
    (p) => p.name === mockBook.publisher_name
  );

  return {
    bookId: mockBook.book_id,
    title: mockBook.title,
    price: mockBook.price,
    oldPrice: mockBook.oldPrice, // Note: it's oldPrice in MOCK_ALL_BOOKS
    salePercent: mockBook.sale_percent || 0,
    coverImageUrl: mockBook.cover_image_url,
    coverImgUrl: mockBook.cover_image_url, // Added for ProductCard compatibility
    // Extract the first category ID as requested, defaulting to 0 if not found
    categoryId: mockBook.categories?.[0]?.category_id || 0,
    // Use mapped publisher ID or 0 if not found
    publisherId: publisher ? publisher.id : 0,
    avgRating: mockBook.avg_rating || 0,
    reviewCount: mockBook.reviewCount || 0,
  };
};

/**
 * Service to search books based on provided filters.
 * In MOCK mode, handles data mapping and filtering directly.
 * 
 * @param filters The search filters (categoryId, publisherId, priceRangeId, page)
 * @returns A promise resolving to a paginated list of books
 */
export const searchBooks = async (filters: BookFilters): Promise<{ data: Book[], total: number }> => {
  if (IS_MOCK) {
    await delay(300);

    let filtered = MOCK_ALL_BOOKS;

    // Filter by category
    if (filters.categoryId) {
      filtered = filtered.filter(
        (book) => book.categories?.[0]?.category_id === filters.categoryId
      );
    }

    // Filter by publisher
    if (filters.publisherId) {
      const publisher = publishersData.find(p => p.id === filters.publisherId);
      if (publisher) {
        filtered = filtered.filter(
          (book) => book.publisher_name === publisher.name
        );
      }
    }

    // Filter by price range
    if (filters.priceRangeId) {
      const range = priceRangesData.find((r) => r.id === filters.priceRangeId);
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

    // Pagination logic (assuming 12 items per page)
    const PAGE_SIZE = 12;
    const startIndex = filters.page * PAGE_SIZE;
    const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    // Map the paginated results to the strict camelCase Data Model
    const mappedBooks = paginated.map(mapToBook);

    return {
      data: mappedBooks,
      total: filtered.length,
    };
  }

  // Placeholder for real API call
  // const query = new URLSearchParams();
  // if (filters.categoryId) query.append('categoryId', filters.categoryId.toString());
  // ...
  // const res = await fetch(`/api/v1/books/search?${query.toString()}`);
  // return res.json();
  
  return { data: [], total: 0 };
};

/**
 * Retrieves a list of top selling books.
 * @param limit Maximum number of books to return
 * @returns Mapped list of top selling books
 */
export const getTopSellingBooks = async (limit: number = 5): Promise<Book[]> => {
  if (IS_MOCK) {
    await delay(300);
    // Sort by reviewCount (proxy for sales) and slice
    const sorted = [...MOCK_ALL_BOOKS]
      .sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0))
      .slice(0, limit);
    
    return sorted.map(mapToBook);
  }
  return [];
};
