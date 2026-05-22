import axiosClient from "./axiosClient";
import type { Book } from "../features/product/types/Book";

/**
 * Raw response từ API related books
 */
type RecommendationBookResponse = {
  book: Book;
  score: number;
  reason: string | null;
};

export const aiRcmApi = {
  /**
   * AI hybrid recommendations cho user hiện tại
   */
  getHybridRecommendations: async (
    limit: number = 10
  ): Promise<Book[]> => {
    const res = await axiosClient.get("/recommendations/me/hybrid", {
      params: { limit },
      skipAuthRedirect: true,
      skipErrorLog: true,
    } as any);

    const data: RecommendationBookResponse[] = res?.data?.result ?? [];

    return data.map((item) => item.book);
  },

  /**
   * Sách liên quan (AI + similarity)
   * API trả: [{ book, score, reason }]
   * Frontend chỉ cần Book[]
   */
  getRelatedBooks: async (
    bookId: number,
    limit: number = 10
  ): Promise<Book[]> => {
    const res = await axiosClient.get(
      `/recommendations/books/${bookId}/related`,
      {
        params: { limit },
        skipAuth: true,
        skipAuthRedirect: true,
      } as any
    );

    const data: RecommendationBookResponse[] = res?.data?.result ?? [];

    return data.map((item) => item.book);
  },
};
