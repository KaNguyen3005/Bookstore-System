import axiosClient from '../../../services/axiosClient';
import { MOCK_BOOKS } from '../../../data/categoryData';
import type { BookFilters } from '../types/book';

const IS_MOCK = true;
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const bookService = {
  getBooks: async (filters: BookFilters) => {
    if (IS_MOCK) {
      await delay(500);
      let filteredBooks = [...MOCK_BOOKS];

      // Filtering logic belongs to the "API" (simulated here in the service)
      if (filters.categoryIds.length > 0) {
        filteredBooks = filteredBooks.filter(book => filters.categoryIds.includes(book.category_id));
      }

      if (filters.publisherIds.length > 0) {
        filteredBooks = filteredBooks.filter(book => filters.publisherIds.includes(book.publisher_id));
      }

      if (filters.priceRange) {
        const { min, max } = filters.priceRange;
        filteredBooks = filteredBooks.filter(book => book.price >= min && book.price <= max);
      }

      return filteredBooks;
    }
    
    // Real API call with query parameters
    const params = new URLSearchParams();
    if (filters.categoryIds.length > 0) params.append('categoryIds', filters.categoryIds.join(','));
    if (filters.publisherIds.length > 0) params.append('publisherIds', filters.publisherIds.join(','));
    if (filters.priceRange) {
      params.append('priceMin', filters.priceRange.min.toString());
      params.append('priceMax', filters.priceRange.max.toString());
    }

    const res: any = await axiosClient.get(`/api/books?${params.toString()}`);
    return res?.data?.result || res?.data || [];
  },

  getTopSellingBooks: async (limit: number = 4) => {
    if (IS_MOCK) {
      await delay(500);
      return MOCK_BOOKS.slice(0, limit);
    }
    const res: any = await axiosClient.get(`/api/books/top-selling?limit=${limit}`);
    return res?.data?.result || res?.data || [];
  }
};
