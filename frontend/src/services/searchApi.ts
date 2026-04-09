// services/searchApi.ts
import { MOCK_ALL_BOOKS } from "../data/books";

export const searchApi = {
  searchBooks: (keyword: string, limit = 10) => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        const result = MOCK_ALL_BOOKS.filter((b) =>
          b.title.toLowerCase().includes(keyword.toLowerCase())
        );

        resolve(result.slice(0, limit));
      }, 300);
    });
  },
};