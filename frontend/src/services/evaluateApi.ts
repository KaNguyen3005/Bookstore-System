import axiosClient from "./axiosClient";

const getAuthHeader = () => {
  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface ReviewItem {
  bookId: number;
  bookTitle: string;
  quantity: number;
  price: number;
  rate: number;
  content: string;
  unit: string;
}

export interface ReviewResponse {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  content: ReviewItem[];
}

export const evaluateApi = {
  getReviewsByBookId: async (
    bookId: number | string,
    page: number = 0,
    size: number = 10
  ): Promise<ReviewResponse> => {
    const response =
      await axiosClient.get(
        `/books/${bookId}/reviews?page=${page}&size=${size}`,
        getAuthHeader()
      );

    return response.data.result;
  },
};