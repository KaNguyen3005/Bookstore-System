// services/searchApi.ts
import { books } from "../data/book";

export const searchApi = {
  searchBooks: (keyword: string, limit = 10) => {
    return new Promise<any[]>((resolve) => {
      setTimeout(() => {
        const result = books.filter((b) =>
          b.title.toLowerCase().includes(keyword.toLowerCase())
        );

        resolve(result.slice(0, limit));
      }, 300);
    });
  },
};