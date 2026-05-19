import axiosClient from "./axiosClient";
import type { Book } from "../features/product/types/Book";

/**
 * Raw response từ API related books
 */
type RelatedBookResponse = {
  book: Book;
  score: number;
  reason: string;
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
    });

    return (res?.data?.result ?? []) as Book[];
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
      }
    );

    const data: RelatedBookResponse[] = res?.data?.result ?? [];

    return data.map((item) => item.book);
  },
};