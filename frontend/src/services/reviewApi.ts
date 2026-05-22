import axiosClient from "./axiosClient";

export const updateOrderItemReview = (
  orderId: number,
  itemId: number,
  data: {
    rating: number;
    content: string;
  }
) => {
 return axiosClient.patch(
    `/api/v1/orders/${orderId}/items/${itemId}`,
    data
  );
};