import axiosClient from "./axiosClient";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    return {};
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const optionalAuthRequest = {
  skipAuthRedirect: true,
  skipErrorLog: true,
} as any;

const publicRequest = {
  skipAuth: true,
  skipAuthRedirect: true,
  skipErrorLog: true,
} as any;

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
};

export const evaluateApi = {
  // ================= GET REVIEWS =================
  getReviewsByBookId: async (
    bookId: number | string,
    page: number = 0,
    size: number = 10
  ): Promise<ReviewResponse> => {
    const response = await axiosClient.get(
      `/books/${bookId}/reviews?page=${page}&size=${size}`,
      publicRequest
    );

    return response.data.result;
  },

  // ================= MY REVIEW =================
  getMyReview: async (
    bookId: number,
    orderId: number,
    itemId: number
  ) => {
    const response = await axiosClient.get(
      `/reviews/my?bookId=${bookId}&orderId=${orderId}&itemId=${itemId}`,
      {
        ...getAuthHeader(),
        ...optionalAuthRequest,
      }
    );

    return response.data.result;
  },

  // ================= ORDER DETAIL =================
  getOrderById: async (orderId: number) => {
    const response = await axiosClient.get(
      `/orders/my/${orderId}`,
      {
        ...getAuthHeader(),
        ...optionalAuthRequest,
      }
    );

    return response.data.result;
  },

    createReview: async (data: {
      bookId: number;
      orderId: number;
      itemId: number;
      rate: number;
      content: string;
    }) => {
      const response = await axiosClient.post(
        `/reviews`,
        data,
        getAuthHeader()
      );

      return response.data.result;
    },


    reviewOrderItem: async (
      orderId: number,
      itemId: number,
      data: {
        rating: number;
        content: string;
      }
    ) => {
      const res = await axiosClient.patch(
        `/orders/${orderId}/items/${itemId}`,
        data,
        getAuthHeader()
      );

      return res.data?.result;
    },
};
