import axiosClient from "./axiosClient";

// ================= GET MY ORDERS =================
export const getMyOrders = async () => {
  const res = await axiosClient.get("/orders/my");
  return res.data; //
};

// ================= GET MY ORDER BY ID =================
export const getMyOrderById = async (id: number | string) => {
  const res = await axiosClient.get(`/orders/my/${id}`);
  return res.data;
};

// ================= GET ORDER BY ID =================
export const getOrderById = async (id: number | string) => {
  const res = await axiosClient.get(`/orders/${id}`);
  return res.data;
};

// ================= CANCEL ORDER =================
export const cancelOrder = async (id: number | string) => {
  const res = await axiosClient.post(`/orders/${id}/cancel`);
  return res.data;
};

// ================= REVIEW ITEM =================
export const reviewOrderItem = async (
  orderId: number | string,
  itemId: number | string,
  payload: { rating: number; content: string }
) => {
  const res = await axiosClient.patch(
    `/orders/${orderId}/items/${itemId}`,
    payload
  );

  return res.data;
};

export const orderApi = {
  getMyOrders,
  getMyOrderById,
  getOrderById,
  cancelOrder,
  reviewOrderItem,
};