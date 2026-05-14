import axiosClient from "./axiosClient";

/* ================= GET MY ORDERS ================= */
export const getMyOrders = async (params?: Record<string, any>) => {
  const res = await axiosClient.get("/orders/my", {
    params,
  });

  return res.data.result;
};

/* ================= GET MY ORDERS BY STATUS ================= */
export const getMyOrdersByStatus = async (status: string) => {
  const res = await axiosClient.get("/orders/my", {
    params: { status },
  });

  return res.data.result;
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (id: number | string) => {
  const res = await axiosClient.get(`/orders/my/${id}`);

  return res.data.result;
};

/* ================= CREATE ORDER ================= */
export const createOrder = async (orderData: any) => {
  const res = await axiosClient.post("/orders", orderData);

  return res.data.result;
};

/* ================= CANCEL ORDER ================= */
export const cancelOrder = async (id: number | string) => {
  const res = await axiosClient.post(`/orders/${id}/cancel`);

  return res.data.result;
};

/* ================= ADMIN: GET ALL ORDERS ================= */
export const getAllOrders = async (
  params?: Record<string, any>
) => {
  const res = await axiosClient.get("/orders", {
    params,
  });

  return res.data.result;
};

/* ================= ADMIN: GET ORDER DETAIL ================= */
export const getAdminOrderById = async (
  id: number | string
) => {
  const res = await axiosClient.get(`/orders/${id}`);

  return res.data.result;
};

/* ================= ADMIN: APPROVE ORDER ================= */
export const approveOrder = async (
  orderId: number | string
) => {
  const res = await axiosClient.put(
    `/orders/${orderId}/approve`
  );

  return res.data.result;
};

/* ================= ADMIN: UPDATE ORDER ================= */
export const updateOrder = async (
  id: number | string,
  data: any
) => {
  const res = await axiosClient.patch(
    `/orders/${id}`,
    data
  );

  return res.data.result;
};

/* ================= ADMIN: UPDATE ORDER ITEM ================= */
export const updateOrderItem = async (
  orderId: number | string,
  itemId: number | string,
  data: any
) => {
  const res = await axiosClient.patch(
    `/orders/${orderId}/items/${itemId}`,
    data
  );

  return res.data.result;
};

/* ================= TOP SELLING BOOKS ================= */
export const getTopSellingBooks = async () => {
  const res = await axiosClient.get(
    "/orders/top-selling-books"
  );

  return res.data.result;
};

/* ================= TOP SELLING BOOK ================= */
export const getTopSellingBook = async () => {
  const res = await axiosClient.get(
    "/orders/top-selling-book"
  );

  return res.data.result;
};

/* ================= EXPORT API OBJECT ================= */
export const orderApi = {
  getMyOrders,
  getMyOrdersByStatus,
  getOrderById,
  createOrder,
  cancelOrder,
  getAllOrders,
  getAdminOrderById,
  approveOrder,
  updateOrder,
  updateOrderItem,
  getTopSellingBooks,
  getTopSellingBook,
};