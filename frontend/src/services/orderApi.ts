import axiosClient from "./axiosClient";

// PUT /api/v1/orders/{orderId}/approve
export const approveOrder = async (orderId: string | number) => {
  const res = await axiosClient.put(`/orders/${orderId}/approve`);

  return res.data;
};

// GET /api/v1/orders
export const getOrders = async (params?: Record<string, any>) => {
  const res = await axiosClient.get("/orders", { params });

  return res.data;
};

// POST /api/v1/orders
export const createOrder = async (data: any) => {
  const res = await axiosClient.post("/orders", data);

  return res.data;
};

// POST /api/v1/orders/{id}/cancel
export const cancelOrder = async (id: string | number) => {
  const res = await axiosClient.post(`/orders/${id}/cancel`);

  return res.data;
};

// GET /api/v1/orders/{id}
export const getOrderById = async (id: string | number) => {
  const res = await axiosClient.get(`/orders/${id}`);

  return res.data;
};

// PATCH /api/v1/orders/{id}
export const updateOrder = async (id: string | number, data: any) => {
  const res = await axiosClient.patch(`/orders/${id}`, data);

  return res.data;
};

// PATCH /api/v1/orders/{id}/items/{itemId}
export const updateOrderItem = async (
  id: string | number,
  itemId: string | number,
  data: any,
) => {
  const res = await axiosClient.patch(`/orders/${id}/items/${itemId}`, data);

  return res.data;
};

// GET /api/v1/orders/top-selling-books
export const getTopSellingBooks = async (params?: Record<string, any>) => {
  const res = await axiosClient.get("/orders/top-selling-books", { params });

  return res.data;
};

// GET /api/v1/orders/top-selling-book
export const getTopSellingBook = async (params?: Record<string, any>) => {
  const res = await axiosClient.get("/orders/top-selling-book", { params });

  return res.data;
};

// GET /api/v1/orders/my
export const getMyOrders = async (params?: Record<string, any>) => {
  const res = await axiosClient.get("/orders/my", { params });

  return res.data;
};

// GET /api/v1/orders/my/{id}
export const getMyOrderById = async (id: string | number) => {
  const res = await axiosClient.get(`/orders/my/${id}`);

  return res.data;
};

export const orderApi = {
  approveOrder,
  getOrders,
  createOrder,
  cancelOrder,
  getOrderById,
  updateOrder,
  updateOrderItem,
  getTopSellingBooks,
  getTopSellingBook,
  getMyOrders,
  getMyOrderById,
};
