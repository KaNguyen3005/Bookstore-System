import axiosClient from "./axiosClient";
import type { Book } from "../features/product/types/Book";

export const aiRcmApi = {
  // lay cho user hien tai ( su dung AI)
  getHybridRecommendations: async (
    limit: number = 10
  ): Promise<Book[]> => {
    const res = await axiosClient.get(
      "/recommendations/me/hybrid",
      {
        params: { limit },
      }
    );

    return res?.data?.result ?? [];
  },

  // lay sach lien quan
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

    return res?.data?.result ?? [];
  },
};