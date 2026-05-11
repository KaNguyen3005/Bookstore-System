import axiosClient from "./axiosClient";
import { mockOrders } from "../data/purchaseOrder";

const IS_MOCK = false;

const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/* ================= GET MY ORDERS ================= */
export const getMyOrders = async (): Promise<any[]> => {
  if (IS_MOCK) {
    await delay(500);
    return mockOrders;
  }

  const res = await axiosClient.get("/orders/my");

  return res.data?.result ?? [];
};

/* ================= GET MY ORDERS BY STATUS ================= */
export const getMyOrdersByStatus = async (
  status: string
): Promise<any[]> => {
  if (IS_MOCK) {
    await delay(500);
    return mockOrders.filter((o) => o.status === status);
  }

  const res = await axiosClient.get("/orders/my", {
    params: { status },
  });

  return res.data?.result ?? [];
};

/* ================= GET ORDER BY ID ================= */
export const getOrderById = async (id: number): Promise<any> => {
  if (IS_MOCK) {
    await delay(500);

    const order = mockOrders.find((o: any) => o.orderId === id);

    if (!order) throw new Error("Order not found");

    return order;
  }

  const res = await axiosClient.get(`/orders/my/${id}`);

  return res.data?.result ?? null;
};

/* ================= CREATE ORDER ================= */
export const createOrder = async (orderData: any): Promise<any> => {
  if (IS_MOCK) {
    await delay(500);

    return {
      success: true,
      message: "Mua hàng thành công",
      orderId: Date.now(),
    };
  }

  const res = await axiosClient.post("/orders", orderData);

  return res.data;
};

/* ================= ADMIN: RECENT ORDERS ================= */
export const getRecentOrders = async (): Promise<any[]> => {
  const res = await axiosClient.get("/admin/recent-orders");
  return res.data ?? [];
};

/* ================= ADMIN: REVENUE ================= */
export const getRevenueData = async (): Promise<any[]> => {
  const res = await axiosClient.get("/admin/revenue");
  return res.data ?? [];
};

/* ================= EXPORT API OBJECT ================= */
export const orderApi = {
  getMyOrders,
  getMyOrdersByStatus,
  getOrderById,
  createOrder,
  getRecentOrders,
  getRevenueData,
};